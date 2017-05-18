import React from 'react';
import { hashHistory } from 'react-router';
import {Form, Row, Col, Input, Button, Icon,Select,message,Radio,Table,Checkbox,Modal} from 'antd';
import { Link} from 'react-router';
import $ from 'jquery';
import { serveUrl, User, cacheData,protocolMsg,newAddFlag} from '../../utils/config';
import DeleteDialog from '../DeleteDialog';//引入删除弹框
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const msg = '是否删除?';
const url = 'http://192.168.1.130:8887/';

class LocalPoliticians extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible11:false,
            serviceList:[],
            serviceListLength:null,
            serveListDateCurrent:1,
            serveListDatePageSize:10,
            servId:null,
            labelData:[],
        }
    }

     componentWillMount() {
          if(User.isLogin()){
        } else{
            hashHistory.push('/login');
        }  
        const _this = this;
        if(_this.props.isRequest){
            $.ajax({
                type: "GET",
                // url: 'http://192.168.0.160:8887/getLabelInfo?access_token=' + User.appendAccessToken().access_token,
                url: serveUrl+"guest-crm/getLabelInfo?access_token="+ User.appendAccessToken().access_token,
                data:{passengerId:_this.props.passengerId,phone:_this.props.phone,protocolTypes:"4,5"},
                success: function(data){
                    if(data.status == 200){
                        data.data.map((v,index)=>{
                            v.key = index
                        })
                        _this.setState({
                            labelData:data.data,
                            serviceListLength:data.data.length
                        })
                    }
                }
            })
        }  
    }

    componentDidMount=()=>{
        $(".ant-modal-footer").hide();
    }

    componentDidUpdate=()=>{    
        $(".ant-table-tbody tr td").css({borderBottom:'none'});
        $("table").css({border:'1px solid #f0f0f0'});
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };

        const _this = this;
        const pagination = {
            total: this.state.serviceListLength,
            showSizeChanger: true,
            onShowSizeChange(current, pageSize) {
                _this.state.serveListDateCurrent = current;
                _this.state.serveListDatePageSize = pageSize;
                _this.getInitList(_this.state.serveListDateCurrent,_this.state.serveListDatePageSize);
            },
            onChange(current) {
                _this.state.serveListDateCurrent = current;
                _this.getInitList(_this.state.serveListDateCurrent,_this.state.serveListDatePageSize);
            }
        };
        const columns = [
            {
                title: '单位名称',
                width: '33%',
                dataIndex: 'workUnit',
                render(text, record) {
                    return (
                        <div className="order">
                            {text}
                        </div>
                    )
                }
            }, {
                title: '职位',
                width: '33%',
                dataIndex: 'position',
                render(text, record) {
                    return (
                        <div className="order">{text}</div>
                    )
                }
            }
        ];

        return (
            <div>
                <div className="search-result-list">
                    <Table key='t1' columns={columns} dataSource={this.state.labelData} pagination={pagination} className="serveTable" />
                    <p>共搜索到{this.state.serviceListLength}条数据</p>
                </div>
            </div>
        )
    }
}

LocalPoliticians = Form.create()(LocalPoliticians);

export default LocalPoliticians;

