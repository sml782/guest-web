import './service.less';
import React from 'react';
import { hashHistory } from 'react-router';
import {Form, Row, Col, Input, Button, Icon,Select,message,Radio,Table,Checkbox,Modal} from 'antd';
import { Link} from 'react-router';
import $ from 'jquery';
import { serveUrl, User, cacheData,protocolMsg,newAddFlag} from '../../utils/config';
import AddSecurityChannel from './AddSecurityChannel';//添加安检通道
import UpdateSecurityChannel from './UpdateSecurityChannel';//修改安检通道
import DeleteDialog from '../DeleteDialog';//引入删除弹框

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const msg = '是否删除?';
const url = 'http://192.168.1.130:8887/';

class SecurityChannelList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible5:false,
            visible05:false,
            visible11:false,
            serviceList:[],
            serviceListLength:null,
            serveListDateCurrent:1,
            serveListDatePageSize:10,
            servId:null
        }
    }

     componentWillMount() {
          if(User.isLogin()){
        } else{
            hashHistory.push('/login');
        }  
    }

    componentDidUpdate=()=>{
        // $(".ant-pagination-item-active").css({backgroundColor:'#4778c7',borderColor:'#4778c7'});
        $(".ant-table-tbody tr td").css({borderBottom:'none'});
        $("table").css({border:'1px solid #f0f0f0'});
        $(".ant-pagination-options").hide();
    }

    getInitList=(page,rows)=> {
        const _this = this;
        $.ajax({
            type: "GET",
            url: serveUrl+"guest-service/list",
            data: { access_token: User.appendAccessToken().access_token,page:page,rows:rows,typeId:6},
            success: function (data) {
                if (data.status == 200) {
                    if (data.data.total > 0) {
                        data.data.rows.map((data) => {
                            data.key = data.servId;
                        })
                        _this.setState({
                            serviceList: data.data.rows,
                            serviceListLength: data.data.total
                        });
                    }
                }
            }
        });
    }

    componentDidMount=()=>{
        $(".ant-modal-footer").hide();
        this.getInitList(this.state.serveListDateCurrent,this.state.serveListDatePageSize);
        // this.getInitialValue(this.state.listDataPage,this.state.listDataRow); 
    }

   //显示新增安检通道的弹窗
    showModal5 = () => {
        this.setState({
            visible5: true
        });
    }
    handleOk5 = () => {
        this.setState({
            confirmLoading5: true,
        });
        setTimeout(() => {
            this.setState({
                visible5: false,
                confirmLoading5: false,
            });
        }, 2000);
    }
    handleCancel5 = () => {
        this.setState({
            visible5: false,
        });
    }

    //显示修改安检通道的弹窗
    showModal05 = (record) => {
        this.setState({
            visible05: true,
            record:record
        });
    }
    handleOk05 = () => {
        this.setState({
            confirmLoading05: true,
        });
        setTimeout(() => {
            this.setState({
                visible05: false,
                confirmLoading05: false,
            });
        }, 2000);
    }
    handleCancel05 = () => {
        this.setState({
            visible05: false,
        });
    }
    //删除弹框
    showModal11 = (record) => {
        
        this.setState({
            visible11: true,
            servId:record.servId
        });
    }
    handleOk11 = () => {
        this.setState({
            visible11: false,
        });
        //删除产品
        const _this = this;
        $.ajax({
            type: "POST",
            contentType: 'application/json;charset=utf-8',
            url: serveUrl + "guest-service/delete?access_token="+User.appendAccessToken().access_token,
            data: JSON.stringify({
                data: [parseInt(_this.state.servId)]
            }),
            success: function (data) {
                if (data.status == 200) {
                    message.success(data.msg);
                    _this.getInitList(_this.state.serveListDateCurrent,_this.state.serveListDatePageSize);
                }
                else if(data.status==5004){
                    message.error(data.msg);
                }
            }
        });
    }
    handleCancel11 = () => {
        this.setState({
            visible11: false,
        });
    }

    //新增安检通道
    handleClick5 =()=>{
        this.setState({
            visible5:false
        });
        this.getInitList(this.state.serveListDateCurrent,this.state.serveListDatePageSize);
    }
    //修改安检通道
    handleClick05 =()=>{
        this.setState({
            visible05:false
        });
        this.getInitList(this.state.serveListDateCurrent,this.state.serveListDatePageSize);
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
        //安检通道列表表头
        const columns = [
            {
                title: '服务编号',
                width: '33%',
                dataIndex: 'no',
                render(text, record) {
                    return (
                        <div className="order">
                            {text}
                        </div>
                    )
                }
            }, {
                title: '安检通道名称',
                width: '33%',
                dataIndex: 'name',
                render(text, record) {
                    return (
                        <div className="order">{text}</div>
                    )
                }
            },  {
                title: '操作',
                render(text, record) {
                    return (
                        <div className="order">
                            <a href='javascript:;' onClick={_this.showModal05.bind(_this,record)} style={{ marginRight: 10,color:'#4778c7' }}>修改</a>
                            <a href='javascript:;' onClick={_this.showModal11.bind(_this,record)} style={{color:'#4778c7'}}>删除</a>
                        </div>
                    )
                }
            }
        ];

        return (
            <div>
                <div className="sub-tit">
                    <p className="f16 fl">安检通道列表</p>
                    <button className="btn fr" onClick={this.showModal5}>增加安检通道</button>
                </div>
                <p style={{ marginTop: 28 }}>共<span>{this.state.serviceListLength}</span>个安检通道</p>
                <div className="search-result-list">
                    <Table key='t6' columns={columns} dataSource={this.state.serviceList} pagination={pagination} className="serveTable" />
                    <p style={{marginTop: 20}}>共搜索到{this.state.serviceListLength}条数据</p>
                </div>

                 <div className="servive-modal">
                     <Modal title="新增安检通道"
                         key={Math.random() * Math.random()}
                         visible={this.state.visible5}
                         onOk={this.handleOk5}
                         confirmLoading={this.state.confirmLoading5}
                         onCancel={this.handleCancel5}
                         >
                         <div>
                             <AddSecurityChannel handleClick={this.handleClick5}  />
                         </div>
                     </Modal>
                 </div>

                <div className="servive-modal">
                     <Modal title="修改安检通道"
                         key={Math.random() * Math.random()}
                         visible={this.state.visible05}
                         onOk={this.handleOk05}
                         confirmLoading={this.state.confirmLoading05}
                         onCancel={this.handleCancel05}
                         >
                         <div>
                             <UpdateSecurityChannel handleClick={this.handleClick05} record={this.state.record} />
                         </div>
                     </Modal>
                 </div>
                 <div className="servive-modal">
                     <Modal title="警告"
                         key={Math.random() * Math.random()}
                         visible={this.state.visible11}
                         onOk={this.handleOk11}
                         onCancel={this.handleCancel11}
                         >
                         <div>
                             <DeleteDialog msg={msg} />
                         </div>
                     </Modal>
                 </div>
                 
            </div>
        )
    }
}

SecurityChannelList = Form.create()(SecurityChannelList);

export default SecurityChannelList;

