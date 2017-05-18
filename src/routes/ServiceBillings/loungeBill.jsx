import '../service/service.less';
import React from 'react';
import { hashHistory } from 'react-router';
import {Breadcrumb,Form, Row, Col, Input, Button, Icon,Select,Popconfirm,message,Table,Menu,Modal,DatePicker,AutoComplete} from 'antd';
import { Link} from 'react-router';
import $ from 'jquery';
import { serveUrl, User, cacheData,setCookie} from '../../utils/config';
import moment from 'moment';

const url = 'http://192.168.1.130:8887/';
const SubMenu = Menu.SubMenu;
const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const msg = '确认删除该服务吗?';
let openKeys = [];
let tabIndex = 2;//2表示头等舱账单，3表示常旅客账单

class ServiceList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            productTypeData:[],
            serveTypeData:[],
            serveListDate: [],
            serveListDateLength:null,
            serveListDateCurrent:1,
            serveListDatePageSize:10,
            selectedRowKeys: [],
            menuList:[],
            key:1,//当前显示服务类别标识
            serviceList:[],//具体服务的列表
            serviceListLength:null,
            serviceListPage:1,
            serviceListRows:10,
            record:null,
            visible11:false,
            servId:null,
            categoryListPage:1,
            categoryListRows:10,
            categoryListLength:null,

            tabIndex:0,//0表示头等舱账单，1表示常旅客账单
            AutoClientList:[],
            customerId:null,//已选客户的id
            serveBillPage:1,
            serveBillPage1:1,
            serveBillRows:10,
            serveBillLength:null,
            serveBillLength1:null,
            clientType:'',
            type:0//是金银卡还是头等舱

        };
    }

    componentWillMount() {
        if (User.isLogin()) {
        } else {
            hashHistory.push('/login');
        }
        const _this = this;
        //获取客户名称列表
        $.ajax({
            type: "GET",
            // url: "192.168.1.126:8887/queryInstitutionClientDropdownList",
            url: serveUrl + "institution-client/queryInstitutionClientDropdownList?access_token=" + User.appendAccessToken().access_token,
            data:{type:tabIndex},//默认头等舱
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
    }

    componentDidMount=()=>{
        $(".ant-col-5").removeClass('ant-col-5').addClass("ant-col-10");
        $(".ant-col-19").removeClass('ant-col-19').addClass("ant-col-14");
        $(".ant-breadcrumb-separator").html(">");
        $(".ant-breadcrumb-separator").css({color:'#333'});
        $(".tit li").on("click",function(){
            $(this).find("a").addClass("active").parents("li").siblings().find("a").removeClass("active");
            if($(this).index() == 0){
                $(".base-service").show();
                $(".service-sort").hide();
                tabIndex = 2;
                $(".search-result-list").hide();
            }
            else{
                $(".base-service").hide();
                $(".service-sort").show();
                tabIndex = 3;
                $(".search-result-list").hide();
            }
        })
    }

    //名称切换
    liClick=(e)=>{
        this.props.form.resetFields();
        const _this = this;
        $.ajax({
            type: "GET",
            // url: "192.168.1.126:8887/queryInstitutionClientDropdownList",
            url: serveUrl + "institution-client/queryInstitutionClientDropdownList?access_token=" + User.appendAccessToken().access_token,
            data:{type:tabIndex},//默认头等舱
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
    }

    //分页的显示与隐藏
    componentDidUpdate=()=>{
        $(".ant-table-tbody tr td").css({borderBottom:'none'});
        $("table").css({border:'1px solid #f0f0f0'});
        $(".ant-pagination-options").hide();
    }

    //获取列表
    getAnyList = (page,rows,formValue,changeDate) =>{ 
        const _this = this;
        let queryCustomerName = '';
        let queryFlightDateBegin = '';
        let queryFlightDateEnd = '';
        if(tabIndex == 2){//头等舱账单
            queryCustomerName = formValue.customer1 == null ? '':formValue.customer1;
            queryFlightDateBegin = _this.props.form.getFieldValue('getMonthStartDate1')==undefined?'':moment(_this.props.form.getFieldValue('getMonthStartDate1')).format("YYYY-MM-DD");
            queryFlightDateEnd = _this.props.form.getFieldValue('getMonthEndDate1')==undefined?'':moment(_this.props.form.getFieldValue('getMonthEndDate1')).format("YYYY-MM-DD");
        }
        else if(tabIndex == 3){//常旅客账单
            queryCustomerName = formValue.customer == null ? '':formValue.customer;
            queryFlightDateBegin = _this.props.form.getFieldValue('getMonthStartDate')==undefined?'':moment(_this.props.form.getFieldValue('getMonthStartDate')).format("YYYY-MM-DD");
            queryFlightDateEnd = _this.props.form.getFieldValue('getMonthEndDate')==undefined?'':moment(_this.props.form.getFieldValue('getMonthEndDate')).format("YYYY-MM-DD");
        }
        if(tabIndex == 2){//头等舱账单
            _this.state.type = 10;
        }
        else if(tabIndex == 3){//常旅客账单
             _this.state.type = 9;
        }
        _this.setState({
            type:_this.state.type
        });
        $.ajax({
            type: "GET",
            url: serveUrl+'guest-check/specialCheckList?access_token=' + User.appendAccessToken().access_token,
            // url: 'http://192.168.0.120:8888/specialCheckList?access_token=' + User.appendAccessToken().access_token,
            data: {
                page: page,
                rows: rows,
                queryFlightDateBegin:queryFlightDateBegin,
                queryFlightDateEnd:queryFlightDateEnd,
                queryCustomerName:queryCustomerName,
                type:_this.state.type
            },
            success: function (data) {
                if(data.status == 200){
                    data.data.rows.map((v, index) => {
                       v.key = v.customerId+"_" +v.customerName+'_'+index
                    })
                    //头等舱
                    if(tabIndex == 2){
                        _this.state.serveBillLength1 = data.data.total;
                    }
                    //常旅客
                    else if(tabIndex == 3){
                         _this.state.serveBillLength = data.data.total;
                    }
                    _this.setState({
                        orderListDate: data.data.rows,
                        partListDateLength: data.data.total,
                        serveBillLength1:_this.state.serveBillLength1,
                        serveBillLength:_this.state.serveBillLength
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

    //客户名称改变
    customerIdChange =(value) =>{
        const _this = this;
        $.ajax({
            type: "GET",
            //url: 'http://192.168.1.129:8887/getAuthorizerDropdownList?access_token='+ User.appendAccessToken().access_token,
            url: serveUrl+'institution-client/queryInstitutionClientDropdownList?access_token='+ User.appendAccessToken().access_token,
            data:{name:value,type:tabIndex},
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
            getMonthStartDate1:moment(getMonthStartDate()),
            getMonthEndDate1:moment(now)
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
            getMonthStartDate1:moment(getLastMonthStartDate()),
            getMonthEndDate1:moment(getLastMonthEndDate())
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
        console.log(moment())
        this.props.form.setFieldsValue({
            getMonthStartDate:moment(getMonthStartDate()),
            getMonthEndDate:moment(now)
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
            getMonthStartDate:moment(getLastMonthStartDate()),
            getMonthEndDate:moment(getLastMonthEndDate())
        })
    }
    //头等舱账单打印
    handleprint=()=>{
        if(tabIndex == 2){
            this.state.clientType = 'firstClass';
        }
        else if(tabIndex == 3){
            this.state.clientType = 'frequentFlyer';
        }
        this.setState({
            clientType:this.state.clientType
        });
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if(values.getMonthStartDate1 != undefined && values.getMonthEndDate1 != undefined && values.getMonthStartDate1 != '' && values.getMonthEndDate1 != ''){
                    var form = $("<form>"); //定义一个form表单
                    form.attr('style', 'display:none'); //在form表单中添加查询参数
                    form.attr('target', '');
                    form.attr('method', 'GET');
                    form.attr('action', serveUrl+"guest-check/exportBill");
                    // form.attr('action', "http://192.168.0.124:8988/exportBill");
                    var input1 = $('<input>');
                    input1.attr('type', 'hidden');
                    input1.attr('name', 'queryFlightDateBegin');
                    input1.attr('value', values.getMonthStartDate1==undefined?'':moment(values.getMonthStartDate1).format("YYYY-MM-DD"));
                    var input2 = $('<input>');
                    input2.attr('type', 'hidden');
                    input2.attr('name', 'queryFlightDateEnd');
                    input2.attr('value', values.getMonthEndDate1==undefined?'':moment(values.getMonthEndDate1).format("YYYY-MM-DD"));
                    var input3 = $('<input>');
                    input3.attr('type', 'hidden');
                    input3.attr('name', 'queryCustomerName');
                    input3.attr('value', values.customer1);
                    var input4 = $('<input>');
                    input4.attr('type', 'hidden');
                    input4.attr('name', 'type');
                    input4.attr('value', this.state.clientType);
                    var input5 = $('<input>');
                    input5.attr('type', 'hidden');
                    input5.attr('name', 'access_token');
                    input5.attr('value', User.appendAccessToken().access_token);
                    $('body').append(form); //将表单放置在web中
                    form.append(input1); //将查询参数控件提交到表单上
                    form.append(input2);
                    form.append(input3);
                    form.append(input4);
                    form.append(input5);
                    form.submit();
                }
                else{
                    message.error('请选择航班日期和客户名称！');
                }
            }
        });
    }
    //常旅客账单打印
    handleprint2=()=>{
        if(tabIndex == 2){
            this.state.clientType = 'firstClass';
        }
        else if(tabIndex == 3){
            this.state.clientType = 'frequentFlyer';
        }
        this.setState({
            clientType:this.state.clientType
        });
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if(values.getMonthStartDate != undefined && values.getMonthEndDate != undefined && values.getMonthStartDate != '' && values.getMonthEndDate != ''){
                    var form = $("<form>"); //定义一个form表单
                    form.attr('style', 'display:none'); //在form表单中添加查询参数
                    form.attr('target', '');
                    form.attr('method', 'GET');
                    form.attr('action', serveUrl+"guest-check/exportBill");
                    // form.attr('action', "http://192.168.0.124:8988/exportBill");
                    var input1 = $('<input>');
                    input1.attr('type', 'hidden');
                    input1.attr('name', 'queryFlightDateBegin');
                    input1.attr('value', values.getMonthStartDate==undefined?'':moment(values.getMonthStartDate).format("YYYY-MM-DD"));
                    var input2 = $('<input>');
                    input2.attr('type', 'hidden');
                    input2.attr('name', 'queryFlightDateEnd');
                    input2.attr('value', values.getMonthEndDate==undefined?'':moment(values.getMonthEndDate).format("YYYY-MM-DD"));
                    var input3 = $('<input>');
                    input3.attr('type', 'hidden');
                    input3.attr('name', 'queryCustomerName');
                    input3.attr('value', values.customer);
                    var input4 = $('<input>');
                    input4.attr('type', 'hidden');
                    input4.attr('name', 'type');
                    input4.attr('value', this.state.clientType);
                    var input5 = $('<input>');
                    input5.attr('type', 'hidden');
                    input5.attr('name', 'access_token');
                    input5.attr('value', User.appendAccessToken().access_token);
                    $('body').append(form); //将表单放置在web中
                    form.append(input1); //将查询参数控件提交到表单上
                    form.append(input2);
                    form.append(input3);
                    form.append(input4);
                    form.append(input5);
                    form.submit();
                }
                else{
                    message.error('请选择航班日期和客户名称！');
                }
            }
        });
    }
    //头等舱详细账单
    handleSubmit =(e)=>{
        const _this = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if(values.getMonthStartDate1 != undefined && values.getMonthEndDate1 != undefined){
                    const formValue = this.props.form.getFieldsValue();
                    this.getAnyList(this.state.serveBillPage1, this.state.serveBillRows,formValue);
                }
                else{
                    message.error('请选择航班日期和客户名称！');
                }
            }
        });
    }
    //常旅客详细账单
    handleSubmit2 =(e)=>{
        const _this = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if(values.getMonthStartDate != undefined && values.getMonthEndDate != undefined){
                    const formValue = this.props.form.getFieldsValue();
                    this.getAnyList(this.state.serveBillPage, this.state.serveBillRows,formValue);
                }
                else{
                    message.error('请选择航班日期和客户名称！');
                }
            }
        });
    }
    
    //头等舱详细账单
    openBlank1=()=>{
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if(values.getMonthStartDate1 != undefined && values.getMonthEndDate1 != undefined){
                    setCookie('protocolId','', 1);
                    setCookie('protocolName','', 1);
                    setCookie('protocolType','', 1);
                    setCookie('flagBill',1, 1);
                    setCookie('queryFlightDateBegin',this.props.form.getFieldValue('getMonthStartDate1')==undefined?'':moment(this.props.form.getFieldValue('getMonthStartDate1')).format("YYYY-MM-DD"), 1);
                    setCookie('queryFlightDateEnd',this.props.form.getFieldValue('getMonthEndDate1')==undefined?'':moment(this.props.form.getFieldValue('getMonthEndDate1')).format("YYYY-MM-DD"), 1);
                    window.open("#/serviceBingDetail");  
                }
                else{
                    message.error('请选择航班日期！');
                }
            }
        }); 
    }
    //常旅客详细账单
    openBlank=()=>{
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if(values.getMonthStartDate != undefined && values.getMonthEndDate != undefined){
                    setCookie('protocolId','', 1);
                    setCookie('protocolName','', 1);
                    setCookie('protocolType','', 1);
                    setCookie('flagBill',1, 1);
                    setCookie('queryFlightDateBegin',this.props.form.getFieldValue('getMonthStartDate')==undefined?'':moment(this.props.form.getFieldValue('getMonthStartDate')).format("YYYY-MM-DD"), 1);
                    setCookie('queryFlightDateEnd',this.props.form.getFieldValue('getMonthEndDate')==undefined?'':moment(this.props.form.getFieldValue('getMonthEndDate')).format("YYYY-MM-DD"), 1);
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
        const _this = this;
        
        const columnsSort1 = [
                {
                title: '客户名称',
                width: '11%',
                dataIndex: 'customerName',
                render(text, record) {
                
                    return (
                        <div className="order">
                            <p>{text}</p>
                        </div>
                    )
                }
            }, {
                title: '航班日期',
                width: '11%',
                dataIndex: 'flightDate',
                render(text, record) {
                    return (
                        <div className="order">
                            <p>{text}</p>
                        </div>
                    )
                }
            },{
                title: '航班号',
                width: '11%',
                dataIndex: 'flightNo',
                render(text, record) {
                    return (
                        <div className="order">
                            <p>{text}</p>
                        </div>
                    )
                }
            },{
                title: '飞机号',
                width: '11%',
                dataIndex: 'planNo',
                render(text, record) {
                    return (
                        <div className="order">
                            <p>{text}</p>
                        </div>
                    )
                }
            },{
                title: '起飞三字码',
                width: '11%',
                dataIndex: 'flightDepcode',
                render(text, record) {
                    return (
                        <div className="order">
                            <p>{text}</p>
                        </div>
                    )
                }
            },{
                title: '到达三字码',
                width: '11%',
                dataIndex: 'flightArrcode',
                render(text, record) {
                    return (
                        <div className="order">
                            <p>{text}</p>
                        </div>
                    )
                }
            }, {
                title: '服务人次',
                width: '11%',
                dataIndex: 'serverPersonNum',
                render(text, record) {
                    return (
                        <div className="order">
                            <p>{text}</p>
                        </div>
                    )
                }
            
            }
        ]

        const columnsSort2 = [
                    {
                title: '客户名称',
                width: '11%',
                dataIndex: 'customerName',
                render(text, record) {
                    
                    return (
                        <div className="order">
                            <p>{text}</p>
                        </div>
                    )
                }
            }, {
                title: '航班日期',
                width: '11%',
                dataIndex: 'flightDate',
                render(text, record) {
                    return (
                        <div className="order">
                            <p>{text}</p>
                        </div>
                    )
                }
            },{
                title: '航班号',
                width: '11%',
                dataIndex: 'flightNo',
                render(text, record) {
                    return (
                        <div className="order">
                            <p>{text}</p>
                        </div>
                    )
                }
            },{
                title: '飞机号',
                width: '11%',
                dataIndex: 'planNo',
                render(text, record) {
                    return (
                        <div className="order">
                            <p>{text}</p>
                        </div>
                    )
                }
            },{
                title: '起飞三字码',
                width: '11%',
                dataIndex: 'flightDepcode',
                render(text, record) {
                    return (
                        <div className="order">
                            <p>{text}</p>
                        </div>
                    )
                }
            },{
                title: '到达三字码',
                width: '11%',
                dataIndex: 'flightArrcode',
                render(text, record) {
                    return (
                        <div className="order">
                            <p>{text}</p>
                        </div>
                    )
                }
            }, {
                title: '服务人次',
                width: '11%',
                dataIndex: 'serverPersonNum',
                render(text, record) {
                    return (
                        <div className="order">
                            <p>{text}</p>
                        </div>
                    )
                }
            }
        ]

        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };
        //头等舱
        const pagination1 = {     
            total: _this.state.serveBillLength1,
            onChange(current) {
                const formValue = _this.props.form.getFieldsValue()
                _this.state.serveBillPage1 = current;
                _this.getAnyList(_this.state.serveBillPage1, _this.state.serveBillRows,formValue);
            }
        };
        //金银卡
        const pagination = {     
            total: _this.state.serveBillLength,
            onChange(current) {
                const formValue = _this.props.form.getFieldsValue()
                _this.state.serveBillPage = current;
                _this.getAnyList(_this.state.serveBillPage, _this.state.serveBillRows,formValue);
            }
        };

        return (
            <div>
                <div className="breadcrumb-box">
                    <div className="top-bar"></div>
                    <div className="breadcrumb">
                        <Breadcrumb>
                            <Breadcrumb.Item>服务账单</Breadcrumb.Item>
                            <Breadcrumb.Item>休息室账单</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
                <div className="box">
                    <ul className="tit">
                        <li onClick={this.liClick.bind(this)} className="liName">
                            <a href="javascript:;" className="active">头等舱账单</a>
                        </li>
                        <li onClick={this.liClick.bind(this)} className="liName">
                            <a href="javascript:;">常旅客账单</a>
                        </li>
                    </ul>
                    <div className="mid-box">
                        <div className="base-service">
                            <Form horizontal style={{ marginTop: 44 }}>
                                <Row>
                                    <Col span={4} style={{}}>
                                        <FormItem label="航班日期" {...formItemLayout} hasFeedback  >
                                            {getFieldDecorator('getMonthStartDate1', {
                                            })(
                                                <DatePicker style={{ width: 120 }} />
                                                )}
                                        </FormItem>
                                    </Col>
                                    <Col span={4} style={{ marginLeft: 30 }}>
                                        <FormItem  {...formItemLayout} hasFeedback   >
                                            {getFieldDecorator('getMonthEndDate1', {
                                            })(
                                                <DatePicker style={{ width: 120 }} />
                                                )}
                                        </FormItem>
                                    </Col>
                                    <Col span={4} style={{ marginLeft: -70 }}>
                                        <FormItem  {...formItemLayout} hasFeedback  >
                                            {getFieldDecorator('flightChose', {
                                            })(
                                                <div className='flightChose'>
                                                    <a className='word-blue' onClick={this.thisMonth}>本月</a>
                                                    <a className='word-blue' onClick={this.lastMonth} style={{ marginLeft: -30 }}>上月</a>
                                                </div>
                                                )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8} style={{}}>
                                        <FormItem labelInValue label="客户名称" {...formItemLayout} style={{}}>
                                            {getFieldDecorator('customer1', {
                                            })(
                                                <AutoComplete
                                                    dataSource={this.state.AutoClientList}
                                                    style={{ width: 200 }}
                                                    onChange={this.customerIdChange}
                                                    />
                                                )}
                                        </FormItem>
                                    </Col>
                                    <Col span={24} >
                                        <FormItem>
                                            <button className='btn-small ' onClick={this.handleSubmit}>生成账单</button>
                                            &nbsp;&nbsp;&nbsp;
                                    <button className='btn-small ' onClick={this.handleprint}>打印账单</button>
                                            &nbsp;&nbsp;&nbsp;
                                    <button className='btn-small '><a style={{ color: '#fff' }} onClick={this.openBlank1}>详细账单</a></button>
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Form>
                            <div className="search-result-list" style={{ display: 'none' }}>
                                <Table pagination={pagination1} columns={columnsSort1} dataSource={this.state.orderListDate} className=" serveTable" />
                                <p style={{ marginTop: 20 }}>共搜索到{this.state.partListDateLength}条数据</p>
                            </div>
                        </div>


                        <div className="service-sort" >
                            <Form horizontal style={{ marginTop: 44 }}>
                                <Row>
                                    <Col span={4} style={{}}>
                                        <FormItem label="航班日期" {...formItemLayout} hasFeedback  >
                                            {getFieldDecorator('getMonthStartDate', {
                                            })(
                                                <DatePicker style={{ width: 120 }} />
                                                )}
                                        </FormItem>
                                    </Col>
                                    <Col span={4} style={{ marginLeft: 30 }}>
                                        <FormItem  {...formItemLayout} hasFeedback   >
                                            {getFieldDecorator('getMonthEndDate', {
                                            })(
                                                <DatePicker style={{ width: 120 }} />
                                                )}
                                        </FormItem>
                                    </Col>
                                    <Col span={4} style={{ marginLeft: -70 }}>
                                        <FormItem  {...formItemLayout} hasFeedback  >
                                            {getFieldDecorator('flightChose', {
                                            })(
                                                <div className='flightChose'>
                                                    <a className='word-blue' onClick={this.thisMonth1}>本月</a>
                                                    <a className='word-blue' onClick={this.lastMonth1} style={{ marginLeft: -30 }}>上月</a>
                                                </div>
                                                )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8} style={{}}>
                                        <FormItem labelInValue label="客户名称" {...formItemLayout} style={{}}>
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
                                    <Col span={24} >
                                        <FormItem>
                                            <button className='btn-small ' onClick={this.handleSubmit2}>生成账单</button>
                                            &nbsp;&nbsp;&nbsp;
                                    <button className='btn-small ' onClick={this.handleprint2}>打印账单</button>
                                            &nbsp;&nbsp;&nbsp;
                                    <button className='btn-small'><a style={{ color: '#fff' }} onClick={this.openBlank}>详细账单</a></button>
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Form>
                            <div className="search-result-list" style={{ display: 'none' }}>
                                <Table pagination={pagination} columns={columnsSort2} dataSource={this.state.orderListDate} className=" serveTable" />
                                <p style={{ marginTop: 20 }}>共搜索到{this.state.partListDateLength}条数据</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
ServiceList = Form.create()(ServiceList);

export default ServiceList;

