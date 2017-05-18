import React from 'react';
import { hashHistory } from 'react-router';
import { Form, Row, Col, Input, Button, Icon, Select, message, Radio, Breadcrumb, Table, Popconfirm, Modal, Checkbox, AutoComplete } from 'antd';
import { Link } from 'react-router';
import $ from 'jquery';
import moment from 'moment';
import { serveUrl, User, cacheData,getCookie } from '../../utils/config';
import DeleteDialog from '../DeleteDialog';//引入删除弹框

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const RadioGroup = Radio.Group;
const msg = '确认删除该产品吗?';
const RadioButton = Radio.Button;


class LoungeFlightDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            viewData:null,
            agentDynamics:[],
            AgentData:[],
            AgentId:null,
            orderData:[],
            consign:null,
            serverCardNoClick:false,
            vipCardClick:false,
            cashClick:false,
            agentPerson:null,
            agentPersonName:null,
            agentComplete:null,
            detailXiu:0,
            detailVIP:0,
            detailAn:0,
            detailPei:0,
            sitNo:[]
        }
    }
    componentWillMount() {
        if (User.isLogin()) {
        } else {
            hashHistory.push('/login');
        }
        const _this = this;
        $.ajax({
            type: "GET",
            url: serveUrl + 'guest-order/view?access_token=' + User.appendAccessToken().access_token,
            //url:"http://192.168.1.199:8887/view?access_token="+User.appendAccessToken().access_token,
            data: { orderId: _this.props.params.id },
            success: function (data) {
                _this.setState({
                    viewData: data.data
                })
                if(data.data.passengerList){
                    if(data.data.passengerList.length>0){
                        data.data.passengerList.map((v,index)=>{
                            if(v.sitNo){
                                _this.state.sitNo.push(v.sitNo);
                            }
                        });
                    }
                }
                _this.setState({
                    sitNo:_this.state.sitNo
                });
                data.data.serviceList.map((v, index) => {
                    if (JSON.parse(v.serviceDetail).serviceName == '休息室') {
                        _this.setState({
                            detailXiu: JSON.parse(v.serviceDetail).serverNum
                        })
                    } else if (JSON.parse(v.serviceDetail).serviceName == '贵宾厅') {
                        _this.setState({
                            detailVIP: JSON.parse(v.serviceDetail).serverNum
                        })
                    } else if (JSON.parse(v.serviceDetail).serviceName == '安检通道') {
                        _this.setState({
                            detailAn: JSON.parse(v.serviceDetail).serverNum
                        })
                    } else if (JSON.parse(v.serviceDetail).serviceName == '迎送机陪同') {
                        _this.setState({
                            detailPei: JSON.parse(v.serviceDetail).serverNum
                        })
                    }
                })
            }
        });
    }

    componentDidMount = () => {
        $(".ant-modal-footer").hide();
        $('#leftMenu').hide();
        $('#rightTop').hide();
         $(".right-box").css({position:'absolute',top:0,left:0,right:0,bottom:0,paddingLeft:0});
         $('#rightWrap').css({position:'absolute',top:0,left:0,right:0,bottom:0,paddingLeft:0});
        

    }
    printme = (e) => {
        document.body.innerHTML = document.getElementById('print').innerHTML;
        window.print();
    }
   
    render() {
        let serviceList = null
        if(this.state.orderData.serviceList != undefined){
            serviceList = this.state.orderData.serviceList[0].serviceDetail
        }
        
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };
        let passengerName = null
        if(this.state.viewData != null){
            if(this.state.viewData.passengerList != null)
             this.state.viewData.passengerList.map((v,index)=>{
            if(index == 0){
                passengerName = v.name
            }else{
                passengerName = passengerName + ',' + v.name
            }
        })  
        }
         let detailVIP = ''
        if(this.state.detailVIP == 0){
            detailVIP = 'isImportno'
        }
        let detailXiu = ''
        if(this.state.detailXiu == 0){
            detailXiu = 'isImportno'
        }
        let detailAn = ''
        if(this.state.detailAn == 0){
            detailAn = 'isImportno'
        }
        let detailPei = ''
        if(this.state.detailPei == 0){
            detailPei = 'isImportno'
        }

        const print = this.state.viewData== null ? '' : this.state.viewData.printCheckRemark=="" ? this.state.viewData.printCheck == 0 ? "":'√' : this.state.viewData.printCheckRemark;

        const consign = this.state.viewData== null ? '':this.state.viewData.consignRemark==null?this.state.viewData.consign == 0 ? "":'√' :this.state.viewData.consignRemark;

        const  security=this.state.viewData== null ? '':this.state.viewData.securityCheckRemark==null?this.state.viewData.securityCheck == 0 ? "":'√':this.state.viewData.securityCheckRemark;

        const other = this.state.viewData== null ? '√':this.state.viewData.otherRemark==null? "" :this.state.viewData.otherRemark;
        console.log(print)
        console.log(consign)
          console.log(security)
            console.log(other)
        return (
            <div id='print' className='print'>
                <h2 className='h-word'>丽江百事特服务签单</h2>
                <span className='s-word'>********************************</span>
                <ul className='ul-mid'>
                    <h2 className='view-span' style={{marginTop:20}}>订单信息</h2>    
                    <li><span >订单号:</span><span className='view-word'>{this.state.viewData== null ? '': this.state.viewData.orderNo}</span></li>
                    <li><span >客户名称:</span><span className='view-word'>{this.state.viewData== null ? '':this.state.viewData.customerName}</span></li>
                    <li><span >航班日期:</span><span className='view-word'>{this.state.viewData== null ? '':moment(this.state.viewData.flight.flightDate).format('YYYY-MM-DD')}</span></li>
                    <li><span >航班号:</span><span className='view-word'>{this.state.viewData== null ? '':this.state.viewData.flight.flightNo}</span></li>
                    <li><span >进出港:</span><span className='view-word'>{this.state.viewData== null ? '':this.state.viewData.flight.isInOrOut ==0?'出港':'进港'}</span></li>
                    <li><span >旅客信息:</span><span className='view-word'>{passengerName}</span></li>
                    <li className={detailVIP}><span >贵宾厅服务人次:</span><span className='view-word'>{this.state.detailVIP}</span></li>
                    <li className={detailXiu}><span >休息室服务人次:</span><span className='view-word'>{this.state.detailXiu}</span></li>
                    <li className={detailAn}><span >安检通道服务人次:</span><span className='view-word'>{this.state.detailAn}</span></li>
                    <li><span >休息区域:</span><span className='view-word'>{this.state.viewData== null ? '':this.state.viewData.serviceList[0].serviceDetail == null ? '':JSON.parse(this.state.viewData.serviceList[0].serviceDetail).serviceDetailName}</span></li>
                    <li className='view-span' style={{marginTop:20}}>------------------------------</li>
                    <h2 className='view-span' style={{marginTop:20}}>服务信息</h2>
                    <li><span >代办登机牌:</span><span className='view-word'>{print}</span></li>
                    <li><span >代办行李:</span><span className='view-word'>{consign}</span></li>
                    <li><span >安检礼遇:</span><span className='view-word'>{security}</span></li>
                    <li><span >其他服务:</span><span className='view-word'>{other}</span></li>
                    <li><span >证件:</span><span className='view-word'>{this.state.viewData== null ? '':this.state.viewData.serverCardNo}</span></li>
                    <li><span >贵宾卡:</span><span className='view-word'>{this.state.viewData== null ? '':this.state.viewData.vipCard}</span></li>
                    <li><span >现金:</span><span className='view-word'>{this.state.viewData== null ? '':this.state.viewData.cash}</span></li>
                    <li className='view-span' style={{marginTop:20}}>------------------------------</li>
                    <h2 className='view-span' style={{marginTop:20}}>代办信息</h2>
                    <li style={{marginTop:10}}><span >代办人:</span><span className='view-word'>{this.state.viewData== null ? '':this.state.viewData.agentPersonName}</span></li>
                    <li style={{marginTop:10}}><span >座位号:</span><span className='view-word'>{this.state.sitNo.toString()}</span></li>
                    <li style={{marginTop:20}}><span >打印人:</span><span className='view-word'>{getCookie('user')}</span></li>
                    <li><span >打印时间:</span><span className='view-word'>{moment().format('YYYY-MM-DD HH:mm:ss')}</span></li>
                </ul>
                 <button className='btn' onClick={this.printme} style={{marginLeft:75,marginTop:20}}>打印</button>
            </div>
        )
    }
}

LoungeFlightDetail = Form.create()(LoungeFlightDetail);
export default LoungeFlightDetail;