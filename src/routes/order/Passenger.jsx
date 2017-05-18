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
            protocolType:_this.state.protocolType
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
                values.expireTime = moment(values.expireTime).format('YYYY-MM-DD')
                _this.props.passengerList.push(values)
                _this.props.passengerList.map((v,index)=>{
                    v.key = index
                })
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
        passengerP = this.state.protocolType.map((v,index) => {
            if(v == 9){
                return (
                 <Row key={index}>
                     <FormItem label="姓名" {...formItemLayout} hasFeedback>
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: '请输入姓名!' }],
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
                            })(
                                <Input onChange={this.passengerNameData} style={{ width: 300 }} className='required' />
                                )}
                        </FormItem>
                        <FormItem labelInValue label="宾客类型" {...formItemLayout} >
                            {getFieldDecorator('passengerType', {
                                initialValue:'主宾'
                            })(
                               <Select style={{ width: 300 }} >
                                    <Option value="主宾">主宾</Option>
                                    <Option value="随行">随行</Option>
                                </Select>
                                )}
                        </FormItem>
                        <FormItem label="卡类别" {...formItemLayout} hasFeedback   >
                            {getFieldDecorator('cardType', {
                                initialValue:'金卡'
                            })(
                                <Select style={{ width: 300 }} >
                                    {CardTypeP}
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
                            })(
                                <Input onChange={this.passengerNameData} style={{ width: 300 }} className='required' />

                                )}
                        </FormItem>
                        <FormItem label="有效期" {...formItemLayout} hasFeedback   >
                            {getFieldDecorator('expireTime', {
                            })(
                                <DatePicker style={{ width: 300 }} format='YY/MM/DD' />
                                )}
                        </FormItem>
                        <FormItem label="客票号" {...formItemLayout} hasFeedback   >
                            {getFieldDecorator('ticketNo', {
                            })(
                                <Input onChange={this.passengerNameData} style={{ width: 300 }} className='required' />

                                )}
                        </FormItem>
                        <FormItem label="座位号" {...formItemLayout} hasFeedback   >
                            {getFieldDecorator('sitNo', {
                            })(
                                <Input onChange={this.passengerNameData} style={{ width: 300 }} className='required' />

                                )}
                        </FormItem>
                        <FormItem label="舱位" {...formItemLayout} hasFeedback   >
                            {getFieldDecorator('cabinNo', {
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
                            })(
                                <Input onChange={this.passengerNameData} style={{ width: 300 }} className='required' />
                                )}
                        </FormItem>
                        <FormItem labelInValue label="宾客类型" {...formItemLayout} >
                            {getFieldDecorator('passengerType', {
                                initialValue:'主宾'
                            })(
                               <Select style={{ width: 300 }} >
                                    <Option value="主宾">主宾</Option>
                                    <Option value="随行">随行</Option>
                                </Select>
                                )}
                        </FormItem>
                        <FormItem label="客票号" {...formItemLayout} hasFeedback   >
                            {getFieldDecorator('ticketNo', {
                            })(
                                <Input onChange={this.passengerNameData} style={{ width: 300 }} className='required' />

                                )}
                        </FormItem>
                        <FormItem label="座位号" {...formItemLayout} hasFeedback   >
                            {getFieldDecorator('sitNo', {
                            })(
                                <Input onChange={this.passengerNameData} style={{ width: 300 }} className='required' />

                                )}
                        </FormItem>
                        <FormItem label="舱位" {...formItemLayout} hasFeedback   >
                            {getFieldDecorator('cabinNo', {
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
                            })(
                                <Input onChange={this.passengerNameData} style={{ width: 300 }} className='required' />
                                )}
                        </FormItem>
                        <FormItem labelInValue label="宾客类型" {...formItemLayout} >
                            {getFieldDecorator('passengerType', {
                                initialValue:'主宾'
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
                            })(
                                <Input onChange={this.passengerNameData} style={{ width: 300 }} className='required' />

                                )}
                        </FormItem>
                        <FormItem label="客票号" {...formItemLayout} hasFeedback   >
                            {getFieldDecorator('ticketNo', {
                            })(
                                <Input onChange={this.passengerNameData} style={{ width: 300 }} className='required' />

                                )}
                        </FormItem>
                        
                        <FormItem label="座位号" {...formItemLayout} hasFeedback   >
                            {getFieldDecorator('sitNo', {
                            })(
                                <Input onChange={this.passengerNameData} style={{ width: 300 }} className='required' />

                                )}
                        </FormItem>
                        <FormItem label="舱位" {...formItemLayout} hasFeedback   >
                            {getFieldDecorator('cabinNo', {
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
                            })(
                                <Input onChange={this.passengerNameData} style={{ width: 300 }} className='required' />
                                )}
                        </FormItem>
                        <FormItem labelInValue label="宾客类型" {...formItemLayout} >
                            {getFieldDecorator('passengerType', {
                                initialValue:'主宾'
                            })(
                               <Select style={{ width: 300 }} >
                                    <Option value="主宾">主宾</Option>
                                    <Option value="随行">随行</Option>
                                </Select>
                                )}
                        </FormItem>
                         <FormItem labelInValue label="单位" {...formItemLayout}>
                            {getFieldDecorator('workUnit', {
                            })(
                                <Input onChange={this.passengerNameData} style={{ width: 300 }} className='required' />
                                )}
                        </FormItem>
                        <FormItem label="职位" {...formItemLayout} hasFeedback   >
                            {getFieldDecorator('position', {
                            })(
                                <Input onChange={this.passengerNameData} style={{ width: 300 }} className='required' />

                                )}
                        </FormItem>
                        <FormItem label="客票号" {...formItemLayout} hasFeedback   >
                            {getFieldDecorator('ticketNo', {
                            })(
                                <Input onChange={this.passengerNameData} style={{ width: 300 }} className='required' />

                                )}
                        </FormItem>
                        <FormItem label="座位号" {...formItemLayout} hasFeedback   >
                            {getFieldDecorator('sitNo', {
                            })(
                                <Input onChange={this.passengerNameData} style={{ width: 300 }} className='required' />

                                )}
                        </FormItem>
                        <FormItem label="舱位" {...formItemLayout} hasFeedback   >
                            {getFieldDecorator('cabinNo', {
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