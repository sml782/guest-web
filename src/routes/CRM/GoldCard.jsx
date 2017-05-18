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

class GoldCard extends React.Component {
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
                data:{passengerId:_this.props.passengerId,phone:_this.props.phone,protocolTypes:'9'},
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
        // this.getInitList(this.state.serveListDateCurrent,this.state.serveListDatePageSize);
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
                title: '公司名称',
                width: '20%',
                dataIndex: 'companyName',
                render(text, record) {
                    return (
                        <div className="order">
                            {text}
                        </div>
                    )
                }
            },{
                title: '卡类别',
                width: '20%',
                dataIndex: 'cardTypeName',
                render(text, record) {
                    return (
                        <div className="order">
                            {record.cardTypeName}
                        </div>
                    )
                }
            },{
                title: '卡号',
                width: '20%',
                dataIndex: 'cardNo',
                render(text, record) {
                    return (
                        <div className="order">
                            {text}
                        </div>
                    )
                }
            }, {
                title: '有效期',
                width: '20%',
                dataIndex: 'expireTime',
                render(text, record) {
                    return (
                        <div className="order">{moment(text).format('YYYY-MM-DD')}</div>
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

GoldCard = Form.create()(GoldCard);

export default GoldCard;

