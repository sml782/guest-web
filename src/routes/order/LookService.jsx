import './appointment.less';
import React from 'react';
import { hashHistory } from 'react-router';
import { Breadcrumb, Form, Row, Col, Input, Button, Icon, Select, Popconfirm, message, Table, Checkbox, Radio, DatePicker, Modal, Collapse, AutoComplete } from 'antd';
import { Link } from 'react-router';
import moment from 'moment';
import $ from 'jquery';
import { serveUrl, User, cacheData } from '../../utils/config';
import EditableTable from './EditableTable'
import DeleteDialog from '../DeleteDialog';//引入删除弹框
import { amendTime } from '../../utils/base';
import LoungeFlightDetail from './accessorialServiceDetail';
import LoungeFlightDetail1 from './written';
import Passenger from './Passenger';//引入旅客
import UpdataPassenger from './UpdataPassengerNo';//引入旅客



const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const CheckboxGroup = Checkbox.Group;
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
// const url = "http://192.168.1.198:8080/";




class AddProtocol extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            className:'',
            airportCode:null,
            orderId:null,
             visible1:false,
            visible: false,
            alongTotal:null,
            protocolType:null,
            protocolProductIds: null,
            flightDepData: [],
            flightArrData: [],
            productId: null,
            productData: [],
            flightBlurData: [],
            flightBlur: [],
            bookingPersonData: [],
            serviceAdd: '',
            bookingStatus: false,
            flightDep: '',
            flightArr: '',
            flightVisible: false,
            protocolId: null,
            scrollTop: null,
            productsData: [],
            detailedData: [],
            protocolProductId: null,
            AutoClientList: [],
            customerId: null,
            bookingPersonId: null,
            otherRemark: null,
            printCheckRemark: null,
            printCheck: false,
            consignRemark: null,
            serviceList: [],
            customerName: null,
            protocolName: null,
            bookingPersonName: null,
            consign: false,
            productName: null,
            serverNum1: null,
            serverNum2: null,
            serverNum3: null,
            serverNum4: null,
            serverNum5: null,
            serverNum6: null,
            serverNum7: null,
            serviceId1: null,
            serviceId2: null,
            serviceId3: null,
            serviceId4: null,
            serviceId5: null,
            serviceId6: null,
            serviceId7: null,
            serviceName1: null,
            serviceName2: null,
            serviceName3: null,
            serviceName4: null,
            serviceName5: null,
            serviceName6: null,
            serviceName7: null,
            serviceId1C: false,
            serviceId2C: false,
            serviceId3C: false,
            serviceId4C: false,
            serviceId5C: false,
            serviceId6C: false,
            serviceId7C: false,
            serviceDetailId1: null,
            serviceDetailId2: null,
            serviceDetailId3: null,
            serviceDetailId4: null,
            serviceDetailId5: null,
            serviceDetailId6: null,
            serviceDetailId7: null,
            bookingWay: null,
            importantCheck: true,
            orderStatus: null,
            flightId: null,
              securityCheckRemark:null,
            securityCheck:false,
            chird: [],
            data: [{
                key: '0',
                name: {
                    editable: false,
                    value: '',
                },
                planLandingTime: {
                    editable: false,
                    value: '',
                },
                isInOrOut: {
                    editable: false,
                    value: '',
                },
                boardInOut: {
                    editable: false,
                    value: '',
                },
                flightPosition: {
                    editable: false,
                    value: '',
                },
                planNo: {
                    editable: false,
                    value: '',
                },
            }],
             passengerVisible:false,
            UpdataPassengerVisible:false,
            UpdataPassengerIndex:null,
            passengerList:[],
            createUserClass:'',
            serverUserClass:'',
        }
    }

    componentWillMount = () => { 
         if(User.isLogin()){
        } else{
            hashHistory.push('/login');
        }
        const _this = this;
        $.ajax({
            type: "GET",
            url: serveUrl + 'flight-info/flightInfoDropdownList?access_token=' + User.appendAccessToken().access_token,
            success: function (data) {
                const Adata = [];
                data.data.map((v, index) => {
                    Adata.push(data.data[index].value)
                })
                _this.setState({
                    flightDepData: Adata,
                    flightArrData: Adata,
                })
            }
        });
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
        $.ajax({
            type: "GET",
            url: serveUrl + 'guest-protocol/getProtocolNameDropdownList?access_token=' + User.appendAccessToken().access_token,
            success: function (data) {
                const Adata = [];
                data.data.map((v, index) => {
                    Adata.push(data.data[index].value)
                })
                _this.setState({
                    productData: Adata,
                })
            }
        });
        $.ajax({
            type: "GET",
            url: serveUrl + 'guest-protocol/getAuthorizerDropdownList?access_token=' + User.appendAccessToken().access_token,
            data: { protocolId: _this.state.protocolId },
            success: function (data) {
                const Adata = [];
                data.data.map((v, index) => {
                    Adata.push(data.data[index].value)
                })
                _this.setState({
                    bookingPersonData: Adata,

                })
            }
        })

        //机构客户名称的列表（模糊匹配）
        $.ajax({
            type: "GET",
            url: serveUrl + "institution-client/queryInstitutionClientDropdownList?access_token=" + User.appendAccessToken().access_token,
            success: function (data) {
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

        $.ajax({
            type: "GET",
            url: serveUrl + 'guest-order/view?access_token=' + User.appendAccessToken().access_token,
            //url:"http://192.168.1.199:8887/view?access_token="+User.appendAccessToken().access_token,
            data: { orderId: _this.props.params.id },
            success: function (data) {
                if (data.status == 200) {
                    JSON.parse(data.data.serviceList[0].serviceDetail)
                    data.data.serviceList.map((v, index) => {
                        if (JSON.parse(v.serviceDetail) != undefined && JSON.parse(v.serviceDetail) != undefined) {
                            $.ajax({
                                type: "GET",
                                url: serveUrl + 'guest-protocol/get-service-box-by-type-and-protocol-product-id?access_token=' + User.appendAccessToken().access_token,
                                data: { protocolProductId: data.data.productId, typeId: JSON.parse(v.serviceDetail).serviceId },
                                success: function (data) {
                                    _this.state.serviceList[index].detailedData = data.data
                                }
                            });
                            $.ajax({
                                type: "GET",
                                url: serveUrl + 'guest-protocol/protocol-product-service-view?access_token=' + User.appendAccessToken().access_token,
                                data: { protocolProductServiceId: JSON.parse(v.serviceDetail).serviceDetailId },
                                success: function (data) {
                                    if (data.data != undefined) {
                                        _this.state.serviceList[index].detailedName = data.data.name
                                    } else {
                                        _this.state.serviceList[index].detailedName = ''
                                    }
                                }
                            })
                            _this.state.serviceList.push(JSON.parse(v.serviceDetail))
                            _this.state.serviceList[index].orderServiceId = v.orderServiceId
                            _this.state.serviceList[index].checked = true
                        }
                    })
                    $.ajax({
                        type: "GET",
                        url: serveUrl + 'guest-protocol/view?access_token=' + User.appendAccessToken().access_token,
                        data: { protocolId: data.data.protocolId },
                        success: function (data) {
                            _this.setState({
                                productsData: data.data.protocolProductList
                            })

                        }
                    });
                    if(data.data.createUser == null){
                        _this.setState({
                            createUserClass:'displayNone'
                        })
                    }

                     if(data.data.serverCreateUserName == null){
                        _this.setState({
                            serverUserClass:'displayNone'
                        })
                    }
                    
                    _this.props.form.setFieldsValue({
                        customerId: data.data.customerName,
                        noticePerson: data.data.noticePerson,
                        orderId: data.data.orderNo,
                        protocolId: data.data.protocolName,
                        bookingPerson: data.data.bookingPersonName,
                        flightDate: moment(data.data.flight.flightDate),
                        flightNo: data.data.flight.flightNo,
                        flightArr: data.data.flight.flightArr+' '+data.data.flight.flightArrcode,
                        flightDep: data.data.flight.flightDep+' '+data.data.flight.flightDepcode,
                        createUserName: data.data.createUserName,
                        createTime: moment(data.data.createTime).format('YYYY-MM-DD HH:mm'),
                        serverCreateUserName: data.data.serverUpdateUserName,
                        serverCreateTime: moment(data.data.serverUpdateTime).format('YYYY-MM-DD HH:mm'),
                    })
                   data.data.passengerList.map((v, index) => {
                        v.key = index
                        v.passengerType = v.passengerType == 0 ? '主宾' : '随行';
                    })
                    if(data.data.consign != 1 && data.data.printCheck != 1 && data.data.securityCheck != 1){
                        _this.setState({
                            className:'isImportno'
                        })
                    }
                    _this.setState({
                        protocolType:data.data.protocolType,
                        productName: data.data.productName,
                        importantCheck: data.data.isImportant == 0 ? true : false,
                        bookingWay: data.data.bookingWay,
                        orderStatus: data.data.orderStatus,
                        otherRemark: data.data.otherRemark,
                        consignRemark: data.data.consignRemark,
                        serviceAdd:data.data.printCheckRemark,
                        printCheckRemark: data.data.printCheckRemark,
                        printCheck: data.data.printCheck == 1 ? true : false,
                        consign: data.data.consign == 1 ? true : false,
                        protocolProductIds: data.data.productId,
                        flightId: data.data.flight.flightId,
                        protocolId: data.data.protocolId,
                        "customerId": data.data.customerId,//机构名称id
                        "bookingPersonId": data.data.bookingPerson,//菜单url 
                        "customerName": data.data.customerName,//机构名称名称
                        "protocolName": data.data.protocolName,//协议名称
                        "bookingPersonName": data.data.bookingPersonName,//预约人名 
                        securityCheckRemark:data.data.securityCheckRemark,
                        securityCheck:data.data.securityCheck == 1 ? true : false,
                        productId: data.data.productId,
                       passengerList:data.data.passengerList,
                        alongTotal:data.data.alongTotal,
                        data: [{
                            key: '0',
                            name: {
                                editable: false,
                                value: moment(data.data.flight.flightDeptimePlanDate).format("HH:mm"),
                            },
                            planLandingTime: {
                                editable: false,
                                value: moment(data.data.flight.flightArrtimePlanDate).format("HH:mm"),
                            },
                            isInOrOut: {
                                editable: false,
                                value: data.data.flight.isInOrOut == 0 ? '出港':'进港',
                            },
                            boardInOut: {
                                editable: false,
                                value: data.data.flight.boardInOut == 1 ? '国内' : '国际',
                            },
                            flightPosition: {
                                editable: false,
                                value: data.data.flight.flightPosition,
                            },
                            planNo: {
                                editable: false,
                                value: data.data.flight.planNo,
                            },
                        }],
                    })
                }
            }
        });



    }

    componentDidMount = () => {
        $(".ant-breadcrumb-separator").html(">");
        $(".ant-breadcrumb-separator").css({ color: '#333' });
        $(".ant-col-3").removeClass('ant-col-3').addClass("ant-col-5");
        $(".ant-col-21").removeClass('ant-col-21').addClass("ant-col-19");
        $(".appointmentType .ant-col-10").removeClass('ant-col-10').addClass("ant-col-19");
        $(".isImportant .ant-col-5").removeClass('ant-col-5').addClass("ant-col-10");


    }



    otherRemark = (e) => {
        this.setState({
            otherRemark: e.target.value
        })
    }

    printCheck = (e) => {
        const _this = this
        this.setState({
            printCheck: !_this.state.printCheck
        })
    }

    consignRemark = (e) => {
        this.setState({
            consignRemark: e.target.value
        })
    }

    consign = (e) => {
        const _this = this
        this.setState({
            consign: !_this.state.consign
        })
    }

    printCheckRemark = (e) => {
        this.setState({
            printCheckRemark: e.target.value
        })
    }

    addHtml = (text,e) =>{
        let _text = ""
        if(this.state.serviceAdd.indexOf(text) == -1){
            _text = this.state.serviceAdd + text
        }else{
            _text = this.state.serviceAdd
        }
        this.setState({
            serviceAdd:_text
        })

    }

    addCheck = (e) => {
        this.setState({
            bookingStatus: e
        })
        const _this = this
        if (e == true) {
            this.props.form.setFieldsValue({
                noticePerson: this.props.form.getFieldValue('bookingPerson')
            })
        } else {
            this.props.form.setFieldsValue({
                noticePerson: ''
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

    flightBlur = () => {
        const _this = this
        $.ajax({
            type: "GET",
            url: serveUrl + 'flight-info/flightInfo?access_token=' + User.appendAccessToken().access_token,
            data: { fnum: this.props.form.getFieldValue('flightNo'), date: moment(this.props.form.getFieldValue('flightDate')).format('YYYY-MM-DD') },
            success: function (msg) {
                if (msg.Data.length > 1) {
                    _this.setState({
                        flightBlur: msg.Data,
                        flightVisible: true
                    })
                } else {
                    _this.setState({
                        flightBlurData: msg.Data
                    })
                    const flightDep = _this.state.flightBlurData.FlightDep + " " + _this.state.flightBlurData.FlightDepcode
                    const flightArr = _this.state.flightBlurData.FlightArr + " " + _this.state.flightBlurData.FlightArrcode
                    _this.props.form.setFieldsValue({
                        flightDep: flightDep,
                        flightArr: flightArr,
                    })
                    let Fcategory = null;
                    if (_this.state.flightBlurData.Fcategory == 0) {
                        Fcategory = '国内'
                    } else {
                        Fcategory = '国际'
                    }
                    _this.setState({
                        data: [{
                            key: '0',
                            name: {
                                editable: false,
                                value: moment(_this.state.flightBlurData.FlightDeptimePlanDate).format('hh:mm'),
                            },
                            planLandingTime: {
                                editable: false,
                                value: moment(_this.state.flightBlurData.FlightArrtimePlanDate).format('hh:mm'),
                            },
                            boardInOut: {
                                editable: false,
                                value: Fcategory,
                            },
                            flightPosition: {
                                editable: false,
                                value: '',
                            },
                            planNo: {
                                editable: false,
                                value: '',
                            },
                        }]
                    })
                }



            }
        });
    }


    changeValue = (values) => {
        this.setState({
            OneValue: values
        }, this.showChange);
        // this.inteval = setTimeout(() => this.showChange(), 300);
    }
    showChange = () => {
    }

    flightDepChange = (value) => {
        const _this = this
        const arrValue = value.split("-")
        $.ajax({
            type: "GET",
            url: serveUrl + 'flight-info/flightInfoDropdownList?access_token=' + User.appendAccessToken().access_token,
            data: { airportNameOrCode: arrValue[0] },
            success: function (data) {
                _this.setState({
                    flightDep: data.data.id
                })
            }
        });
    }
    flightArrChange = (value) => {
        const _this = this
        const arrValue = value.split("-")
        $.ajax({
            type: "GET",
            url: serveUrl + 'flight-info/flightInfoDropdownList?access_token=' + User.appendAccessToken().access_token,
            data: { airportNameOrCode: arrValue[0] },
            success: function (data) {
                _this.setState({
                    flightArr: data.data.id
                })
            }
        });
    }

    productChange = (value) => {
        const _this = this
        $.ajax({
            type: "GET",
            url: serveUrl + 'guest-protocol/getProtocolNameDropdownList?access_token=' + User.appendAccessToken().access_token,
            data: { protocolName: value },
            success: function (data) {
                const Adata = []
                data.data.map((v, index) => {
                    Adata.push(data.data[index].value)
                })
                _this.setState({
                    productData: Adata,
                    protocolId: data.data[0].id,
                    protocolName: data.data[0].value

                })

                $.ajax({
                    type: "GET",
                    url: serveUrl + 'guest-protocol/view?access_token=' + User.appendAccessToken().access_token,
                    data: { protocolId: data.data[0].id },
                    success: function (data) {
                        _this.setState({
                            productsData: data.data.protocolProductList
                        })

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
                            bookingPersonId: data.data.id
                        })

                    }
                });
            }
        });


    }

    bookingPersonChange = (value) => {
        const _this = this
        $.ajax({
            type: "GET",
            url: serveUrl + 'guest-protocol/getAuthorizerDropdownList?access_token=' + User.appendAccessToken().access_token,
            data: { name: value, protocolId: _this.state.protocolId },
            success: function (data) {
                _this.setState({
                    bookingPersonId: data.data[0].id,
                    bookingPersonName: data.data[0].value,
                })

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
        const flightDep = _this.state.flightBlurData.FlightDep + " " + _this.state.flightBlurData.FlightDepcode
        const flightArr = _this.state.flightBlurData.FlightArr + " " + _this.state.flightBlurData.FlightArrcode
        _this.props.form.setFieldsValue({
            flightDep: flightDep,
            flightArr: flightArr,
        })
        let Fcategory = null;
        if (_this.state.flightBlurData.Fcategory == 0) {
            Fcategory = '国内'
        } else {
            Fcategory = '国际'
        }
        _this.setState({
            flightVisible: false,
            data: [{
                key: '0',
                name: {
                    editable: false,
                    value: moment(_this.state.flightBlurData.FlightDeptimePlanDate).format('hh:mm'),
                },
                planLandingTime: {
                    editable: false,
                    value: moment(_this.state.flightBlurData.FlightArrtimePlanDate).format('hh:mm'),
                },
                boardInOut: {
                    editable: false,
                    value: Fcategory,
                },
                flightPosition: {
                    editable: false,
                    value: '',
                },
                planNo: {
                    editable: false,
                    value: '',
                },
            }]
        })
    }

    productsClick = (e, text) => {
        const _this = this
        _this.setState({
            protocolProductId: e
        })
        $.ajax({
            type: "GET",
            //url: 'http://192.168.1.130:8080/get-service-type-by-protocol-product-id?access_token='+ User.appendAccessToken().access_token,
            url: serveUrl + 'guest-protocol/get-service-type-by-protocol-product-id?access_token=' + User.appendAccessToken().access_token,
            data: { protocolProductId: e },
            success: function (data) {
                _this.setState({
                    detailedData: data.data,

                })
            }
        });
    }

    selectValue = (v, e) => {
        this.state.serviceList.map((v, index) => {
            if (value.orderServiceId == v.orderServiceId) {
                v.serviceDetailId = e
            }
        })
        this.setState({
            serviceList: this.state.serviceList
        })
    }

    getValue = (v) => {
        this.setState({
            PassengerData: v
        })
    }

    customerIdChange = (value) => {
        const _this = this
        $.ajax({
            type: "GET",
            url: serveUrl + 'institution-client/queryInstitutionClientDropdownList?access_token=' + User.appendAccessToken().access_token,
            data: { name: value },
            success: function (data) {
                _this.setState({
                    customerId: data.data[0].id,
                    customerName: data.data[0].value
                })

            }
        });
    }

    serverInputChange = (value, e) => {
        this.state.serviceList.map((v, index) => {
            if (value.orderServiceId == v.orderServiceId) {
                v.serverNum = e.target.value
            }
        })
        this.setState({
            serviceList: this.state.serviceList
        })
    }

    checkedChange = (v) => {
        this.setState({
            importantCheck: !this.state.importantCheck
        })
    }
    handleReset =(e)=>{
         hashHistory.push('/serverList');
    }

    checkBoxClick = (value, e) => {
        this.state.serviceList.map((v, index) => {
            if (value.orderServiceId == v.orderServiceId) {
                if (v.checked == true) {
                    v.checked = false
                } else {
                    v.checked = true
                }
            }
        })

        this.setState({
            serviceList: this.state.serviceList
        })
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

    showModel = () => {
        this.setState({
            visible: true,
            orderId:this.props.params.id
        });
    }
    showModel1 = () => {
        // this.setState({
        //     visible1: true,
        //     orderId:this.props.params.id
        // });
        // console.log(this.props.params.id)
        window.open(`#/written/${this.props.params.id}`,"打印","top="+Math.round((window.screen.height-600)/2)+",left="+Math.round((window.screen.width-280)/2)+",height=600,width=280,toolbar=no,menubar=no,scrollbars=yes,resizable=no,location=no,status=no"); 
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


        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');

        const flightP = this.state.flightBlur.map((v, index) => {
            return (
                <p key={index} style={{ marginBottom: 15 }} onClick={this.flightChose.bind(this, index)}>{v.FlightDep}-{v.FlightArr}</p>
            )
        })
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
                </div>
            ),
        }];

        const _this = this;

         const detailedP = this.state.serviceList.map((v, index) => {
            const name = v.serviceName + '服务'
            let chird = null
            // const serviceTypeAllocationId = v.serviceTypeAllocationId
            if (v.detailedData != undefined) {
                chird = v.detailedData.map((v, index) => {
                    const values = v.protocolProductServiceId.toString() +"&"+v.name+"&"+v.serviceId
                    return  <Option   key={index} value={values}>{v.name}</Option>
                })
            }
            // let id = null;
            if (v.serviceName == 'VIP摆渡车' || v.serviceName == '远机位摆渡车') {
                return (
                    <div key={index}>
                    <div style={{paddingBottom:10,borderBottom:'1px solid #f0f0f0'}}>
                        <Checkbox onClick={this.checkBoxClick.bind(this, v)}  checked={v.checked}>{v.serviceName}</Checkbox>
                        <Select onChange={this.selectValue.bind(this)} defaultValue={v.serviceDetailName} style={{ width: 120 }}className='selectMid' >
                            {chird}
                        </Select>
                    </div>
                    </div>
                )
            } else if(v.serviceName =='停车场'){
                 return(
                    <div key={index}>
                    <div style={{paddingBottom:10,borderBottom:'1px solid #f0f0f0'}}>
                        <Checkbox onClick={this.checkBoxClick.bind(this, v)} checked={v.checked} >{v.serviceName}</Checkbox>
                        <Select onChange={this.selectValue.bind(this)} defaultValue={v.serviceDetailName} style={{ width: 120}} className='selectMid'>
                            {chird}
                        </Select>
                        <div className='inputMid'>
                            <span>车辆信息</span>
                            <input defaultValue={v.carNum}  className='serverInput '/>
                            <span>辆</span>
                            <input defaultValue={v.car}  className='carInput'  />
                        </div>
                    </div>
                    </div>
                )
            } else {
                return (
                    <div key={index}>
                    <div style={{paddingBottom:10,borderBottom:'1px solid #f0f0f0'}}>
                        <Checkbox onClick={this.checkBoxClick.bind(this, v)} checked={v.checked}>{v.serviceName}</Checkbox>
                        <Select onChange={this.selectValue.bind(this, v)} defaultValue={v.serviceDetailName} style={{ width: 120}}className='selectMid' >
                            {chird}
                        </Select>
                        <div className='inputMid'>
                            <span >服务人次</span>
                            <input onChange={this.serverInputChange.bind(this, v)} defaultValue={v.serverNum} className='serverInput'  />
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




        return (
            <div >
                <div className="breadcrumb-box">
                    <div className="top-bar"></div>
                    <div className="breadcrumb">
                        <Breadcrumb>
                            <Breadcrumb.Item>订单管理</Breadcrumb.Item>
                            <Breadcrumb.Item>服务订单修改</Breadcrumb.Item>
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
                    <FormItem className='border-Bottom' style={{ marginTop: -48, marginLeft: 430 }}>
                        <a onClick={_this.showModel1}>打印消费签单</a>
                        <a onClick={_this.showModel} className={this.state.className} style={{padding:'0 20px'}}>代办服务</a>
                        <button className="btn-small" onClick={this.handleReset} style={{ marginLeft: 26 }}>返回</button>
                    </FormItem>
                    </div>
                    <div className='title-fix'>
                        <ul className='top_tit' style={{ marginLeft: 20, marginTop: 2 }}>
                           <li onClick={this.baseClick} className={this.state.baseClass}>基本信息</li>
                            <li onClick={this.flightClick} className={this.state.flightClass}>航班信息</li>
                            <li onClick={this.serviceClick} className={this.state.serviceClass}>服务信息</li>
                        </ul>
                        <FormItem className='border-Bottom' style={{ marginTop: -48, marginLeft: 430 }}>
                            <a onClick={_this.showModel1}>打印消费签单</a>
                            <a onClick={_this.showModel} className={this.state.className} style={{padding:'0 20px'}}>代办服务</a>
                            <button className="btn-small" onClick={this.handleReset} style={{ marginLeft: 26 }}>返回</button>
                        </FormItem>
                    </div>
                    <ul className="tit" id='base' style={{marginTop:20}}>
                        <li>
                            <a href="javascript:;" className="active">基本信息</a>
                        </li>
                    </ul>

                    <div className="mid-box">
                        <div className="protocol-sort">

                            <Form horizontal style={{ position: 'relative' }}>

                                <Row>
                                    <Col span={10} style={{ marginLeft: 20 }}>
                                        <FormItem label="订单号" {...formItemLayout} disabled>
                                            {getFieldDecorator("orderId", {
                                            })(
                                                <Input style={{ width: 250 }} disabled />

                                                )}
                                        </FormItem>
                                    </Col>
                                    <Col span={10} style={{ marginLeft: 60 }}>
                                        <FormItem label="状态" {...formItemLayout}>
                                            {getFieldDecorator("orderStatus", {
                                                initialValue: this.state.orderStatus
                                            })(
                                                <Select style={{ width: 250 }} disabled>
                                                    <Option value="已使用">已使用</Option>
                                                    <Option value="服务取消">服务取消</Option>
                                                    <Option value="服务草稿">服务草稿</Option>
                                                </Select>
                                                )}
                                        </FormItem>
                                    </Col>
                                    <Col span={10} style={{ marginLeft: 20 }}>
                                        <FormItem label="客户名称" {...formItemLayout} disabled>
                                            {getFieldDecorator("customerId", {
                                                rules: [
                                                  { required: true, message: '请填写客户名称!' },
                                                ]
                                            })(
                                                <AutoComplete
                                                    dataSource={this.state.AutoClientList}
                                                    style={{ width: 250 }}
                                                    onChange={this.customerIdChange}
                                                    disabled
                                                    />
                                                )}
                                        </FormItem>
                                    </Col>
                                    <Col span={10} style={{ marginLeft: 60 }}>
                                        <FormItem label="协议信息" {...formItemLayout} >
                                            {getFieldDecorator("protocolId", {
                                            })(

                                                <AutoComplete
                                                    dataSource={this.state.productData}
                                                    style={{ width: 250 }}
                                                    onChange={this.productChange}
                                                    disabled
                                                    />
                                                )}
                                        </FormItem>
                                    </Col>
                                     <div className={this.state.createUserClass}>
                                    <Col span={9} style={{ marginLeft: 30 }}>
                                        <FormItem label="预约登记人" {...formItemLayout} >
                                            {getFieldDecorator("createUserName", {
                                                initialValue:this.state.bookingPersonName
                                            })(
                                                <AutoComplete
                                                    dataSource={this.state.bookingPersonData}
                                                    style={{ width: 250 }}
                                                    onChange={this.bookingPersonChange}
                                                    disabled
                                                    />
                                                )}
                                        </FormItem>
                                    </Col>
                                    <Col span={9} style={{ marginLeft: 107 }}>
                                        <FormItem label="预约时间" {...formItemLayout} >
                                            {getFieldDecorator("createTime", {
                                            })(
                                                <AutoComplete
                                                    dataSource={this.state.bookingPersonData}
                                                    style={{ width: 250 }}
                                                    onChange={this.bookingPersonChange}
                                                    disabled
                                                    />
                                                )}
                                        </FormItem>
                                    </Col>
                                    </div>
                                    <div className={this.state.serverUserClass}>
                                    <Col span={9} style={{ marginLeft: 30 }}>
                                        <FormItem label="服务登记人" {...formItemLayout} >
                                            {getFieldDecorator("serverCreateUserName", {
                                            })(
                                                <AutoComplete
                                                    dataSource={this.state.bookingPersonData}
                                                    style={{ width: 250 }}
                                                    onChange={this.bookingPersonChange}
                                                    disabled
                                                    />
                                                )}
                                        </FormItem>
                                    </Col>
                                    <Col span={9} style={{ marginLeft: 107 }}>
                                        <FormItem label="服务时间" {...formItemLayout} >
                                            {getFieldDecorator("serverCreateTime", {
                                            })(
                                                <AutoComplete
                                                    style={{ width: 250 }}
                                                    disabled
                                                    />
                                                )}
                                        </FormItem>
                                    </Col>
                                    </div>
                                    <div className={this.state.createUserClass}>
                                         <Col span={15} className='appointmentType' style={{ marginLeft: -14 }}>
                                            <FormItem label="预约方式" {...formItemLayout}>
                                                {getFieldDecorator("bookingWay", {
                                                    initialValue: this.state.bookingWay
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
                                    </div>
                                    <Col span={9} className='isImportant' style={{ marginLeft: -50 }}>
                                        <FormItem label="是否重要订单" {...formItemLayout}>
                                            {getFieldDecorator("isImportant", {
                                            })(
                                                <Checkbox onClick={this.checkedChange} checked={this.state.importantCheck}>重要</Checkbox>
                                                )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <ul className="tit" id='flight'>
                                    <li>
                                        <a href="javascript:;" className="active">航班信息</a>
                                    </li>
                                </ul>
                                <Row style={{ marginTop: 50 }}>
                                    <Col span={13} style={{ marginLeft: 50 }}>
                                        <FormItem label="航班日期" {...formItemLayout}>
                                            {getFieldDecorator("flightDate", {
                                            })(
                                                <DatePicker onChange={this.flightBlur} style={{width:300}}/>
                                                )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8} style={{ marginLeft: '-12%', marginTop: 5 }}>
                                        <a onClick={this.changeDate.bind(this, '0')}>今天</a>
                                        <a style={{ marginLeft: 10 }} onClick={this.changeDate.bind(this, '1')}>明天</a>
                                        <a style={{ marginLeft: 10 }} onClick={this.changeDate.bind(this, '2')}>后天</a>
                                    </Col>
                                    <Col span={13} style={{ marginLeft: 50 }}>
                                        <FormItem label="航班号" {...formItemLayout}>
                                            {getFieldDecorator("flightNo", {
                                            })(
                                                <Input style={{ width: 300 }} onBlur={this.flightBlur} />
                                                )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12} style={{ marginLeft: 50 }}>
                                        <FormItem label="航段" {...formItemLayout} style={{ marginLeft: 10 }}>
                                            {getFieldDecorator("flightDep", {
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
                                        <span style={{ marginLeft: -178 }}>~</span>
                                    </Col>

                                    <Col span={7} >
                                        <FormItem  {...formItemLayout} style={{ marginLeft: -233 }}>
                                            {getFieldDecorator("flightArr", {
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
                                <div className='secondTitle' style={{ marginLeft: 90 }}>
                                    <span></span>
                                    <a>详细信息</a>
                                </div>

                                <div className="search-result-list" style={{ marginLeft: 90, paddingRight: 90 }}>
                                    <EditableTable key={Math.random() * Math.random()} data={this.state.data} />
                                </div>
                                <ul className="tit" style={{ marginTop: '5%' }} id='service'>
                                    <li>
                                        <a href="javascript:;" className="active">服务信息</a>
                                    </li>
                                </ul>
                                <div className='secondTitle' style={{ marginLeft: 90, marginTop: 40, paddingBottom: 40 }}>
                                    <span></span>
                                    <a>旅客信息</a>
                                </div>
                                <div className="search-result-list" style={{ marginLeft: 90, paddingRight: 90 }}>
                                    <Table pagination={false} dataSource={this.state.passengerList} columns={columns} />
                                </div>
                                <div className='secondTitle' style={{ marginLeft: 90, marginTop: 40, paddingBottom: 40 }}>
                                    <span></span>
                                    <a><span className='ruleRed'>*</span> 该协议可预约以下产品，请选择</a>
                                </div>
                                <div style={{ marginLeft: 90, paddingRight: 90 }}>
                                    <button className='btn' style={{ marginLeft: 30 }}>{this.state.productName}</button>
                                </div>
                                <div className='secondTitle' style={{ marginLeft: 90, marginTop: 40, paddingBottom: 40 }}>
                                    <span></span>
                                    <a>详细服务</a>
                                </div>

                                <div style={{ marginLeft: 90, paddingRight: 90 }}>
                                            {detailedP}
                                </div>
                                <div className='secondTitle' style={{ marginLeft: 90, marginTop: 40, paddingBottom: 40 }}>
                                    <span></span>
                                    <a>附加服务</a>
                                </div>

                                <div style={{ marginLeft: 90, paddingRight: 90 }}>
                                        <div>
                                        <div style={{paddingBottom:10,borderBottom:'1px solid #f0f0f0'}}>
                                            <Checkbox onClick={this.printCheck} checked={this.state.printCheck}>代办登机牌</Checkbox>
                                            <Input onChange={this.printCheckRemark} defaultValue={this.state.printCheckRemark} value={this.state.serviceAdd} style={{ width: 300, marginLeft: 120 }} />
                                            <a className='word-blue' style={{ marginLeft: 10 }} onClick={this.addHtml.bind(this, "靠窗")}>靠窗</a>
                                            <a className='word-blue' style={{ marginLeft: 10 }} onClick={this.addHtml.bind(this, "靠走廊")}>靠走廊</a>
                                            <a className='word-blue' style={{ marginLeft: 10 }} onClick={this.addHtml.bind(this, "前排")}>前排</a>
                                            <a className='word-blue' style={{ marginLeft: 10 }} onClick={this.addHtml.bind(this, "后排")}>后排</a>
                                            <a className='word-blue' style={{ marginLeft: 10 }} onClick={this.addHtml.bind(this, "不要安全门")}>不要安全门</a>
                                            </div>
                                            <div  style={{paddingTop:10,paddingBottom:10,borderBottom:'1px solid #f0f0f0'}}>
                                            <Checkbox onClick={this.consign} checked={this.state.consign}>代办托运</Checkbox>
                                            <Input onChange={this.consignRemark} defaultValue={this.state.consignRemark} placeholder="请输入托运要求" style={{ width: 300, marginLeft: 136 }} />
                                                </div>
                                                <div  style={{paddingTop:10,paddingBottom:10,borderBottom:'1px solid #f0f0f0'}}>
                                            <Checkbox onClick={this.securityCheck} checked={this.state.securityCheck}>安检礼遇</Checkbox>
                                            <Input onChange={this.securityCheckRemark} value={this.state.securityCheckRemark} defaultValue={this.state.securityCheckRemark}  style={{width:300,marginLeft:136}} />
                                            </div>
                                            <div  style={{paddingTop:10,paddingBottom:10}}>
                                            <span>其他服务</span>
                                            <Input onChange={this.otherRemark} value={this.state.otherRemark} style={{width:300,marginLeft:175}} />
                                            </div>
                                            </div>
                                </div>
                            </Form>
                            <Modal title="请选择航段" visible={this.state.flightVisible} onCancel={this.flightHandleCancel}>
                                {flightP}
                            </Modal>
                        </div>
                    </div>
                     <div id="detail-msg">
                        <Modal title="详细信息"
                            key={Math.random() * Math.random()}
                            visible={this.state.visible}
                            onCancel={this.handleCancel}
                            >
                            <div>
                                <LoungeFlightDetail orderId={this.state.orderId} />
                            </div>
                        </Modal>
                    </div>
                    {
                        // <div id="detail-msg">
                        //     <Modal title="丽江百事特服务消费单"
                        //         key={Math.random() * Math.random()}
                        //         visible={this.state.visible1}
                        //         onCancel={this.handleCancel1}
                        //         >
                        //         <div>
                        //             <LoungeFlightDetail1 orderId={this.state.orderId} />
                        //         </div>
                        //     </Modal>
                        // </div>
                    }   
                    
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
        )
    }
}
AddProtocol = Form.create()(AddProtocol);

export default AddProtocol;