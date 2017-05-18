import React from 'react';
import { hashHistory } from 'react-router';
import { Form, Row, Col, Input, Button, Icon, Select, message, Radio, Breadcrumb, Table, Popconfirm, Modal, Checkbox, AutoComplete } from 'antd';
import { Link } from 'react-router';
import $ from 'jquery';
import moment from 'moment';
import { serveUrl, User, cacheData } from '../../utils/config';
import DeleteDialog from '../DeleteDialog';//引入删除弹框
import PassengerD from './PassengerD'

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
            orderType:null,
            AutoClientList:[],
            customerId:null,
            customerName:null,
            passengerList:null,
             data: [{
                key: '0',
                name: {
                value: '',
                },
                passengerType: {
                value: '',
                },
                sitNo: {
                editable: false,
                value: '',
                },
            }],
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
             url: serveUrl+'guest-order/getOrderServiceRecord?access_token='+ User.appendAccessToken().access_token,
             data:{orderId:_this.props.orderId},
             success: function(data){
                _this.setState({
                    agentDynamics:data.data
                })
                
            }
         });

         //机构客户名称的列表（模糊匹配）
            $.ajax({
                type: "GET",
                url: serveUrl + "guest-employee/getEmployeeDropdownListByRoleId?access_token="+ User.appendAccessToken().access_token,
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

         $.ajax({
                type: "GET",
                url:serveUrl+'guest-order/view?access_token='+User.appendAccessToken().access_token,
                //url:"http://192.168.0.104:8887/view?access_token="+User.appendAccessToken().access_token,
                data:{orderId:_this.props.orderId},
                success: function(data) {
                     data.data.passengerList.map((v,index)=>{
                        v.passengerType = v.passengerType == 0 ? '主宾' : '随行';
                    })
                    const passengerList = data.data.passengerList.map((v,index)=>{
                          return  {
                                key: index,
                                name: {
                                value: v.name,
                                },
                                passengerType: {
                                value: v.passengerType,
                                },
                                sitNo: {
                                editable: false,
                                value: v.sitNo,
                                },
                            }
                    })
                    
                    _this.setState({
                        passengerList:data.data.passengerList,
                        orderData:data.data,
                        data:passengerList,
                        consign:data.data.consign == 0 ? false:true,
                        printCheck:data.data.printCheck == 0 ? false:true,
                        securityCheck:data.data.securityCheck == 0 ? false:true,
                        serverCardNoClick:data.data.serverCardNo == null ? false:true,
                        vipCardClick:data.data.vipCard == null ? false:true,
                        cashClick:data.data.cash == null ? false:true,
                        agentPerson:data.data.agentPerson,
                        agentPersonName:data.data.agentPersonName,
                        agentComplete:data.data.agentComplete,
                        orderType:data.data.orderType
                    })

                }
            });
    }

    handleSubmit = (e) => {
        const _this = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let agent = null;
                if(null != values.Agent && values.Agent.split('&').length > 1){
                    agent = values.Agent.split('&');
                }
                _this.state.data.map((v,index)=>{
                    _this.state.passengerList[v.key].sitNo = v.sitNo.value
                })
                 _this.state.passengerList.map((v,index)=>{
                    v.passengerType = v.passengerType == '主宾' ? 0 : 1;
                    v.expireTime = moment(v.expireTime).format('YYYY-MM-DD')
                })
                const formData = {
                    "data": [
                        {
                            passengerList:_this.state.passengerList,
                            "orderId": _this.props.orderId,
                            "agentPerson": _this.state.customerId,
                            "agentComplete": parseInt(values.agentComplete),
                            "serverCardNo": values.serverCardNo,
                            "vipCard": values.vipCard,
                            "cash": values.cash,
                            agentPersonName:_this.state.customerName,
                            orderType:_this.state.orderType
                        }
                    ]
                }
                $.ajax({
                    type: "POST",
                    contentType:'application/json;charset=utf-8',
                    url: serveUrl+'guest-order/addOrderServiceRecord?access_token='+User.appendAccessToken().access_token,
                    //url:"http://192.168.0.104:8887/addOrderServiceRecord?access_token="+User.appendAccessToken().access_token,
                    data: JSON.stringify(formData),
                    success: function(data){
                        if(data.status == 200){
                            message.success(data.msg);
                        }
                        else if(data.status == 500){
                            message.error(data.msg);
                        }
                    }
                });  
                
            }
        });
    }
    componentDidMount = () => {
        $(".ant-modal").css({ width: 1000, height: 500, top: '5%', left: '15%', marginTop: '-375', transformOrigin: '0', position: 'fixed', })
        $(".ant-modal-footer").hide();
        $(".ant-modal-content").css({ width: 1000, height: 500 });
        $(".flight-detail-msg").css({height: 400 });
        $(".no-table-head thead").hide();
       
        $(".ant-col-19").removeClass('ant-col-19').addClass("ant-col-15");
        $(".ant-col-5").removeClass('ant-col-5').addClass("ant-col-9");
    }
    componentDidUpdate =()=>{
         $('#nopage .ant-pagination').hide();
    }
    customerIdChange =(value) =>{
         const _this = this
            $.ajax({
            type: "GET",
            url: serveUrl+'guest-employee/getEmployeeDropdownListByRoleId?access_token='+ User.appendAccessToken().access_token,
            data:{name:value},
            success: function(data){
                if(data !== null && data.data.length !== 0){
                     _this.setState({
                     customerId:data.data[0].id,
                     customerName:data.data[0].value
                 })
                }
               
                
            }
        });
    }

    agentDynamicsChange =(e)=>{
        this.setState({
            AgentId:e
        })
    }

    serverCardNoClick =(e)=>{
        const _this= this
        this.setState({
            serverCardNoClick:!_this.state.serverCardNoClick,
            
        })
    }
     vipCardClick =(e)=>{
          const _this= this
        this.setState({
            vipCardClick:!_this.state.vipCardClick,
    
        })
    }
    cashClick =(e)=>{
          const _this= this
        this.setState({
            cashClick:!_this.state.cashClick,
    
        })
        
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
        const _this = this;
        const pagination = {
            total: this.state.loungeListDateLength,
            showSizeChanger: true,
            onShowSizeChange(current, pageSize) {
                _this.state.loungeListDateCurrent = current;
                _this.state.loungeListDatePageSize = pageSize;
                // _this.getInitList(_this.state.loungeListDateCurrent,_this.state.loungeListDatePageSize);
            },
            onChange(current) {
                _this.state.loungeListDateCurrent = current;
                // _this.getInitList(_this.state.loungeListDateCurrent,_this.state.loungeListDatePageSize);
            }
        };

   

        const agentDynamicsP = this.state.agentDynamics.map((v,index) =>{
            return(
                <div key={index} className='agentDynamics'>
                    <span className='agentDynamics-span'>{moment(v.createTime).format('YYYY-MM-DD HH:MM')}</span>
                    <span className='agentDynamics-span-right'>{v.recordDesc}</span>
                </div>
            )
        })
        const agentDynamicsSelect = this.state.AgentData.map((v,index) =>{
            const values = v.id.toString()+'&'+v.value
            return(
                <Option key={index} value={values}>{v.value}</Option>
            )
        })

        return (
            <div className="flight-detail-msg">
                <button className="btn-small" style={{marginLeft:'80%'}} onClick={this.handleSubmit}>更新</button>
                <Form horizontal style={{ marginTop: 30 }}>
                    <div className='accessorial-left'>
                        <div className='secondTitle' style={{ marginLeft: 10 }}>
                            <span></span>
                            <a>代办信息</a>
                        </div>
                        <Row>
                            <Col span={12}>
                                <FormItem label="订单号" {...formItemLayout} >
                                    {getFieldDecorator("orderNo", {
                                    })(
                                        <span>{this.state.orderData.orderNo}</span>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={12} >
                                <FormItem label="订单状态" {...formItemLayout}>
                                    {getFieldDecorator("orderStatus", {
                                    })(
                                        <span>{this.state.orderData.orderStatus}</span>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={12} >
                                <FormItem label="客户名称" {...formItemLayout}>
                                    {getFieldDecorator("customerName", {
                                    })(
                                        <span>{this.state.orderData.customerName}</span>
                                        )}
                                </FormItem>
                            </Col>

                            <Col span={12} >
                                <FormItem label="协议名称" {...formItemLayout}>
                                    {getFieldDecorator("noticePerson", {
                                    })(
                                        <span>{this.state.orderData.protocolName}</span>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={12} >
                                <FormItem label="航班日期" {...formItemLayout}>
                                    {getFieldDecorator("bookingWay", {
                                    })(
                                        <span>{this.state.orderData.flight==null ? '':moment(this.state.orderData.flight.flightDate).format('YYYY-MM-DD')}</span>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="航班号" {...formItemLayout}>
                                    {getFieldDecorator("isImportant", {
                                    })(
                                        <span>{this.state.orderData.flight==null ? '':this.state.orderData.flight.flightNo}</span>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="航班时间" {...formItemLayout}>
                                    {getFieldDecorator("isImportant", {
                                    })(
                                        <span>{this.state.orderData.flight==null ? '':moment(this.state.orderData.flight.flightArrtimePlanDate).format('HH:MM')}-{this.state.orderData.flight==null ? '':moment(this.state.orderData.flight.flightDeptimePlanDate).format('HH:MM')}</span>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="航段" {...formItemLayout}>
                                    {getFieldDecorator("isImportant", {
                                    })(
                                        <span>{this.state.orderData.flight==null ? '':this.state.orderData.flight.flightArr}-{this.state.orderData.flight==null ? '':this.state.orderData.flight.flightDep}</span>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="休息区域" {...formItemLayout}>
                                    {getFieldDecorator("isImportant", {
                                    })(
                                        <span>{serviceList == null ? '':JSON.parse(serviceList).serviceDetailName}</span>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="服务人次" {...formItemLayout}>
                                    {getFieldDecorator("isImportant", {
                                    })(
                                        <span>{serviceList == null ? '':JSON.parse(serviceList).serverNum}</span>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={12} style={{marginTop:20}}>
                                <FormItem  {...formItemLayout}>
                                    {getFieldDecorator("printCheck", {
                                    })(
                                        <Checkbox  checked={this.state.printCheck}>代办登机牌</Checkbox>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={12} style={{marginTop:20}}>
                                <FormItem  {...formItemLayout}>
                                    {getFieldDecorator("printCheckRemark", {
                                    })(
                                        <span>{this.state.orderData.printCheckRemark == "" ? '无':this.state.orderData.printCheckRemark}</span>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={12} style={{ marginTop: -20}}>
                                <FormItem {...formItemLayout}>
                                    {getFieldDecorator("consign", {
                                    })(
                                        <Checkbox  checked={this.state.consign}>代办托运</Checkbox>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={12} style={{ marginTop: -20 }}>
                                <FormItem  {...formItemLayout}>
                                    {getFieldDecorator("consignRemark", {
                                    })(
                                        <span>{this.state.orderData.consignRemark == null ? '无':this.state.orderData.consignRemark}</span>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={12} style={{marginTop:-20}}>
                                <FormItem  {...formItemLayout}>
                                    {getFieldDecorator("printCheck", {
                                    })(
                                        <Checkbox  checked={this.state.securityCheck}>安检礼遇</Checkbox>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={12} style={{marginTop:-20}}>
                                <FormItem  {...formItemLayout}>
                                    {getFieldDecorator("printCheckRemark", {
                                    })(
                                        <span>{this.state.orderData.securityCheckRemark == null ? '无':this.state.orderData.securityCheckRemark}</span>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={12} style={{ marginTop: -20}}>
                                <FormItem {...formItemLayout}>
                                    {getFieldDecorator("isImportant", {
                                    })(
                                        <span >其他服务</span>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={12} style={{ marginTop: -20 }}>
                                <FormItem  {...formItemLayout}>
                                    {getFieldDecorator("isImportant", {
                                    })(
                                        <span>{this.state.orderData.otherRemark == null ? '无':this.state.orderData.otherRemark}</span>
                                        )}
                                </FormItem>
                            </Col>
                            <div className='secondTitle' style={{ marginLeft: 10 }}>
                                <span></span>
                                <a>旅客信息</a>
                            </div>
                            <Col span={23}  style={{ marginLeft: 10 }} >
                                <div id='nopage'>
                                    <PassengerD key={Math.random() * Math.random()} data={this.state.data}/>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className='accessorial-right'>
                        <div className='secondTitle' style={{ marginLeft: 10 }}>
                            <span></span>
                            <a>乘机手续</a>
                        </div>
                        <Row>
                            <Col span={10} style={{marginLeft:20}}>
                                <FormItem  {...formItemLayout}>
                                    {getFieldDecorator("Agent1", {
                                    })(
                                        <span >安排代办人</span>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem  {...formItemLayout}>
                                    {getFieldDecorator("Agent", {
                                        initialValue:this.state.orderData.agentPersonName
                                    })(
                                        <AutoComplete
                                                dataSource={this.state.AutoClientList}
                                                onChange={this.customerIdChange}
                                            />
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={10} style={{marginLeft:20}}>
                                <FormItem {...formItemLayout}>
                                    {getFieldDecorator("serverCardNo1", {
                                    })(
                                        <Checkbox onClick={this.serverCardNoClick} checked={this.state.serverCardNoClick}>证件</Checkbox>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={12} >
                                <FormItem  {...formItemLayout}>
                                    {getFieldDecorator("serverCardNo", {
                                        initialValue:this.state.orderData.serverCardNo
                                    })(
                                        <Input disabled={!this.state.serverCardNoClick}/>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={10} style={{marginLeft:20}}>
                                <FormItem {...formItemLayout}>
                                    {getFieldDecorator("vipCard1", {
                                    })(
                                        <Checkbox onClick={this.vipCardClick} checked={this.state.vipCardClick}>贵宾卡</Checkbox>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={12} style={{marginLeft:195,marginTop:-57}}>
                                <FormItem  {...formItemLayout}>
                                    {getFieldDecorator("vipCard", {
                                        initialValue:this.state.orderData.vipCard
                                    })(
                                        <Input disabled={!this.state.vipCardClick}/>
                                        )}
                                </FormItem>
                            </Col>
                             <Col span={10} style={{marginLeft:20}} >
                                <FormItem {...formItemLayout}>
                                    {getFieldDecorator("cash1", {
                                    })(
                                        <Checkbox onClick={this.cashClick} checked={this.state.cashClick}>现金</Checkbox>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={12} style={{marginLeft:2}}>
                                <FormItem  {...formItemLayout}>
                                    {getFieldDecorator("cash", {
                                        initialValue:this.state.orderData.cash
                                    })(
                                        <Input disabled={!this.state.cashClick}/>
                                        )}
                                </FormItem>
                            </Col>
                             <Col span={10} style={{marginLeft:20}}>
                                <FormItem {...formItemLayout}>
                                    {getFieldDecorator("agentComplete1", {
                                    })(
                                        <span >服务完成</span>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={12} >
                                <FormItem  {...formItemLayout}>
                                    {getFieldDecorator("agentComplete", {
                                        initialValue:this.state.orderData.agentComplete == undefined ? '':this.state.orderData.agentComplete.toString()
                                    })(
                                        <RadioGroup onChange={this.onCompleteChange} >
                                            <RadioButton value="1">是</RadioButton>
                                            <RadioButton value="0">否</RadioButton>
                                        </RadioGroup>
                                        )}
                                </FormItem>
                            </Col>
                            
                        </Row>
                        <div className='secondTitle'>
                            <span></span>
                            <a>代办动态</a>
                        </div>
                        {agentDynamicsP}
                        
                    </div>
                </Form>
            </div>
        )
    }
}

LoungeFlightDetail = Form.create()(LoungeFlightDetail);
export default LoungeFlightDetail;