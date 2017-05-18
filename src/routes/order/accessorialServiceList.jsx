import './appointment.less'
import React from 'react';
import { hashHistory } from 'react-router';
import { Breadcrumb, Form, Row, Col, Input, Button, Icon, Select, Popconfirm, message, Table, Checkbox, AutoComplete, DatePicker, Modal } from 'antd';
import { Link } from 'react-router';
import $ from 'jquery';
import moment from 'moment';
import { serveUrl, User, cacheData } from '../../utils/config';

import LoungeFlightDetail from './accessorialServiceDetail';
import LoungeFlightDetail1 from './Print';

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;

class ServiceList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible1:false,
            productTypeData: [],
            serveTypeData: [],
            orderListDate: [],
            partListDateLength: null,
            orderListPage: 1,
            orderListRows: 10,
            selectedRowKeys: [],
            searchValue: '',
            menuListDate: [],
            menuIds: [],
            filteredInfo: null,
            sortedInfo: null,
            passwordData: [],
            productList: [],
            importPrduct: false,
            appoimtPrduct: false,
            appoimtClassName: 'btn-product',
            importClassName: 'btn-product',
            queryIsInOrOut: null,
            queryOrderStatus: null,
            queryProductId: null,
            visible: false,
            flightNoList: [],
            orderId:null,
            queryIsImportant:null,
        }
    }

    componentWillMount() {
         if(User.isLogin()){
        } else{
            hashHistory.push('/login');
        }
        this.getInitList(this.state.orderListPage, this.state.orderListRows)
        const _this = this
        $.ajax({
            type: "GET",
            url: serveUrl + 'guest-order/getIdentityCardDropdownList?access_token=' + User.appendAccessToken().access_token,
            //url:'http://192.168.1.147:8887/getIdentityCardDropdownList?access_token='+User.appendAccessToken().access_token,
            success: function (data) {
                const Adata = [];
                data.data.map((v, index) => {
                    Adata.push(data.data[index].value)
                })
                _this.setState({
                    passwordData: Adata,
                })

            }
        });
        //航班号（模糊匹配）
        $.ajax({
            type: "GET",
            url: serveUrl + "flight-info/flightNoDropdownList",
            data: { access_token: User.appendAccessToken().access_token, flightNo: '' },
            success: function (data) {
                if (data.status == 200) {
                    const Adata = [];
                    _this.setState({
                        flightNoList: []
                    })
                    data.data.map((data) => {
                        Adata.push(data.value);
                    })
                    _this.setState({
                        flightNoList: Adata
                    })
                }
            }
        });
    }
    componentDidMount = () => {
        $(".ant-breadcrumb-separator").html(">");
        $(".ant-breadcrumb-separator").css({ color: '#333' });
        $(".ant-col-5").removeClass('ant-col-5').addClass("ant-col-8");
        $(".ant-col-19").removeClass('ant-col-19').addClass("ant-col-16");

    }

    handleChange = (pagination, filters, sorter) => {
        this.setState({
            filteredInfo: filters,
            sortedInfo: sorter,
        });
    }
    clearFilters = () => {
        this.setState({ filteredInfo: null });
    }
    clearAll = () => {
        this.setState({
            filteredInfo: null,
            sortedInfo: null,
        });
    }
    setAgeSort = () => {
        this.setState({
            sortedInfo: {
                order: 'descend',
                columnKey: 'age',
            },
        });
    }

    handleSubmit = (e) => {
        const _this = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const formValue = this.props.form.getFieldsValue()
                const changeDate = {
                    queryIsImportant: _this.state.queryIsImportant,
                    queryBookingOneDayBefore:_this.state.queryBookingOneDayBefore
                }
                this.state.orderListPage = 1
                this.getAnyList(this.state.orderListPage, this.state.orderListRows,formValue,changeDate);
            }
        });

    }

    getInitList(page, rows) {
        const data = [];
        const _this = this;

        $.ajax({
            type: "GET",
            url: serveUrl + 'guest-order/list?access_token=' + User.appendAccessToken().access_token,
            //url:'http://192.168.0.104:8887/list?access_token='+User.appendAccessToken().access_token,
            data: {
                page: page,
                rows: rows,
                queryOrderType:-1,
                queryAttServerOrderList:1,
                queryFlightDate:moment().format('YYYY-MM-DD')
            },
            success: function (data) {
                data.data.rows.map((v, index) => {
                    v.key = v.orderId
                })
                _this.setState({
                    orderListDate: data.data.rows,
                    partListDateLength: data.data.total
                })
            }
        });
    }

    passwordChange = (value) => {
        const _this = this
        $.ajax({
            type: "GET",
            url: serveUrl + 'guest-order/getIdentityCardDropdownList?access_token=' + User.appendAccessToken().access_token,
            data: { identityCard: value },
            success: function (data) {
                const Adata = [];
                data.data.map((v, index) => {
                    Adata.push(data.data[index].value)
                })
                _this.setState({
                    passwordData: Adata,
                })
            }
        });
    }

  
    changeDate = (e, text) => {
        let date = new Date()
        const day = parseInt(e * (24 * 60 * 60) * 1000)
        this.props.form.setFieldsValue({
            flightDate: moment(date.getTime() + day),
        })
    }
    importPrductClick = () => {
        const _this = this;
        if (this.state.importPrduct == false) {
            let appoimt = 'bg-red'
            this.setState({
                importPrduct: true,
                importClassName: appoimt,
                queryIsImportant: 0
            })
            const changeDate = {
                queryIsImportant: 0,
                queryBookingOneDayBefore:_this.state.queryBookingOneDayBefore
            }
             const formValue = this.props.form.getFieldsValue()
            this.getAnyList(this.state.orderListPage, this.state.orderListRows,formValue,changeDate);
        } else {
            let appoimt = 'btn-product'
            this.setState({
                importPrduct: false,
                importClassName: appoimt,
                queryIsImportant:""
            })
            const changeDate = {
                queryIsImportant: "",
                queryBookingOneDayBefore:_this.state.queryBookingOneDayBefore
            }
            const formValue = this.props.form.getFieldsValue()
            this.getAnyList(this.state.orderListPage, this.state.orderListRows,formValue,changeDate);
        }
    }

    appoimtPrductClick = () => {
        const _this = this
        if (this.state.appoimtPrduct == false) {
            let appoimt = 'bg-yellow'
            this.setState({
                appoimtPrduct: true,
                appoimtClassName: appoimt,
                queryBookingOneDayBefore: 1
            })
            const formValue = this.props.form.getFieldsValue()
            this.getAnyList(this.state.orderListPage, this.state.orderListRows,formValue);

        } else {
            let appoimt = 'btn-product'
            this.setState({
                appoimtPrduct: false,
                appoimtClassName: appoimt,
                queryBookingOneDayBefore: 0
            })
            const formValue = this.props.form.getFieldsValue()
            this.getAnyList(this.state.orderListPage, this.state.orderListRows,formValue);
        }
    }
    handleTableChange = (page, filters, sorter) => {
        let queryStatus = '';
        if(filters.queryStatus != null){
        if(filters.queryStatus.length >= 0){
                filters.queryStatus.map((v,index)=>{
                    if(index == 0){
                        queryStatus = v
                    }else{
                        queryStatus = queryStatus +v
                    }
                })
            }else{
                 queryStatus = ''
            }
        }
        let queryProductId = '';
         if(filters.queryProductId != null){
        if(filters.queryProductId.length >= 0){
            filters.queryProductId.map((v,index)=>{
                if(index == 0){
                    queryProductId = "'"+v+"'"
                }else{
                    queryProductId = queryProductId +','+"'"+v+"'"
                }
            })
        }else{
                 queryProductId = ''
            }
         }
        let queryIsInOrOut = '';
         if(filters.queryIsInOrOut != null){
        if(filters.queryIsInOrOut.length >= 0){
            filters.queryIsInOrOut.map((v,index)=>{
                if(index == 0){
                    queryIsInOrOut = "'"+v+"'"
                }else{
                    queryIsInOrOut = queryIsInOrOut +','+"'"+v+"'"
                }
            })
        }else{
                 queryIsInOrOut = ''
            }
         }
       
        let order = null
        if(sorter.field == 'start'){
            if(sorter.order == 'ascend'){
                order=0
            }else{
                order=1
            }
            
        }else if(sorter.field == 'down'){
            if(sorter.order == 'ascend'){
                order=2
            }else{
                order=3
            }
        }
        this.setState({
            queryIsInOrOut:queryIsInOrOut,
            queryOrderStatus:queryStatus,
            queryProductId:queryProductId,
            queryOrderBy:order
        })
        const changeDate = {
            queryIsInOrOut:queryIsInOrOut,
            queryOrderStatus:queryStatus,
            queryProductId:queryProductId,
            queryOrderBy:order,
            queryBookingOneDayBefore: this.state.queryBookingOneDayBefore,
            queryIsImportant:this.state.queryIsImportant
        }
        
        const formValue = this.props.form.getFieldsValue();
        if(this.state.orderListPage == 1){
            this.getAnyList(this.state.orderListPage, this.state.orderListRows,formValue,changeDate);
        }
    }
    getAnyList = (page, rows, formValue,changeDate) => {
        const _this = this
        $.ajax({
            type: "GET",
            //url: serveUrl+"list",
            url: serveUrl + 'guest-order/list?access_token=' + User.appendAccessToken().access_token,
            //url:"http://192.168.0.104:8887/list?access_token="+User.appendAccessToken().access_token,
            data: {
                page: page,
                rows: rows,
                queryOrderType:-1,
                queryAttServerOrderList:1,
                queryIsInOrOut:changeDate==undefined ? _this.state.queryIsInOrOut:changeDate.queryIsInOrOut,
                queryAgentPerson:changeDate==undefined ? _this.state.queryOrderStatus:changeDate.queryOrderStatus,
                queryProductId:changeDate==undefined ? _this.state.queryProductId:changeDate.queryProductId,
                queryOrderBy:changeDate==undefined ? _this.state.queryOrderBy:changeDate.queryOrderBy,
                queryIsImportant:changeDate.queryIsImportant,
                queryBookingOneDayBefore:changeDate.queryBookingOneDayBefore,
                queryCustomerInfo:formValue.customerInfo == null ? '':formValue.customerInfo,
                queryFlightNo:formValue.flightNo == null ? '':formValue.flightNo,
                queryIdentityCard:formValue.identityCard == null ? '':formValue.identityCard,
                queryPassengerName:formValue.passengerName == null ? '':formValue.passengerName,
                queryFlightDate:formValue.flightDate == null?'':moment(formValue.flightDate._d).format('YYYY-MM-DD'),
                queryOrderNo:formValue.queryOrderNo == null ? '':formValue.queryOrderNo
            },
            success: function (data) {
                data.data.rows.map((v, index) => {
                    v.key = v.orderId
                })
                _this.setState({
                    orderListDate: data.data.rows,
                    partListDateLength: data.data.total
                })
            }
        });
    }

    handleOk = () => {
        this.setState({
            visible: false,
        });
    }
    handleCancel = () => {
        this.setState({
            visible: false,
        });
        $('.ant-pagination').show();
        const formValue = this.props.form.getFieldsValue()
        const changeDate = {
            queryIsImportant: this.state.queryIsImportant,
            queryBookingOneDayBefore:this.state.queryBookingOneDayBefore
        }
        this.state.orderListPage = 1
        this.getAnyList(this.state.orderListPage, this.state.orderListRows,formValue,changeDate);
      
    }

    flightNoListChange = (value) => {
        $.ajax({
            type: "GET",
            url: serveUrl + "flight-info/flightNoDropdownList",
            data: { access_token: User.appendAccessToken().access_token, flightNo: value },
            success: function (data) {
                if (data.status == 200) {
                    const Adata = [];
                    _this.setState({
                        flightNoList: []
                    })
                    data.data.map((data) => {
                        Adata.push(data.value);
                    })
                    _this.setState({
                        flightNoList: Adata
                    })
                }
            }
        });
    }
    //更新弹框
    showModel = (_this,record) => {
        this.setState({
            visible: true,
            orderId:_this.orderId
        });
    }
    //打印弹框
    showModel1 = (_this,record) => {
        // this.setState({
        //     visible1: true,
        //     orderId:_this.orderId
        // });
        // console.log(_this.orderId);

        window.open(`#/Print/${_this.orderId}`,"打印","top="+Math.round((window.screen.height-1000)/2)+",left="+Math.round((window.screen.width-280)/2)+",height=1000,width=280,toolbar=no,menubar=no,scrollbars=yes,resizable=no,location=no,status=no"); 
    }
    handleCancel1 = () => {
        this.setState({
            visible1: false,
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };
        let { sortedInfo, filteredInfo } = this.state;
        sortedInfo = sortedInfo || {};
        filteredInfo = filteredInfo || {};
        const _this = this;
        const productData = []
        this.state.productList.map((v, index) => {
            productData.push({
                text: v.productNo,
                value: v.productId
            })
        })
        const columns = [{
            title: '航班日期',
            width: '10%',
            dataIndex: 'employee_id',
            render(text, record) {
                let importClass = ''
                let isAppoinClass = ''
                if (record.isImportant == 0) {
                    importClass = 'isImport'
                }else{
                    importClass = 'isImportno'
                }
                var d = new Date;
                var today = new Date(d.getFullYear (), d.getMonth (), d.getDate ());
                var reg = /\d+/g;
                var temp = record.createTime.match (reg);
                var foday = new Date(temp[0], parseInt (temp[1]) - 1, temp[2]);
                if (foday < today) {
                    isAppoinClass = 'isAppoin'
                } else {
                    isAppoinClass = 'isAppoinno'
                }
                return (
                    <div className="order">
                        <p>{moment(record.flight.flightDate).format('MM-DD')}</p>
                        <p><span className={importClass}>重要</span><span style={{ marginLeft: 5 }} className={isAppoinClass}>提前</span></p>
                    </div>
                )
            }
        }, {
            title: '航班号',
            width: '10%',
            dataIndex: 'name',
            render(text, record) {
                return (
                    <div className="order">
                        <p>{record.flight.flightNo}</p>
                        <p>{record.flight.flightDep}-{record.flight.flightArr}</p>
                    </div>
                )
            }
        }, {
            title: '进出港',
            width: '8%',
            dataIndex: 'queryIsInOrOut',
            filters: [
                { text: '出港', value: '0' },
                { text: '进港', value: '1' },
            ],
            render(text, record) {
                return (
                    <div className="order">{record.flight.isInOrOut == 0 ? '出港' : '进港'}</div>
                )
            }
        }, {
            title: '起飞',
            width: '6%',
            dataIndex: 'start',
            sorter: (a, b) => a.address,
            render(text, record) {
                return (
                    <div className="order">{moment(record.flight.flightDeptimePlanDate).format('HH:mm')}</div>
                )
            }
        }, {
            title: '降落',
            width: '6%',
            dataIndex: 'down',
            sorter: (a, b) => a.address,
            render(text, record) {
                return (
                    <div className="order">{moment(record.flight.flightArrtimePlanDate).format('HH:mm')}</div>
                )
            }
        }, {
            title: '旅客信息',
            width: '8%',
            dataIndex: 'kehuxin',
            render(text, record) {
                let str = ''
                record.passengerList.map((v, index) => {
                    if (index == 0) {
                        str = v.name
                    } else {
                        str = str + ',' + v.name
                    }

                })
                return (
                    <div className="order">{str}</div>
                )
            }
        },{
            title: '订单状态',
            width: '8%',
            dataIndex: 'queryOrderStatus',
            render(text, record) {

                return (
                    <div className="order">
                        <p>{record.orderStatus}</p>
                        <p>{record.orderNo}</p>
                    </div>
                )
            }
        },{
            title: '代办登机牌',
            width: '9%',
            dataIndex: 'printCheck',
            render(text, record) {
                let status = null
                if(record.printCheck == 0){
                    status = false
                }else{
                    status = true
                }
                return (
                    <Checkbox className="order" checked={status} style={{marginLeft:40}}></Checkbox>
                )
            }
        }, {
            title: '代办托运',
            width: '8%',
            dataIndex: 'consign',
            render(text, record) {
                let status = null
                if(record.consign == 0){
                    status = false
                }else{
                    status = true
                }
                return (
                    <Checkbox className="order" checked={status}  style={{marginLeft:40}}></Checkbox>
                )
            }
        }, {
            title: '安检礼遇',
            width: '8%',
            dataIndex: 'securityCheck',
            render(text, record) {
                let status = null
                if(record.securityCheck == 0){
                    status = false
                }else{
                    status = true
                }
                return (
                    <Checkbox className="order" checked={status}  style={{marginLeft:40}}></Checkbox>
                )
            }
        }, {
            title: '状态',
            width: '8%',
            dataIndex: 'queryStatus',
            filters: [
                { text: '未安排', value: '0' },
                { text: '已安排', value: '1' },
                { text: '已完成', value: '2' },
            ],
            render(text, record) {
                   let text1 = ''
                   let className = ''
                if(record.agentComplete == 1){
                    text1 = '已完成'
                    className = 'order word-green'
                }else{
                   if(record.agentPerson == null){
                        text1 = '未安排'
                         className = 'order word-yellow'
                    }else{
                        text1 = '已安排'
                         className = 'order word-red'
                    }
                }
                
                let pClass =null;
                if(record.agentPersonName == null){
                    pClass = 'displayNone'
                }
                
                return (
                    <div className={className}>
                         <p >{text1}</p>
                         <p className={pClass}>({record.agentPersonName})</p>
                    </div>
                )
            }
        }, {
            title: '操作',
            width: '10%',
            render(text, record) {
                return (
                    <div className="order">
                        <a className='word-blue' onClick={_this.showModel.bind(_this,record)} style={{ marginRight: 10 }}>更新</a>
                        <a className='word-blue' onClick={_this.showModel1.bind(_this,record)}>打印</a>
                    </div>
                )
            }
        }]


        const pagination = {
            
            total: _this.state.partListDateLength,
            onChange(current) {
                  const changeDate = {
                    queryIsInOrOut:undefined,
                    queryOrderStatus:undefined,
                    queryProductId:undefined,
                    queryOrderBy:undefined,
                    queryBookingOneDayBefore: _this.state.queryBookingOneDayBefore,
                    queryIsImportant:_this.state.queryIsImportant
                }
                const formValue = _this.props.form.getFieldsValue();
                 _this.state.orderListPage = current
                if(current !=1){
                      _this.getAnyList(current, _this.state.orderListRows,formValue,changeDate);
                }
            }
        };
       


        return (
            <div>
                <div className="breadcrumb-box">
                    <div className="top-bar"></div>
                    <div className="breadcrumb">
                        <Breadcrumb>
                            <Breadcrumb.Item>订单管理</Breadcrumb.Item>
                            <Breadcrumb.Item>附加列表</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>

                <div className="box">
                    <ul className="tit">
                        <li>
                            <a href="javascript:;" className="active">附加列表</a>
                        </li>

                    </ul>

                    <Form horizontal onSubmit={this.handleSubmit} style={{ marginTop: 44 }}>
                        <Row>
                            <Col span={8}>
                                <div style={{display:'inline-block'}}>
                                    <FormItem label="客户/协议信息" {...formItemLayout} hasFeedback>
                                        {getFieldDecorator('customerInfo', {
                                        })(
                                            <Input onChange={this.customerInfoData} placeholder="客户/协议信息" style={{ width: 158 }} className='required' />

                                            )}
                                    </FormItem>
                                </div>
                                <div style={{display:'inline-block',verticalAlign:'top',marginTop:5,marginLeft:50}}>
                                    <a href="javascript:;" onClick={this.clickAllDate} style={{color:'#4778c7'}}></a>&nbsp;
                                    <a href="javascript:;" onClick={this.clickToday} style={{marginTop:'',color:'#4778c7'}}></a>&nbsp;
                                    <a href="javascript:;" onClick={this.clickTomorrow} style={{color:'#4778c7'}}></a>
                                </div>
                            </Col>
                            <Col span={8}>
                                <div style={{display:'inline-block'}}>
                                    <FormItem label="旅客姓名" {...formItemLayout} hasFeedback   >
                                        {getFieldDecorator('passengerName', {
                                        })(
                                            <Input onChange={this.passengerNameData} style={{ width: 158 }} className='required' />

                                            )}
                                    </FormItem>
                                </div>
                                <div style={{display:'inline-block',verticalAlign:'top',marginTop:5,marginLeft:50}}>
                                    <a href="javascript:;" onClick={this.clickAllDate} style={{color:'#4778c7'}}></a>&nbsp;
                                    <a href="javascript:;" onClick={this.clickToday} style={{marginTop:'',color:'#4778c7'}}></a>&nbsp;
                                    <a href="javascript:;" onClick={this.clickTomorrow} style={{color:'#4778c7'}}></a>
                                </div>
                            </Col>
                            <Col span={8}>
                                <div style={{display:'inline-block'}}>
                                    <FormItem labelInValue label="旅客身份证" {...formItemLayout}  >
                                        {getFieldDecorator('identityCard', {
                                        })(
                                            <AutoComplete
                                                dataSource={this.state.passwordData}
                                                style={{ width: 158 }}
                                                onChange={this.identityCardChange}
                                                />
                                            )}
                                    </FormItem>
                                </div>
                                <div style={{display:'inline-block',verticalAlign:'top',marginTop:5,marginLeft:50}}>
                                    <a href="javascript:;" onClick={this.clickAllDate} style={{color:'#4778c7'}}></a>&nbsp;
                                    <a href="javascript:;" onClick={this.clickToday} style={{marginTop:'',color:'#4778c7'}}></a>&nbsp;
                                    <a href="javascript:;" onClick={this.clickTomorrow} style={{color:'#4778c7'}}></a>
                                </div>
                            </Col>

                            <Col span={8} style={{marginLeft:16}}>
                                <div className="flight-date" style={{display:'inline-block'}}>
                                    <FormItem labelInValue label="航班日期" {...formItemLayout} >
                                        {getFieldDecorator('flightDate', {
                                            initialValue: moment()
                                        })(
                                            <DatePicker style={{ width: 158 }} onChange={this.flightData} />
                                            )}
                                    </FormItem>
                                </div>
                                <div style={{display:'inline-block',verticalAlign:'top',marginTop:5,marginLeft:30}}>
                                    <a  onClick={this.changeDate.bind(this, '0')} style={{color:'#4778c7'}}>今天</a>&nbsp;
                                    <a  onClick={this.changeDate.bind(this, '1')} style={{marginTop:'',color:'#4778c7'}}>明天</a>&nbsp;
                                    <a  onClick={this.changeDate.bind(this, '2')} style={{color:'#4778c7'}}>后天</a>
                                </div>
                            </Col>
                            <Col span={8} style={{marginLeft:-10}}>
                                <div style={{display:'inline-block'}}>
                                    <FormItem labelInValue label="航班号" {...formItemLayout}>
                                        {getFieldDecorator('flightNo', {
                                        })(
                                            <AutoComplete
                                                dataSource={this.state.flightNoList}
                                                style={{ width: 158 }}
                                                onChange={this.flightNoListChange}
                                                />
                                            )}
                                    </FormItem>
                                </div>
                                    <a href="javascript:;" onClick={this.clickAllDate} style={{color:'#4778c7'}}></a>&nbsp;
                                    <a href="javascript:;" onClick={this.clickToday} style={{marginTop:'',color:'#4778c7'}}></a>&nbsp;
                                    <a href="javascript:;" onClick={this.clickTomorrow} style={{color:'#4778c7'}}></a>
                            </Col>
                            <Col span={8} style={{marginLeft:-10}}>
                                <div style={{display:'inline-block'}} className="order-no">
                                    <FormItem labelInValue label="订单号" {...formItemLayout}>
                                        {getFieldDecorator('queryOrderNo', {
                                        })(
                                            <Input  style={{ width: 158 }}/>
                                            )}
                                    </FormItem>
                                </div>
                                    <a href="javascript:;" onClick={this.clickAllDate} style={{color:'#4778c7'}}></a>&nbsp;
                                    <a href="javascript:;" onClick={this.clickToday} style={{marginTop:'',color:'#4778c7'}}></a>&nbsp;
                                    <a href="javascript:;" onClick={this.clickTomorrow} style={{color:'#4778c7'}}></a>
                            </Col>

                        </Row>
                    </Form>
                   <div className="table-operations" >
                        <Row>
                            <Col span={12}>   
                               <div style={{float:'left',paddingRight:30}}>
                                    <span className='bg-red'></span>
                                    <span style={{marginLeft:20}}>重要客户</span>
                                    <Checkbox onClick={this.importPrductClick} style={{marginLeft:10,marginTop:-10}}></Checkbox>
                                </div>
                            </Col>
                            <Col span={6} offset={5}>
                                <FormItem >
                                    <button className='btn-small'  onClick={this.handleSubmit}>查询</button>
                                </FormItem>
                            </Col>
                        </Row>
                    </div>
                    <div className="search-result-list" >
                        <Table style={{ marginTop: 20 }} pagination={pagination} onChange={this.handleTableChange} columns={columns} dataSource={this.state.orderListDate} className=" serveTable" />
                        <p style={{marginTop:20}}>共搜索到{this.state.partListDateLength}条数据</p>
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
                <div id="detail-msg">
                    <Modal title="丽江百事特服务消费单"
                        key={Math.random() * Math.random()}
                        visible={this.state.visible1}
                        onCancel={this.handleCancel1}
                        >
                        <div>
                            <LoungeFlightDetail1 orderId={this.state.orderId} />
                        </div>
                    </Modal>
                </div>
            </div>
        )
    }
}

ServiceList = Form.create()(ServiceList);

export default ServiceList;