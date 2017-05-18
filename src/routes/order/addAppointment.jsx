import './appointment.less';
import React from 'react';
import { hashHistory } from 'react-router';
import {Breadcrumb,Form, Row, Col, Input, Button, Icon,Select,Popconfirm,message,Table,Checkbox,Radio,DatePicker,Modal,Collapse,AutoComplete} from 'antd';
import { Link} from 'react-router';
import moment from 'moment';
import $ from 'jquery';
import { serveUrl, User, cacheData,defaultEvent} from '../../utils/config';
import EditableTable from './EditableTable'
import DeleteDialog from '../DeleteDialog';//引入删除弹框
import { amendTime} from '../../utils/base';
import Passenger from './Passenger';//引入旅客
import UpdataPassenger from './UpdataPassenger';//引入旅客



const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const CheckboxGroup = Checkbox.Group;
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

class AddProtocol  extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            protocolType: null,
            RemoteClass:'btn-no',
            IndependentClass:'btn-no',
            VIPClass:'btn-no',
            ClassTwoClass:'btn-no',
            baseClass:null,
            serviceClass:null,
            flightClass:null,
            flightDepData:[],
            productId:null,
            flightArrData:[],
            productData:[],
            flightBlurData:[],
            flightBlur:[],
            bookingPersonData:[],
            serviceAdd:'',
            bookingStatus: false,
            flightDep:'',
            flightArr:'',
            flightVisible:false,
            protocolId:null,
            scrollTop:null,
            productsData:[],
            detailedData:[],
            protocolProductId:null,
            AutoClientList:[],
            customerId:null,
            bookingPersonId:null,
            otherRemark:null,
            securityCheckRemark:null,
            securityCheck:false,
            printCheckRemark:null,
            printCheck:false,
            consignRemark:null,
            consign:false,
            serverNum1:null,
            serverNum2:null,
            serverNum3:null,
            serverNum4:null,
            serverNum5:null,
            serverNum6:null,
            serverNum7:null,
            serviceId1:1,
            serviceId2:null,
            serviceId3:null,
            serviceId4:null,
            serviceId5:5,
            serviceId6:null,
            serviceId7:null,
            serviceName1:'贵宾厅',
            serviceName2:null,
            serviceName3:null,
            serviceName4:null,
            serviceName5:'休息室',
            serviceName6:null,
            serviceName7:null,
            serviceId1C:false,
            serviceId2C:false,
            serviceId3C:false,
            serviceId4C:false,
            serviceId5C:false,
            serviceId6C:false,
            serviceId7C:false,
            serviceDetailId1:null,
            serviceDetailId2:null,
            serviceDetailId3:null,
            serviceDetailId4:null,
            serviceDetailId5:null,
            serviceDetailId6:null,
            serviceDetailId7:null,
            serviceDetailName1:'',
            serviceDetailName2:'',
            serviceDetailName3:'',
            serviceDetailName4:'',
            serviceDetailName5:'',
            serviceDetailName6:'',
            serviceDetailName7:'',
            servId1:null,
            servId2:null,
            servId3:null,
            servId4:null,
            servId5:null,
            servId6:null,
            servId7:null,
            carNum1:null,
            carNum2:null,
            carNum3:null,
            carNum4:null,
            carNum5:null,
            carNum6:null,
            carNum7:null,
            car1:null,
            car2:null,
            car3:null,
            car4:null,
            car5:null,
            car6:null,
            car7:null,
            chird1:[],
            chird2:[],
            chird3:[],
            chird4:[],
            chird5:[],
            chird6:[],
            chird7:[],
            customerName:null,
            protocolName:null,
            bookingPersonName:null,
            productName:null,
            data: [{
            key: '0',
            name: {
            editable: true,
            value: '',
            },
            planLandingTime: {
            editable: true,
            value: '',
            },
             isInOrOut: {
                editable: true,
            value: '',
            },
            boardInOut: {
                editable: true,
                value: '',
            },
            flightPosition: {
                editable: true,
                value: '',
            },
            planNo:{
                editable: true,
                value: '',
            },}],
            passengerVisible:false,
            UpdataPassengerVisible:false,
            UpdataPassengerIndex:null,
            passengerList:[],
            airportCode:null,
            isImportant:false,
            // submitStatus:false,// 保存状态
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
             url: serveUrl+'flight-info/flightInfoDropdownList?access_token='+ User.appendAccessToken().access_token,
             success: function(data){
                 const Adata = [];
                 data.data.map((v,index)=>{
                     Adata.push(data.data[index].value)
                 })
                 _this.setState({
                     flightDepData:Adata,
                     flightArrData:Adata,
                 })
            }
         });
        
         $.ajax({
             type: "GET",
             url: serveUrl+'guest-protocol/getProtocolNameDropdownList?access_token='+ User.appendAccessToken().access_token,
             success: function(data){
                 const Adata = [];
                 data.data.map((v,index)=>{
                     Adata.push(data.data[index].value)
                 })
                 _this.setState({
                     productData:Adata,
                 })
            }
         });
   


          $.ajax({
            type: "GET",
            url: serveUrl+'guest-protocol/getAuthorizerDropdownList?access_token='+ User.appendAccessToken().access_token,
            data:{protocolId:_this.state.protocolId},
            success: function(data){
                 const Adata = [];
                 data.data.map((v,index)=>{
                     Adata.push(data.data[index].value)
                 })
                 _this.setState({
                     bookingPersonData:Adata,
                 })
            }
            })

            $.ajax({
                type: "GET",
                url: serveUrl+'guest-order/getAirportCode?access_token='+ User.appendAccessToken().access_token,
                //url:"http://192.168.1.199:8887/getAirportCode?access_token="+User.appendAccessToken().access_token,
                success: function(data){
                    _this.setState({
                        airportCode:data.data.airportCode
                    })
                }
            })

            //机构客户名称的列表（模糊匹配）
            $.ajax({
                type: "GET",
                url: serveUrl + "institution-client/queryInstitutionClientDropdownList?access_token="+ User.appendAccessToken().access_token,
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
         
         
    }

    componentDidMount=()=>{
        $(".ant-breadcrumb-separator").html(">");
        $(".ant-breadcrumb-separator").css({color:'#333'});
        $(".ant-col-3").removeClass('ant-col-3').addClass("ant-col-5");
        $(".ant-col-21").removeClass('ant-col-21').addClass("ant-col-19");
         $(".isImportant .ant-col-5").removeClass('ant-col-5').addClass("ant-col-10");
        $(".appointmentType .ant-col-10").removeClass('ant-col-10').addClass("ant-col-19");
        $(".isImportant .ant-col-5").removeClass('ant-col-5').addClass("ant-col-10");
        $(".modalp .ant-modal-footer").hide();
        defaultEvent();
    }

     //表单提交
    handleSubmit = (e)=>{
        const _this = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err && _this.state.passengerList.length>0) {
                $(".save-btn").attr("disabled", true);
                $(".save-btn").css({
                    background: '#ccc',
                    color: '#000'
                });
                if (values.bookingWay == '电话') {
                    values.bookingWay = 0
                } else if (values.bookingWay == '邮件') {
                    values.bookingWay = 1
                } else if (values.bookingWay == '传真') {
                    values.bookingWay = 2
                } else if (values.bookingWay == '短信') {
                    values.bookingWay = 3
                } else if (values.bookingWay == '其他') {
                    values.bookingWay = 4
                }
                if(_this.state.data[0].isInOrOut.value == ''){
                    message.error('请选择进出港！')
                    return
                }
                const flightArr = values.flightArr == undefined ? '' : values.flightArr.split('-')
                const flightDep = values.flightDep == undefined ? '' : values.flightDep.split('-')
                let flight = [{
                    flightNo: values.flightNo,
                    flightArrAirport: flightArr[0],
                    flightDepAirport: flightDep[0],
                    flightDepcode: flightDep[1],
                    flightArrcode: flightArr[1],
                    flightDate: moment(values.flightDate).format('YYYY-MM-DD'),
                    planNo: _this.state.data[0].planNo.value,
                    isInOrOut:_this.state.data[0].isInOrOut.value == '出港' ? 0:1,
                    boardInOut: _this.state.data[0].boardInOut.value == '国内' ? 1:0,
                    flightPosition: _this.state.data[0].flightPosition.value,
                    flightDeptimePlanDate: amendTime(moment(values.flightDate).format('YYYY-MM-DD'), _this.state.data[0].name.value).format('YYYY-MM-DD HH:mm:ss'),
                    flightArrtimePlanDate: amendTime(moment(values.flightDate).format('YYYY-MM-DD'), _this.state.data[0].planLandingTime.value).format('YYYY-MM-DD HH:mm:ss'),
                }, {
                    boardGate: this.state.flightBlurData.BoardGate,
                    boardGateTime: this.state.flightBlurData.BoardGateTime,
                    boardState: this.state.flightBlurData.BoardState,
                    fdId: this.state.flightBlurData.FD_ID,
                    fcategory: this.state.flightBlurData.Fcategory,
                    fillFlightNo: this.state.flightBlurData.FillFlightNo,
                    flightArr: this.state.flightBlurData.FlightArr,
                    flightArrAirport: this.state.flightBlurData.FlightArrAirport,
                    flightArrcode: this.state.flightBlurData.FlightArrcode,
                    flightArrtimeDate: this.state.flightBlurData.FlightArrtimeDate,
                    flightArrtimePlanDate: this.state.flightBlurData.FlightArrtimePlanDate,
                    flightArrtimeReadyDate: this.state.flightBlurData.FlightArrtimeReadyDate,
                    flightCompany: this.state.flightBlurData.FlightCompany,
                    flightDate: this.state.flightBlurData.FlightDate,
                    flightDep: this.state.flightBlurData.FlightDep,
                    flightDepAirport: this.state.flightBlurData.FlightDepAirport,
                    flightDepcode: this.state.flightBlurData.FlightDepcode,
                    flightDeptimeDate: this.state.flightBlurData.FlightDeptimeDate,
                    flightDeptimePlanDate: this.state.flightBlurData.FlightDeptimePlanDate,
                    flightDeptimeReadyDate: this.state.flightBlurData.FlightDeptimeReadyDate,
                    flightHTerminal: this.state.flightBlurData.FlightHTerminal,
                    flightNo: this.state.flightBlurData.FlightNo,
                    flightState: this.state.flightBlurData.FlightState,
                    flightTerminal: this.state.flightBlurData.FlightTerminal,
                    shareFlag: this.state.flightBlurData.ShareFlag,
                    shareFlightNo: this.state.flightBlurData.ShareFlightNo,
                    stopFlag: this.state.flightBlurData.StopFlag,
                }]

                
                let serviceDetail = []
                for (let i = 1; i <= 7; i++) {
                    const server = 'serviceDetailId' + i
                    if (this.state[`serviceId${i}C`] == false ) {

                    } else {
                             serviceDetail.push({
                                serviceId: this.state[`serviceId${i}`],
                                serviceDetailId: this.state[`serviceDetailId${i}`],
                                serverNum: this.state[`serverNum${i}`],
                                serviceName: this.state[`serviceName${i}`],
                                serviceDetailName: this.state[`serviceDetailName${i}`],
                                servId: this.state[`servId${i}`],
                                carNum:this.state[`carNum${i}`],
                                car:this.state[`car${i}`],
                            })
                    }
                }
                let serviceList = []
                serviceDetail.map((v, index) => {
                     const forDate = '{"carNum":' + v.carNum + ',"car":' + v.car + ',"servId":' + v.servId + ',"serviceDetailName":"' + v.serviceDetailName + '","serviceName":"' + v.serviceName + '","serviceId":' + v.serviceId + ',"serviceDetailId":' + v.serviceDetailId + ',"serverNum":' + v.serverNum + '}'
                    serviceList.push({
                        serviceDetail: forDate
                    })
                })
                if(_this.state.passengerList.length == 0){
                    message.error('旅客不可为空！');
                    return
                }
                _this.state.passengerList.map((v,index)=>{
                    v.passengerType = v.passengerType == '主宾' ? 0 : 1;
                })

                let formData = {
                    data: [{
                        serverLocation:_this.state.data[0].isInOrOut.value == '出港' ? _this.state.flightBlurData.FlightArr:_this.state.flightBlurData.FlightDep,
                        "customerId": _this.state.customerId,//机构名称id
                        "protocolId": _this.state.protocolId,//协议id
                        "bookingPerson": _this.state.bookingPersonId,//菜单url 
                        "customerName": _this.state.customerName,//机构名称名称
                        "protocolName": _this.state.protocolName,//协议名称
                        "bookingPersonName": _this.state.bookingPersonName,//预约人名 
                        "productName": _this.state.productName,
                        productId: _this.state.productId,
                        "bookingWay": values.bookingWay == undefined ? null : values.bookingWay, //菜单排序
                        isImportant: values.isImportant == true ? 0 : 1,
                        noticePerson: values.noticePerson,//通知人姓名
                        orderType: 0,
                        flightList: flight,
                        passengerList: _this.state.passengerList,
                        serviceList: serviceList,
                        orderStatus: '已预约',
                        printCheck: _this.state.printCheck == true ? 1 : 0,
                        consignRemark: _this.state.consignRemark,
                        otherRemark: _this.state.otherRemark,
                        consign: _this.state.consign == true ? 1 : 0,
                        printCheckRemark: _this.state.serviceAdd,
                        protocolType: _this.state.protocolType,
                        alongTotal: _this.state.alongTotal,
                        securityCheckRemark: _this.state.securityCheckRemark,
                        securityCheck: _this.state.securityCheck == true ? 1 : 0,
                    }]
                }
                 let index = null;
                if(_this.state.productId != null){
                    $.ajax({
                        type: "POST",
                        contentType: 'application/json;charset=utf-8',
                         url: serveUrl + 'guest-order/saveOrUpdate?access_token=' + User.appendAccessToken().access_token,
                        // url:"http://192.168.0.107:8887/saveOrUpdate?access_token="+User.appendAccessToken().access_token,
                        data: JSON.stringify(formData),
                        success: function (data) {
                          const type = 0;
                            if(data.status == 200){
                                $(".save-btn").attr("disabled",false);
                                $(".save-btn").css({
                                    background: '#4778c7',
                                    color: '#fff'
                                });
                                message.success(data.msg);
                                hashHistory.push(`/Status/${data.data}/${type}`);
                            }
                            else if(data.status == 500){
                                message.error('后台错误');
                                hashHistory.push(`/StatusFail/${type}`);
                                $(".save-btn").attr("disabled",false);
                                $(".save-btn").css({
                                    background: '#4778c7',
                                    color: '#fff'
                                });
                            }else{
                                message.error(data.msg);
                                $(".save-btn").attr("disabled",false);
                                $(".save-btn").css({
                                    background: '#4778c7',
                                    color: '#fff'
                                });
                            }
                            
                        }
                    });
                }else{
                    message.error('请选择产品！')
                }  
            }
            else{
                message.error('请填写必填信息！');
            }
        });
    }

    handleSubmit2 = (e)=>{
        const _this = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err && _this.state.passengerList.length>0) {
                $(".save-btn-draft").attr("disabled", true);
                $(".save-btn-draft").css({
                    background: '#ccc',
                    color: '#000'
                });
                if (values.bookingWay == '电话') {
                    values.bookingWay = 0
                } else if (values.bookingWay == '邮件') {
                    values.bookingWay = 1
                } else if (values.bookingWay == '传真') {
                    values.bookingWay = 2
                } else if (values.bookingWay == '短信') {
                    values.bookingWay = 3
                } else if (values.bookingWay == '其他') {
                    values.bookingWay = 4
                }
                 if(_this.state.data[0].isInOrOut.value == ''){
                    message.error('请选择进出港！')
                    return
                }
                const flightArr = values.flightArr == undefined ? '' : values.flightArr.split('-')
                const flightDep = values.flightDep == undefined ? '' : values.flightDep.split('-')
                let flight = [{
                    flightNo: values.flightNo,
                    flightArrAirport: flightArr[0],
                    flightDepAirport: flightDep[0],
                    flightDepcode: flightDep[1],
                    flightArrcode: flightArr[1],
                    flightDate: moment(values.flightDate).format('YYYY-MM-DD'),
                    planNo: _this.state.data[0].planNo.value,
                    isInOrOut:_this.state.data[0].isInOrOut.value == '出港' ? 0:1,
                    boardInOut: _this.state.data[0].boardInOut.value == '国内' ? 1:0,
                    flightPosition: _this.state.data[0].flightPosition.value,
                    flightDeptimePlanDate: amendTime(moment(values.flightDate).format('YYYY-MM-DD'), _this.state.data[0].name.value).format('YYYY-MM-DD HH:mm:ss'),
                    flightArrtimePlanDate: amendTime(moment(values.flightDate).format('YYYY-MM-DD'), _this.state.data[0].planLandingTime.value).format('YYYY-MM-DD HH:mm:ss'),
                }, {
                    boardGate: this.state.flightBlurData.BoardGate,
                    boardGateTime: this.state.flightBlurData.BoardGateTime,
                    boardState: this.state.flightBlurData.BoardState,
                    fdId: this.state.flightBlurData.FD_ID,
                    fcategory: this.state.flightBlurData.Fcategory,
                    fillFlightNo: this.state.flightBlurData.FillFlightNo,
                    flightArr: this.state.flightBlurData.FlightArr,
                    flightArrAirport: this.state.flightBlurData.FlightArrAirport,
                    flightArrcode: this.state.flightBlurData.FlightArrcode,
                    flightArrtimeDate: this.state.flightBlurData.FlightArrtimeDate,
                    flightArrtimePlanDate: this.state.flightBlurData.FlightArrtimePlanDate,
                    flightArrtimeReadyDate: this.state.flightBlurData.FlightArrtimeReadyDate,
                    flightCompany: this.state.flightBlurData.FlightCompany,
                    flightDate: this.state.flightBlurData.FlightDate,
                    flightDep: this.state.flightBlurData.FlightDep,
                    flightDepAirport: this.state.flightBlurData.FlightDepAirport,
                    flightDepcode: this.state.flightBlurData.FlightDepcode,
                    flightDeptimeDate: this.state.flightBlurData.FlightDeptimeDate,
                    flightDeptimePlanDate: this.state.flightBlurData.FlightDeptimePlanDate,
                    flightDeptimeReadyDate: this.state.flightBlurData.FlightDeptimeReadyDate,
                    flightHTerminal: this.state.flightBlurData.FlightHTerminal,
                    flightNo: this.state.flightBlurData.FlightNo,
                    flightState: this.state.flightBlurData.FlightState,
                    flightTerminal: this.state.flightBlurData.FlightTerminal,
                    shareFlag: this.state.flightBlurData.ShareFlag,
                    shareFlightNo: this.state.flightBlurData.ShareFlightNo,
                    stopFlag: this.state.flightBlurData.StopFlag,
                }]

                
                 let serviceDetail = []
                for (let i = 1; i <= 7; i++) {
                    const server = 'serviceDetailId' + i
                    if (this.state[`serviceId${i}C`] == false ) {

                    } else {
                             serviceDetail.push({
                                serviceId: this.state[`serviceId${i}`],
                                serviceDetailId: this.state[`serviceDetailId${i}`],
                                serverNum: this.state[`serverNum${i}`],
                                serviceName: this.state[`serviceName${i}`],
                                serviceDetailName: this.state[`serviceDetailName${i}`],
                                servId: this.state[`servId${i}`],
                                carNum:this.state[`carNum${i}`],
                                car:this.state[`car${i}`],
                            })
                    }
                }
                let serviceList = []
                serviceDetail.map((v, index) => {
                    const forDate = '{"carNum":' + v.carNum + ',"car":' + v.car + ',"servId":' + v.servId + ',"serviceDetailName":"' + v.serviceDetailName + '","serviceName":"' + v.serviceName + '","serviceId":' + v.serviceId + ',"serviceDetailId":' + v.serviceDetailId + ',"serverNum":' + v.serverNum + '}'
                    serviceList.push({
                        serviceDetail: forDate
                    })
                })
                if(_this.state.passengerList.length == 0){
                    message.error('旅客不可为空！');
                    return
                }
                _this.state.passengerList.map((v,index)=>{
                    v.passengerType = v.passengerType == '主宾' ? 0 : 1;
                })
                let formData = {
                    data: [{
                        serverLocation:_this.state.data[0].isInOrOut.value == '出港' ? _this.state.flightBlurData.FlightArr:_this.state.flightBlurData.FlightDep,
                        "customerId": _this.state.customerId,//机构名称id
                        "protocolId": _this.state.protocolId,//协议id
                        "bookingPerson": _this.state.bookingPersonId,//菜单url 
                        "customerName": _this.state.customerName,//机构名称名称
                        "protocolName": _this.state.protocolName,//协议名称
                        "bookingPersonName": _this.state.bookingPersonName,//预约人名 
                        "productName": _this.state.productName,
                        productId: _this.state.productId,
                        "bookingWay": values.bookingWay == undefined ? null : values.bookingWay, //菜单排序
                        isImportant: values.isImportant == true ? 0 : 1,
                        noticePerson: values.noticePerson,//通知人姓名
                        orderType: 0,
                        flightList: flight,
                        passengerList: _this.state.passengerList,
                        serviceList: serviceList,
                        orderStatus: '预约草稿',
                        printCheck: _this.state.printCheck == true ? 1 : 0,
                        consignRemark: _this.state.consignRemark,
                        otherRemark: _this.state.otherRemark,
                        consign: _this.state.consign == true ? 1 : 0,
                        printCheckRemark: _this.state.serviceAdd,
                        protocolType: _this.state.protocolType,
                        alongTotal: _this.state.alongTotal,
                        securityCheckRemark: _this.state.securityCheckRemark,
                        securityCheck: _this.state.securityCheck == true ? 1 : 0,
                    }]
                }
                 let index = null 
             
                   if(_this.state.productId != null){
                    $.ajax({
                        type: "POST",
                        contentType: 'application/json;charset=utf-8',
                       url: serveUrl + 'guest-order/saveOrUpdate?access_token=' + User.appendAccessToken().access_token,
                    //    url:"http://192.168.0.107:8887/saveOrUpdate?access_token="+User.appendAccessToken().access_token,
                        data: JSON.stringify(formData),
                        success: function (data) {
                          const type = 0
                            if(data.status == 200){
                                $(".save-btn-draft").attr("disabled",false);
                                $(".save-btn-draft").css({
                                    background: '#4778c7',
                                    color: '#fff'
                                });
                                message.success(data.msg);
                                hashHistory.push(`/Status/${data.data}/${type}`);
                            }
                            else if(data.status == 500){
                                message.error('后台错误');
                                hashHistory.push(`/StatusFail/${type}`);
                                $(".save-btn-draft").attr("disabled",false);
                                $(".save-btn-draft").css({
                                    background: '#4778c7',
                                    color: '#fff'
                                });
                            }else{
                                message.error(data.msg);
                                $(".save-btn-draft").attr("disabled",false);
                                $(".save-btn-draft").css({
                                    background: '#4778c7',
                                    color: '#fff'
                                });
                            }
                        }
                    });
                }else{
                    message.error('请选择产品！')
                }  
            }
            else{
                message.error('请填写必填信息！');
            }
        });
    }

    otherRemark = (e) =>{
        this.setState({
            otherRemark:e.target.value
        })
    }
    securityCheckRemark = (e) =>{
        this.setState({
            securityCheckRemark:e.target.value
        })
    }
    
    securityCheck = (e) =>{
        const _this = this
        this.setState({
            securityCheck:!_this.state.securityCheck
        })
    }

    printCheck = (e) =>{
        const _this = this
        this.setState({
            printCheck:!_this.state.printCheck
        })
    }

    consignRemark =(e) =>{
        this.setState({
            consignRemark:e.target.value
        })
    }

    consign = (e) =>{
        const _this = this
        this.setState({
            consign:!_this.state.consign
        })
    }

    printCheckRemark =(e) =>{
        
        this.setState({
            printCheckRemark:e.target.value,
            serviceAdd:e.target.value
        })
    }

    addHtml = (text,e) =>{
        let _text = ""
        if(this.state.serviceAdd.indexOf(text) == -1){
            
            if(this.state.serviceAdd==""){
                _text = this.state.serviceAdd + text
            }else{
                _text = this.state.serviceAdd +','+ text
            }
        }else{
            _text = this.state.serviceAdd
        }
        this.setState({
            serviceAdd:_text
        })

    }

    addCheck = (e) =>{
        this.setState({
            bookingStatus:e
        })
        const _this = this
        if(e == true){
            this.props.form.setFieldsValue({
                noticePerson:this.props.form.getFieldValue('bookingPerson')
            })
        }else{
            this.props.form.setFieldsValue({
                noticePerson:''
            })
        }
    }

    changeDate =(e,text) =>{
        let date = new Date()
        const day = parseInt(e * (24*60*60)*1000)
        this.flightBlur()
        this.props.form.setFieldsValue({
            flightDate:moment(date.getTime()+day)
        })
    }

    flightBlur = () =>{
        const _this = this
        if(this.props.form.getFieldValue('flightNo') !=undefined && this.props.form.getFieldValue('flightDate') != undefined){
              $.ajax({
             type: "GET",
             url: serveUrl+'flight-info/flightInfo?access_token='+ User.appendAccessToken().access_token,
             data:{fnum:this.props.form.getFieldValue('flightNo'),date:moment(this.props.form.getFieldValue('flightDate')).format('YYYY-MM-DD')},
             success: function(msg){
                 if(msg.State==1){
                 if(msg.Data.length > 1){                     
                     _this.setState({
                         flightBlur:msg.Data,
                         flightVisible:true
                     })
                 }else{
                     _this.setState({
                         flightBlurData:msg.Data[0]
                     })
                    const flightDep = msg.Data[0].FlightDepAirport +"-"+ msg.Data[0].FlightDepcode 
                    const flightArr = msg.Data[0].FlightArrAirport + "-" + msg.Data[0].FlightArrcode
                    _this.props.form.setFieldsValue({
                        flightDep: flightDep,
                        flightArr: flightArr,
                    })
                    let isInOrOut = ''
                    if(msg.Data[0].FlightArrcode == _this.state.airportCode || msg.Data[0].FlightDepcode == _this.state.airportCode){
                        isInOrOut = '出港'
                    }
                    $.ajax({
                            type: "GET",
                            url: serveUrl + 'flight-info/getFlightForOrderDetail?access_token=' + User.appendAccessToken().access_token,
                            //url:'http://192.168.0.124:8989/getFlightForOrderDetail',
                            data: { fnum:_this.props.form.getFieldValue('flightNo'),
                                    date:moment(_this.props.form.getFieldValue('flightDate')).format('YYYY-MM-DD'),
                                    flightDepcode:msg.Data[0].FlightDepcode,
                                    flightArrcode:msg.Data[0].FlightArrcode,
                                    flightDeptimePlanDate:moment(msg.Data[0].FlightDeptimePlanDate).format('YYYY-MM-DD hh:mm:ss'),
                                    flightArrtimePlanDate:moment(msg.Data[0].FlightArrtimePlanDate).format('YYYY-MM-DD hh:mm:ss'),
                                    isInOrOut:isInOrOut == '出港' ? 0:1,
                                },
                            success: function (data) {
                               _this.setState({
                                    data:[{
                                        key: '0',
                                        name: {
                                            editable: true,
                                            value: moment(data.flightDeptimePlanDate).format('HH:mm'),
                                        },
                                        planLandingTime: {
                                            editable: true,
                                            value: moment(data.flightArrtimePlanDate).format('HH:mm'),
                                        },
                                        isInOrOut: {
                                            editable: true,
                                            value: data.isInOrOut == null ? '': data.isInOrOut == 0 ? '出港':'进港',
                                        },
                                        boardInOut: {
                                            editable: true,
                                            value: data.boardInOut == null ? '':data.boardInOut == 0 ?'国内':'国际',
                                        },
                                        flightPosition: {
                                            editable: true,
                                            value: data.flightPosition == null ? '':data.flightPosition,
                                        },
                                        planNo:{
                                            editable: true,
                                            value: data.planNo == null ? '':data.planNo,
                                        },
                                    }]
                                })
                            }
                        });
                     
                 }
                 }else{
                     message.error('该航班无航班数据，请检查航班号或者手动输入航班信息')
                 }
            }
         });
        }
      
    }

    changeValue = (values) => {
        this.setState({
            OneValue: values
        }, this.showChange);
        // this.inteval = setTimeout(() => this.showChange(), 300);
    }
    showChange = () => {
    }

    flightDepChange = (value) =>{
        const _this = this
        const arrValue = value.split("-")
        $.ajax({
             type: "GET",
             url: serveUrl+'flight-info/flightInfoDropdownList?access_token='+ User.appendAccessToken().access_token,
             data:{airportNameOrCode:arrValue[0]},
             success: function(data){
                 const Adata = [];
                 data.data.map((v,index)=>{
                     Adata.push(data.data[index].value)
                 })
                 _this.setState({
                     flightDep:data.data.id,
                     flightDepData:Adata,
                 })
            }
         });
    }
    flightArrChange = (value) =>{
        const _this = this
        const arrValue = value.split("-")
        $.ajax({
             type: "GET",
             url: serveUrl+'flight-info/flightInfoDropdownList?access_token='+ User.appendAccessToken().access_token,
             data:{airportNameOrCode:arrValue[0]},
             success: function(data){
                 _this.setState({
                     flightArr:data.data.id
                 })
            }
         });
    }
    //协议更改
    productChange = (value) =>{
        const _this = this
        if(value !== ''){
            $.ajax({
             type: "GET",
             url: serveUrl+'guest-protocol/getProtocolNameDropdownList?access_token='+ User.appendAccessToken().access_token,
             data:{protocolName:value,customerId:_this.state.customerId},
             success: function(data){
                 const Adata = []
                 data.data.map((v,index)=>{
                     Adata.push(data.data[index].value)
                 })
                 if(data.data.length == 1){
                    _this.setState({
                        productData:Adata,
                        protocolId:data.data[0].id,
                        protocolName:data.data[0].value,
                        customerId:data.data[0].clientId,
                        customerName:data.data[0].clientValue,
                        securityCheck:data.data[0].type == 6 ? true:false,
                    })
                    _this.props.form.setFieldsValue({
                        customerId: data.data[0].clientValue,
                    })
                 }
                
                 $.ajax({
                     type: "GET",
                     url: serveUrl + 'guest-protocol/view?access_token=' + User.appendAccessToken().access_token,
                     data: { protocolId: data.data[0].id },
                     success: function (data) {
                         _this.setState({
                             productsData: data.data.protocolProductList,
                             protocolType:data.data.type,
                         })
                        // console.log(data.data.protocolProductList)
                         if(data.data.protocolProductList.length == 1){
                             _this.productsClick.bind(data.data.protocolProductList[0],data.data.protocolProductList[0])()
                         }
                         if(data.data.type == 12 || data.data.type == 4 || data.data.type == 6 || data.data.type == 5){
                             
                            _this.setState({
                                isImportant: true,
                            })
                         }
                     }
                 });
                  $.ajax({
                    type: "GET",
                    url: serveUrl+'guest-protocol/getAuthorizerDropdownList?access_token='+ User.appendAccessToken().access_token,
                    data:{protocolId:data.data[0].id},
                    success: function(data){
                        const Adata = [];
                        data.data.map((v,index)=>{
                            Adata.push(data.data[index].value)
                        })
                        _this.setState({
                            bookingPersonData:Adata,
                            
                        })
                        _this.setState({
                            bookingPersonData:Adata,
                            bookingPersonId:data.data.id
                        })
                        
                    }
                });
            }
         });
        }
        
         
          
    }

    bookingPersonChange = (value) =>{
         this.setState({
                bookingPersonName:value
            })
        const _this = this
            $.ajax({
            type: "GET",
            url: serveUrl+'guest-protocol/getAuthorizerDropdownList?access_token='+ User.appendAccessToken().access_token,
            data:{name:value,protocolId:_this.state.protocolId},
            success: function(data){
                if(data.data.length ==1){
                    _this.setState({
                     bookingPersonId:data.data[0].id,
                     bookingPersonName:data.data[0].value,
                 })
                }
            }
        });
    }
    flightHandleCancel = (e) => {
        this.setState({
            flightVisible: false,
        });
    }
    flightChose = (index, e) => {
        const _this = this

        this.state.flightBlurData = this.state.flightBlur[index]
        const flightDep = _this.state.flightBlurData.FlightDepAirport+"-"+_this.state.flightBlurData.FlightDepcode 
        const flightArr = _this.state.flightBlurData.FlightArrAirport + "-" +_this.state.flightBlurData.FlightArrcode
        _this.props.form.setFieldsValue({
            flightDep: flightDep,
            flightArr: flightArr,
        })
        
        let isInOrOut = ''
        if(_this.state.flightBlurData.FlightArrcode == _this.state.airportCode || _this.state.flightBlurData.FlightDepcode == _this.state.airportCode){
                        isInOrOut = '出港'
                    }

        $.ajax({
                type: "GET",
                url: serveUrl + 'flight-info/getFlightForOrderDetail?access_token=' + User.appendAccessToken().access_token,
                //url:'http://192.168.0.124:8989/getFlightForOrderDetail',
                data: { fnum:_this.props.form.getFieldValue('flightNo'),
                        date:moment(_this.props.form.getFieldValue('flightDate')).format('YYYY-MM-DD'),
                        flightDepcode:_this.state.flightBlurData.FlightDepcode,
                        flightArrcode:_this.state.flightBlurData.FlightArrcode,
                        flightDeptimePlanDate:moment(_this.state.flightBlurData.FlightDeptimePlanDate).format('YYYY-MM-DD hh:mm:ss'),
                        flightArrtimePlanDate:moment(_this.state.flightBlurData.FlightArrtimePlanDate).format('YYYY-MM-DD hh:mm:ss'),
                        isInOrOut:isInOrOut == '出港' ? 0:1,
                    },
                success: function (data) {
                    _this.setState({
                        flightVisible: false,
                        data:[{
                            key: '0',
                            name: {
                                editable: true,
                                value: moment(data.flightDeptimePlanDate).format('HH:mm'),
                            },
                            planLandingTime: {
                                editable: true,
                                value: moment(data.flightArrtimePlanDate).format('HH:mm'),
                            },
                            isInOrOut: {
                                editable: true,
                                value: data.isInOrOut == null ? '': data.isInOrOut == 0 ? '出港':'进港',
                            },
                            boardInOut: {
                                editable: true,
                                value: data.boardInOut == null ? '':data.boardInOut == 0 ?'国内':'国际',
                            },
                            flightPosition: {
                                editable: true,
                                value: data.flightPosition == null ? '':data.flightPosition,
                            },
                            planNo:{
                                editable: true,
                                value: data.planNo == null ? '':data.planNo,
                            },
                        }]
                    })
                }
            });
    }

    productsClick = (e, text) => {
        if(e.productName == '异地贵宾服务'){
            this.setState({
                RemoteClass:'btn',
                IndependentClass:'btn-no',
                VIPClass:'btn-no',
                ClassTwoClass:'btn-no',
                printCheck:false,
            })
        }else if(e.productName == '独立安检通道'){
             this.setState({
                RemoteClass:'btn-no',
                IndependentClass:'btn',
                VIPClass:'btn-no',
                ClassTwoClass:'btn-no',
                printCheck:false,
            })
        }else if(e.productName == 'VIP接送机'){

             this.setState({
                RemoteClass:'btn-no',
                IndependentClass:'btn-no',
                VIPClass:'btn',
                ClassTwoClass:'btn-no',
                printCheck:true,
            })
        }else if(e.productName == '两舱休息室'){
             this.setState({
                RemoteClass:'btn-no',
                IndependentClass:'btn-no',
                VIPClass:'btn-no',
                ClassTwoClass:'btn',
                printCheck:false,
            })
        }
        
        const _this = this
        _this.setState({
            protocolProductId: e.protocolProductId,
            productName:e.productName,
            productId:e.protocolProductId,
            serviceId1C:false,
            serviceId2C:false,
            serviceId3C:false,
            serviceId4C:false,
            serviceId5C:false,
            serviceId6C:false,
            serviceId7C:false,
        })
        $.ajax({
            type: "GET",
            //url: 'http://192.168.1.130:8080/get-service-type-by-protocol-product-id?access_token='+ User.appendAccessToken().access_token,
            url: serveUrl + 'guest-protocol/get-service-type-by-protocol-product-id?access_token=' + User.appendAccessToken().access_token,
            data: { protocolProductId: e.protocolProductId },
            success: function (data) {
                data.data.map((v,index)=>{
                    if(v.serviceTypeAllocationId == 1 || v.serviceTypeAllocationId ==5){
                    
                        let server1 = 'serviceId' + v.serviceTypeAllocationId+'C'
                        _this.state[server1] = true
                    }
                })
                _this.setState({
                    detailedData: data.data,
                })

            }
        });
            $.ajax({
                type: "GET",
                //url: 'http://192.168.1.130:8080/get-service-box-by-type-and-protocol-product-id?access_token='+ User.appendAccessToken().access_token,
                url: serveUrl+'guest-protocol/get-service-box-by-type-and-protocol-product-id?access_token='+ User.appendAccessToken().access_token,
                data:{protocolProductId:e.protocolProductId,typeId:1},
                success: function(data){
                    data.data.map((v,index)=>{
                          
                        if(v.isPrioritized == true){
                            _this.setState({
                                 serviceDetailName1:v.name,
                                 serviceDetailId1:v.protocolProductServiceId,
                                 servId1:v.serviceId,
                            })
                        }
                    })
                  _this.setState({
                      chird1:data.data
                  })
                }
            });
        $.ajax({
                type: "GET",
                //url: 'http://192.168.1.130:8080/get-service-box-by-type-and-protocol-product-id?access_token='+ User.appendAccessToken().access_token,
                url: serveUrl+'guest-protocol/get-service-box-by-type-and-protocol-product-id?access_token='+ User.appendAccessToken().access_token,
                data:{protocolProductId:e.protocolProductId,typeId:5},
                success: function(data){
                     data.data.map((v,index)=>{
                        if(v.isPrioritized == true){
                            _this.setState({
                                 serviceDetailName5:v.name,
                                 serviceDetailId5:v.protocolProductServiceId,
                                 servId5:v.serviceId,
                            })
                        }
                    })
                  _this.setState({
                      chird5:data.data
                  })
                }
            });
    }

    selectValue =(v,e)=>{
        console.log(this.state[`serviceId${v.serviceTypeAllocationId}C`])
        const serverD = 'serviceId' + v.serviceTypeAllocationId
        const sercerC = 'serviceId'+v.serviceTypeAllocationId+'C'
        const serverN = 'serviceName' +v.serviceTypeAllocationId
        if(this.state[`serviceId${v.serviceTypeAllocationId}C`] == false){
            this.setState({
                [sercerC]:true,
                [serverD]:v.serviceTypeAllocationId,
                [serverN]:v.type
            })
            
        }else{
            this.setState({
                [sercerC]:false,
                [serverD]:null,
                [serverN]:null
            })
        }
        const _this = this
        const chird = 'chird' + v.serviceTypeAllocationId
        const type = v.serviceTypeAllocationId
         $.ajax({
                type: "GET",
                //url: 'http://192.168.1.130:8080/get-service-box-by-type-and-protocol-product-id?access_token='+ User.appendAccessToken().access_token,
                url: serveUrl+'guest-protocol/get-service-box-by-type-and-protocol-product-id?access_token='+ User.appendAccessToken().access_token,
                data:{protocolProductId:_this.state.protocolProductId,typeId:v.serviceTypeAllocationId},
                success: function(data){
                    data.data.map((v,index)=>{
                        let serviceDetailId = 'serviceDetailId' + type
                        let serviceDetailName = 'serviceDetailName' + type
                        let servId = 'servId' + type
                        _this.setState({
                            [serviceDetailId]:v.protocolProductServiceId,
                            [serviceDetailName]:v.name,
                            [servId]:v.serviceId
                        })
                    })
                  _this.setState({
                      [chird]:data.data
                  })
                }
            });
    }


    getValue = (v) =>{
        this.setState({
            PassengerData:v
        })
    }
    //客户名称改变
    customerIdChange =(value) =>{
        const _this = this;
        // if(value == ''){
        //    $.ajax({
        //         type: "GET",
        //         url: serveUrl+'guest-protocol/getProtocolNameDropdownList?access_token='+ User.appendAccessToken().access_token,
        //         success: function(data){
        //             const Adata = [];
        //             data.data.map((v,index)=>{
        //                 Adata.push(data.data[index].value)
        //             })
        //             _this.props.form.setFieldsValue({
        //                             protocolId: '',
        //                         })
        //             _this.setState({
        //                 productData:Adata,
        //                 protocolId: null,
        //                 protocolName:null,
        //                 protocolType:null,
        //                 customerId:null,
        //                 customerName:null,
        //             })
        //         }
        //     });
        //     return
        // }
        $.ajax({
            type: "GET",
            url: serveUrl + 'institution-client/queryInstitutionClientDropdownList?access_token=' + User.appendAccessToken().access_token,
            data: { name: value },
            success: function (data) {
                if(data.data.length>0){
                    _this.setState({
                        customerId: data.data[0].id,
                        customerName: data.data[0].value
                    })
                }
                if (data.data.length == 1) {
                    $.ajax({
                        type: "GET",
                        url: serveUrl + 'guest-protocol/getProtocolNameDropdownList?access_token=' + User.appendAccessToken().access_token,
                        data: { customerId: data.data[0].id },
                        success: function (data) {
                            const Adata = [];
                            data.data.map((v, index) => {
                                Adata.push(data.data[index].value)
                            })
                            if (data.data.length == 1) {
                                const Adata = []
                                data.data.map((v, index) => {
                                    Adata.push(data.data[index].value)
                                })
                                _this.setState({
                                    productData: Adata,
                                    protocolId: data.data[0].id,
                                    protocolName: data.data[0].value,
                                    protocolType: data.data[0].type,
                                    customerId: data.data[0].clientId,
                                    customerName: data.data[0].clientValue,
                                    securityCheck: data.data[0].type == 6 ? true : false,
                                })
                                _this.props.form.setFieldsValue({
                                    protocolId: data.data[0].value,
                                })
                                $.ajax({
                                    type: "GET",
                                    url: serveUrl + 'guest-protocol/view?access_token=' + User.appendAccessToken().access_token,
                                    data: { protocolId: data.data[0].id },
                                    success: function (data) {
                                        _this.setState({
                                            productsData: data.data.protocolProductList,
                                        })
                                        if (data.data.type == 12 || data.data.type == 4 || data.data.type == 6 || data.data.type == 5) {
                                            _this.setState({
                                                isImportant: true,
                                            })
                                        }
                                    }
                                });
                                $.ajax({
                                    type: "GET",
                                    url: serveUrl + 'guest-protocol/getAuthorizerDropdownList?access_token=' + User.appendAccessToken().access_token,
                                    data: { protocolId: data.data[0].id },
                                    success: function (data) {
                                        const Adata = [];
                                        data.data.map((v, index) => {
                                            Adata.push(data.data[index].value)
                                        })
                                        _this.setState({
                                            bookingPersonData: Adata,

                                        })
                                        _this.setState({
                                            bookingPersonData: Adata,
                                            bookingPersonId: data.data.id,
                                        })
                                    }
                                });
                            } else {
                                _this.setState({
                                    productData: Adata,
                                })
                            }
                        }
                    });
                }
            }
        });
    }
    detailChange = (v,e) =>{

        let serviceDetailId = 'serviceDetailId' + v
        let serviceDetailName = 'serviceDetailName' + v
        let servId = 'servId' + v
        let es = e.split('&')
        this.setState({
            [serviceDetailId]:es[0],
            [serviceDetailName]:es[1],
            [servId]:es[2]
        })
    }
    serverInputChange = (v,e) =>{
        let server = 'serverNum' + v
        this.setState({
            [server]:e.target.value
        })
        this.state[server] = e.target.value
    }
    carNumInputChange = (v,e) =>{
        let car = 'carNum' + v
        this.setState({
            [car]:e.target.value
        })
    }
    carInputChange= (v,e) =>{
        let car = 'car' + v
        this.setState({
            [car]:e.target.value
        })
    }
     passengerOk = (e)=>{
         let values = this.state.passengerList.length 
         this.setState({
            passengerVisible: false,
            serverNum1:values,
            serverNum5:values,
        });
    }

    handleAdd = (e) =>{
        this.setState({
            passengerVisible: true,
        });
    }

    handleCancel1 = (e)=>{
         this.setState({
            passengerVisible: false,
        });
    }
    UpdataPassengerOk = (e)=>{
         this.setState({
            UpdataPassengerVisible: false,
        });
    }

    handleAdd2 = (e,index) =>{
        this.setState({
            UpdataPassengerIndex:e.key,
            UpdataPassengerVisible: true,
        });
    }

    handleCancel2 = (e)=>{
         this.setState({
            UpdataPassengerVisible: false,
        });
    }

    baseClick = ()=>{
        document.getElementById('base').scrollIntoView()
        if(this.state.baseClass == null){
            this.setState({
                baseClass:'ul-li-active',
                flightClass:null,
                serviceClass:null,
            })
        }else{
            this.setState({
                baseClass:null,
            })
        }
    }
    flightClick =()=>{
        document.getElementById('flight').scrollIntoView()
        if(this.state.flightClass == null){
            this.setState({
                flightClass:'ul-li-active',
                baseClass:null,
                serviceClass:null
            })
        }else{
            this.setState({
                flightClass:null,
            })
        }
    }

    serviceClick = () =>{
        document.getElementById('service').scrollIntoView()
        if(this.state.serviceClass == null){
            this.setState({
                serviceClass:'ul-li-active',
                baseClass:null,
                flightClass:null,
            })
        }else{
            this.setState({
                serviceClass:null
            })
        }
    }

      handleReset =(e)=>{
         hashHistory.push('/appointmentList');
    }
     passengerCanel = (e,index) =>{
        e.persist();
        for(var i = 0;i<this.state.passengerList.length;i++){
            if(value.key == this.state.passengerList[i].key){
                this.state.passengerList.splice(i,1)
            }
        }
        const _this = this
        this.setState({
            passengerList:_this.state.passengerList
        })
    }

    isImportant =(e)=>{
        const _this = this
        _this.setState({
            isImportant:!_this.state.isImportant
        })
    }
    

     render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 10 }
        };

        const customPanelStyle = {
            background: '#f7f7f7',
            borderRadius: 4,
            marginBottom: 5,
            border: 0,
        };

        const columns = [{
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            render: text => <div className="order"><span className='order'>{text}</span></div>,
            }, {
            title: '宾客类型',
            dataIndex: 'passengerType',
            key: 'address',
            render: text => <div className="order"><span className='order'>{text}</span></div>,
            }, {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <div className='order'>
                <a onClick={this.handleAdd2.bind(this,text)}>操作</a>
                <a style={{marginLeft:20}} onClick={this.passengerCanel.bind(this,text)}>删除</a>
                </div>
            ),
        }];
        
        
        getFieldDecorator('keys', { initialValue: []});
        const keys = getFieldValue('keys');

        const flightP = this.state.flightBlur.map((v, index) => {
            return(
                <p key={index} className='cursor' style={{marginBottom:15}} onClick={this.flightChose.bind(this,index)}>{v.FlightDep}-{v.FlightArr}</p>
            )
        })
        let productsP = null
        if(this.state.productsData != null){
             productsP = this.state.productsData.map((v,index) => {
                 let className = ''
                  if(v.productName == '异地贵宾服务'){
                        className='RemoteClass'
                    }else if(v.productName == '独立安检通道'){
                        className='IndependentClass'
                    }else if(v.productName == 'VIP接送机'){
                        className='VIPClass'
                    }else if(v.productName == '两舱休息室'){
                        className='ClassTwoClass'
                    }
                  
            return(
                <button key={index} className={this.state[className]} onClick={this.productsClick.bind(this,v)} style={{marginLeft:30}}>{v.productName}</button>
            )
        })
        }
        
        const _this = this;
        let detailedP = null;
         detailedP = this.state.detailedData.map((v,index) =>{
            const name = v.type + '服务'
            const serviceTypeAllocationId = v.serviceTypeAllocationId
            const chirds = 'chird' + v.serviceTypeAllocationId
            const sercerC = 'serviceId'+v.serviceTypeAllocationId+'C'
            let chird = this.state[chirds].map((v,index)=>{
                const values = v.protocolProductServiceId.toString() +"&"+v.name+"&"+v.serviceId
                return  <Option   key={index} value={values}>{v.name}</Option>
            })
            let values = ''
            if(v.serviceTypeAllocationId == 1 || v.serviceTypeAllocationId ==5){
                values = _this.state.passengerList.length 
                let server = 'serverNum' + v.serviceTypeAllocationId
            }else{
                values=''
            }
     
            let server = 'serverNum' + v.serviceTypeAllocationId
            let serviceDetailName = 'serviceDetailName' + v.serviceTypeAllocationId
            let id = null;
            if(v.type == 'VIP摆渡车' || v.type == '远机位摆渡车'){
                 return(
                     <div  key={v.serviceTypeAllocationId}>
                        <div key={v.serviceTypeAllocationId} style={{paddingTop:10,paddingBottom:10,borderBottom:'1px solid #f0f0f0'}}>
                        <Checkbox onClick={this.selectValue.bind(this,v)} checked={this.state[sercerC]}>{v.type}</Checkbox>
                        <span className='detailInput'>
                        <Select  onChange={this.detailChange.bind(this,v.serviceTypeAllocationId)} value={this.state[serviceDetailName]}  style={{ width: 120 }} className='selectMid detailInput' >
                            {chird}
                        </Select>
                        </span>
                        </div>
                    </div>
                )
            }else if(v.type =='停车场' ){
                 return(
                    <div  key={v.serviceTypeAllocationId}>
                        <div key={v.serviceTypeAllocationId} style={{paddingTop:10,paddingBottom:10,borderBottom:'1px solid #f0f0f0'}}>
                        <Checkbox onClick={this.selectValue.bind(this,v)} checked={this.state[sercerC]}>{v.type}</Checkbox>
                        <span className='detailInput'>
                        <Select onChange={this.detailChange.bind(this,v.serviceTypeAllocationId)} value={this.state[serviceDetailName]} className='selectMid detailInput'  style={{ width: 120 }} >
                        {chird}
                        </Select>
                        </span>
                        <div className='inputMid'>
                            <span>车辆信息</span>
                            <input onChange={this.carNumInputChange.bind(this,v.serviceTypeAllocationId)} className='serverInput '/>
                            <span>辆</span>
                            <input onChange={this.carInputChange.bind(this,v.serviceTypeAllocationId)} className='carInput' plaseHolder='车牌' />
                        </div>
                        </div>
                    </div>
                )
            }else{
                 return(
                    <div  key={v.serviceTypeAllocationId}>
                        <div key={v.serviceTypeAllocationId} style={{paddingTop:10,paddingBottom:10,borderBottom:'1px solid #f0f0f0'}}>
                        <Checkbox onClick={this.selectValue.bind(this,v)} checked={this.state[sercerC]}>{v.type}</Checkbox>
                        <span className='detailInput'>
                        <Select onChange={this.detailChange.bind(this,v.serviceTypeAllocationId)} value={this.state[serviceDetailName]} className='selectMid detailInput'  style={{ width: 120 }} >
                        {chird}
                        </Select>
                        </span>
                        <div className='inputMid'>
                            <span>服务人次</span>
                            <input onChange={this.serverInputChange.bind(this,v.serviceTypeAllocationId)} className='serverInput' value={this.state[server]}/>
                            <span>次</span>
                        </div>
                        </div>
                    </div>
                )
            }
           
        })
        
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };
        const { dataSource } = this.state;
        

        const plainOptions = ['电话', '邮件', '传真', '短信', '其他'];

        return (
            <div id='sa'>
                <div className="breadcrumb-box">
                    <div className="top-bar"></div>
                    <div className="breadcrumb">
                        <Breadcrumb>
                            <Breadcrumb.Item>订单管理</Breadcrumb.Item>
                            <Breadcrumb.Item>预约订单</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
                <div className="box">
                    <div className='top-div'>
                        <ul className='top_tit'>
                            <li onClick={this.baseClick} className={this.state.baseClass}>基本信息</li>
                            <li onClick={this.flightClick} className={this.state.flightClass}>航班信息</li>
                            <li onClick={this.serviceClick} className={this.state.serviceClass}>服务信息</li>
                        </ul>
                        <FormItem className='border-Bottom' style={{ marginTop:-48,marginLeft:'36%' }}>
                            <button className="btn-small save-btn" onClick={this.handleSubmit}>保存</button>
                            <button className="btn-small save-btn-draft" onClick={this.handleSubmit2} style={{marginLeft:26}}>保存草稿</button>
                            <button className="btn-small" onClick={this.handleReset} style={{marginLeft:26}}>返回</button>
                        </FormItem>
                    </div>

                     <div className='title-fix'>
                        <ul className='top_tit'>
                            <li onClick={this.baseClick} className={this.state.baseClass}>基本信息</li>
                            <li onClick={this.flightClick} className={this.state.flightClass}>航班信息</li>
                            <li onClick={this.serviceClick} className={this.state.serviceClass}>服务信息</li>
                        </ul>
                        <FormItem className='border-Bottom' style={{ marginTop:-48,marginLeft:'36%' }}>
                            <button className="btn-small save-btn" onClick={this.handleSubmit}>保存</button>
                            <button className="btn-small save-btn-draft" onClick={this.handleSubmit2} style={{marginLeft:26}}>保存草稿</button>
                            <button className="btn-small" onClick={this.handleReset} style={{marginLeft:26}}>返回</button>
                        </FormItem>
                    </div>
                    <ul className="tit" id='base' style={{marginTop:20}}>
                        <li>
                            <a href="javascript:;" className="active">基本信息</a>
                        </li>
                    </ul>

                    <div className="mid-box">
                        <div className="protocol-sort">
                       
                            <Form horizontal  style={{ position: 'relative'}}>
                                
                             <Row>
                                <Col span={10} style={{marginLeft:20}} className='ant-form-explainI'>
                                    <FormItem label="客户名称" {...formItemLayout}  >
                                        {getFieldDecorator("customerId", {
                                            rules: [
                                             { required: true, message: '请填写客户名称!' },
                                            ]
                                        })(
                                             <AutoComplete
                                                dataSource={this.state.AutoClientList}
                                                style={{ width: 250 }}
                                                onChange={this.customerIdChange}
                                            />
                                            )}
                                    </FormItem>
                                </Col>
                                <Col span={10} style={{marginLeft:60}}>
                                <FormItem label="协议信息" {...formItemLayout}>
                                    {getFieldDecorator("protocolId", {
                                        rules: [
                                             { required: true, message: '请填写协议信息!' },
                                            ]
                                    })(
                                        
                                        <AutoComplete
                                                dataSource={this.state.productData}
                                                style={{ width: 250 }}
                                                onChange={this.productChange}
                                            />
                                        )}
                                </FormItem>
                                </Col>
                                    <Col span={9} style={{marginLeft:30}}>
                                    <FormItem label="预约人" {...formItemLayout}>
                                        {getFieldDecorator("bookingPerson", {
                                        })(
                                           <AutoComplete
                                                dataSource={this.state.bookingPersonData}
                                                style={{ width: 250 }}
                                                onChange={this.bookingPersonChange}
                                            />
                                            )}
                                    </FormItem>
                                    </Col>
                                    <Col span={3} style={{marginLeft:-38,marginTop:5}}>
                                        <Checkbox onClick={this.addCheck.bind(this,!this.state.bookingStatus)}>是否通知人</Checkbox>
                                    </Col>
                                    <Col span={8} style={{marginLeft:-70}}>
                                        <FormItem label="通知人" {...formItemLayout}>
                                            {getFieldDecorator("noticePerson", {
                                            })(
                                                <Input style={{width:250}}/>
                                                )}
                                        </FormItem>
                                    </Col>
                                <Col span={15} className='appointmentType' style={{marginLeft:-28}}>
                                <FormItem label="预约方式" {...formItemLayout}>
                                    {getFieldDecorator("bookingWay", {
                                        initialValue:0
                                    })(
                                        <RadioGroup>
                                            <Radio value={0}>电话</Radio>
                                            <Radio value={1}>邮件</Radio>
                                            <Radio value={2}>传真</Radio>
                                            <Radio value={3}>短信</Radio>
                                            <Radio value={4}>其他</Radio>
                                        </RadioGroup>
                                        )}
                                </FormItem>
                                </Col>
                                <Col span={9} className='isImportant' style={{marginLeft:-208}}>
                                <FormItem label="是否重要订单" {...formItemLayout}>
                                    {getFieldDecorator("isImportant", {
                                    })(
                                        <Checkbox checked={this.state.isImportant} onClick={this.isImportant}>重要</Checkbox>
                                        )}
                                </FormItem>
                                </Col>
                            </Row>
                            <ul className="tit" id='flight'>
                                <li>
                                    <a href="javascript:;" className="active">航班信息</a>
                                </li>
                            </ul>
                            <Row style={{marginTop:50}}>
                                <Col span={13} style={{marginLeft:50}}>
                                <FormItem label="航班日期" {...formItemLayout}>
                                    {getFieldDecorator("flightDate", {
                                        initialValue:moment(),
                                        rules: [
                                             { required: true, message: '请填写航班日期!' },
                                            ]
                                    })(
                                        <DatePicker onChange={this.flightBlur} style={{width:300}}/>
                                        )}
                                </FormItem>
                                </Col>
                                <Col span={8} style={{marginLeft:'-12%',marginTop:5}}>
                                    <a className='word-blue' onClick={this.changeDate.bind(this,'0')}>今天</a>
                                    <a style={{marginLeft:10}} className='word-blue' onClick={this.changeDate.bind(this,'1')}>明天</a>
                                    <a style={{marginLeft:10}} className='word-blue' onClick={this.changeDate.bind(this,'2')}>后天</a>
                                </Col>
                                <Col span={13} style={{marginLeft:50}}>
                                <FormItem label="航班号" {...formItemLayout}>
                                    {getFieldDecorator("flightNo", {
                                        rules: [
                                             { required: true, message: '请填写航班号!' },
                                            ]
                                    })(
                                        <Input style={{width:300}} onBlur={this.flightBlur}/>
                                        )}
                                </FormItem>
                                </Col>
                                <Col span={12} style={{marginLeft:50}}>
                                    <FormItem label="航段" {...formItemLayout} style={{marginLeft:10}}>
                                        {getFieldDecorator("flightDep", {
                                            rules: [
                                             { required: true, message: '请填写航段!' },
                                            ]
                                        })(
                                            <AutoComplete
                                                dataSource={this.state.flightDepData}
                                                style={{ width: 200 }}
                                                onChange={this.flightDepChange}
                                            />
                                            )}
                                    </FormItem>
                                </Col>
                                <Col span={2} >
                                    <span style={{marginLeft:-195}}>~</span>
                                </Col>

                                <Col span={7} >
                                    <FormItem  {...formItemLayout} style={{marginLeft:-233}}>
                                        {getFieldDecorator("flightArr", {
                                            rules: [
                                             { required: true, message: '请填写航段!' },
                                            ]
                                        })(
                                            <AutoComplete
                                                dataSource={this.state.flightArrData}
                                                style={{ width: 200 }}
                                                onChange={this.flightArrChange}
                                            />
                                            )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <div className='secondTitle' style={{marginLeft:90}}>
                                <span></span>
                                <a>详细信息</a>
                            </div>
                           
                            <div className="search-result-list" style={{marginLeft:90,paddingRight:90}}>
                                <EditableTable key={Math.random() * Math.random()} data={this.state.data}/>
                            </div>
                            <ul  id='service' className="tit" style={{marginTop:'5%'}} >
                                <li>
                                    <a href="javascript:;" className="active">服务信息</a>
                                </li>
                            </ul>
                            <div className='secondTitle' style={{marginLeft:90,marginTop:40,paddingBottom:40}}>
                                <span></span>
                                <a>旅客信息</a>
                            </div>
                            <div className="search-result-list" style={{marginLeft:90,paddingRight:90}}>
                                <Table pagination={false} dataSource={this.state.passengerList} columns={columns} />
                                <button style={{width:200,height:30,lineHeight:'30px',textAlign:'center',color:'#b7b7b7',backgroundColor:'#fff',border:'1px dashed #b7b7b7',display:'block',marginTop:30}} onClick={this.handleAdd} >+增加旅客</button>
                            </div>
                            <div className='secondTitle' style={{marginLeft:90,marginTop:40,paddingBottom:40}}>
                                <span></span>
                                <a><span className='ruleRed'>*</span> 该协议可预约以下产品，请选择</a>
                            </div>
                            <div style={{marginLeft:90,paddingRight:90}}>
                               {productsP}
                            </div>
                            <div className='secondTitle' style={{marginLeft:90,marginTop:40,paddingBottom:40}}>
                                <span></span>
                                <a>详细服务</a>
                            </div>

                            <div style={{marginLeft:90,paddingRight:90}}>
                                        {detailedP}
                            </div>
                            <div className='secondTitle' style={{marginLeft:90,marginTop:40,paddingBottom:40}}>
                                <span></span>
                                <a>附加服务</a>
                            </div>

                            <div style={{marginLeft:90,paddingRight:90}}>
                                    <div>
                                        <div style={{paddingBottom:10,borderBottom:'1px solid #f0f0f0'}}>
                                        <Checkbox onClick={this.printCheck} checked={this.state.printCheck}>代办登机牌</Checkbox>
                                        <Input onChange={this.printCheckRemark} value={this.state.serviceAdd} style={{width:300,marginLeft:120}} />
                                        <a className='word-blue' style={{marginLeft:10}} onClick={this.addHtml.bind(this,"靠窗")}>靠窗</a>
                                        <a className='word-blue' style={{marginLeft:10}} onClick={this.addHtml.bind(this,"靠走廊")}>靠走廊</a>
                                        <a className='word-blue' style={{marginLeft:10}} onClick={this.addHtml.bind(this,"前排")}>前排</a>
                                        <a className='word-blue' style={{marginLeft:10}} onClick={this.addHtml.bind(this,"后排")}>后排</a>
                                        <a className='word-blue' style={{marginLeft:10}} onClick={this.addHtml.bind(this,"安全出口")}>安全出口</a>
                                        </div>
                                        <div  style={{paddingTop:10,paddingBottom:10,borderBottom:'1px solid #f0f0f0'}}>
                                        <Checkbox onClick={this.consign}>代办托运</Checkbox>
                                        <Input onChange={this.consignRemark} placeholder="请输入托运要求" style={{width:300,marginLeft:136}} />
                                        </div>
                                        <div  style={{paddingTop:10,paddingBottom:10,borderBottom:'1px solid #f0f0f0'}}>
                                        <Checkbox onClick={this.securityCheck} checked={this.state.securityCheck}>安检礼遇</Checkbox>
                                        <Input onChange={this.securityCheckRemark}  style={{width:300,marginLeft:136}} />
                                        </div>
                                        <div  style={{paddingTop:10,paddingBottom:10}}>
                                        <span>其他服务</span>
                                        <Input onChange={this.otherRemark}  style={{width:300,marginLeft:175}} />
                                        </div>
                                    </div>
                            </div>
                            </Form>
                            <span className='modalp'>
                                <Modal title="请选择航段" visible={this.state.flightVisible}  onCancel={this.flightHandleCancel}>
                                    {flightP}
                                </Modal>
                            </span>
                            <div id="detail-msg">
                                <Modal title="旅客信息"
                                    key={Math.random() * Math.random()}
                                    visible={this.state.passengerVisible}
                                    onCancel={this.handleCancel1}
                                    >
                                    <div>
                                        <Passenger  protocolType={this.state.protocolType} onOK={this.passengerOk} passengerList={this.state.passengerList} />
                                    </div>
                                </Modal>
                            </div>
                            <div id="detail-msg">
                                <Modal title="旅客信息"
                                    key={Math.random() * Math.random()}
                                    visible={this.state.UpdataPassengerVisible}
                                    onCancel={this.handleCancel2}
                                    >
                                    <div>
                                        <UpdataPassenger index={this.state.UpdataPassengerIndex}  protocolType={this.state.protocolType} onOK={this.UpdataPassengerOk} passengerList={this.state.passengerList} />
                                    </div>
                                </Modal>
                            </div>
                        </div>
                    </div>
                    
                </div>
               

            </div>
        )
    }
}
AddProtocol  = Form.create()(AddProtocol );

export default AddProtocol ;