
import React from 'react';
import { hashHistory } from 'react-router';
import { Breadcrumb, Form, Row, Col, Input, Button, Icon, Select, Popconfirm, message, Table, Checkbox, AutoComplete, DatePicker,Modal } from 'antd';
import { Link } from 'react-router';
import $ from 'jquery';
import moment from 'moment';
import { serveUrl, User, cacheData,getCookie } from '../utils/config';
import LoungeFlightDetail from './order/accessorialServiceDetail';
import LoungeFlightDetail1 from './order/written';
import LoungeFlightDetail2 from './order/Print';

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
            className:'blue-word',
            visible:false,
            visible1:false,
            visible2:false,
            type:null,
        }
    }

    componentWillMount() {
         if(User.isLogin()){
        } else{
            hashHistory.push('/login');
        }
        const _this = this
         $.ajax({
                type: "GET",
                 //url: 'http://192.168.1.136:8887/view?access_token='+User.appendAccessToken().access_token,
                url:serveUrl+'guest-order/view?access_token='+User.appendAccessToken().access_token,
                data:{orderId:_this.props.params.id},
                success: function(data) {
                    if (data.status == 200) {
                        _this.setState({
                            createUserName:data.data.createUserName,
                            orderNo:data.data.orderNo,
                            createTime:data.data.serverUpdateTime
                        })
                        if(data.data.consign == 0 && data.data.printCheck == 0 && data.data.securityCheck == 0){
                            _this.setState({
                                className:'blue-word isImportno'
                            })
                        }
                    }
                }
            });
            if(this.props.params.type == 2 || this.props.params.type == 3){
                this.setState({
                    text:'更新成功'
                })
            }
            if(this.props.params.type == 0){
                this.setState({
                    text:'添加成功'
                })
            }
            if(this.props.params.type == 2 || this.props.params.type == 0){
                this.setState({
                    type:0
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
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }
    handleCancel1 = () => {
        this.setState({
            visible1: false,
        });
      
    }
    handleCancel2 = () => {
        this.setState({
            visible2: false,
        });
      
    }

    showLoungeFlightDetail =(e)=>{
        this.setState({
            visible: true,
        });
    }
    showLoungeFlightDetail1 =(e)=>{
        this.setState({
            visible1: true,
        });
    }
    showLoungeFlightDetail2 =(e)=>{
        this.setState({
            visible2: true,
        });
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
                            <div style={{marginTop:70}}><img src={require('../assets/images/true.png')}/><span className='green-word'>{this.state.text}</span></div>
                            <div style={{marginTop:50}}>订单号:<span style={{marginLeft:30}}>{this.state.orderNo}</span></div>
                            <div style={{marginTop:20}}>操作人:<span style={{marginLeft:30}}>{getCookie('user')}</span></div>
                            <div style={{marginTop:20}}>操作时间:<span style={{marginLeft:30}}>{moment(this.state.createTime).format('YYYY-MM-DD HH:mm')}</span></div>
                            <button style={{marginTop:80}} className='btn' type="primary"  onClick={this.return}>返回列表</button>
                            <button style={{marginLeft:40}} className='btn' type="primary" onClick={this.handleReset}>继续添加</button>
                            <span className='blue-word' onClick={this.state.type == 0 ? this.showLoungeFlightDetail1:this.showLoungeFlightDetail2}>打印消费订单</span>
                            <span className={this.state.className} onClick={this.showLoungeFlightDetail}>代办服务</span>
                        </Form>
                    </div>
                </div>
                <div id="detail-msg">
                    <Modal title="详细信息"
                        key={Math.random() * Math.random()}
                        visible={this.state.visible}
                        onCancel={this.handleCancel}
                        >
                        <div>
                            <LoungeFlightDetail orderId={this.props.params.id} />
                        </div>
                    </Modal>
                </div>
                <div id="detail-msg">
                    <Modal title="丽江百事特服务消费单"
                        key={Math.random() * Math.random()}
                        visible={this.state.visible1}
                        onCancel={this.handleCancel1}
                        >
                        <div>
                            <LoungeFlightDetail1 orderId={this.props.params.id} />
                        </div>
                    </Modal>
                </div>
                <div id="detail-msg">
                    <Modal title="丽江百事特服务消费单"
                        key={Math.random() * Math.random()}
                        visible={this.state.visible2}
                        onCancel={this.handleCancel2}
                        >
                        <div>
                            <LoungeFlightDetail2 orderId={this.props.params.id} />
                        </div>
                    </Modal>
                </div>
            </div>
        )
    }
}

ServiceList = Form.create()(ServiceList);

export default ServiceList;