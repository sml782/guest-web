import './appointment.less'
import React from 'react';
import { hashHistory } from 'react-router';
import {Breadcrumb,Form, Row, Col, Input, Button, Icon,Select,message,Table,Checkbox,DatePicker,Modal,Radio,AutoComplete} from 'antd';
import { Link} from 'react-router';
import $ from 'jquery';
import Moment from 'moment'
import { serveUrl, User, cacheData} from '../../utils/config';
import VIPLoungeList from './VIPLoungeList';//添加贵宾厅
import VIPLoungeFlightDetail from './VIPLoungeFlightDetail';//航班详情

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
let selectedList = [];
let selectedServIdsList = [];
let index = null;
let flag = false;
let className = '';
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

class VIPLoungeManage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            btnState:'primary',
            flightList:[],
            flightListLength:null,
            flightListPage:1,
            flightListRows:10,
            visible:false,
            visibleDetail:false,
            iconType:'down',
            flag:false,
            VIPLoungeList:[],
            flightNoList:[],
            flightId:null,
            defaultList:[],
            indexList:[],
            indexFlag:false,
            servId:null,
            isInOrOut:'',
            flightState:'',
            scheduleEventIds:'',
            scheduleEventList:[],//调度事件列表
        }
    }

    componentWillMount() {
         if(User.isLogin()){
        } else{
            hashHistory.push('/login');
        }
        const _this = this;
        //航班号（模糊匹配）
        $.ajax({
            type: "GET",
            url: serveUrl + "flight-info/flightNoDropdownList",
            data: { access_token: User.appendAccessToken().access_token },
            success: function(data) {
                if (data.status == 200) {
                    const Adata = [];
                    _this.setState({
                        flightNoList: []
                    })
                    data.data.map((data) => {
                        data.key=data.id;
                        Adata.push(data.value);
                    })
                    _this.setState({
                        flightNoList: Adata
                    })
                }
            }
        });
        //调度状态列表
        $.ajax({
            type: "GET",
            url: serveUrl + "flight-info/get-schedule-event-drop-down-box",
            data: { access_token: User.appendAccessToken().access_token},
            success: function (data) {
                if (data.status == 200) {
                    const scheduleEventList = [];
                    data.data.map(k=>{
                        scheduleEventList.push({
                            text:k.name,
                            value:k.scheduleEventId
                        });
                    });
                    _this.setState({
                        scheduleEventList:scheduleEventList
                    });
                }
            }
        });
    }
    componentDidMount=()=>{
        this.props.form.setFieldsValue({'flightDate': Moment(Date.now()) }); 
        const nowDate = Moment(this.props.form.getFieldValue('flightDate')._d).format('YYYY-MM-DD'); 
        const _this = this;
        //获取贵宾厅列表
        $.ajax({
            type: "GET",
            url: serveUrl + "guest-service/getServNameAndPositionNum",
            data: {access_token: User.appendAccessToken().access_token,typeId:1},
            success: function (data) {
                if (data.status == 200) {
                    data.data.map(data=>{
                        data.key = data.servId;
                    });
                    for(let i =0;i<data.data.length;i++){
                        selectedList.push(i);
                        selectedServIdsList.push(data.data[i].servId);                      
                    }
                    const selectedServIdsListStr = selectedServIdsList.join(',');
                    _this.getInitList(_this.state.flightListPage,_this.state.flightListRows,nowDate,selectedServIdsListStr);
                    _this.setState({
                        VIPLoungeList:data.data
                    });
                }
            }
        });
        $(".ant-breadcrumb-separator").html(">");
        $(".ant-breadcrumb-separator").css({color:'#333'});
        $(".ant-col-19").removeClass('ant-col-19').addClass("ant-col-16");
        $(".ant-col-5").removeClass('ant-col-5').addClass("ant-col-8");
    }

    componentDidUpdate=()=>{
        $(".ant-table-tbody tr td").css({borderBottom:'none'});
        $("table").css({border:'1px solid #f0f0f0'});
        $(".ant-pagination-options").hide();
    }
   
    //获取航班列表
    getInitList = (page,rows,flightDate,servIds)=>{
        const _this = this;
        $.ajax({
            type: "POST", 
            // url:"http://192.168.0.161:8080/get-flight-list?access_token="+User.appendAccessToken().access_token,
            url:serveUrl+"flight-info/get-flight-list?access_token="+User.appendAccessToken().access_token,
            contentType: 'application/json;charset=utf-8',
            data:JSON.stringify({
                typeId:1,
                page: page,
                rows: rows,
                isInOrOut:_this.state.isInOrOut,
                flightState:_this.state.flightState,
                flightDate:flightDate,//航班日期
                flightNo:_this.props.form.getFieldValue('flightNo'),//航班号
                serverComplete:_this.props.form.getFieldValue('isRight'),//服务是否完成
                servIds:servIds,
                scheduleEventIds:_this.state.scheduleEventName,//调度事件id
            }),
            success: function (data) {
                if (data.status == 200) {
                    if (data.data.total > 0) {
                        data.data.rows.map(data => {
                            if(data.flightState == 'Plan'){
                                data.flightState = '计划';
                            }
                            else if(data.flightState == 'Take off'){
                                data.flightState = '起飞';
                            }
                            else if(data.flightState == 'Arrivals'){
                                data.flightState = '到达';
                            }
                            else if(data.flightState == 'Delay'){
                                data.flightState = '延误';
                            }
                            else if(data.flightState == 'Cancel'){
                                data.flightState = '取消';
                            }
                            else if(data.flightState == 'Alternate'){
                                data.flightState = '备降';
                            }
                            else if(data.flightState == 'Return'){
                                data.flightState = '返航';
                            }
                            else if(data.flightState == 'Advance cancel'){
                                data.flightState = '提前取消';
                            }
                            data.key = data.flightId+"_"+data.servId;
                            data.scheduleTime = data.scheduleTime==null?'':Moment(data.scheduleTime).format('HH:mm');
                            data.flightArrtimeDate = data.flightArrtimeDate==null?'':Moment(data.flightArrtimeDate).format('MM-DD HH:mm');
                            data.flightArrtimePlanDate = data.flightArrtimePlanDate==null?'':Moment(data.flightArrtimePlanDate).format('MM-DD HH:mm');
                            data.flightDeptimeDate = data.flightDeptimeDate==null?'':Moment(data.flightDeptimeDate).format('MM-DD HH:mm');
                            data.flightDeptimePlanDate = data.flightDeptimePlanDate==null?'':Moment(data.flightDeptimePlanDate).format('MM-DD HH:mm');
                            data.flightDeptimeReadyDate = data.flightDeptimeReadyDate==null?'':Moment(data.flightDeptimeReadyDate).format('MM-DD HH:mm');
                            data.flightArrtimeReadyDate = data.flightArrtimeReadyDate==null?'':Moment(data.flightArrtimeReadyDate).format('MM-DD HH:mm');
                            if(data.flightArrtimeDate == ''){
                               data.flightArrtimeDate =  data.flightArrtimeReadyDate;
                            }
                            if(data.flightDeptimeDate == ''){
                               data.flightDeptimeDate =  data.flightDeptimeReadyDate;
                            }
                        });
                    }
                    _this.setState({
                        flightList: data.data.rows,
                        flightListLength: data.data.total
                    });
                }
            }
        });
    }

    //默认设置弹框出现
    showModal = ()=>{
        this.setState({
            visible:true
        });
    }
    handleOk = () => {
        this.setState({
            confirmLoading: true,
        });
        setTimeout(() => {
            this.setState({
                visible: false,
                confirmLoading: false,
            });
        }, 1000);
    }
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }
     //默认贵宾厅
    confirmSelect=(defaultData,indexList)=>{
        this.setState({
            visible:false,
            indexList:indexList,
            indexFlag:true
        });
        selectedServIdsList = defaultData;
        const selectedServIdsListStr=defaultData.join(',');
        this.props.form.validateFields((err, values) => {
            const _this = this;
            if (values.flightDate) {
                _this.getInitList(_this.state.flightListPage, _this.state.flightListRows, Moment(values.flightDate._d).format('YYYY-MM-DD'), selectedServIdsListStr);
            }
            else {
                _this.getInitList(_this.state.flightListPage, _this.state.flightListRows, '', selectedServIdsListStr);
            }
        })
        const defaultList = this.state.defaultList;
        for(let i =0;i<defaultData.length;i++){
            for(let j = 0;j<this.state.VIPLoungeList.length;j++){
                if(defaultData[i] == this.state.VIPLoungeList[j].servId){
                    defaultList.push(this.state.VIPLoungeList[j].servId);
                }
            }
        }
        const _this = this;
        $.ajax({
            type: "GET",
            url: serveUrl + "guest-service/getServNameAndPositionNum",
            data: { access_token: User.appendAccessToken().access_token, typeId: 1, isShowAll: true },
            success: function(data) {
                if (data.status == 200) {
                    data.data.map(data => {
                        data.key = data.servId;
                    });
                    selectedList = [];
                    _this.setState({
                        VIPLoungeList: data.data
                    });
                }
            }
        });
    }
    //航班详情的弹框
    showModalDetail=(record)=>{
        this.setState({
            visibleDetail:true,
            flightId:record.flightId,
            servId:record.servId
        });
    }
    handleOkDetail = () => {
        this.setState({
            confirmLoadingDetail: true,
        });
        setTimeout(() => {
            this.setState({
                visibleDetail: false,
                confirmLoadingDetail: false,
            });
        }, 2000);
        const _this = this;
        const selectedServIdsListStr = selectedServIdsList.join(',');
        _this.props.form.validateFields((err, values) => {
            if (values.flightDate) {
                _this.getInitList(1, _this.state.flightListRows, Moment(values.flightDate._d).format('YYYY-MM-DD'), selectedServIdsListStr);
            }
            else {
                _this.getInitList(1, _this.state.flightListRows, '', selectedServIdsListStr);
            }
        })
         $(".ant-pagination").show();
    }
    handleCancelDetail = () => {
        this.setState({
            visibleDetail: false
        });
        const _this = this;
        const selectedServIdsListStr = selectedServIdsList.join(',');
        _this.props.form.validateFields((err, values) => {
            if (values.flightDate) {
                _this.getInitList(1, _this.state.flightListRows, Moment(values.flightDate._d).format('YYYY-MM-DD'), selectedServIdsListStr);
            }
            else {
                _this.getInitList(1, _this.state.flightListRows, '', selectedServIdsListStr);
            }
        })
         $(".ant-pagination").show();
    }
    //后天
    clickOtherDate = () => {
        this.props.form.setFieldsValue({ 'flightDate': Moment(Date.now() + 172800000) });
    }
    //将时间控件设置为当前系统的日期(今天)
    clickToday=()=>{
        this.props.form.setFieldsValue({'flightDate':Moment(Date.now())});
    }
    //将时间控件设置为系统时间的明天
    clickTomorrow=()=>{
        this.props.form.setFieldsValue({'flightDate':Moment(Date.now()+86400000)});
    }
    //是否显示所有休息室
    changeIconType=()=>{
        //flag为false时为down,为true时为up
        this.state.flag = !(this.state.flag);
        if(this.state.flag){
            this.setState({
                iconType:'up'
            });
            $(".lounge-list").css({height:'auto',overflow:'visible'});
        }
        else{
            this.setState({
                iconType:'down'
            });
            $(".lounge-list").css({height:100,overflow:'hidden'});
        }
    }
    //是否将所有休息室变为选中状态
    changeBox=(e)=>{
        const _this = this;
        if(e.target.checked){
            selectedServIdsList=[];
            $.ajax({
                type: "GET",
                url: serveUrl + "guest-service/getServNameAndPositionNum",
                data: { access_token: User.appendAccessToken().access_token, typeId: 1,isShowAll:true},
                success: function(data) {
                    if (data.status == 200) {
                        data.data.map(data => {
                            data.key = data.servId;
                        });
                        for (let i = 0; i < data.data.length; i++) {
                            selectedServIdsList.push(data.data[i].servId);
                        }
                        const selectedServIdsListStr = selectedServIdsList.join(',');
                        _this.props.form.validateFields((err, values) => {
                            if (values.flightDate) {
                                _this.getInitList(1, _this.state.flightListRows, Moment(values.flightDate._d).format('YYYY-MM-DD'), selectedServIdsListStr);
                            }
                            else {
                                _this.getInitList(1, _this.state.flightListRows, '', selectedServIdsListStr);
                            }
                        })
                        _this.setState({
                            VIPLoungeList: data.data
                        });
                    }
                }
            });
            $(".btnState").addClass("btnLounge");
        }
        else{
            $.ajax({
                type: "GET",
                url: serveUrl + "guest-service/getServNameAndPositionNum",
                data: { access_token: User.appendAccessToken().access_token, typeId: 1},
                success: function(data) {
                    if (data.status == 200) {
                        data.data.map(data => {
                            data.key = data.servId;
                        });
                        _this.setState({
                            VIPLoungeList: data.data
                        });
                    }
                }
            });
            $(".btnState").addClass("btnLounge");
            this.props.form.validateFields((err, values) => {
                const _this = this;
                if (values.flightDate) {
                    _this.getInitList(1, _this.state.flightListRows, Moment(values.flightDate._d).format('YYYY-MM-DD'), '');
                }
                else {
                    _this.getInitList(1, _this.state.flightListRows, '', '');
                }
            })
        }
    }

    //搜索
    searchFlightList=()=>{
        const selectedServIdsListStr = selectedServIdsList.join(',');
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const _this = this;
                if(values.flightDate){
                    _this.getInitList(1,_this.state.flightListRows,Moment(values.flightDate._d).format('YYYY-MM-DD'),selectedServIdsListStr);
                }
                else{
                    _this.getInitList(1,_this.state.flightListRows,'',selectedServIdsListStr);
                }
            }
        })
    }

    //更改筛选条件，表格刷新
    handleTableChange = (page,filters) => {
        let flightStateStr = "";
        if(filters.flightState){
            if(filters.flightState.length>0){
                filters.flightState.map((k,index)=>{
                    if(index == 0){
                        flightStateStr = "'"+k+"'";
                    }else{
                        flightStateStr = flightStateStr +','+"'"+k+"'";
                    }
                    this.state.flightState = flightStateStr;
                });
            }
            else{
                this.state.flightState = '';
            }
        }
        if(filters.scheduleEventName){
            if(filters.scheduleEventName.length>0){
                this.state.scheduleEventName = filters.scheduleEventName.toString();
            }
            else{
                this.state.scheduleEventName='';
            } 
        }
        if(filters.isInOrOut){
            if(filters.isInOrOut.length>0){
                this.state.isInOrOut = filters.isInOrOut.toString();
            }
            else{
                this.state.isInOrOut='';
            } 
        }
        const selectedServIdsListStr = selectedServIdsList.join(',');
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const _this = this;
                if(values.flightDate){
                    _this.getInitList(1,_this.state.flightListRows,Moment(values.flightDate._d).format('YYYY-MM-DD'),selectedServIdsListStr);
                }
                else{
                    _this.getInitList(1,_this.state.flightListRows,'',selectedServIdsListStr);
                }
            }
        })
    }

    //按钮点击事件
    VIPClick = (index, servId) => {
        for (let i = 0; i < selectedServIdsList.length; i++) {
            if (selectedServIdsList[i] == servId) {
                flag = true;
                selectedServIdsList.splice(i,1);
                selectedList.splice(i, 1);
                $(".btnState").eq(index).removeClass("btnLounge");
                const selectedServIdsListStr = selectedServIdsList.join(',');
                this.props.form.validateFields((err, values) => {
                    const _this = this;
                    if (values.flightDate) {
                        _this.getInitList(1, _this.state.flightListRows, Moment(values.flightDate._d).format('YYYY-MM-DD'), selectedServIdsListStr);
                    }
                    else {
                        _this.getInitList(1, _this.state.flightListRows, '', selectedServIdsListStr);
                    }
                })
            }
        };
        if (!flag) {
            flag = false;
            $(".btnState").eq(index).addClass("btnLounge");
            selectedList.push(index);
            selectedServIdsList.push(servId);
            const selectedServIdsListStr = selectedServIdsList.join(',');
            this.props.form.validateFields((err, values) => {
                const _this = this;
                if (values.flightDate) {
                    _this.getInitList(1, _this.state.flightListRows, Moment(values.flightDate._d).format('YYYY-MM-DD'), selectedServIdsListStr);
                }
                else {
                    _this.getInitList(1, _this.state.flightListRows, '', selectedServIdsListStr);
                }
            })
        }  
        flag = false;
    }

    render() {
        //贵宾厅列表
        const viploungeList = this.state.VIPLoungeList.map((data,index) => {
            if(this.state.indexFlag){//设置默认
                className='btnState';
                for(let j = 0;j< this.state.indexList.length;j++){
                    if(this.state.indexList[j] == index){
                        className='btnState btnLounge';
                        return (<button key={data.servId} className={className} onClick={this.VIPClick.bind(this,index,data.servId)}>{data.name}<br/><span>{data.serverNum}/{data.positionNum}</span></button>);
                    }
                    else{
                        className='btnState';
                    }
                }
            }
            else{
                className='btnState btnLounge';
            }
            return (<button key={data.servId} onClick={this.VIPClick.bind(this,index,data.servId)} className={className}>{data.name}<br/><span>{data.serverNum}/{data.positionNum}</span></button>);
        });
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };
        let { sortedInfo, filteredInfo } = this.state;
        sortedInfo = sortedInfo || {};
        filteredInfo = filteredInfo || {};
        const _this = this;
        const paginationFlight = {
            total: this.state.flightListLength,
            showSizeChanger: true,
            onShowSizeChange(current, pageSize) {
                _this.state.flightListPage = current;
                _this.state.flightListRows = pageSize;
            },
            onChange(current) {
                _this.state.flightListPage = current;
                if(current != 1){
                    if(_this.props.form.getFieldValue('flightDate')){
                        _this.getInitList(current,_this.state.flightListRows,Moment(_this.props.form.getFieldValue('flightDate')).format('YYYY-MM-DD'));
                    }
                    else{
                        _this.getInitList(current,_this.state.flightListRows,'');
                    }
                }
            }
        };
        const columns = [
            {
                title: '航班号',
                width: '10%',
                dataIndex: 'flightNo',
                render(text, record) {
                    return (
                        <div className="order"><a href="javascript:;" onClick={_this.showModalDetail.bind(_this,record)} style={{color:'#4778c7'}}>{text}</a></div>
                    )
                }
            }, {
                title: '人数',
                width: '10%',
                dataIndex: 'serverNum',
                render(text, record) {
                    return (
                        <div className="order">{text}</div>
                    )
                }
            },{
                title: '航段',
                width: '10%',
                render(text, record) {
                    return (
                        <div className="order">
                            <p>{text.flightDep}</p>-
                            <p>{text.flightArr}</p>
                        </div>
                    )
                }
            }, {
                title: '贵宾厅',
                width: '10%',
                dataIndex: 'serviceName',
                render(text, record) {
                    return (
                        <div className="order">{text}</div>
                    )
                }
            },  {
                title: '进出港',
                width: '10%',
                dataIndex: 'isInOrOut',
                filters: [
                    { text: '出港', value: '0' },
                    { text: '进港', value: '1' },
                ],
                render(text, record) {
                    return (
                        <div className="order">{record.isInOrOut == 0 ? '出港' : '进港'}</div>
                    )
                }
            }, {
                title: '起飞',
                width: '10%',
                render(text, record) {
                    let className1 = ''
                    if(text.flightDeptimePlanDate == ''){
                        className1 = 'isImportno'
                    }
                    let className = ''
                    if(text.flightDeptimeDate == '' ){
                        className = 'isImportno'
                    }
                    return (
                        <div className="order">
                            <p className={className1}>计划:{text.flightDeptimePlanDate}</p>
                            <p className={className}>实际:{text.flightDeptimeDate}</p>
                        </div>
                    )
                }
            }, {
                title: '降落',
                width: '10%',
                render(text, record) {
                    let className1 = ''
                    if(text.flightArrtimePlanDate == ''){
                        className1 = 'isImportno'
                    }
                    let className = ''
                    if(text.flightArrtimeDate == '' ){
                        className = 'isImportno'
                    }
                    return (
                        <div className="order">
                            <p className={className1}>计划:{text.flightArrtimePlanDate}</p>
                            <p className={className}>实际:{text.flightArrtimeDate}</p>
                        </div>
                    )
                }
            }, {
                title: '航班状态',
                width: '10%',
                dataIndex: 'flightState',
                filters: [
                    { text: '计划', value: 'Plan' },
                    { text: '起飞', value: 'Take off' },
                    { text: '到达', value: 'Arrivals' },
                    { text: '延误', value: 'Delay' },
                    { text: '取消', value: 'Cancel' },
                    { text: '备降', value: 'Alternate' },
                    { text: '返航', value: 'Return' },
                    { text: '提前取消', value: 'Advance cancel' }
                ],
                render(text, record) {
                    let color1 = '';
                    if(record.flightState == '计划' || record.flightState == '起飞' || record.flightState == '到达'){
                        color1 = '#47c771';
                    }
                    else{
                        color1 = '#f00';
                    }
                    return (
                        <div className="order" style={{color:color1}}>{text}</div>
                    )
                }
            }, {
                title: '机位',
                width: '10%',
                dataIndex:'flightPosition',
                render(text, record) {
                    return (
                        <div className="order">{text}</div>
                    )
                }
            }, {
                title: '调度状态',
                width: '10%',
                dataIndex: 'scheduleEventName',
                filters: _this.state.scheduleEventList, 
                render(text, record) {
                    return (
                        <div className="order">
                            <p>{record.scheduleTime}</p>
                            <p>{record.scheduleEventName}</p>
                        </div>
                    )
                }   
            }];

       
        return (
            <div>
                <div className="breadcrumb-box">
                    <div className="top-bar"></div>
                    <div className="breadcrumb">
                        <Breadcrumb>
                            <Breadcrumb.Item>订单管理</Breadcrumb.Item>
                            <Breadcrumb.Item>贵宾厅管理</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>

                 <div className="box">
                    <ul className="tit">
                        <li>
                            <a href="javascript:;" className="active">贵宾厅管理</a>
                        </li>
                    </ul>

                    <div className="lounge-box">
                        <div className="box-tit">
                            <Checkbox onChange={this.changeBox}>所有贵宾厅</Checkbox>
                            <a href="javascript:;" onClick={this.showModal} style={{color:'#4778c7',verticalAlign:'sub'}}>设置默认</a>
                            <Icon type={this.state.iconType} style={{float:'right',marginTop:10,fontSize:'20px',color:'#d0d0d0'}} onClick={this.changeIconType}/>
                        </div>
                        <div className="lounge-list" >
                            {viploungeList}
                        </div>
                    </div>
                    
                    <Form horizontal onSubmit={this.handleSubmit} style={{ marginTop: 44 }}>
                        <Row>
                            <Col span={8} >
                                <div style={{ float: 'left' }}>
                                    <FormItem labelInValue label="航班日期" {...formItemLayout}>
                                        {getFieldDecorator('flightDate', {
                                        })(
                                            <DatePicker />
                                            )}
                                    </FormItem>
                                </div>
                                <a href="javascript:;" onClick={this.clickToday} style={{display:'inline-block',marginTop:5,color:'#4778c7'}}>今天</a>&nbsp;
                                <a href="javascript:;" onClick={this.clickTomorrow} style={{display:'inline-block',color:'#4778c7'}}>明天</a>&nbsp; 
                                <a href="javascript:;" onClick={this.clickOtherDate} style={{display:'inline-block',color:'#4778c7'}}>后天</a>  
                            </Col>
                            <Col span={6}>
                                <FormItem labelInValue label="航班号" {...formItemLayout} >
                                    {getFieldDecorator('flightNo', {
                                    })(
                                        <AutoComplete
                                            dataSource={this.state.flightNoList}
                                            placeholder="请输入航班号"
                                            style={{ width: 140 }}
                                            />
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={7} >
                                <FormItem labelInValue label="服务完成" {...formItemLayout} >
                                    {getFieldDecorator('isRight', {
                                        initialValue:'0'
                                    })(
                                        <RadioGroup>
                                            <RadioButton value="1">是</RadioButton>
                                            <RadioButton value="0">否</RadioButton>
                                        </RadioGroup>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={3} >
                                <FormItem style={{ paddingBottom: 30 }}>
                                    <button className='btn-small' onClick={this.searchFlightList}>查&nbsp;&nbsp;询</button>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                    
                    <div className="search-result-list" >
                        <Table  columns={columns} dataSource={this.state.flightList}   className=" serveTable" pagination={paginationFlight} onChange={this.handleTableChange}/>
                        <p style={{marginTop:20}}>共搜索到{this.state.flightListLength}条数据</p>
                    </div>
                    <Modal title="默认设置"
                        key={Math.random() * Math.random()}
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        confirmLoading={this.state.confirmLoading}
                        onCancel={this.handleCancel}
                        >
                        <div>
                            <VIPLoungeList confirmSelect={this.confirmSelect}/>   
                        </div>
                    </Modal>

                    <div id="detail-msg">
                        <Modal title="详细信息"
                            key={Math.random() * Math.random()}
                            visible={this.state.visibleDetail}
                            onOk={this.handleOkDetail}
                            confirmLoading={this.state.confirmLoadingDetail}
                            onCancel={this.handleCancelDetail}
                            >
                            <div>
                                <VIPLoungeFlightDetail flightId={this.state.flightId} servId={this.state.servId}/>
                            </div>
                        </Modal>
                    </div>
                 </div>
            </div>
        )
    }
}

VIPLoungeManage = Form.create()(VIPLoungeManage);

export default VIPLoungeManage;