import React from 'react';
import { hashHistory } from 'react-router';
import {Form, Row, Col, Input, Button, Icon,Select,message,Radio } from 'antd';
import { Link} from 'react-router';
import $ from 'jquery';
import { serveUrl, User, cacheData,getCookie} from '../utils/config';

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const RadioGroup = Radio.Group;
const msg = '是否删除?';
let flag = true;

class UpdatePwd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 1,
            msg:''
        }
    }

     componentWillMount() {
          if(User.isLogin()){
        } else{
            hashHistory.push('/login');
        }
    }
    componentDidMount=()=>{
        $(".ant-modal-footer").hide();
        $(".ant-modal").css({top:'50%',marginTop:'-168px'});
    }

    confirmPwd = () => {
        if (this.props.form.getFieldValue('newPwd') != this.props.form.getFieldValue('confirmPwd')) {
            $(".confim-pwd .ant-form-explain").show();
            $(".confim-pwd .ant-input").css({ borderColor: '#f04134' });
            flag = false;
        }
        else {
            $(".confim-pwd .ant-form-explain").hide();
            $(".confim-pwd .ant-input").css({ borderColor: '#d9d9d9' });
            flag = true;
        }
    }

    submit=()=>{
        const _this = this;
        _this.props.form.validateFields((err, values) => {
            if(flag){
                $.ajax({
                    type: 'POST',
                    url: 'http://airport.zhiweicloud.com/oauth/user/reset/password',
                    data: {
                        access_token:User.appendAccessToken().access_token,
                        oldPassword: values.oldPwd,
                        newPassword: values.newPwd
                    },
                    success: function (data) {
                        const result = JSON.parse(data);
                        if(result.status == "success"){
                            _this.props.confirmUpdatePwd();
                            _this.props.form.resetFields();
                            message.success(result.display_message);
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
            wrapperCol: { span: 19 }
        };
        return (
            <div>
                 <div className="box">
                    <Form
                        horizontal
                        className="ant-advanced-search-form"
                        >
                        <FormItem label="原密码" {...formItemLayout} hasFeedback>
                            {getFieldDecorator('oldPwd', {
                                rules: [{ required: true, message: '请输入原密码!' }]
                            })(
                                <Input  type="password"/>
                                )}
                        </FormItem>
                        <FormItem label="新密码" {...formItemLayout} hasFeedback>
                            {getFieldDecorator('newPwd', {
                                rules: [{ required: true, message: '请输入新密码!' }]
                            })(
                                <Input  type="password"/>
                                )}
                        </FormItem>
                        <FormItem label="确认密码" {...formItemLayout} hasFeedback required>
                            {getFieldDecorator('confirmPwd', {

                            })(
                                <div className="confim-pwd">
                                    <Input  type="password" onBlur={this.confirmPwd}/>
                                    <div className="ant-form-explain" style={{display:'none',color:'#f04134'}}>两次密码输入不一致，请重新输入!</div>
                                </div>
                                )}
                        </FormItem>
                        <Row>
                            <Col span={24} style={{ textAlign: 'left' }} offset={10}>
                                <button className="btn-small" onClick={this.submit}>保&nbsp;&nbsp;存</button>
                            </Col>
                        </Row>
                    </Form>
                 </div>
            </div>
        )
    }
}

UpdatePwd = Form.create()(UpdatePwd);

export default UpdatePwd;

