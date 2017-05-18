import './protocolClientList.less'
import React from 'react';
import { hashHistory } from 'react-router';
import {Breadcrumb,Form, Row, Col, Input, Button, Icon,Select,Popconfirm,message,Table,AutoComplete} from 'antd';
import { Link} from 'react-router';
import $ from 'jquery';
import { serveUrl, User, cacheData} from '../../utils/config';

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const msg = '是否删除?';
// const url = 'http://192.168.1.126:8887/';

class AddProtocolClient extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            employeeList: [],
            employeeId: '',
            getInstitutionType:[],
            AutoEmployeeList:[]
        }
    }

    componentWillMount() {
          if(User.isLogin()){

        } else{
            hashHistory.push('/login');
        }
        const _this = this;
        //跟进人列表
         $.ajax({
             type: "GET",
             url: serveUrl+"guest-employee/queryEmployeeDropdownList",
             data:{access_token: User.appendAccessToken().access_token},
             success: function(data){
                 if (data.status == 200) {
                    const Adata = [];
                    data.data.map((data) => {
                        Adata.push(data.value);
                    })
                    _this.setState({
                        AutoEmployeeList: Adata
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
    componentDidMount = () => {
        $(".ant-breadcrumb-separator").html(">");
        $(".ant-breadcrumb-separator").css({ color: '#333' });
    }

    AutoEmployeeCompleteChange=(e)=>{
        const _this = this;
        $.ajax({
            type: "GET",
            url: serveUrl+"guest-employee/queryEmployeeDropdownList",
            data:{access_token: User.appendAccessToken().access_token,name:e},
            success: function(data){
                if (data.status == 200) {
                    if(data.data.length == 1){
                        _this.setState({
                            employeeId:data.data[0].id
                        });
                    }
                }
            }
        });
    }

    handleReset = () => {
        this.props.form.resetFields();
        hashHistory.push('/protocolClientList');
    }

    handleSelectChange = (value) => {
        this.setState({
            employeeId: value
        });
    }

    //表单提交
    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                //修改保存
                const _this = this;
                
                const formatData = {
                    data: [{
                        airportCode: "LJG",
                        name: values.name,
                        type: values.type,
                        employeeId: parseInt(_this.state.employeeId),
                        remark: values.remark
                    }]
                };
                $.ajax({
                    type: "POST",
                    url: serveUrl + "institution-client/saveOrUpdate?access_token="+User.appendAccessToken().access_token,
                    // url:"http://192.168.0.100:8887/saveOrUpdate?access_token="+User.appendAccessToken().access_token,
                    contentType: 'application/json;charset=utf-8',
                    data: JSON.stringify(formatData),
                    success: function (data) {
                        if (data.status == 200) {
                            message.success(data.msg);
                            hashHistory.push('/protocolClientList');
                            _this.props.form.resetFields();
                        }
                        else if(data.status == 5001){
                            message.error(data.msg);
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
        const Options = this.state.employeeList.map(data => <Option key={data.id} value={data.id.toString()}>{data.value}</Option>);
        const Options1 = this.state.getInstitutionType.map(data => <Option key={data.id} value={data.value}>{data.value}</Option>);
        return (
            <div>
                <div className="breadcrumb-box">
                    <div className="top-bar"></div>
                    <div className="breadcrumb">
                        <Breadcrumb>
                            <Breadcrumb.Item>客户管理</Breadcrumb.Item>
                            <Breadcrumb.Item>添加客户</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>

                <div className="box">
                    <ul className="tit">
                        <li>
                            <a href="javascript:;" className="active">添加客户</a>
                        </li>

                    </ul>

                    <Form horizontal style={{ marginTop: 44 }}>
                        <FormItem label="机构客户名称" {...formItemLayout} hasFeedback required style={{ marginLeft: -30 }} >
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: '请输入机构客户名称!' }],
                            })(
                                <Input placeholder="请输入机构客户名称" style={{ width: 358 }} className='required' />

                                )}
                        </FormItem>

                        <FormItem labelInValue label="跟进人" {...formItemLayout} required style={{ marginLeft: -30 }}>
                            {getFieldDecorator('employeeId', {
                                rules: [{ required: true, message: '请选择跟进人!' }],
                            })(
                                <AutoComplete style={{width:358}} dataSource={this.state.AutoEmployeeList} placeholder="请输入客户名称"
                                        onChange={this.AutoEmployeeCompleteChange}/>
                                )}
                        </FormItem>

                        <FormItem label="机构类型" {...formItemLayout} style={{ marginLeft: -30 }}>
                            {getFieldDecorator('type', {
                                initialValue: '银行'
                            })(
                                <Select size="large" style={{ width: 358 }} >
                                    {Options1}
                                </Select>
                                )}
                        </FormItem>

                        <FormItem id="control-textarea" label="备注" {...formItemLayout} style={{ marginLeft: -30 }}>
                            {getFieldDecorator('remark', {

                            })(
                                <Input type="textarea" id="control-textarea" rows="3" style={{ width: 358, height: 112 }} />
                                )}
                        </FormItem>

                        <FormItem wrapperCol={{ span: 6, offset: 3 }} style={{ marginTop: 58, marginLeft: 180, paddingBottom: 100 }}>
                            <button className='btn-small' onClick={this.handleSubmit}>保&nbsp;&nbsp;存</button>
                            &nbsp;&nbsp;&nbsp;
                            <button className='btn-small' onClick={this.handleReset}>取&nbsp;&nbsp;消</button>
                        </FormItem>
                    </Form>

                </div>
            </div>
        )
    }
}

AddProtocolClient = Form.create()(AddProtocolClient);

export default AddProtocolClient;