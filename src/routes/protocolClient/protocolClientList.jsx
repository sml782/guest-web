import './protocolClientList.less'
import React from 'react';
import { hashHistory } from 'react-router';
import {Breadcrumb,Form, Row, Col, Input, Button, Icon,Select,Popconfirm,message,Table,AutoComplete,Modal} from 'antd';
import { Link} from 'react-router';
import $ from 'jquery';
import { serveUrl, User, cacheData} from '../../utils/config';
import DeleteDialog from '../DeleteDialog';//引入删除弹框

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const msg = '确定删除该客户?';
// const url = 'http://192.168.1.126:8887/';

class ProtocolClientList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            protocolClientList:[],
            protocolClientListLength:null,
            protocolClientListPage:1,
            protocolClientListRows:10,
            AutoClientList:[],
            visible:false,
            institutionClientId:null,
            getInstitutionType:[]
        }
    }

     componentWillMount() {
          if(User.isLogin()){
              
        } else{
            hashHistory.push('/login');
        }
        this.getInitList(this.state.protocolClientListPage,this.state.protocolClientListRows);
        //机构客户名称的列表（模糊匹配）
        const _this = this;
         $.ajax({
             type: "GET",
             url:serveUrl+"institution-client/queryInstitutionClientDropdownList",
             data:{access_token: User.appendAccessToken().access_token,name:''},
             success: function(data){
                if(data.status == 200){
                    const Adata = [];
                    _this.setState({
                        AutoClientList:[]
                    })
                    data.data.map((data)=>{
                        Adata.push(data.value);
                    })
                    _this.setState({
                        AutoClientList:Adata
                    })
                }
            }
         });
         //获取机构类型列表
        $.ajax({
            type: "GET",
            url: serveUrl + "institution-client/getInstitutionType",
            data: {access_token: User.appendAccessToken().access_token},
            success: function (data) {
                if (data.status == 200) {
                    _this.setState({
                        getInstitutionType:data.data
                    });
                }
            }
        }); 
        
    }
    componentDidMount=()=>{
        $(".ant-breadcrumb-separator").html(">");
        $(".ant-breadcrumb-separator").css({color:'#333'});
    }

    componentDidUpdate=()=>{
        // $(".ant-pagination-item-active").css({backgroundColor:'#4778c7',borderColor:'#4778c7'});
        $(".ant-table-tbody tr td").css({borderBottom:'none'});
        $("table").css({border:'1px solid #f0f0f0'});
        $(".ant-pagination-options").hide();
    }

    //获取协议客户列表
    getInitList=(page,rows)=> {
        const _this = this;
        if(_this.props.form.getFieldValue('type') == '所有'){
            _this.props.form.setFieldsValue({
                type: ''
            })
        }
        $.ajax({
            type: "GET",
            url: serveUrl + "institution-client/list",
            data: {
                access_token: User.appendAccessToken().access_token,
                page:page,
                rows:rows,
                type: _this.props.form.getFieldValue('type'),
                name: _this.props.form.getFieldValue('name')
            },
            success: function (data) {
                if (data.status == 200) {
                    data.data.rows.map(data=>{
                        data.key = data.institutionClientId;
                    });
                    _this.setState({
                        protocolClientList:data.data.rows,
                        protocolClientListLength:data.data.total
                    });
                }
            }
        });
    }
    //按条件搜索
    handleSearch = (e) => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const _this = this;
                if(values.type == '所有'){
                    values.type = '';
                }
                _this.state.protocolClientListPage = 1;
                _this.setState({
                    protocolClientListPage:_this.state.protocolClientListPage
                });
                $.ajax({
                    type: "GET",
                    url: serveUrl + "institution-client/list",
                    data: {
                        access_token: User.appendAccessToken().access_token,
                        page: _this.state.protocolClientListPage,
                        rows: _this.state.protocolClientListRows,
                        type: values.type,
                        name: values.name
                    },
                    success: function (data) {
                        if (data.status == 200) {
                            data.data.rows.map(data => {
                                data.key = data.institutionClientId;
                            });
                            _this.setState({
                                protocolClientList: data.data.rows,
                                protocolClientListLength: data.data.total
                            });
                        }
                    }
                });
            }
        })
    }

    showModal = (record) => {
        
        this.setState({
            visible: true,
            institutionClientId:record.institutionClientId
        });
    }
    handleOk = () => {
        this.setState({
            visible: false,
        });
        //删除协议客户
        const _this = this;
        $.ajax({
            type: "POST",
            contentType: 'application/json;charset=utf-8',
            url: serveUrl + "institution-client/delete?access_token="+User.appendAccessToken().access_token,
            data: JSON.stringify({
                data: [parseInt(_this.state.institutionClientId)]
            }),
            success: function (data) {
                if (data.status == 200) {
                    message.success(data.msg);
                    _this.getInitList(_this.state.protocolClientListPage, _this.state.protocolClientListRows);
                }
                else if(data.status==5004){
                    message.error(data.msg);
                }
            }
        });
    }
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }

    

    addClick = (e) =>{
        hashHistory.push('/addProtocolClient');
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };
        const Options1 = this.state.getInstitutionType.map(data => <Option key={data.id} value={data.value}>{data.value}</Option>);

        const _this = this;
        const columns = [
            {
                title: '客户代码',
                width: '20%',
                dataIndex: 'no',
                render(text, record) {
                    return (
                        <div className="order">{text}</div>
                    )
                }
            }, {
                title: '客户',
                width: '20%',
                dataIndex: 'name',
                render(text, record) {
                    return (
                        <div className="order">{text}</div>
                    )
                }
            }, {
                title: '客户类型',
                width: '20%',
                dataIndex: 'type',
                render(text, record) {
                    return (
                        <p className="order">
                            {text}
                        </p>
                    )
                }
            }, {
                title: '跟进人',
                width: '20%',
                dataIndex: 'employeeName',
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
                            <a href={`#/UpdateProtocolClient/${record.institutionClientId}`} style={{ marginRight: 10,color:'#4778c7'}}>修改</a>
                            <a href='javascript:;' onClick={_this.showModal.bind(_this,record)} style={{color:'#4778c7'}}>删除</a>
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
            total: this.state.protocolClientListLength,
            showSizeChanger: true,
            onChange(current) {
                _this.getInitList(current,_this.state.protocolClientListRows);
            }
        };

        return (
            <div>
                <div className="breadcrumb-box">
                    <div className="top-bar"></div>
                    <div className="breadcrumb">
                        <Breadcrumb>
                            <Breadcrumb.Item>客户管理</Breadcrumb.Item>
                            <Breadcrumb.Item>客户列表</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>

                 <div className="box">
                    <ul className="tit">
                        <li>
                            <a href="javascript:;" className="active">客户列表</a>
                        </li>
                    </ul>
                    <Form
                        horizontal
                        className="ant-advanced-search-form"
                        // onSubmit={this.handleSearch}
                        style={{marginTop:44}}
                        >
                        <Row>
                            <Col span={4}>
                                <FormItem  {...formItemLayout} hasFeedback>
                                    {getFieldDecorator('type', {
                                        initialValue:'所有' 
                                    })(
                                        <Select style={{width:130,height:28,marginLeft:14}}>
                                            {Options1}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={14} style={{width:350,height:32}}>
                                <FormItem label="客户名称" {...formItemLayout} hasFeedback>
                                    {getFieldDecorator('name', {
                                    })(
                                        <AutoComplete
                                            dataSource={this.state.AutoClientList}
                                            placeholder="请输入"
                                         />
                                    )}
                                </FormItem>
                            </Col>          
                        </Row>
                        <Row>
                            <Col className='lookButton' span={2} style={{ textAlign: 'right',marginTop:-47,marginLeft:600 }}>
                                <button className='btn-small' onClick={this.handleSearch}>查&nbsp;&nbsp;询</button>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='lookButton' span={2} style={{ textAlign: 'right',marginTop:-47,marginLeft:700 }}>
                                <button className='btn-small' onClick={this.addClick}>添加客户</button>
                            </Col>
                        </Row>
                    </Form>
                    <div className="search-result-list" style={{marginLeft:14}}>
                        <Table style={{marginTop:20}} columns={columns} dataSource={this.state.protocolClientList} pagination={pagination}  className="serveTable"/>
                        <p style={{marginTop: 20}}>共搜索到{this.state.protocolClientListLength}条数据</p>
                    </div>
                 </div>
                 <div id="delete-modal">
                     <Modal title="警告"
                         key={Math.random() * Math.random()}
                         visible={this.state.visible}
                         onOk={this.handleOk}
                         confirmLoading={this.state.confirmLoading}
                         onCancel={this.handleCancel}
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

ProtocolClientList = Form.create()(ProtocolClientList);

export default ProtocolClientList;