import './login.less'
import React from 'react';
import { hashHistory } from 'react-router';
import { Form, Input, Button, message, Icon, Checkbox } from 'antd';
import $ from 'jquery';
import { serveUrl, User, cacheData, loginFlag,userMsg,setCookie,getCookie } from '../../utils/config';

const FormItem = Form.Item;
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            remmberPwd: false
        }
    }

    componentDidMount = () => {
        if (loginFlag.flag) {
            // $('.user').val(localStorage.getItem('user'));
            // $('.pwd').val(localStorage.getItem('pwd'));
            $('.user').val(getCookie('user'));
            $('.pwd').val(getCookie('pwd'));
            this.setState({
                remmberPwd: true
            });
        }
    }
    

    emitEmpty = () => {
        this.userNameInput.focus();
        this.setState({ userName: '' });
    }
    onChangeUserName = (e) => {
        this.setState({ userName: e.target.value });
    }
    //记住密码
    remmberPwd = (e) => {
        this.setState({
            remmberPwd: e.target.checked
        });
        if (e.target.checked) {
            loginFlag.flag = true;
        }
        else {
            loginFlag.flag = false;
        }
    }
    //提交表单
    handleSubmit = (e) => {
        const _this = this;
        e.preventDefault();
        _this.props.form.validateFields((err, values) => {
            if ($('.user').val() && $('.pwd').val()) {
                $.ajax({
                    type: 'POST',
                    url: 'http://airport.zhiweicloud.com/oauth/oauth/access_token',
                    // url:'http://101.37.106.176/oauth/oauth/access_token',
                    data: {
                        grant_type: 'password',
                        client_id: 'LJG',
                        client_secret: 111111,
                        username: $('.user').val(),
                        password: $('.pwd').val(),
                        scope: "",
                    },
                    success: function (data) {
                        if (data.access_token) {
                            //获取用户名称
                            $.ajax({
                                type: "GET",
                                url: serveUrl+"guest-employee/getUserName",
                                // url: "http://192.168.0.101:8887/getUserName",
                                data: { access_token:data.access_token},
                                success: function (data) {
                                    if (data.status == 200) {
                                        setCookie('user', data.data.name, 1);
                                    }
                                }
                            });
                            if (_this.state.remmberPwd) {
                                setCookie('pwd', $('.pwd').val(), 1);
                                setCookie('user', $('.user').val(), 1);
                            }
                            User.login(data);
                            cacheData.set('username', $('.user').val());
                            setTimeout(function(){
                                hashHistory.push('/');
                            },500);
                        }
                        else{
                            message.error(data.display_message);
                        }
                    }
                });
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
        }
        const { userName } = this.state;
        const suffix = userName ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;
        return (
            <div id="login" className="animated zoomIn">
                <div className="login-tit">
                    <span>
                        <img src={require('../../assets/images/icon.png')} alt="贵宾云logo" />
                        <img src={require('../../assets/images/tit.png')} alt="贵宾云标题" />
                    </span>
                    <span>
                        <img src={require('../../assets/images/line.png')} alt="隔线" />
                    </span>
                    <span className="text">智慧贵宾系统云平台</span>
                </div>

                <div className="login-box">
                    <div className="inline-box"></div>
                    <p >登录</p>
                    <Form className="login-form" horizontal onSubmit={this.handleSubmit}>
                        <FormItem>
                            {getFieldDecorator('userName', {
                                rules: [{ message: '请输入用户名!' }],
                            })(
                                <div className="login-input">
                                    <img src={require('../../assets/images/head.png')} alt="头像图标" />
                                    <input className="user" type="text" placeholder="请输入用户名" />
                                </div>
                                )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ message: '请输入密码!' }],
                            })(
                                <div className="login-input">
                                    <img src={require('../../assets/images/lock.png')} alt="密码图标" />
                                    <input className="pwd" type="password" placeholder="请输入密码" />
                                </div>
                                )}
                        </FormItem>
                        <div className="remmber" style={{ marginBottom: 24 }} >
                            <Checkbox style={{ float: 'right', color: '#fff' }} onChange={this.remmberPwd} checked={this.state.remmberPwd}>记住密码</Checkbox>
                        </div>
                        <button style={{ width: 170, height: 32, lineHeight: '32px', padding: 0, textAlign: 'center', position: 'absolute', left: '50%', marginLeft: '-90px' }} className="btn">登 录</button>
                    </Form>
                </div>
                <div className="login-footer">
                    <p>广州风数信息科技有限公司</p>
                </div>
            </div>
        )
    }
}

Login = Form.create()(Login);

export default Login;