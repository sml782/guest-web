
import React from 'react';
import { hashHistory } from 'react-router';
import { Breadcrumb, Form, Row, Col, Input, Button, Icon, Select, Popconfirm, message, Table, Checkbox, AutoComplete, DatePicker } from 'antd';
import { Link } from 'react-router';
import $ from 'jquery';
import moment from 'moment';
import { serveUrl, User, cacheData } from '../utils/config';

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;

class ServiceList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            createUserName:null,
            orderNo:null,
            createTime:null,
            text:null,
        }
    }

    componentWillMount() {
         if(User.isLogin()){
        } else{
            hashHistory.push('/login');
        }
        if(this.props.params.type == 2 || this.props.params.type == 3){
                this.setState({
                    text:'更新失败'
                })
            }
            if(this.props.params.type == 0){
                this.setState({
                    text:'添加失败'
                })
            }
       
        

    }
    componentDidMount = () => {
        $(".ant-breadcrumb-separator").html(">");
        $(".ant-breadcrumb-separator").css({ color: '#333' });
        $(".ant-col-5").removeClass('ant-col-5').addClass("ant-col-8");
        $(".ant-col-19").removeClass('ant-col-19').addClass("ant-col-16");

    }
   return = (e) =>{
        if(this.props.params.type == 0 || this.props.params.type == 2){
            hashHistory.push('/appointmentList')
        }else{
            hashHistory.push('/serverList');
        }
    }
    handleReset = (e)=>{
       if(this.props.params.type == 0 || this.props.params.type == 2){
            hashHistory.push('/addAppointment')
        }else{
            hashHistory.push('/addService');
        } 
    }
    




    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };
     
        const _this = this;
        
   


        return (
            <div>
                <div className="breadcrumb-box">
                    <div className="top-bar"></div>
                    <div className="breadcrumb">
                        <Breadcrumb>
                            <Breadcrumb.Item>订单状态</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>

                <div className="box" style={{ marginTop: 50 }}>
                    <div className='status-box'>
                        <Form horizontal onSubmit={this.handleSubmit} style={{ marginLeft:138,marginTop: 44 }}>
                            <div style={{marginTop:70}}><img src={require('../assets/images/false.png')}/><span className='red-word'>{this.state.text}</span></div>
                            
                            <button style={{marginTop:80}} className='btn' type="primary" htmlType="submit" onClick={this.return}>返回列表</button>
                            <button style={{marginLeft:40}} className='btn' type="primary" onClick={this.handleReset}>继续添加</button>
                        </Form>
                    </div>
                </div>
            </div>
        )
    }
}

ServiceList = Form.create()(ServiceList);

export default ServiceList;