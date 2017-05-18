import './appointment.less'
import React from 'react';
import { hashHistory } from 'react-router';
import { Breadcrumb, Form, Row, Col, Input, Button, Icon, Select, Popconfirm, message, Table, Checkbox, AutoComplete, DatePicker,Modal } from 'antd';
import { Link } from 'react-router';
import $ from 'jquery';
import moment from 'moment';
import { serveUrl, User, cacheData } from '../../utils/config';
import DeleteDialog from '../DeleteDialog';//引入删除弹框
const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const msg = '确认要取消吗?'

class ServiceList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            record:null,
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
            queryIsInOrOut:null,
            queryOrderStatus:null,
            queryProductId:"",
            queryOrderBy:null,
            flightNoList:[],
            queryIsImportant:null,
            queryBookingOneDayBefore:null,

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
             //url: serveUrl+'guest-order/getIdentityCardDropdownList?access_token='+ User.appendAccessToken().access_token,
             url:serveUrl+'guest-order/getIdentityCardDropdownList?access_token='+User.appendAccessToken().access_token,
             success: function(data){
                  const Adata = [];
                 data.data.map((v,index)=>{
                     Adata.push(data.data[index].value)
                 })
                 _this.setState({
                     passwordData:Adata,
                 })

            }
         });

        $.ajax({
            type: "GET",
            //url: serveUrl+"list",
            url: serveUrl + 'guest-product/list?access_token=' + User.appendAccessToken().access_token,
            data: {
                noPage: true,
            },
            success: function (data) {
                _this.setState({
                    productList: data.data.rows,
                })
            }
        });

        //航班号（模糊匹配）
        $.ajax({
            type: "GET",
            url: serveUrl + "flight-info/flightNoDropdownList",
            data: { access_token: User.appendAccessToken().access_token,flightNo:'' },
            success: function(data) {
                if (data.status == 200) {
                    data.data.map(k=>{
                        k.key = k.id + k.value;
                    });
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
        $(".ant-col-5").removeClass('ant-col-5').addClass("ant-col-10");
        $(".ant-col-19").removeClass('ant-col-19').addClass("ant-col-14");
        $(".ant-table-tbody tr td").css({borderBottom:'none'});
        $("table").css({border:'1px solid #f0f0f0'});
        $(".order-no .ant-col-10").removeClass("ant-col-10").addClass("ant-col-12");
        $(".order-no .ant-col-14").removeClass("ant-col-14").addClass("ant-col-12");
        // $(".flight-date .ant-col-8").removeClass("ant-col-8").addClass("ant-col-12");
        // $(".flight-date .ant-col-16").removeClass("ant-col-16").addClass("ant-col-12");
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
    handleReset = (e) => {
        hashHistory.push('/addAppointment');
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
            //url: serveUrl+"list",
            url: serveUrl+'guest-order/list?access_token=' + User.appendAccessToken().access_token,
            //url:"http://192.168.1.199:8887/list?access_token="+User.appendAccessToken().access_token,
            data: {
                page: page,
                rows: rows,
                queryOrderType:0,
                queryFlightDate:moment().format("YYYY-MM-DD")
            },
            success: function (data) {
                data.data.rows.map((v, index) => {
                    v.key = v.orderId
                    
                })

                _this.setState({
                    orderListDate: data.data.rows,
                    partListDateLength: data.data.total,
                })
            }
        });
    }

    passwordChange = (value) => {
        const _this = this
        $.ajax({
            type: "GET",
            url: serveUrl+'guest-order/getIdentityCardDropdownList?access_token=' + User.appendAccessToken().access_token,
            //url: serveUrl+'guest-order/queryInstitutionClientDropdownList?access_token='+ User.appendAccessToken().access_token,
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

    removeOrder = (_this, text) => {
        const __this = this
        const formData = {
            data: [_this.orderId]
        }
        $.ajax({
            type: "POST",
            contentType: 'application/json;charset=utf-8',
            url: serveUrl+'guest-order/delete?access_token=' + User.appendAccessToken().access_token,
            data: JSON.stringify(formData),
            success: function (data) {
                if (data.status == 200) {
                    if (data.data != null) {
                        message.error(data.data);
                    } else {
                        message.success(data.msg);
                    }
                } else {
                    message.error(data.msg);
                }
                const formValue = __this.props.form.getFieldsValue();
                __this.getAnyList(__this.state.orderListPage, __this.state.orderListRows,formValue)
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
                queryIsImportant: ""
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
            const changeDate = {
                queryBookingOneDayBefore: 1,
                queryIsImportant:_this.state.queryIsImportant
            }
            this.getAnyList(this.state.orderListPage, this.state.orderListRows,formValue,changeDate);

        } else {
            let appoimt = 'btn-product'
            this.setState({
                appoimtPrduct: false,
                appoimtClassName: appoimt,
                queryBookingOneDayBefore: ""
            })
            const formValue = this.props.form.getFieldsValue()
            const changeDate = {
                queryBookingOneDayBefore: "",
                queryIsImportant:_this.state.queryIsImportant
            }
            this.getAnyList(this.state.orderListPage, this.state.orderListRows,formValue,changeDate);
        }
    }
    handleTableChange = (page,filters, sorter) => {
        let queryOrderStatus = '';
        if(filters.queryOrderStatus != null){
        if(filters.queryOrderStatus.length >= 0){
            filters.queryOrderStatus.map((v,index)=>{
                if(index == 0){
                    queryOrderStatus = "'"+v+"'"
                }else{
                    queryOrderStatus = queryOrderStatus +','+"'"+v+"'"
                }
            })
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
            queryOrderStatus:queryOrderStatus,
            queryProductId:queryProductId,
            queryOrderBy:order
        })
        const changeDate = {
            queryIsInOrOut:queryIsInOrOut,
            queryOrderStatus:queryOrderStatus,
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
    getAnyList = (page,rows,formValue,changeDate) =>{
        const _this = this

        $.ajax({
            type: "GET",
            //url: serveUrl+"list",
             url: serveUrl+'guest-order/list?access_token=' + User.appendAccessToken().access_token,
            //url:"http://192.168.1.199:8887/list?access_token="+User.appendAccessToken().access_token,
            data: {
                page: page,
                rows: rows,
                queryOrderType:0,
                queryIsInOrOut:changeDate.queryIsInOrOut==undefined ? _this.state.queryIsInOrOut:changeDate.queryIsInOrOut,
                queryOrderStatus:changeDate.queryOrderStatus==undefined ? _this.state.queryOrderStatus:changeDate.queryOrderStatus,
                queryProductId:changeDate.queryProductId==undefined ? _this.state.queryProductId:changeDate.queryProductId,
                queryOrderBy:changeDate.queryOrderBy==undefined ? _this.state.queryOrderBy:changeDate.queryOrderBy,
                queryIsImportant:changeDate.queryIsImportant,
                queryBookingOneDayBefore:changeDate.queryBookingOneDayBefore,

                queryCustomerInfo:formValue.customerInfo == undefined ? '':formValue.customerInfo,
                queryFlightNo:formValue.flightNo == null ? '':formValue.flightNo,
                queryIdentityCard:formValue.identityCard == null ? '':formValue.identityCard,
                queryPassengerName:formValue.passengerName == null ? '':formValue.passengerName,
                queryFlightDate:formValue.flightDate == undefined?'':moment(formValue.flightDate._d).format('YYYY-MM-DD'),
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

    flightNoListChange =(value)=>{
         $.ajax({
            type: "GET",
            url: serveUrl + "flight-info/flightNoDropdownList",
            data: { access_token: User.appendAccessToken().access_token,flightNo:value},
            success: function(data) {
                if (data.status == 200) {
                    data.data.map(k=>{
                        k.key = k.id + k.value;
                    });
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

  
    //删除弹框
    showModalDel = (record) => {
        this.setState({
            visibleDel: true,
            record:record
        });
    }
    //删除确认
    handleOkDel = () => {
        this.setState({
            visibleDel: false
        });
        //删除协议
          const __this = this
            const formData = {
                data: [{
                    orderId: __this.state.record.orderId,
                    orderStatus: '预约取消',
                    protocolId:__this.state.record.protocolId,
                    productId:__this.state.record.productId,
                    orderType:0,
                }]
            }
            $.ajax({
                type: "POST",
                contentType: 'application/json;charset=utf-8',
                url:serveUrl+'guest-order/saveOrUpdate?access_token='+User.appendAccessToken().access_token,
                //url:"http://192.168.0.101:8887/saveOrUpdate?access_token="+User.appendAccessToken().access_token,
                data: JSON.stringify(formData),
                success: function (data) {
                    if (data.status == 200) {
                        if (data.data == null) {
                            
                            message.error(data.data);
                        } else {
                            const formValue = __this.props.form.getFieldsValue()
                            const changeDate = {
                                queryIsImportant: __this.state.queryIsImportant,
                                queryBookingOneDayBefore:__this.state.queryBookingOneDayBefore
                            }
                            __this.state.orderListPage = 1
                            __this.getAnyList(__this.state.orderListPage, __this.state.orderListRows,formValue,changeDate);
                            message.success('操作成功');
                        }
                    } else {
                        message.error(data.msg);
                    }
                    
                }
            });
    }
    //删除取消
    handleCancelDel = () => {
        this.setState({
            visibleDel: false
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
                text: v.productName,
                value: v.productName
            })
        })
        const columns = [{
            title: '航班日期',
            width: '8%',
            dataIndex: 'employee_id',
            render(text, record) {
                let importClass = ''
                let isAppoinClass = ''
                if (record.isImportant == 0) {
                    importClass = 'isImport'
                } else {
                    importClass = 'isImportno'
                }
                var d = new Date;
                var today = new Date(d.getFullYear(), d.getMonth(), d.getDate());
                var reg = /\d+/g;
                var temp = record.createTime.match(reg);
                var foday = new Date(temp[0], parseInt(temp[1]) - 1, temp[2]);
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
            width: '8%',
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
            title: '使用产品',
            width: '8%',
            dataIndex: 'queryProductId',
            filters: productData,
            render(text, record) {
                let html = ''
                if(record.productName == '异地贵宾服务'){
                    html = record.serverLocation
                }
                return (
                    <div className="order">
                        <p >{record.productName}</p>
                        <p >{html}</p>
                    </div>
                    
                )
            }
        }, {
            title: '客户名称',
            // width: '22%',
            dataIndex: 'kehuname',
            render(text, record) {
                return (
                    <div className="order"><p>【{record.customerName}】</p><p>{record.protocolName}</p></div>
                )
            }
        }, {
            title: '旅客信息',
            width: '10%',
            dataIndex: 'kehuxin',
            render(text, record) {
                let str = '';
                const len = record.passengerList.length;
                record.passengerList.map((v, index) => {
                    if (index == 0) {
                        str = v.name
                    } else {
                        str = str + ',' + v.name
                    }

                })
                return (
                    <div className="order">{str} {'【'+len+'】'}</div>
                )
            }
        },{
            title: '服务人次',
            width: '8%',
            dataIndex: 'serviceNum',
            render(text, record) {
                let serviceDetail = record.serviceList;
                let serverNum = 0;
                serviceDetail.map(v => {
                    const serveDetail = JSON.parse(v.serviceDetail);
                    if (record.productName == '两舱休息室' && serveDetail.serviceId == 5) {
                        serverNum = serveDetail.serverNum;
                        return;
                    }
                    else if (record.productName == 'VIP接送机'  && serveDetail.serviceId == 1) {
                        serverNum = serveDetail.serverNum;
                        return;
                    }
                    else if (record.productName == '异地贵宾服务'  && serveDetail.serviceId == 1) {
                        serverNum = serveDetail.serverNum;
                        return;
                    }
                    else if (record.productName == '独立安检通道'  && serveDetail.serviceId == 6) {
                        serverNum = serveDetail.serverNum;
                        return;
                    }
                });
                return (
                    <div className="order">{serverNum}</div>
                )
            }
        }, {
            title: '订单状态',
            width: '10%',
            dataIndex: 'queryOrderStatus',
            filters: [
                { text: '已使用', value: '已使用' },
                { text: '已预约', value: '已预约' },
                { text: '预约取消', value: '预约取消' },
                { text: '预约草稿', value: '预约草稿' },
            ],
            render(text, record) {

                return (
                    <div className="order">
                        <p>{record.orderStatus}</p>
                        <a className='word-blue' href={`#/LookAppointment/${record.orderId}`}>{record.orderNo}</a>
                    </div>
                )
            }
        }, {
            title: '操作',
            width: '10%',
            render(text, record) {
                let className = 'word-blue'
                if(record.orderStatus == "预约取消"){
                    className = 'word-blue isImportno'
                }
                return (
                    <div className="order">
                        <a className={className} href={`#/updataAppointment/${record.orderId}`} style={{ marginRight: 5 }}>更新</a>
                        <a className={className} onClick={_this.showModalDel.bind(_this,record)}>取消</a>
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
                _this.state.orderListPage = current;
                if(current != 1){
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
                            <Breadcrumb.Item>预约列表</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>

                <div className="box">
                    <ul className="tit">
                        <li>
                            <a href="javascript:;" className="active">预约列表</a>
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
                                <div >
                                    <span className='bg-yellow'></span>
                                    <span style={{marginLeft:20}}>提前一天以上预约</span>
                                    <Checkbox onClick={this.appoimtPrductClick} style={{marginLeft:10,marginTop:-10}}></Checkbox>
                                </div>
                            </Col>
                            <Col span={6} offset={5}>
                                <FormItem >
                                    <button className='btn-small'  onClick={this.handleSubmit}>查询</button>
                                    <button style={{marginLeft:20}} className='btn'  onClick={this.handleReset}>添加新的预约</button>
                                </FormItem>
                            </Col>
                        </Row>
                    </div>
                    <div className="search-result-list" >
                        <Table  pagination={pagination} onChange={this.handleTableChange} columns={columns} dataSource={this.state.orderListDate} className=" serveTable" />
                        <p style={{marginTop:20}}>共搜索到{this.state.partListDateLength}条数据</p>
                    </div>
                    <Modal title="警告"
                        key={Math.random() * Math.random()}
                        visible={this.state.visibleDel}
                        onOk={this.handleOkDel}
                        onCancel={this.handleCancelDel}
                        >
                        <div>
                            <DeleteDialog msg={msg} />
                        </div>
                    </Modal>

                </div>
            </div>
        )
    }
}

ServiceList = Form.create()(ServiceList);

export default ServiceList;