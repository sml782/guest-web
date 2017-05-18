import React from 'react';
import { hashHistory } from 'react-router';
import { Form, Row, Col, Input, Button, Icon, Select, message, Radio, Breadcrumb, Table, Popconfirm, Modal, Checkbox,DatePicker } from 'antd';
import { Link } from 'react-router';
import $ from 'jquery';
import { serveUrl, User, cacheData } from '../../utils/config';
import DeleteDialog from '../DeleteDialog';//引入删除弹框
import Moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const msg = '确认删除该产品吗?';
const url = "http://192.168.1.145:8887/";
let editData = {};

class EditableCell extends React.Component {
    state = {
        value: this.props.value,
        editable: false,
    }
    handleChange = (e) => {
        const value = e.target.value;
        this.setState({ value });
    }
    check = () => {
        this.setState({ editable: false });
        if (this.props.onChange) {
            this.props.onChange(this.state.value);
        }
    }
    edit = () => {
        this.setState({ editable: true });
    }
    render() {
        const { value, editable } = this.state;
        return (
            <div className="editable-cell">
                {
                    editable ?
                        <div className="editable-cell-input-wrapper">
                            <Input
                                value={value}
                                onChange={this.handleChange}
                                onPressEnter={this.check}
                                />
                            <Icon
                                type="check"
                                className="editable-cell-icon-check"
                                onClick={this.check}
                                />
                        </div>
                        :
                        <div className="editable-cell-text-wrapper">
                            {value || ' '}
                            <Icon
                                type="edit"
                                className="editable-cell-icon"
                                onClick={this.edit}
                                />
                        </div>
                }
            </div>
        );
    }
}

class LoungeFlightDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            flightOldData: [],
            flightDateSource: [],//航班时间信息
            boardDataSource: [],//登机口信息
            scheduleEventList: [],//已添加调度事件列表
            allScheduleEventList: [],//获取所有调度事件的下拉框列表
            passengerList:[],//旅客信息列表
            flightState:null,
            flightDateSourceEdit:[],
            isInOrOut:null,
            //计划
            planStartValue: null,
            planEndValue: null,
            planEndOpen: false,
            planStartDate:null,
            planEndDate:null,
            //预计
            readyStartValue: null,
            readyEndValue: null,
            readyEndOpen: false,
            readyStartDate:null,
            readyEndDate:null,
            //实际
            startValue: null,
            endValue: null,
            endOpen: false,
            startDate:null,
            endDate:null,
            flightLogList:[],
            updateState:true,//修改航班的标志
        }
    }
    componentWillMount() {
         if(User.isLogin()){
        } else{
            hashHistory.push('/login');
        }
        this.getFlightDetail();
        this.updateFlightLog();
        const _this = this;
        //根据航班id查该航班已经添加的调度事件
        $.ajax({
            type: "GET",
            // url: "http://192.168.0.161:8080/get-schedule-event-by-flight-id",
            url: serveUrl + "flight-info/get-schedule-event-by-flight-id",
            data: { access_token: User.appendAccessToken().access_token, flightId: _this.props.flightId },
            success: function (data) {
                if (data.status == 200) {
                    data.data.map(k => {
                        if(k.scheduleEventId){
                            k.key = k.scheduleEventId;
                        }
                        else{
                            k.key = -1;
                        }
                        k.flightScheduleUpdateTime = Moment(k.flightScheduleUpdateTime).format('MM-DD HH:mm')
                    });
                    _this.setState({
                        scheduleEventList: data.data
                    });
                }
            }
        });
        
        //获取旅客信息列表
        $.ajax({
            type: "GET",
            url: serveUrl + "guest-order/getPassengerByFlightId",
            data: { access_token: User.appendAccessToken().access_token,flightId:_this.props.flightId,servId:_this.props.servId},
            success: function (data) {
                if (data.status == 200) {
                    let passenger = '';
                    data.data.map(k => {
                        k.key = k.orderId;
                        k.numberOfPeople = k.passengerList.length;
                        k.passenger = k.passengerList.join(",");
                        k.createTime = Moment(k.createTime).format('MM-DD HH:mm')
                    });
                    _this.setState({
                        passengerList: data.data
                    });
                }
            }
        });
    }
    //更新航班日志
    updateFlightLog = ()=>{
        const _this = this;
        $.ajax({
            type: "GET",
            // url: "http://192.168.0.111:8080/flightLog",
            url: serveUrl + "flight-info/flightLog",
            data: { access_token: User.appendAccessToken().access_token, flightId: _this.props.flightId },
            success: function (data) {
                if (data.status == 200) {
                    data.data.map(k => {
                        k.key = k.flightLogId;
                        const str1 = k.updateMessage.substring(1,k.updateMessage.length-1);
                        k.updateMessage = str1.replace(new RegExp(/(")/g),'');
                    });
                    _this.setState({
                        flightLogList: data.data
                    });
                }
            }
        });
    }
    getFlightDetail=()=>{
        const _this = this;
        //获取航班详情
        $.ajax({
            type: "GET",
            url: serveUrl+"flight-info/get-flight-view",
            // url: "http://192.168.1.130:8080/get-flight-view",
            data: { access_token: User.appendAccessToken().access_token, flightId: _this.props.flightId },
            success: function (data) {
                if (data.status == 200) {
                    _this.setState({
                        flightState:data.data.flightState
                    });
                    
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
                    const flightDeptimePlanDate = data.data.flightDeptimePlanDate;
                    const flightArrtimePlanDate = data.data.flightArrtimePlanDate;
                    const flightDeptimeReadyDate = data.data.flightDeptimeReadyDate;
                    const flightArrtimeReadyDate = data.data.flightArrtimeReadyDate;
                    const flightDeptimeDate = data.data.flightDeptimeDate;
                    const flightArrtimeDate = data.data.flightArrtimeDate;

                    data.data.flightDeptimePlanDate =data.data.flightDeptimePlanDate == null?'':Moment(data.data.flightDeptimePlanDate).format('MM-DD HH:mm');
                    data.data.flightArrtimePlanDate =data.data.flightArrtimePlanDate == null?'': Moment(data.data.flightArrtimePlanDate).format('MM-DD HH:mm');
                    data.data.flightDeptimeReadyDate =data.data.flightDeptimeReadyDate == null?'': Moment(data.data.flightDeptimeReadyDate).format('MM-DD HH:mm');
                    data.data.flightArrtimeReadyDate =data.data.flightArrtimeReadyDate == null?'': Moment(data.data.flightArrtimeReadyDate).format('MM-DD HH:mm');
                    data.data.flightDeptimeDate =data.data.flightDeptimeDate == null?'': Moment(data.data.flightDeptimeDate).format('MM-DD HH:MM');
                    data.data.flightArrtimeDate =data.data.flightArrtimeDate == null?'': Moment(data.data.flightArrtimeDate).format('MM-DD HH:mm');
                    data.data.serverComplete = data.data.serverComplete.toString();
                    data.data.isInOrOut = data.data.isInOrOut.toString();
                    _this.state.isInOrOut = data.data.isInOrOut;
                    _this.setState({
                        flightOldData: data.data,
                        //计划
                        planStartDate:data.data.flightDeptimePlanDate,
                        planEndDate:data.data.flightArrtimePlanDate,
                        //预计
                        readyStartDate:data.data.flightDeptimeReadyDate,
                        readyEndDate:data.data.flightArrtimeReadyDate,
                        //实际
                        startDate:data.data.flightDeptimeDate,
                        endDate:data.data.flightArrtimeDate,

                        isInOrOut:data.data.isInOrOut
                    });
                    //获取所有调度事件下拉框
                    $.ajax({
                        type: "GET",
                        // url: "http://192.168.0.161:8080/get-schedule-event-drop-down-box",
                        url: serveUrl + "flight-info/get-schedule-event-drop-down-box",
                        data: { access_token: User.appendAccessToken().access_token,flightId: _this.props.flightId,isInOrOut:_this.state.isInOrOut,scheduleType:'休息室服务' },
                        success: function (data) {
                            if (data.status == 200) {
                                data.data.map(k => {
                                    k.key = k.scheduleEventId;
                                });
                                _this.setState({
                                    allScheduleEventList: data.data
                                });
                            }
                        }
                    });
                }
            }
        });
    }
    componentDidMount = () => {
        $(".ant-modal").css({ width: 1000, height: 800, top: '50%', left: '50%', marginTop: '-400px',marginLeft:'-500px' })
        $(".ant-modal-footer").hide();
        $(".ant-modal-content").css({ width: 1000, height: 800 });
        $(".no-table-head thead").hide();
        $(".scheduleEventTime .ant-col-5").removeClass("ant-col-5").addClass("ant-col-9");
        $(".scheduleEventTime .ant-col-19").removeClass("ant-col-19").addClass("ant-col-15");
        $(".ant-calendar-picker").css({minWidth:147});

        this.props.form.setFieldsValue({'scheduleEventTime': Moment(Date.now()) });
    }
    componentDidUpdate=()=>{
        $(".ant-pagination").hide();
        $(".flight-detail-left table,.flight-detail-right table").css({border:'1px solid #f0f0f0'});
        $(".flight-detail-left table tr,.flight-detail-right table tr").css({backgroundColor:'#fff'});
    }
    //新增调度
    addScheduleEvent = () => {
        $(".newScheduleEvent").show();
        $(".addScheduleEventText").hide();
        $(".saveScheduleEventText").show();
    }
    //保存调度
    saveScheduleEvent=()=>{  
        const _this = this;
        var formatData = {
            data: [
                {
                    flightScheduleEventId: null,
                    flightId: parseInt(_this.props.flightId),
                    scheduleEventId:parseInt(_this.props.form.getFieldValue('scheduleEvent')),
                    scheduleTime: Moment(_this.props.form.getFieldValue('scheduleEventTime')).format('YYYY-MM-DD HH:mm:ss'),
                    remark:_this.props.form.getFieldValue('remark')
                }
            ]
        }
        $.ajax({
            type: "POST",
            contentType: 'application/json;charset=utf-8',
            url: serveUrl+"flight-info/saveOrUpdateFlightScheduleEvent?access_token="+User.appendAccessToken().access_token,
            // url: "http://192.168.0.161:8080/saveOrUpdateFlightScheduleEvent?access_token="+User.appendAccessToken().access_token,
            data: JSON.stringify(formatData),
            success: function (data) {
                if (data.status == 200) {
                    $(".newScheduleEvent").hide();
                    $(".addScheduleEventText").show();
                    $(".saveScheduleEventText").hide();
                    _this.props.form.setFieldsValue({
                        scheduleEvent:''
                    })
                    _this.props.form.resetFields(['scheduleEventTime']);
                    //获取调度列表
                    $.ajax({
                        type: "GET",
                        // url: "http://192.168.0.161:8080/get-schedule-event-by-flight-id",
                        url: serveUrl + "flight-info/get-schedule-event-by-flight-id",
                        data: { access_token: User.appendAccessToken().access_token, flightId: _this.props.flightId },
                        success: function (data) {
                            if (data.status == 200) {
                                data.data.map(k => {
                                    if(k.scheduleEventId){
                                        k.key = k.scheduleEventId;
                                    }
                                    else{
                                        k.key = -1;
                                    }
                                    k.flightScheduleUpdateTime = Moment(k.flightScheduleUpdateTime).format('MM-DD HH:mm')
                                });
                                _this.setState({
                                    scheduleEventList: data.data
                                });
                            }
                        }
                    }); 
                }
            }
        });  
    }
    //10分钟后
    tenMinAfter=()=>{
        if(this.props.form.getFieldValue('scheduleEventTime') == undefined){
            this.props.form.setFieldsValue({'scheduleEventTime': Moment(Date.now()+600000)});
        }
        else{
            const nowDate = new Date(this.props.form.getFieldValue('scheduleEventTime'));
            this.props.form.setFieldsValue({'scheduleEventTime': Moment(nowDate.getTime()+600000)});
        }
    }
    //30分钟后
    thirtyMinAfter=()=>{
        if(this.props.form.getFieldValue('scheduleEventTime') == undefined){
            this.props.form.setFieldsValue({'scheduleEventTime': Moment(Date.now()+1800000)});
        }
        else{
            const nowDate = new Date(this.props.form.getFieldValue('scheduleEventTime'));
            this.props.form.setFieldsValue({'scheduleEventTime': Moment(nowDate.getTime()+1800000)});
        }
    }
    onCellChange = (index, key) => {
        return (value) => {
            const dataSource = this.state.flightDateSourceEdit;
            dataSource[index][key] = value;
            this.setState({
                flightDateSourceEdit:dataSource
            });
        };
    }
    onCellChange1 = (index, key) => {
        return (value) => {
            const dataSource = this.state.boardDataSource;
            dataSource[index][key] = value;
            this.setState({
                boardDataSource:dataSource
            });
        };
    }
    //修改航班
    editFlight=()=>{
        $(".edit-flight").hide();
        $(".save-flight").show();
        this.setState({
            updateState:false
        });
    }
    //航班状态修改
    flightStateChange=(value)=>{
        this.setState({
            flightState: value
        });
    }
    //保存航班信息
    saveFlight=()=>{
        //保存航班
        const _this = this;
        if(_this.state.readyStartDate == '' || _this.state.readyStartDate == null || _this.state.readyStartDate == 'Invalid date' || _this.state.readyStartDate == undefined){
            _this.state.readyStartDate = '';
        }
        else{
            _this.state.readyStartDate = Moment(_this.state.readyStartDate).format('YYYY-MM-DD HH:mm:ss');
        }

        if(_this.state.readyEndDate == '' || _this.state.readyEndDate == null || _this.state.readyEndDate == 'Invalid date' || _this.state.readyEndDate == undefined){
            _this.state.readyEndDate = '';
        }
        else{
            _this.state.readyEndDate = Moment(_this.state.readyEndDate).format('YYYY-MM-DD HH:mm:ss');
        }

        if(_this.state.startDate == '' || _this.state.startDate == null || _this.state.startDate == 'Invalid date' || _this.state.startDate == undefined){
            _this.state.startDate = '';
        }
        else{
            _this.state.startDate = Moment(_this.state.startDate).format('YYYY-MM-DD HH:mm:ss');
        }

        if(_this.state.endDate == '' || _this.state.endDate == null || _this.state.endDate == 'Invalid date' || _this.state.endDate == undefined){
            _this.state.endDate = '';
        }
        else{
            _this.state.endDate = Moment(_this.state.endDate).format('YYYY-MM-DD HH:mm:ss');
        }

        const formatData = {
            data: [
                {
                    flightId: parseInt(_this.props.flightId),
                    flightDeptimeReadyDate:_this.state.readyStartDate,
                    flightArrtimeReadyDate:_this.state.readyEndDate,
                    flightDeptimeDate:_this.state.startDate,
                    flightArrtimeDate:_this.state.endDate,
                    flightState:_this.props.form.getFieldValue('flightState'),
                    isInOrOut:parseInt(_this.props.form.getFieldValue('isInOrOut')),
                    flightPosition:_this.props.form.getFieldValue('flightPosition'),
                    planNo:_this.props.form.getFieldValue('planNo'),
                    boardGate:_this.props.form.getFieldValue('boardGate'),
                    boardState:_this.props.form.getFieldValue('boardState'),
                }
            ]
        }
        
        $.ajax({
            type: "POST",
            contentType: 'application/json;charset=utf-8',
            url: serveUrl+"flight-info/flight-update?access_token="+User.appendAccessToken().access_token,
            // url: "http://192.168.0.111:8080/flight-update?access_token="+User.appendAccessToken().access_token,
            data: JSON.stringify(formatData),
            success: function (data) {
                if (data.status == 200) {
                    $(".edit-flight").show();
                    $(".save-flight").hide();
                    _this.setState({
                        updateState:true
                    });
                    // //获取航班详情
                    _this.getFlightDetail();
                    _this.updateFlightLog();
                }
            }
        });  
    }

    //服务完成
    serverComplete=(e)=>{
        const _this = this;
        if(e.target.value == '1'){
            const formatData = {
                flightId: parseInt(_this.props.flightId),
                serverComplete:parseInt(e.target.value)
            }
            $.ajax({
                type: "POST",
                contentType: 'application/json;charset=utf-8',
                url: serveUrl+"guest-order/updateServerComplete?access_token="+User.appendAccessToken().access_token,
                data: JSON.stringify(formatData),
                success: function (data) {
                    if (data.status == 200) {
                        //根据航班id查该航班已经添加的调度事件
                        $.ajax({
                            type: "GET",
                            // url: "http://192.168.0.161:8080/get-schedule-event-by-flight-id",
                            url: serveUrl + "flight-info/get-schedule-event-by-flight-id",
                            data: { access_token: User.appendAccessToken().access_token, flightId: _this.props.flightId },
                            success: function (data) {
                                if (data.status == 200) {
                                    data.data.map(k => {
                                        if(k.scheduleEventId){
                                            k.key = k.scheduleEventId;
                                        }
                                        else{
                                            k.key = -1;
                                        }
                                        k.flightScheduleUpdateTime = Moment(k.flightScheduleUpdateTime).format('MM-DD HH:mm')
                                    });
                                    _this.setState({
                                        scheduleEventList: data.data
                                    });
                                }
                            }
                        });
                    }
                }
            }); 
        }
        else{
            const formatData = {
                flightId: parseInt(_this.props.flightId),
                serverComplete:parseInt(e.target.value)
            }
            $.ajax({
                type: "POST",
                contentType: 'application/json;charset=utf-8',
                url: serveUrl+"guest-order/updateServerComplete?access_token="+User.appendAccessToken().access_token,
                data: JSON.stringify(formatData),
                success: function (data) {
                    if (data.status == 200) {
                        //根据航班id查该航班已经添加的调度事件
                        $.ajax({
                            type: "GET",
                            // url: "http://192.168.0.161:8080/get-schedule-event-by-flight-id",
                            url: serveUrl + "flight-info/get-schedule-event-by-flight-id",
                            data: { access_token: User.appendAccessToken().access_token, flightId: _this.props.flightId },
                            success: function (data) {
                                if (data.status == 200) {
                                    data.data.map(k => {
                                        if(k.scheduleEventId){
                                            k.key = k.scheduleEventId;
                                        }
                                        else{
                                            k.key = -1;
                                        }
                                        k.flightScheduleUpdateTime = Moment(k.flightScheduleUpdateTime).format('MM-DD HH:mm')
                                    });
                                    _this.setState({
                                        scheduleEventList: data.data
                                    });
                                }
                            }
                        });
                    }
                }
            }); 
        }
    }

    //计划时间
    disabledPlanStartDate = (planStartValue) => {
        const planEndValue = this.state.planEndValue;
        if (!planStartValue || !planEndValue) {
            return false;
        }
        return planStartValue.valueOf() > planEndValue.valueOf();
    }

    disabledPlanEndDate = (planEndValue) => {
        const planStartValue = this.state.planStartValue;
        if (!planEndValue || !planStartValue) {
            return false;
        }
        return planEndValue.valueOf() <= planStartValue.valueOf();
    }

    onPlanChange = (field, value) => {
        this.setState({
            [field]: value,
        });
    }

    onPlanStartChange = (value) => {
        this.onPlanChange('planStartValue', value);
        this.state.planStartDate = Moment(value._d).format('YYYY-MM-DD');
        this.setState({
            planStartDate:this.state.planStartDate
        });
    }

    onPlanEndChange = (value) => {
        this.onPlanChange('planEndValue', value);
        this.state.planEndDate = Moment(value._d).format('YYYY-MM-DD');
        this.setState({
            planEndDate:this.state.planEndDate
        });
    }

    handlePlanStartOpenChange = (open) => {
        if (!open) {
            this.setState({ planEndOpen: true });
        }
    }

    handlePlanEndOpenChange = (open) => {
        this.setState({ planEndOpen: open });
    }
    //预计时间
    disabledReadyStartDate = (readyStartValue) => {
        const readyEndValue = this.state.readyEndValue;
        if (!readyStartValue || !readyEndValue) {
            return false;
        }
        return readyStartValue.valueOf() > readyEndValue.valueOf();
    }

    disabledReadyEndDate = (readyEndValue) => {
        const readyStartValue = this.state.readyStartValue;
        if (!readyEndValue || !readyStartValue) {
            return false;
        }
        return readyEndValue.valueOf() <= readyStartValue.valueOf();
    }

    onReadyChange = (field, value) => {
        this.setState({
            [field]: value,
        });
    }

    onReadyStartChange = (value) => {
        this.onReadyChange('readyStartValue', value);
        this.state.readyStartDate = Moment(value._d).format('YYYY-MM-DD HH:mm');
        this.setState({
            readyStartDate:this.state.readyStartDate
        });
    }

    onReadyEndChange = (value) => {
        this.onReadyChange('readyEndValue', value);
        this.state.readyEndDate = Moment(value._d).format('YYYY-MM-DD  HH:mm');
        this.setState({
            readyEndDate:this.state.readyEndDate
        });
    }

    handleReadyStartOpenChange = (open) => {
        if (!open) {
            this.setState({ readyEndOpen: true });
        }
    }

    handleReadyEndOpenChange = (open) => {
        this.setState({ readyEndOpen: open });
    }

    //实际时间
    disabledStartDate = (startValue) => {
        const endValue = this.state.endValue;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    }

    disabledEndDate = (endValue) => {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    }

    onChange = (field, value) => {
        this.setState({
            [field]: value,
        });
    }

    onStartChange = (value) => {
        this.onChange('startValue', value);
        this.state.startDate = Moment(value._d).format('YYYY-MM-DD  HH:mm');
        this.setState({
            startDate:this.state.startDate
        });
    }

    onEndChange = (value) => {
        this.onChange('endValue', value);
        this.state.endDate = Moment(value._d).format('YYYY-MM-DD  HH:mm');
        this.setState({
            endDate:this.state.endDate
        });
    }

    handleStartOpenChange = (open) => {
        if (!open) {
            this.setState({ endOpen: true });
        }
    }

    handleEndOpenChange = (open) => {
        this.setState({ endOpen: open });
    }
    render() {
        const { planStartValue, planEndValue, planEndOpen } = this.state;
        const { readyStartValue, readyEndValue, readyEndOpen } = this.state;
        const { startValue, endValue, endOpen } = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };
        //所有调度事件下拉框
        const Options = this.state.allScheduleEventList.map(data => <Option key={data.scheduleEventId} value={data.scheduleEventId.toString()}>{data.name}</Option>);
        const _this = this;

        const flightUpdateColumns = [
            {
                title: '航班更新',
                width: '33%',
                dataIndex: 'updateMessage',
                render(text, record) {
                    return (
                        <div className="order">{text}</div>
                    )
                }
            }, {
                title: '更新人',
                width: '33%',
                dataIndex: 'operatorName',
                render(text, record,index) {
                    return (
                        <div className="order">{text}</div>
                    )
                }
            }, {
                title: '更新时间',
                dataIndex: 'createTime',
                render(text, record,index) {
                    return (
                        <div className="order">{text}</div>
                    )
                }
            }
        ];

        const guestColumns = [
            {
                title: '厅房',
                width: '16%',
                dataIndex: 'roomName',
                render(text, record) {
                    let className= '';
                    if(record.booleanImportant){
                        className = 'red';
                    }
                    return (
                        <div className={className}>{text}</div>
                    )
                }
            }, {
                title: '旅客',
                width: '22%',
                dataIndex: 'passenger',
                render(text, record) {
                    let className= '';
                    if(record.booleanImportant){
                        className = 'red';
                    }
                    return (
                        <div className={className}>{text}</div>
                    )
                }
            },  {
                title: '客户名称',
                width: '16%',
                dataIndex: 'customerName',
                render(text, record) {
                    let className= '';
                    if(record.booleanImportant){
                        className = 'red';
                    }
                    return (
                        <div className={className}>{text}</div>
                    )
                }
            }, {
                title: '人数',
                width: '10%',
                dataIndex: 'serverNum',
                render(text, record) {
                    let className= '';
                    if(record.booleanImportant){
                        className = 'red';
                    }
                    return (
                        <div className={className}>{text}</div>
                    )
                }
            }, {
                title: '状态',
                width: '16%',
                render(text, record) {
                    let className= '';
                    let fontColor = ''
                    if(record.booleanImportant){
                        className = 'red';
                        fontColor = 'red';
                    }
                    else{
                        fontColor = '#4778c7';
                    }
                    return (
                        <div className="order">
                            <p className={className}>{text.orderStatus}</p>
                            <p style={{color:fontColor,cursor:'pointer'}} className={className}>{text.orderNo}</p>
                        </div>
                    )
                }
            }, {
                title: '登记时间',
                dataIndex: 'serverCreateTime',
                render(text, record) {
                    let className= '';
                    if(record.booleanImportant){
                        className = 'red';
                    }
                    return (
                        <div className={className}>{text}</div>
                    )
                }
            }
        ];

        const dispatchColumns = [
            {
                title: '服务事件',
                width: '25%',
                dataIndex: 'name',
                render(text, record) {
                    return (
                        <div className="order">{text}</div>
                    )
                }
            },{
                title: '备注说明',
                width: '25%',
                dataIndex: 'remark',
                render(text, record) {
                    return (
                        <div className="order">{text}</div>
                    )
                }
            },{
                title: '更新人',
                width: '25%',
                dataIndex: 'scheduleUpdateUserName',
                render(text, record) {
                    return (
                        <div className="order">{text}</div>
                    )
                }
            }, {
                title: '更新时间',
                width: '25%',
                dataIndex: 'flightScheduleUpdateTime',
                render(text, record) {
                    return (
                        <div className="order">{text}</div>
                    )
                }
            }
        ];

        return (
            <div className="flight-detail-msg">
                <div className="flight-detail-left fl " >
                    <div className="flight-detail-left-tit mb30">
                        <p className="flight-detail-tit fl">航班信息</p>
                        <p className="fr blue edit-flight" onClick={this.editFlight}>修改航班</p>
                        <p className="fr blue save-flight" style={{display:'none'}} onClick={this.saveFlight}>保存航班信息</p>
                    </div>
                    <FormItem label="航班号" {...formItemLayout} hasFeedback>
                        {getFieldDecorator('flightNo', {
                        })(
                            <p>{this.state.flightOldData.flightNo}</p>
                            )}
                    </FormItem>
                    <FormItem label="航班状态" {...formItemLayout} hasFeedback>
                        {getFieldDecorator('flightState', {
                            initialValue: this.state.flightOldData.flightState
                        })(
                            <Select style={{ width: 320 }}  onChange={this.flightStateChange} disabled={this.state.updateState}>
                                <Option value="Plan">计划</Option>
                                <Option value="Take off">起飞</Option>
                                <Option value="Arrivals" >到达</Option>
                                <Option value="Delay">延误</Option>
                                <Option value="Cancel">取消</Option>
                                <Option value="Alternate">备降</Option>
                                <Option value="Return">返航</Option>
                                <Option value="Advance cancel">提前取消</Option>
                            </Select>
                            )}
                    </FormItem>
                    <FormItem label="进出港" {...formItemLayout} hasFeedback>
                        {getFieldDecorator('isInOrOut', {
                            initialValue:this.state.flightOldData.isInOrOut
                        })( 
                            <RadioGroup>
                                <RadioButton value="1" disabled={this.state.updateState}>进港</RadioButton>
                                <RadioButton value="0" disabled={this.state.updateState}>出港</RadioButton>
                            </RadioGroup>
                        )}
                    </FormItem>
                    <FormItem label="机位" {...formItemLayout} hasFeedback>
                        {getFieldDecorator('flightPosition', {
                            initialValue:this.state.flightOldData.flightPosition
                        })(
                            <Input style={{ width: 320 }} disabled={this.state.updateState}/>
                            )}
                    </FormItem>
                    <FormItem label="机号" {...formItemLayout} hasFeedback>
                        {getFieldDecorator('planNo', {
                            initialValue:this.state.flightOldData.planNo
                        })(
                            <Input style={{ width: 320 }} disabled={this.state.updateState}/>
                            )}
                    </FormItem>
                    <FormItem label="登机口" {...formItemLayout} hasFeedback>
                        {getFieldDecorator('boardGate', {
                            initialValue:this.state.flightOldData.boardGate
                        })(
                            <Input style={{ width: 320 }} disabled={this.state.updateState}/>
                            )}
                    </FormItem>
                    <FormItem label="登机状态" {...formItemLayout} hasFeedback>
                        {getFieldDecorator('boardState', {
                            initialValue: this.state.flightOldData.boardState
                        })(
                            <Select style={{ width: 320 }} onChange={this.flightStateChange} disabled={this.state.updateState}>
                                <Option value="开始值机">开始值机</Option>
                                <Option value="值机结束">值机结束</Option>
                                <Option value="开始登机">开始登机</Option>
                                <Option value="催促登机">催促登机</Option>
                                <Option value="登机结束">登机结束</Option>
                            </Select>
                            )}
                    </FormItem>
                    <FormItem label="计划时间" {...formItemLayout} hasFeedback>
                        {getFieldDecorator("planTime", {
                            rules: [{  message: '请选择计划时间!' }],
                        })(
                            <div>
                                <DatePicker
                                    disabledDate={this.disabledPlanStartDate}
                                    format="MM-DD HH:mm"
                                    value={planStartValue}
                                    placeholder={this.state.planStartDate}
                                    style={{ width: 147 }}
                                    disabled 
                                    showTime
                                    onChange={this.onPlanStartChange}
                                    onOpenChange={this.handlePlanStartOpenChange}
                                    />&nbsp;&nbsp;~&nbsp;&nbsp;
                                <DatePicker
                                    disabledDate={this.disabledPlanEndDate}
                                    format="MM-DD HH:mm"
                                    value={planEndValue}
                                    placeholder={this.state.planEndDate}
                                    style={{ width: 147 }}
                                    disabled 
                                    showTime
                                    onChange={this.onPlanEndChange}
                                    open={planEndOpen}
                                    onOpenChange={this.handlePlanEndOpenChange}
                                    />
                            </div>
                            )}
                    </FormItem>
                    <FormItem label="预计时间" {...formItemLayout} hasFeedback>
                        {getFieldDecorator("readyTime", {
                            rules: [{  message: '请选择预计时间!' }],
                        })(
                            <div>
                                <DatePicker
                                    disabledDate={this.disabledReadyStartDate}
                                    format="MM-DD HH:mm"
                                    value={readyStartValue}
                                    placeholder={this.state.readyStartDate}
                                    style={{ width: 147 }}
                                    showTime
                                    disabled={this.state.updateState}
                                    onChange={this.onReadyStartChange}
                                    onOpenChange={this.handleReadyStartOpenChange}
                                    />&nbsp;&nbsp;~&nbsp;&nbsp;
                                <DatePicker
                                    disabledDate={this.disabledReadyEndDate}
                                    format="MM-DD HH:mm"
                                    value={readyEndValue}
                                    placeholder={this.state.readyEndDate}
                                    style={{ width: 147 }}
                                    showTime
                                    disabled={this.state.updateState}
                                    onChange={this.onReadyEndChange}
                                    open={readyEndOpen}
                                    onOpenChange={this.handleReadyEndOpenChange}
                                    />
                            </div>
                            )}
                    </FormItem>
                    <FormItem label="实际时间" {...formItemLayout} hasFeedback>
                        {getFieldDecorator("time", {
                            rules: [{  message: '请选择实际时间!' }],
                        })(
                            <div>
                                <DatePicker
                                    disabledDate={this.disabledStartDate}
                                    format="MM-DD HH:mm"
                                    value={startValue}
                                    style={{ width: 147}}
                                    showTime
                                    disabled={this.state.updateState}
                                    placeholder={this.state.startDate}
                                    onChange={this.onStartChange}
                                    onOpenChange={this.handleStartOpenChange}
                                    />&nbsp;&nbsp;~&nbsp;&nbsp;
                                <DatePicker
                                    disabledDate={this.disabledEndDate}
                                    format="MM-DD HH:mm"
                                    value={endValue}
                                    style={{ width: 147 }}
                                    showTime
                                    disabled={this.state.updateState}
                                    placeholder={this.state.endDate}
                                    onChange={this.onEndChange}
                                    open={endOpen}
                                    onOpenChange={this.handleEndOpenChange}
                                    />
                            </div>
                            )}
                    </FormItem>
                    <Table columns={flightUpdateColumns} dataSource={this.state.flightLogList} className="serveTable mb30" />
                    
                </div>
                <div className="flight-detail-right fr ">
                    <p className="flight-detail-tit mb30">旅客信息</p>
                    <Table columns={guestColumns} dataSource={this.state.passengerList} className="serveTable mb30" />

                    <div className="flight-detail-left-tit mb30">
                        <p className="flight-detail-tit fl">服务信息</p>
                        <p className="fr blue addScheduleEventText" onClick={this.addScheduleEvent}>新增服务</p>
                        <p className="fr blue saveScheduleEventText" onClick={this.saveScheduleEvent} style={{display:'none'}}>保存服务</p>
                    </div>
                    <div className="newScheduleEvent" style={{display:'none'}}>
                        <FormItem label="调度事件" {...formItemLayout} hasFeedback>
                            {getFieldDecorator('scheduleEvent', {
                            })(
                                <Select style={{ height: 28, width: 160 }}>
                                    {Options}
                                </Select>
                                )}
                        </FormItem>
                        <Row>
                            <div style={{ float: 'left' }} className="scheduleEventTime">
                                <FormItem label="调度时间" {...formItemLayout} hasFeedback>
                                    {getFieldDecorator('scheduleEventTime', {
                                    })(
                                        <DatePicker
                                                format="MM-DD HH:mm"
                                                showTime
                                                style={{ width: 160 }}
                                            />
                                        )}
                                </FormItem>
                            </div>
                            <a href="javascript:;" style={{ color: '#4778c7', marginLeft: 30 }} onClick={this.tenMinAfter}>10分钟后</a>&nbsp;&nbsp;<a href="javascript:;" style={{ color: '#4778c7' }} onClick={this.thirtyMinAfter}>30分钟后</a>
                        </Row>
                        <FormItem label="备注说明" {...formItemLayout}>
                            {getFieldDecorator("remark", {
                                rules: [{message: '请输入备注说明!' }],
                            })(
                                <Input type="textarea" id="control-textarea" rows="3" style={{height:112}} />
                                )}
                        </FormItem>
                    </div>
                    <FormItem labelInValue label="服务完成" {...formItemLayout} hasFeedback>
                        {getFieldDecorator('isRight', {
                            initialValue:this.state.flightOldData.serverComplete
                        })( 
                                <RadioGroup onChange={this.serverComplete}>
                                    <RadioButton value="1">是</RadioButton>
                                    <RadioButton value="0">否</RadioButton>
                                </RadioGroup>
                        )}
                    </FormItem>
                    <Table columns={dispatchColumns} dataSource={this.state.scheduleEventList} className="serveTable mb30" />
                </div>
            </div>
        )
    }
}

LoungeFlightDetail = Form.create()(LoungeFlightDetail);
export default LoungeFlightDetail;

