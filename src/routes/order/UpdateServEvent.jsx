import React from 'react';
import { hashHistory } from 'react-router';
import {Breadcrumb,Form, Row, Col, Input, Button, Icon,Select,Popconfirm,message,Table,Checkbox,Radio,DatePicker,Modal} from 'antd';
import { Link} from 'react-router';
import moment from 'moment';
import $ from 'jquery';
import { serveUrl, User, cacheData,protocolMsg} from '../../utils/config';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const CheckboxGroup = Checkbox.Group;
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
// const url = "http://192.168.1.198:8080/";

class UpdateServEvent  extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           oldData:[]
        }
    }

    componentWillMount=()=> { 
        if(User.isLogin()){
        } else{
            hashHistory.push('/login');
        }
        const _this = this;
        $.ajax({
            type: "GET",
            url:serveUrl+'flight-info/schedule-event-view',
            data: {access_token: User.appendAccessToken().access_token,scheduleEventId: _this.props.params.id},
            success: function (data) {
                if (data.status == 200) {
                    data.data.isApproach=data.data.isApproach.toString();
                    
                    _this.setState({
                        oldData:data.data
                    });
                }
            }
        });
    }

    componentDidMount = () => {
        $(".ant-breadcrumb-separator").html(">");
    }

     //表单提交
    handleSubmit = (e)=>{
        const _this=this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                
                var formatData = {
                    data: [
                        {
                            isApproach:values.isApproach,
                            name: values.name,
                            no: values.no,
                            type: values.type,
                            scheduleEventId:_this.props.params.id
                        }
                    ]
                }
                $.ajax({
                    type: "POST",
                    contentType:'application/json;charset=utf-8',
                    url: serveUrl+"flight-info/schedule-event-save-or-update?access_token="+User.appendAccessToken().access_token,
                    data: JSON.stringify(formatData),
                    success: function(data){
                        if(data.status == 200){
                            hashHistory.push('/servEventManage');
                        }
                    }
                });    
            }
        });
    }
    //清空表单
    handleReset=()=>{
        this.props.form.resetFields();
        hashHistory.push('/servEventManage');
    }

     render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 10 }
        };
        const formItemLayoutWithOutLabel = {
            wrapperCol: { span: 20, offset: 4 },
        };

        const _this = this;
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };

        return (
            <div>
                <div className="breadcrumb-box">
                    <div className="top-bar"></div>
                    <div className="breadcrumb">
                        <Breadcrumb>
                            <Breadcrumb.Item>订单管理</Breadcrumb.Item>
                            <Breadcrumb.Item>服务事件管理</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
                <div className="box">
                    <ul className="tit">
                        <li>
                            <a href="javascript:;" className="active">修改调度事件</a>
                        </li>
                    </ul>

                    <div className="mid-box">
                        <div className="protocol-sort">
                            <Form horizontal  className="" style={{ position: 'relative' }}>
                                <FormItem label="调度事件" {...formItemLayout} required>
                                    {getFieldDecorator("name", {
                                        rules: [{ required: true, message: '请输入调度事件!' }],
                                        initialValue:this.state.oldData.name
                                    })(
                                        <Input />
                                        )}
                                </FormItem>

                                <FormItem label="类别" {...formItemLayout} required>
                                    {getFieldDecorator("type", {
                                        rules: [{ required: true, message: '请选择调度事件类别!' }],
                                        initialValue:this.state.oldData.type
                                    })(
                                        <Select>
                                            <Option value="VIP调度">VIP调度</Option>
                                            <Option value="休息室服务">休息室服务</Option>
                                        </Select>
                                        )}
                                </FormItem>
                                <FormItem label="进出港" {...formItemLayout}>
                                    {getFieldDecorator("isApproach", {
                                        rules: [{ required: true, message: '请选择进出港!' }],
                                        initialValue:this.state.oldData.isApproach
                                    })(
                                        <Select>
                                            <Option value="1">进港</Option>
                                            <Option value="0">出港</Option>
                                        </Select>
                                        )}
                                </FormItem>

                                <FormItem label="序号" {...formItemLayout} required>
                                    {getFieldDecorator("no", {
                                        rules: [
                                            {
                                                message: "请输入序号！",
                                                pattern: /^\d+$/
                                            }, {
                                                required: true, message: '请输入序号！'
                                            }
                                        ],
                                        initialValue:this.state.oldData.no
                                    })(
                                        <Input />
                                        )}
                                </FormItem>

                                <FormItem wrapperCol={{ span: 6, offset: 9 }} style={{ marginTop: 24 }}>
                                    <button className="btn-small" onClick={this.handleSubmit}>保&nbsp;&nbsp;存</button>
                                    &nbsp;&nbsp;&nbsp;
                                    <button className="btn-small" onClick={this.handleReset}>取&nbsp;&nbsp;消</button>
                                </FormItem>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
UpdateServEvent  = Form.create()(UpdateServEvent );

export default UpdateServEvent ;