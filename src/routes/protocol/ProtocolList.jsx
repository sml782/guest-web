import './protocol.less';
import React from 'react';
import { hashHistory } from 'react-router';
import {Breadcrumb,Form, Row, Col, Input, Button, Icon,Select,Popconfirm,message,Table,AutoComplete,Modal } from 'antd';
import { Link} from 'react-router';
import $ from 'jquery';
import moment from 'moment';
import { serveUrl, User, cacheData} from '../../utils/config';
import DeleteDialog from '../DeleteDialog';//引入删除弹框
// const $ = require('jquery')

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const Option1 = AutoComplete.Option;
const msg = '确认删除该协议吗?';
const url = "http://192.168.1.130:8887/";

class ProtocolList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            protocolList:[],
            protocolListLength:null,
            protocolListPage:1,
            protocolListRows:10,
            protocolTypeList:[],
            visibleDel:false,
            AutoClientList:[],//协议客户列表
            AutoProtocolList:[],//协议列表
            protocolId:null
        }
    }

     componentWillMount() {
          if(User.isLogin()){
        } else{
            hashHistory.push('/login');
        }
        this.getInitList(this.state.protocolListPage,this.state.protocolListRows); 
        //获取协议类型列表
        const _this = this;
        $.ajax({
            type: "GET",
            url: serveUrl + "guest-protocol/protocolTypeSelect",
            // url: url + "protocolTypeSelect",
            data: {access_token: User.appendAccessToken().access_token},
            success: function (data) {
                if (data.status == 200) {
                    data.data.unshift({
                        id:'',
                        value:'全部类型'
                    });
                    _this.setState({
                        protocolTypeList:data.data
                    });
                }
            }
        });
        //机构客户名称的列表（模糊匹配）
        $.ajax({
            type: "GET",
            // url: "192.168.1.126:8887/queryInstitutionClientDropdownList",
            url: serveUrl + "institution-client/queryInstitutionClientDropdownList",
            data: { access_token: User.appendAccessToken().access_token },
            success: function(data) {
                if (data.status == 200) {
                    const Adata = [];
                    _this.setState({
                        AutoClientList: []
                    })
                    data.data.map((data) => {
                        Adata.push(data.value);
                    })
                    _this.setState({
                        AutoClientList: Adata
                    })
                }
            }
        });
        //协议名称列表（模糊匹配）
        $.ajax({
            type: "GET",
            url: serveUrl+"guest-protocol/getProtocolNameDropdownList",  
            // url: url+"queryProtocolNameDropdownList",     
            data: {access_token: User.appendAccessToken().access_token, name: '' },
            success: function(data) {
                if (data.status == 200) {
                    const Adata = [];
                    _this.setState({
                        AutoProtocolList: []
                    })
                    data.data.map((data) => {
                        Adata.push(data.value);
                    })
                    _this.setState({
                        AutoProtocolList: Adata
                    })
                }
            }
        });
    }

    componentDidMount=()=>{
        $(".ant-breadcrumb-separator").html(">");
        $(".ant-col-19").removeClass('ant-col-19').addClass("ant-col-16");
        $(".ant-col-5").removeClass('ant-col-5').addClass("ant-col-8");
    }

    componentDidUpdate=()=>{
        // $(".ant-pagination-item-active").css({backgroundColor:'#4778c7',borderColor:'#4778c7'});    
        $(".ant-table-tbody tr td").css({borderBottom:'none'});
        $("table").css({border:'1px solid #f0f0f0'});
        $(".ant-pagination-options").hide();
    }

    //初始化获取协议列表
    getInitList = (page,rows)=>{
        const _this = this;
        $.ajax({
            type: "GET",
            url: serveUrl + "guest-protocol/protocolList",
            // url: url + "protocolList",
            data: {
                access_token: User.appendAccessToken().access_token,
                page:page,
                rows:rows,
                protocolType:_this.props.form.getFieldValue('institutionClientType') == undefined ? null:_this.props.form.getFieldValue('institutionClientType'),
                institutionClientName:_this.props.form.getFieldValue('institutionClientName') == undefined ? null:_this.props.form.getFieldValue('institutionClientName'),
                protocolName:_this.props.form.getFieldValue('protocolName')== undefined ? null:_this.props.form.getFieldValue('protocolName')
            },
            success: function (data) {
                if (data.status == 200) {
                    data.data.rows.map(data=>{
                        data.key = data.protocolId;
                    });
                    _this.setState({
                        protocolList:data.data.rows,
                        protocolListLength:data.data.total
                    });
                }
            }
        });
    }

    addClick=()=>{
        hashHistory.push('/addProtocol');
    }

    //删除弹框
    showModalDel = (record) => {
        this.setState({
            visibleDel: true,
            protocolId:record.protocolId
        });
    }
    //删除确认
    handleOkDel = () => {
        this.setState({
            visibleDel: false
        });
        //删除协议
        const _this = this;
        $.ajax({
            type: "POST",
            contentType: 'application/json;charset=utf-8',
            url: serveUrl + "guest-protocol/deleteProtocol?access_token="+User.appendAccessToken().access_token,
            data: JSON.stringify({
                data: [parseInt(_this.state.protocolId)]
            }),
            success: function (data) {
                if (data.status == 200) {
                    message.success(data.msg);
                    _this.getInitList(_this.state.protocolListPage,_this.state.protocolListRows);
                }
                else if(data.status==5004){
                    message.error(data.msg);
                }
            }
        });
    }
    //删除取消
    handleCancelDel = () => {
        this.setState({
            visibleDel: false
        });
    }
    
    //条件搜索
    handleSearch=()=>{
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const _this = this;
                $.ajax({
                    type: "GET",
                    url: serveUrl + "guest-protocol/protocolList?access_token="+User.appendAccessToken().access_token,
                    // url: url + "protocolList",
                    data: {
                        page: 1,
                        rows: _this.state.protocolListRows,
                        protocolType: values.institutionClientType == undefined ? null:values.institutionClientType,
                        institutionClientName: values.institutionClientName== undefined ? null:values.institutionClientName,
                        protocolName: values.protocolName== undefined ? null:values.protocolName
                    },
                    success: function (data) {
                        if (data.status == 200) {
                            
                            data.data.rows.map(data => {
                                data.key = data.protocolId;
                            });
                            _this.setState({
                                protocolList: data.data.rows,
                                protocolListLength: data.data.total
                            });
                        }
                    }
                });
            }
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };
        const _this = this;
        const columns = [
            {
                title: '协议编号',
                width: '20%',
                dataIndex: 'no',
                render(text, record) {
                    return (
                        <div className="order">{text}</div>
                    )
                }
            }, {
                title: '客户名称',
                width: '20%',
                dataIndex: 'institutionClientName',
                render(text, record) {
                    return (
                        <div className="order">{text}</div>
                    )
                }
            }, {
                title: '协议名称',
                width: '20%',
                dataIndex: 'name',
                render(text, record) {
                    return (
                        <div className="order">{text}</div>
                    )
                }
            }, {
                title: '协议类型',
                width: '20%',
                dataIndex: 'protocolTypeName',
                render(text, record) {
                    return (
                        <div className="order">{text}</div>
                    )
                }
            }, {
                title: '操作',
                render(text, record) {
                    return (
                        <div className="order">
                            <a href={`#/UpdateProtocol/${record.protocolId}`} style={{ marginRight: 10,color:'#4778c7' }}>修改</a>
                            <a href='javascript:;' onClick={_this.showModalDel.bind(_this,record)} style={{color:'#4778c7'}}>删除</a>
                        </div>
                    )
                }
            }
        ];

        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };
        const pagination = {
            total: this.state.protocolListLength,
            showSizeChanger: true,
          
            onChange(current) {
                _this.getInitList(current,_this.state.protocolListRows);
            }
        };
        //协议类型下拉菜单
        const Options = this.state.protocolTypeList.map(data => <Option key={data.id} value={data.id.toString()}>{data.value}</Option>);
        return (
            <div>
                <div className="breadcrumb-box">
                    <div className="top-bar"></div>
                    <div className="breadcrumb">
                        <Breadcrumb>
                            <Breadcrumb.Item>协议管理</Breadcrumb.Item>
                            <Breadcrumb.Item>协议管理</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
                 
                 <div className="box">
                    <ul className="tit">
                        <li>
                            <a href="javascript:;" className="active">协议列表</a>
                        </li>
                    </ul>

                    <div className="mid-box">
                        <div className="protocol-sort">
                            <Form inline horizontal
                                className="ant-advanced-search-form"
                               >
                                <Row>
                                    <FormItem {...formItemLayout} hasFeedback style={{width: 14+'%'}}>
                                        {getFieldDecorator('institutionClientType', {
                                            initialValue:'' 
                                        })(
                                            <Select style={{height: 28 }}>
                                                {Options}
                                            </Select>
                                            )}
                                    </FormItem>
                                    <FormItem label="客户名称:" {...formItemLayout} hasFeedback style={{ width:24+'%' }}>
                                        {getFieldDecorator('institutionClientName', {
                                        })(
                                            <AutoComplete
                                                dataSource={this.state.AutoClientList}
                                                placeholder="请输入客户名称"
                                                style={{width:170}}
                                                />
                                            )}
                                    </FormItem>
                                    <FormItem label="协议名称:" {...formItemLayout} hasFeedback style={{ width: 24+'%' }}>
                                        {getFieldDecorator('protocolName', {

                                        })(
                                            <AutoComplete
                                                dataSource={this.state.AutoProtocolList}
                                                // onSelect={this.onSelectClientNo}
                                                // onChange={this.handleChangeClientNo}
                                                placeholder="请输入协议名称"
                                                style={{width:170}}
                                                />
                                            )}
                                    </FormItem>
                                    <button className='btn-small' onClick={this.handleSearch} style={{marginRight:26,marginLeft:15}}>查&nbsp;&nbsp;询</button>
                                    <button className='btn-small' onClick={this.addClick} style={{}}>添加协议</button>
                                </Row>
                            </Form>
                        </div>
                    </div>

                    <div className="search-result-list " style={{marginTop:16}}>
                        <Table columns={columns} dataSource={this.state.protocolList} pagination={pagination}  className="serveTable"/>
                        <p style={{marginTop: 20}}>共搜索到{this.state.protocolListLength}条数据</p>
                    </div>
                 </div>
                 <Modal title="警告"
                     key={Math.random() * Math.random()}
                     visible={this.state.visibleDel}
                     onOk={this.handleOkDel}
                     onCancel={this.handleCancelDel}
                     >
                     <div>
                         <DeleteDialog msg={msg} />
                     </div>
                 </Modal>
            </div>
        )
    }
}

ProtocolList = Form.create()(ProtocolList);
export default ProtocolList;

