import React from 'react';
import { hashHistory } from 'react-router';
import { Form, Row, Col, Input, Button, Icon, Select, message, Radio, Breadcrumb, Table, Popconfirm, Modal, Checkbox, AutoComplete,DatePicker } from 'antd';
import { Link } from 'react-router';
import $ from 'jquery';
import moment from 'moment';
import { serveUrl, User, cacheData } from '../../utils/config';
import DeleteDialog from '../DeleteDialog';//引入删除弹框

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const RadioGroup = Radio.Group;
const msg = '确认删除该产品吗?';
const RadioButton = Radio.Button;


class Passenger extends React.Component {
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
            PassengerData:null,
            protocolType:[],
            CardTypeList:[],

        }
    }
    componentWillMount() {
         if(User.isLogin()){
        } else{
            hashHistory.push('/login');
        }
        const _this = this
        this.state.protocolType.push(_this.props.protocolType)
        this.setState({
            protocolType:_this.state.protocolType,
            PassengerData:_this.props.passengerList[_this.props.index]
        })
         $.ajax({
             type: "GET",
             url: serveUrl+'guest-order/getCardType?access_token=' + User.appendAccessToken().access_token,
             success: function(data){
                 if(data.status == '200'){
                      _this.setState({
                        CardTypeList:data.data
                    })
                 }
            }
         });
        
     
    }

    componentDidMount = () => {
        $(".ant-modal-footer").hide();
    }

    handleSubmit = (e)=>{
        const _this = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                _this.props.passengerList[_this.props.index].name = values.name
                _this.props.passengerList[_this.props.index].identityCard = values.identityCard
                _this.props.passengerList[_this.props.index].phone = values.phone
                _this.props.passengerList[_this.props.index].passengerType = values.passengerType
                _this.props.passengerList[_this.props.index].workUnit = values.workUnit
                _this.props.passengerList[_this.props.index].position = values.position
                _this.props.passengerList[_this.props.index].cardType = values.cardType
                _this.props.passengerList[_this.props.index].cardNo = values.cardNo
                _this.props.passengerList[_this.props.index].expireTime = values.expireTime
                _this.props.passengerList[_this.props.index].ticketNo = values.ticketNo
                _this.props.passengerList[_this.props.index].sitNo = values.sitNo
                _this.props.passengerList[_this.props.index].cabinNo = values.cabinNo
                _this.props.onOK()
            }
        });
    }
  

   
    render() {
        
        
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };
         let CardTypeP = null
        CardTypeP = this.state.CardTypeList.map((v,index)=>{
            return(
                 <Option key={v.cardId} value={v.cardName}>{v.cardName}</Option>
            )
        })
         let passengerP = null
         if(this.state.PassengerData != []){
              passengerP = this.state.protocolType.map((v,index) => {
            if(v == 9){
                return (
                 <Row key={index}>
                      <FormItem label="姓名" {...formItemLayout} hasFeedback>
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: '请输入姓名!' }],
                                initialValue:this.state.PassengerData.name
                            })(
                               <Input onChange={this.passengerNameData} style={{ width: 300 }} className='required' />
                                )}
                        </FormItem>
                        <FormItem label="身份证" {...formItemLayout} hasFeedback   >
                            {getFieldDecorator('identityCard', {
                                 rules: [
                                        {
                                            message: "身份证输入有误，请重新输入！",
                                            pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
                                        }],
                                initialValue:this.state.PassengerData.identityCard
                            })(
                                <Input onChange={this.passengerNameData} style={{ width: 300 }} className='required' />

                                )}
                        </FormItem>
                        <FormItem labelInValue label="手机号" {...formItemLayout}  >
                            {getFieldDecorator('phone', {
                                  rules: [
                                        {
                                            message: "手机号输入有误，请重新输入！",
                                            pattern: /^1[3|4|5|7|8][0-9]{9}$/
                                        }],
                                initialValue:this.state.PassengerData.phone
                            })(
                                <Input onChange={this.passengerNameData} style={{ width: 300 }} className='required' />
                                )}
                        </FormItem>
                        <FormItem labelInValue label="宾客类型" {...formItemLayout} >
                            {getFieldDecorator('passengerType', {
                                initialValue:this.state.PassengerData.passengerType
                            })(
                               <Select style={{ width: 300 }} >
                                    <Option value="主宾">主宾</Option>
                                    <Option value="随行">随行</Option>
                                </Select>
                                )}
                        </FormItem>
                        <FormItem label="卡类别" {...formItemLayout} hasFeedback   >
                            {getFieldDecorator('cardType', {
                                initialValue:this.state.PassengerData.cardType
                            })(
                                 <Select style={{ width: 300 }} >
                                    <Option value="金卡">金卡</Option>
                                    <Option value="银卡">银卡</Option>
                                    <Option value="钻石卡">钻石卡</Option>
                                    <Option value="白金卡">白金卡</Option>
                                    <Option value="贵宾卡">贵宾卡</Option>
                                    <Option value="其他">其他</Option>
                                </Select>

                                )}
                        </FormItem>
                        <FormItem label="卡号" {...formItemLayout} hasFeedback   >
                            {getFieldDecorator('cardNo', {
                                rules: [
                                        {
                                            message: "卡号输入有误，请重新输入！",
                                            pattern: /^[0-9]*$/
                                        }],
                                initialValue:this.state.PassengerData.cardNo
                            })(
                                <Input onChange={this.passengerNameData} style={{ width: 300 }} className='required' />

                                )}
                        </FormItem>
                        <FormItem label="有效期" {...formItemLayout} hasFeedback   >
                            {getFieldDecorator('expireTime', {
                                initialValue:moment(this.state.PassengerData.expireTime)
                            })(
                                <DatePicker style={{ width: 300 }} format='YY/MM/DD' />

                                )}
                        </FormItem>
                        <FormItem label="客票号" {...formItemLayout} hasFeedback   >
                            {getFieldDecorator('ticketNo', {
                                initialValue:this.state.PassengerData.ticketNo
                            })(
                                <Input onChange={this.passengerNameData} style={{ width: 300 }} className='required' />

                                )}
                        </FormItem>
                        <FormItem label="座位号" {...formItemLayout} hasFeedback   >
                            {getFieldDecorator('sitNo', {
                                initialValue:this.state.PassengerData.sitNo
                            })(
                                <Input onChange={this.passengerNameData} style={{ width: 300 }} className='required' />

                                )}
                        </FormItem>
                        <FormItem label="舱位" {...formItemLayout} hasFeedback   >
                            {getFieldDecorator('cabinNo', {
                                initialValue:this.state.PassengerData.cabinNo
                            })(
                                <Input onChange={this.passengerNameData} style={{ width: 300 }} className='required' />

                                )}
                        </FormItem>
                        <FormItem style={{ paddingBottom: 30 }}>
                            <button className='btn-small'  onClick={this.handleSubmit}>提交</button>
                        </FormItem>
                 </Row>
             )
            }else if(v == 10){
                 return (
                 <Row key={index}>
                      <FormItem label="姓名" {...formItemLayout} hasFeedback>
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: '请输入姓名!' }],
                                initialValue:this.state.PassengerData.name

                            })(
                               <Input onChange={this.passengerNameData} style={{ width: 300 }} className='required' />
                                )}
                        </FormItem>
                        <FormItem label="身份证" {...formItemLayout} hasFeedback   >
                            {getFieldDecorator('identityCard', {
                                 rules: [
                                        {
                                            message: "身份证输入有误，请重新输入！",
                                            pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
                                        }],
                                initialValue:this.state.PassengerData.identityCard
                            })(
                                <Input onChange={this.passengerNameData} style={{ width: 300 }} className='required' />

                                )}
                        </FormItem>
                        <FormItem labelInValue label="手机号" {...formItemLayout}  >
                            {getFieldDecorator('phone', {
                                  rules: [
                                        {
                                            message: "手机号输入有误，请重新输入！",
                                            pattern: /^1[3|4|5|7|8][0-9]{9}$/
                                        }],
                                initialValue:this.state.PassengerData.phone
                            })(
                                <Input onChange={this.passengerNameData} style={{ width: 300 }} className='required' />
                                )}
                        </FormItem>
                        <FormItem labelInValue label="宾客类型" {...formItemLayout} >
                            {getFieldDecorator('passengerType', {
                                initialValue:this.state.PassengerData.passengerType
                            })(
                               <Select style={{ width: 300 }} >
                                    <Option value="主宾">主宾</Option>
                                    <Option value="随行">随行</Option>
                                </Select>
                                )}
                        </FormItem>
                        <FormItem label="客票号" {...formItemLayout} hasFeedback   >
                            {getFieldDecorator('ticketNo', {
                                initialValue:this.state.PassengerData.ticketNo
                            })(
                                <Input onChange={this.passengerNameData} style={{ width: 300 }} className='required' />

                                )}
                        </FormItem>
                        <FormItem label="座位号" {...formItemLayout} hasFeedback   >
                            {getFieldDecorator('sitNo', {
                                initialValue:this.state.PassengerData.sitNo
                            })(
                                <Input onChange={this.passengerNameData} style={{ width: 300 }} className='required' />

                                )}
                        </FormItem>
                        <FormItem label="舱位" {...formItemLayout} hasFeedback   >
                            {getFieldDecorator('cabinNo', {
                                initialValue:this.state.PassengerData.cabinNo
                            })(
                                <Input onChange={this.passengerNameData} style={{ width: 300 }} className='required' />

                                )}
                        </FormItem>
                        <FormItem style={{ paddingBottom: 30 }}>
                            <button className='btn-small'  onClick={this.handleSubmit}>提交</button>
                        </FormItem>
                 </Row>
             )
            }else if(v == 2 || v == 7 || v == 8){
                  return (
                 <Row key={index}>
                     <FormItem label="姓名" {...formItemLayout} hasFeedback>
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: '请输入姓名!' }],
                                initialValue:this.state.PassengerData.name
                            })(
                               <Input onChange={this.passengerNameData} style={{ width: 300 }} className='required' />
                                )}
                        </FormItem>
                        <FormItem label="身份证" {...formItemLayout} hasFeedback   >
                            {getFieldDecorator('identityCard', {
                                 rules: [
                                        {
                                            message: "身份证输入有误，请重新输入！",
                                            pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
                                        }],
                                initialValue:this.state.PassengerData.identityCard
                            })(
                                <Input onChange={this.passengerNameData} style={{ width: 300 }} className='required' />

                                )}
                        </FormItem>
                        <FormItem labelInValue label="手机号" {...formItemLayout}  >
                            {getFieldDecorator('phone', {
                                  rules: [
                                        {
                                            message: "手机号输入有误，请重新输入！",
                                            pattern: /^1[3|4|5|7|8][0-9]{9}$/
                                        }],
                                initialValue:this.state.PassengerData.phone
                                
                            })(
                                <Input onChange={this.passengerNameData} style={{ width: 300 }} className='required' />
                                )}
                        </FormItem>
                        <FormItem labelInValue label="宾客类型" {...formItemLayout} >
                            {getFieldDecorator('passengerType', {
                                initialValue:this.state.PassengerData.passengerType
                            })(
                               <Select style={{ width: 300 }} >
                                    <Option value="主宾">主宾</Option>
                                    <Option value="随行">随行</Option>
                                </Select>
                                )}
                        </FormItem>
                        <FormItem label="卡号" {...formItemLayout} hasFeedback   >
                            {getFieldDecorator('cardNo', {
                                rules: [
                                        {
                                            message: "卡号输入有误，请重新输入！",
                                            pattern: /^[0-9]*$/
                                        }],
                                initialValue:this.state.PassengerData.cardNo
                            })(
                                <Input onChange={this.passengerNameData} style={{ width: 300 }} className='required' />

                                )}
                        </FormItem>
                        <FormItem label="客票号" {...formItemLayout} hasFeedback   >
                            {getFieldDecorator('ticketNo', {
                                initialValue:this.state.PassengerData.ticketNo
                            })(
                                <Input onChange={this.passengerNameData} style={{ width: 300 }} className='required' />

                                )}
                        </FormItem>
                        <FormItem label="座位号" {...formItemLayout} hasFeedback   >
                            {getFieldDecorator('sitNo', {
                                initialValue:this.state.PassengerData.sitNo
                            })(
                                <Input onChange={this.passengerNameData} style={{ width: 300 }} className='required' />

                                )}
                        </FormItem>
                        <FormItem label="舱位" {...formItemLayout} hasFeedback   >
                            {getFieldDecorator('cabinNo', {
                                initialValue:this.state.PassengerData.cabinNo
                            })(
                                <Input onChange={this.passengerNameData} style={{ width: 300 }} className='required' />

                                )}
                        </FormItem>
                        <FormItem style={{ paddingBottom: 30 }}>
                            <button className='btn-small'  onClick={this.handleSubmit}>提交</button>
                        </FormItem>
                 </Row>
             )
            }else{
                  return (
                 <Row key={index}>
                     <FormItem label="姓名" {...formItemLayout} hasFeedback>
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: '请输入姓名!' }],
                                initialValue:this.state.PassengerData.name
                            })(
                               <Input onChange={this.passengerNameData} style={{ width: 300 }} className='required' />
                                )}
                        </FormItem>
                        <FormItem label="身份证" {...formItemLayout} hasFeedback   >
                            {getFieldDecorator('identityCard', {
                                 rules: [
                                        {
                                            message: "身份证输入有误，请重新输入！",
                                            pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
                                        }],
                                initialValue:this.state.PassengerData.identityCard
                            })(
                                <Input onChange={this.passengerNameData} style={{ width: 300 }} className='required' />

                                )}
                        </FormItem>
                        <FormItem labelInValue label="手机号" {...formItemLayout}  >
                            {getFieldDecorator('phone', {
                                  rules: [
                                        {
                                            message: "手机号输入有误，请重新输入！",
                                            pattern: /^1[3|4|5|7|8][0-9]{9}$/
                                        }],
                                initialValue:this.state.PassengerData.phone
                            })(
                                <Input onChange={this.passengerNameData} style={{ width: 300 }} className='required' />
                                )}
                        </FormItem>
                        <FormItem labelInValue label="宾客类型" {...formItemLayout} >
                            {getFieldDecorator('passengerType', {
                                initialValue:this.state.PassengerData.passengerType
                            })(
                               <Select style={{ width: 300 }} >
                                    <Option value="主宾">主宾</Option>
                                    <Option value="随行">随行</Option>
                                </Select>
                                )}
                        </FormItem>
                        <FormItem labelInValue label="单位" {...formItemLayout}>
                            {getFieldDecorator('workUnit', {
                                initialValue:this.state.PassengerData.workUnit
                            })(
                                <Input onChange={this.passengerNameData} style={{ width: 300 }} className='required' />
                                )}
                        </FormItem>
                        <FormItem label="职位" {...formItemLayout} hasFeedback   >
                            {getFieldDecorator('position', {
                                initialValue:this.state.PassengerData.position
                            })(
                                <Input onChange={this.passengerNameData} style={{ width: 300 }} className='required' />

                                )}
                        </FormItem>
                        <FormItem label="客票号" {...formItemLayout} hasFeedback   >
                            {getFieldDecorator('ticketNo', {
                                initialValue:this.state.PassengerData.ticketNo
                            })(
                                <Input onChange={this.passengerNameData} style={{ width: 300 }} className='required' />

                                )}
                        </FormItem>
                        <FormItem label="座位号" {...formItemLayout} hasFeedback   >
                            {getFieldDecorator('sitNo', {
                                initialValue:this.state.PassengerData.sitNo
                            })(
                                <Input onChange={this.passengerNameData} style={{ width: 300 }} className='required' />

                                )}
                        </FormItem>
                        <FormItem label="舱位" {...formItemLayout} hasFeedback   >
                            {getFieldDecorator('cabinNo', {
                                initialValue:this.state.PassengerData.cabinNo
                            })(
                                <Input onChange={this.passengerNameData} style={{ width: 300 }} className='required' />

                                )}
                        </FormItem>
                        <FormItem style={{ paddingBottom: 30 }}>
                            <button className='btn-small'  onClick={this.handleSubmit}>提交</button>
                        </FormItem>
                 </Row>
             )
            }
        })
         }
       

        return (
            <div className="flight-detail-msg">
                <Form horizontal onSubmit={this.handleSubmit}>
                    {passengerP}
                </Form>
            </div>
        )
    }
}

Passenger = Form.create()(Passenger);
export default Passenger;