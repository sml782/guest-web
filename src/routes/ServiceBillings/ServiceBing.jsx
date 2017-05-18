import './ServiceBing.less'
import React from 'react';
import { hashHistory } from 'react-router';
import { Breadcrumb, Form, Row, Col, Input, Button, Icon, Select, Popconfirm, message, Table, Checkbox, AutoComplete, DatePicker } from 'antd';
import { Link } from 'react-router';
import $ from 'jquery';
import moment from 'moment';
import { serveUrl, User, cacheData,billClient,setCookie,getCookie} from '../../utils/config';

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;

class ServiceList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
            queryProductId:null,
            queryOrderBy:null,
            protocolTypeList:[],
            queryProtocolType:null,
            customer:null,
            protocolName:null,
            protocolTypes:[]
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
            url: serveUrl + 'guest-product/list?access_token=' + User.appendAccessToken().access_token,
            data: {
                noPage: true,
            },
            success: function (data) {
                if(data.status == 200){
                    data.data.rows.map((v,index)=>{
                        v.key = index
                    })
                    _this.setState({
                        productList: data.data.rows,
                    })
                }
            }
        });
        $.ajax({
            type: "GET",
            // url: "192.168.1.126:8887/queryInstitutionClientDropdownList",
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
            //url: 'http://192.168.1.130:8887/getProtocolNameDropdownList?access_token='+ User.appendAccessToken().access_token,
            url: serveUrl + 'guest-protocol/getProtocolNameDropdownList?access_token=' + User.appendAccessToken().access_token,
            success: function (data) {
                if(data.status == 200){
                    const Adata = [];
                    data.data.map((v, index) => {
                        Adata.push(data.data[index].value)
                    })
                    _this.setState({
                        productData: Adata
                    })
                }
            }
        });
        $.ajax({
            type: "GET",
            url: serveUrl + "guest-protocol/protocolTypeSelect",
            // url: url + "protocolTypeSelect",
            data: { access_token: User.appendAccessToken().access_token },
            success: function (data) {
                if (data.status == 200) {
                    const Adata = []
                    data.data.map((v, index) => {
                        Adata.push({
                            text: v.value,
                            value: v.id
                        })
                    })
                    _this.setState({
                        protocolTypeList: Adata
                    });
                }
            }
        });
        //获取协议类型
        $.ajax({
            type: "GET",
            url: serveUrl + "guest-protocol/getProtocolTypeDropdownList",
            data: { access_token: User.appendAccessToken().access_token},
            success: function (data) {
                if (data.status == 200) {
                    const protocolTypes = [];
                    data.data.map(k=>{
                        protocolTypes.push({
                            text:k.value,
                            value:k.id
                        });
                    });
                    _this.setState({
                        protocolTypes:protocolTypes
                    });
                }
            }
        });
    }
    componentDidMount = () => {
        $(".ant-breadcrumb-separator").html(">");
        $(".ant-breadcrumb-separator").css({ color: '#333' });
        $(".ant-col-5").removeClass('ant-col-5').addClass("ant-col-10");
        $(".ant-col-19").removeClass('ant-col-19').addClass("ant-col-14");
    }
    componentDidUpdate=()=>{
        // $(".ant-pagination-item-active").css({backgroundColor:'#4778c7',borderColor:'#4778c7'});
        $(".ant-table-tbody tr td").css({borderBottom:'none'});
        $("table").css({border:'1px solid #f0f0f0'});
        $(".ant-pagination-options").hide();
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
                if(values.getMonthStartDate != undefined && values.getMonthEndDate != undefined){
                    const formValue = this.props.form.getFieldsValue()
                    this.getAnyList(this.state.orderListPage, this.state.orderListRows,formValue);
                }
                else{
                    message.error('请选择航班日期！');
                }
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

    handleTableChange = (page,filters, sorter) => {
        let queryProtocolType = ''
        if(filters.queryProtocolType != undefined){
            filters.queryProtocolType.map((v,index)=>{
                if(index == 0){
                    queryProtocolType = queryProtocolType + "'"+v+"'"
                }else{
                    queryProtocolType = queryProtocolType + ',' + "'"+v+"'"
                }
            })
        }
        let queryProductId = ''
        if(filters.queryProductId != undefined){
            filters.queryProductId.map((v,index)=>{
                if(index == 0){
                    queryProductId = queryProductId + "'"+v+"'"
                }else{
                    queryProductId = queryProductId + ',' + "'"+v+"'"
                }
            })
        }
        this.setState({
            queryProtocolType:queryProtocolType,
            queryProductId:queryProductId
        })
        const changeDate = {
            queryProtocolType:queryProtocolType,
            queryProductId:queryProductId
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
            url: serveUrl+'guest-check/list?access_token=' + User.appendAccessToken().access_token,
            // url: 'http://192.168.0.143:8887/list?access_token=' + User.appendAccessToken().access_token,
            data: {
                page: page,
                rows: rows,
                queryFlightDateBegin:formValue.getMonthStartDate==undefined?'':moment(formValue.getMonthStartDate).format("YYYY-MM-DD"),
                queryFlightDateEnd:formValue.getMonthEndDate==undefined?'':moment(formValue.getMonthEndDate).format("YYYY-MM-DD"),
                queryCreateDateBegin:formValue.lastMonthStartDate==undefined?'':moment(formValue.lastMonthStartDate).format("YYYY-MM-DD"),
                queryCreateDateEnd:formValue.lastMonthEndDate==undefined?'':moment(formValue.lastMonthEndDate).format("YYYY-MM-DD"),
                queryCustomerName:formValue.customer == null ? '':formValue.customer,
                queryProtocolName:formValue.protocolName == null ? '':formValue.protocolName,
                queryProtocolType:changeDate == undefined?'':changeDate.queryProtocolType,
                queryProductId:changeDate == undefined?'':changeDate.queryProductId
            },
            success: function (data) {
                if(data.status == 200){
                    data.data.rows.map((v, index) => {
                        v.key = v.customerId+"_"+v.customerName+"_" +v.orderCount+"_"+v.protocolId+"_"+v.protocolType+"_"+index;
                    })
                    _this.setState({
                        orderListDate: data.data.rows,
                        partListDateLength: data.data.total,
                    })
                
                    if(data.data.total>0){
                        $(".search-result-list").show();
                    }
                    else{
                        $(".search-result-list").hide();
                        message.warning('未搜索到相关数据！');
                    }
                }
            }
        });
    }

     customerIdChange =(value) =>{
        const _this = this;
        $.ajax({
            type: "GET",
            url: serveUrl+'institution-client/queryInstitutionClientDropdownList?access_token='+ User.appendAccessToken().access_token,
            data:{name:value},
            success: function(data){
                if (data.status == 200) {
                    if(data.data.length>0){
                        _this.setState({
                            customerId: data.data[0].id
                        })
                        if(data.data.length == 1){
                            setCookie('customerId',_this.state.customerId, 1);
                            setCookie('customerName',data.data[0].value, 1);
                        }
                    } 
                }
            }
        });
    }

     productChange = (value) => {
         const _this = this;
         $.ajax({
             type: "GET",
             url: serveUrl + 'guest-protocol/getProtocolNameDropdownList?access_token=' + User.appendAccessToken().access_token,
             data: { protocolName: value },
             success: function (data) {
                 if (data.status == 200) {
                     if(data.data.length>0){
                        const Adata = [];
                        data.data.map((v, index) => {
                            Adata.push(data.data[index].value);
                        })
                        _this.setState({
                            productData: Adata,
                            protocolId: data.data[0].id
                        })
                        if(data.data.length == 1){
                            setCookie('protocolId',data.data[0].id, 1);
                            setCookie('protocolName',data.data[0].value, 1);
                            setCookie('protocolType',data.data[0].type, 1);
                            _this.props.form.setFieldsValue({
                                customer:data.data[0].clientValue
                            })
                            _this.setState({
                                customerId:data.data[0].clientId
                            });
                            setCookie('customerId',data.data[0].clientId, 1);
                            setCookie('customerName',data.data[0].clientValue, 1);
                        } 
                     }
                 }
             }
         });
     }

    thisMonth = (value) =>{
        var now = new Date(); //当前日期
        var nowDayOfWeek = now.getDay(); //今天本周的第几天
        var nowDay = now.getDate(); //当前日
        var nowMonth = now.getMonth(); //当前月
        var nowYear = now.getYear(); //当前年
        nowYear += (nowYear < 2000) ? 1900 : 0; //
        var lastMonthDate = new Date(); //上月日期
        lastMonthDate.setDate(1);
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
        var lastYear = lastMonthDate.getYear();
        var lastMonth = lastMonthDate.getMonth();
        //格式化日期：yyyy-MM-dd
        function formatDate(date) {
            var myyear = date.getFullYear();
            var mymonth = date.getMonth() + 1;
            var myweekday = date.getDate();
            if (mymonth < 10) {
                mymonth = "0" + mymonth;
            }
            if (myweekday < 10) {
                myweekday = "0" + myweekday;
            }
            return (myyear + "-" + mymonth + "-" + myweekday);
        }
        //获得某月的天数
        function getMonthDays(myMonth) {
            var monthStartDate = new Date(nowYear, myMonth, 1);
            var monthEndDate = new Date(nowYear, myMonth + 1, 1);
            var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
            return days;
        }
        //获得本月的开始日期
        function getMonthStartDate() {
            var monthStartDate = new Date(nowYear, nowMonth, 1);
            return formatDate(monthStartDate);
        }
        //获得本月的结束日期
        function getMonthEndDate() {
            var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth));
            return formatDate(monthEndDate);
        }
        this.props.form.setFieldsValue({
            getMonthStartDate:moment(getMonthStartDate()),
            getMonthEndDate:moment(now)
        })
    }

    lastMonth =()=>{
        var now = new Date(); //当前日期
        var nowDayOfWeek = now.getDay(); //今天本周的第几天
        var nowDay = now.getDate(); //当前日
        var nowMonth = now.getMonth(); //当前月
        var nowYear = now.getYear(); //当前年
        nowYear += (nowYear < 2000) ? 1900 : 0; //
        var lastMonthDate = new Date(); //上月日期
        lastMonthDate.setDate(1);
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
        var lastYear = lastMonthDate.getYear();
        var lastMonth = lastMonthDate.getMonth();
        //格式化日期：yyyy-MM-dd
        function formatDate(date) {
            var myyear = date.getFullYear();
            var mymonth = date.getMonth() + 1;
            var myweekday = date.getDate();
            if (mymonth < 10) {
                mymonth = "0" + mymonth;
            }
            if (myweekday < 10) {
                myweekday = "0" + myweekday;
            }
            return (myyear + "-" + mymonth + "-" + myweekday);
        }
        //获得某月的天数
        function getMonthDays(myMonth) {
            var monthStartDate = new Date(nowYear, myMonth, 1);
            var monthEndDate = new Date(nowYear, myMonth + 1, 1);
            var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
            return days;
        }
        function getLastMonthStartDate() {
            var lastMonthStartDate = new Date(nowYear, lastMonth, 1);
            return formatDate(lastMonthStartDate);
        }
        //获得上月结束时间
        function getLastMonthEndDate() {
            var lastMonthEndDate = new Date(nowYear, lastMonth, getMonthDays(lastMonth));
            return formatDate(lastMonthEndDate);
        }
        this.props.form.setFieldsValue({
            getMonthStartDate:moment(getLastMonthStartDate()),
            getMonthEndDate:moment(getLastMonthEndDate())
        })
    }

    thisMonth1 = (value) =>{
        var now = new Date(); //当前日期
        var nowDayOfWeek = now.getDay(); //今天本周的第几天
        var nowDay = now.getDate(); //当前日
        var nowMonth = now.getMonth(); //当前月
        var nowYear = now.getYear(); //当前年
        nowYear += (nowYear < 2000) ? 1900 : 0; //
        var lastMonthDate = new Date(); //上月日期
        lastMonthDate.setDate(1);
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
        var lastYear = lastMonthDate.getYear();
        var lastMonth = lastMonthDate.getMonth();
        //格式化日期：yyyy-MM-dd
        function formatDate(date) {
            var myyear = date.getFullYear();
            var mymonth = date.getMonth() + 1;
            var myweekday = date.getDate();
            if (mymonth < 10) {
                mymonth = "0" + mymonth;
            }
            if (myweekday < 10) {
                myweekday = "0" + myweekday;
            }
            return (myyear + "-" + mymonth + "-" + myweekday);
        }
        //获得某月的天数
        function getMonthDays(myMonth) {
            var monthStartDate = new Date(nowYear, myMonth, 1);
            var monthEndDate = new Date(nowYear, myMonth + 1, 1);
            var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
            return days;
        }
        //获得本月的开始日期
        function getMonthStartDate() {
            var monthStartDate = new Date(nowYear, nowMonth, 1);
            return formatDate(monthStartDate);
        }
        //获得本月的结束日期
        function getMonthEndDate() {
            var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth));
            return formatDate(monthEndDate);
        }
        this.props.form.setFieldsValue({
            lastMonthStartDate:moment(getMonthStartDate()),
            lastMonthEndDate:moment(now)
        })
    }

    lastMonth1 =()=>{
        var now = new Date(); //当前日期
        var nowDayOfWeek = now.getDay(); //今天本周的第几天
        var nowDay = now.getDate(); //当前日
        var nowMonth = now.getMonth(); //当前月
        var nowYear = now.getYear(); //当前年
        nowYear += (nowYear < 2000) ? 1900 : 0; //
        var lastMonthDate = new Date(); //上月日期
        lastMonthDate.setDate(1);
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
        var lastYear = lastMonthDate.getYear();
        var lastMonth = lastMonthDate.getMonth();
        //格式化日期：yyyy-MM-dd
        function formatDate(date) {
            var myyear = date.getFullYear();
            var mymonth = date.getMonth() + 1;
            var myweekday = date.getDate();
            if (mymonth < 10) {
                mymonth = "0" + mymonth;
            }
            if (myweekday < 10) {
                myweekday = "0" + myweekday;
            }
            return (myyear + "-" + mymonth + "-" + myweekday);
        }
        //获得某月的天数
        function getMonthDays(myMonth) {
            var monthStartDate = new Date(nowYear, myMonth, 1);
            var monthEndDate = new Date(nowYear, myMonth + 1, 1);
            var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
            return days;
        }
        function getLastMonthStartDate() {
            var lastMonthStartDate = new Date(nowYear, lastMonth, 1);
            return formatDate(lastMonthStartDate);
        }
        //获得上月结束时间
        function getLastMonthEndDate() {
            var lastMonthEndDate = new Date(nowYear, lastMonth, getMonthDays(lastMonth));
            return formatDate(lastMonthEndDate);
        }
        this.props.form.setFieldsValue({
            lastMonthStartDate:moment(getLastMonthStartDate()),
            lastMonthEndDate:moment(getLastMonthEndDate())
        })
    }

    openBlank=()=>{
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if(values.getMonthStartDate != undefined && values.getMonthEndDate != undefined){
                    if(this.props.form.getFieldValue('customer') == undefined || this.props.form.getFieldValue('customer') == ''){
                        setCookie('customerId','', 1);
                        setCookie('customerName','', 1);
                    }
                    if(this.props.form.getFieldValue('protocolName') == undefined || this.props.form.getFieldValue('protocolName') == ''){
                        setCookie('protocolId','', 1);
                        setCookie('protocolName','', 1);
                        setCookie('protocolType','', 1);
                    }
                    setCookie('queryFlightDateBegin',this.props.form.getFieldValue('getMonthStartDate')==undefined?'':moment(this.props.form.getFieldValue('getMonthStartDate')).format("YYYY-MM-DD"), 1);
                    setCookie('queryFlightDateEnd',this.props.form.getFieldValue('getMonthEndDate')==undefined?'':moment(this.props.form.getFieldValue('getMonthEndDate')).format("YYYY-MM-DD"), 1);
                    setCookie('flagBill',0, 1);
                    window.open("#/serviceBingDetail");  
                }
                else{
                    message.error('请选择航班日期！');
                }
            }
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
            title: '客户名称',
            width: '18%',
            dataIndex: 'customerName',
            render(text, record) {
                return (
                    <div className="order">
                        <p>{text}</p>
                    </div>
                )
            }
        }, {
            title: '协议信息',
            width: '18%',
            dataIndex: 'protocolName',
            render(text, record) {
                return (
                    <div className="order">
                        <p>{text}</p>
                    </div>
                )
            }
        }, {
            title: '协议类型',
            width: '18%',
            dataIndex: 'queryProtocolType',
            filters: this.state.protocolTypes,
            // filteredValue: filteredInfo.name || null,
            // onFilter: (value, record) => record.name.includes(value),
            // sorter: this.isInOrOutChange,
            render(text, record) {
                return (
                    <div className="order">{record.protocolTypeName}</div>
                )
            }
        }, {
            title: '产品名称',
            width: '18%',
            dataIndex: 'queryProductId',
            filters: productData,
            filteredValue: filteredInfo.name || null,
            onFilter: (value, record) => record.name.includes(value),
            render(text, record) {
                return (
                    <div className="order">
                        <p>{record.productName}</p>
                    </div>
                )
            }
        }, {
            title: '订单数',
            width: '18%',
            dataIndex: 'orderCount',
            render(text, record) {
                return (
                    <div className="order">
                        <p>{record.orderCount}</p>
                    </div>
                )
            }
        }]
        const pagination = {     
            total: _this.state.partListDateLength,
            onChange(current) {
                const formValue = _this.props.form.getFieldsValue()
                _this.state.orderListPage = current;
                if(current != 1){
                    _this.getAnyList(_this.state.orderListPage, _this.state.orderListRows,formValue);
                }
            }
        };
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            onSelection: this.onSelection,
        };

        return (
            <div>
                <div className="breadcrumb-box">
                    <div className="top-bar"></div>
                    <div className="breadcrumb">
                        <Breadcrumb>
                            <Breadcrumb.Item>服务账单</Breadcrumb.Item>
                            <Breadcrumb.Item>所有账单</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>

                <div className="box">
                    <ul className="tit">
                        <li>
                            <a href="javascript:;" className="active">服务总览</a>
                        </li>
                    </ul>

                    <Form horizontal  style={{ marginTop: 44 }}>
                        <Row>
                            <Col span={4} style={{}}>
                                <FormItem label="航班日期" {...formItemLayout} hasFeedback  >
                                    {getFieldDecorator('getMonthStartDate', {
                                    })(
                                        <DatePicker style={{width:120}}/>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={4} style={{marginLeft:20}}>
                                <FormItem  {...formItemLayout} hasFeedback   >
                                    {getFieldDecorator('getMonthEndDate', {
                                    })(
                                        <DatePicker style={{width:120}}/>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={4} style={{marginLeft:-70}}>
                                <FormItem  {...formItemLayout} hasFeedback  >
                                    {getFieldDecorator('flightChose', {
                                    })(
                                        <div className='flightChose'>
                                            <a className='word-blue' onClick={this.thisMonth}>本月</a>
                                            <a className='word-blue' onClick={this.lastMonth} style={{marginLeft:-30}}>上月</a>
                                        </div>

                                        )}
                                </FormItem>
                            </Col>
                           <Col span={4} style={{}}>
                                <FormItem label="登记日期" {...formItemLayout} hasFeedback  >
                                    {getFieldDecorator('lastMonthStartDate', {
                                    })(
                                        <DatePicker style={{width:120}}/>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={4} style={{marginLeft:20}}>
                                <FormItem  {...formItemLayout} hasFeedback   >
                                    {getFieldDecorator('lastMonthEndDate', {
                                    })(
                                        <DatePicker style={{width:120}}/>
                                        )}
                                </FormItem>
                            </Col>
                             <Col span={4} style={{marginLeft:-70}}>
                                <FormItem  {...formItemLayout} hasFeedback  >
                                    {getFieldDecorator('flightChose', {
                                    })(
                                        <div className='flightChose'>
                                            <a className='word-blue' onClick={this.thisMonth1}>本月</a>
                                            <a className='word-blue' onClick={this.lastMonth1} style={{marginLeft:-30}}>上月</a>
                                        </div>

                                        )}
                                </FormItem>
                            </Col>
                           
                            <Col span={4} style={{}}>
                                <FormItem labelInValue label="客户名称" {...formItemLayout}>
                                    {getFieldDecorator('customer', {
                                    })(
                                        <AutoComplete
                                                dataSource={this.state.AutoClientList}
                                                style={{ width: 200 }}
                                                onChange={this.customerIdChange}
                                            />
                                        )}
                                </FormItem>
                            </Col>
                             <Col offset={7} span={4} >
                                <FormItem labelInValue label="协议名称" {...formItemLayout} >
                                    {getFieldDecorator('protocolName', {
                                    })(
                                         <AutoComplete
                                                dataSource={this.state.productData}
                                                style={{ width: 200 }}
                                                onChange={this.productChange}
                                            />
                                        )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6}>
                                <FormItem>
                                    <button className='btn-small ' onClick={this.handleSubmit}>生成账单</button>
                                    &nbsp;&nbsp;&nbsp;
                                    <button className='btn-small ' ><a style={{color:'#fff'}}  onClick={this.openBlank}>详细账单</a></button>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                    <div className="search-result-list" style={{display:'none'}}>
                        <Table  pagination={pagination} onChange={this.handleTableChange} columns={columns} dataSource={this.state.orderListDate} className=" serveTable" />
                        <p style={{marginTop:20}}>共搜索到{this.state.partListDateLength}条数据</p>
                    </div>

                </div>
            </div>
        )
    }
}

ServiceList = Form.create()(ServiceList);

export default ServiceList;