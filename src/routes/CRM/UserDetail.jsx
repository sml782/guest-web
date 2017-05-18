import './crm.less';
import React from 'react';
import { hashHistory } from 'react-router';
import { Breadcrumb, Form, Row, Col, Input, Button, Icon, Select, Popconfirm, message, Table, AutoComplete, Modal, DatePicker } from 'antd';
import { Link } from 'react-router';
import $ from 'jquery';
import moment from 'moment';
import { serveUrl, User, cacheData } from '../../utils/config';
import DeleteDialog from '../DeleteDialog';//引入删除弹框
import FirstClassCabin from './FirstClassCabin';//头等舱列表
import GoldCard from './GoldCard';//金银卡列表
import LocalPoliticians from './LocalPoliticians';//地方政要
import DeputyMinisterLevel from './DeputyMinisterLevel';//副部级VIP
import BankLeadership from './BankLeadership';//银行领导
import CardHolder from './CardHolder';//持卡用户
// const $ = require('jquery')

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const Option1 = AutoComplete.Option;
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const msg = '确认删除该协议吗?';
const url = "http://192.168.1.130:8887/";
let selectedList=[];
let flag = false;
let isLabel = false;//标签信息显示
let liLableList = null;

class UserDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startValue: null,
            endValue: null,
            endOpen: false,
            userDetail:null,
            serviceInfoList:[],
            serviceInfoListLength:null,
            passengerId:null,
            labalsName:[],
            phone:null,
            protocolTypes:null,
            isRequest1:false,//判断点击的标签，最后决定是否向后台发送请求
            isRequest2:false,
            isRequest3:false,
            isRequest4:false,
            isRequest5:false,
            isRequest6:false
        }
    }

    componentWillMount() {
          if(User.isLogin()){
        } else{
            hashHistory.push('/login');
        }
        this.setState({
            passengerId:this.props.params.id
        })

        const _this = this
        $.ajax({
            type: "GET",
            // url: 'http://192.168.0.160:8887/getPassengerById?access_token=' + User.appendAccessToken().access_token,
            url: serveUrl+"guest-crm/getPassengerById?access_token="+ User.appendAccessToken().access_token,
            data:{passengerId: _this.props.params.id},
            success: function(data){
               data.data.serviceInfoList.map((v,index)=>{
                   v.key = index
               })
               _this.setState({
                   userDetail:data.data,
                   serviceInfoList:data.data.serviceInfoList,
                   serviceInfoListLength:data.data.serviceInfoList.length,
                   labalsName:data.data.labalsName,
                   phone:data.data.phone
               })
               _this.props.form.setFieldsValue({
                    no: data.data.passengerNo,
                    name: data.data.name,
                    idCard: data.data.identityCard,
                    telephone: data.data.phone,
                })
            }
        })

        //判断标签是否被点击
        $(".selected-list li").on("click", function () {
            for (let i = 0; i <selectedList.length; i++) {
                if (selectedList[i] == $(this).index()) {
                    flag = true;
                    selectedList.splice(i, 1);
                    $(this).removeClass("active");
                }
            };
            if (!flag) {
                flag = false;
                $(this).addClass("active");
                selectedList.push($(this).index());
            }
            flag = false;
        })
    }

    componentDidMount = () => {
        $(".ant-breadcrumb-separator").html(">");
        $(".ant-col-5").removeClass('ant-col-5').addClass("ant-col-7");
        $(".ant-col-19").removeClass("ant-col-19").addClass("ant-col-17");
        $(".tab-list li").on("click", function () {
            $(this).find("a").addClass("active").parents("li").siblings().find("a").removeClass("active");
            if($(this).index() == 0){
                $(".base-service-list").show();
                $(".service-category-list").hide();
                isLabel = false;
            }
            else{
                $(".base-service-list").hide();
                $(".service-category-list").show();
                $(".service-category-ul li").on('click', function () {
                    $(this).addClass("active").siblings().removeClass("active");
                    $(".tag-list-detail .tag-list-detail-li").eq($(this).index()).show().siblings().hide();
                })
                isLabel = true;
            }
        });
    }

    componentDidUpdate=()=>{    
        $(".ant-table-tbody tr td").css({borderBottom:'none'});
        $("table").css({border:'1px solid #f0f0f0'});
    }

    isLableFun=(e,v)=>{
        if(isLabel){
            liLableList = this.state.labalsName.map((v, index) => {
                let labelBtn;
                if(v == '头等舱'){
                    labelBtn = <FirstClassCabin key={Math.random() * Math.random()} passengerId={this.state.passengerId} phone={this.state.phone} isRequest={this.state.isRequest1}/>;
                }
                else if(v == '金银卡'){
                    labelBtn = <GoldCard key={Math.random() * Math.random()} passengerId={this.state.passengerId} phone={this.state.phone} isRequest={this.state.isRequest2}/>;
                }
                else if(v == '地方政要'){
                    labelBtn = <LocalPoliticians key={Math.random() * Math.random()} passengerId={this.state.passengerId} phone={this.state.phone} isRequest={this.state.isRequest3}/>;
                }
                else if(v == 'VVIP'){
                    labelBtn = <DeputyMinisterLevel key={Math.random() * Math.random()} passengerId={this.state.passengerId} phone={this.state.phone} isRequest={this.state.isRequest4}/>;
                }
                else if(v == '银行领导'){
                    labelBtn = <BankLeadership key={Math.random() * Math.random()} passengerId={this.state.passengerId} phone={this.state.phone} isRequest={this.state.isRequest5}/>;
                }
                else if(v == '持卡用户'){
                    labelBtn = <CardHolder key={Math.random() * Math.random()} passengerId={this.state.passengerId} phone={this.state.phone} isRequest={this.state.isRequest6}/>;
                }
                return (
                    <li className="tag-list-detail-li" key={index} style={{display:'none'}}>{labelBtn}</li>
                )
            });
        }
    }

    //点击标签,获取数据
    liLableClick=(e,index,v)=>{
        $(".tag-list-detail-li").eq(index).show().siblings().hide();
        if(e == '头等舱'){
            this.state.protocolTypes = '10';
            this.state.isRequest1 = true;
        }
        else if(e == '金银卡'){
            this.state.protocolTypes = '9';
            this.state.isRequest2 = true;
        }
        else if(e == '地方政要'){
            this.state.protocolTypes = '4,5';
            this.state.isRequest3 = true;
        }
        else if(e == 'VVIP'){
            this.state.protocolTypes = '6';
            this.state.isRequest4 = true;
        }
        else if(e == '银行领导'){
            this.state.protocolTypes = '1';
            this.state.isRequest5 = true;
        }
        else if(e == '持卡用户'){
            this.state.protocolTypes = '2,7';
            this.state.isRequest6 = true;
        }
        this.setState({
            protocolTypes:this.state.protocolTypes,
            isRequest1:this.state.isRequest1,
            isRequest2:this.state.isRequest2,
            isRequest3:this.state.isRequest3,
            isRequest4:this.state.isRequest4,
            isRequest5:this.state.isRequest5,
            isRequest6:this.state.isRequest6
        });
    }


    render() {
        const { startValue, endValue, endOpen } = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };
        const _this = this;
        const columns = [
            {
                title: '航班时间',
                width: '16%',
                dataIndex: 'flightDate',
                render(text, record) {
                    return (
                        <div className="order">{text == undefined ? '':moment(text).format('YYYY-MM-DD')}</div>
                    )
                }
            }, {
                title: '订单号',
                width: '16%',
                dataIndex: 'orderNo',
                render(text, record) {
                    return (
                        <div className="order">{text}</div>
                    )
                }
            }, {
                title: '产品',
                width: '16%',
                dataIndex: 'productName',
                render(text, record) {
                    return (
                        <div className="order">{text}</div>
                    )
                }
            }, {
                title: '客户',
                width: '16%',
                dataIndex: 'clientName',
                render(text, record) {
                    return (
                        <div className="order">{text}</div>
                    )
                }
            }, {
                title: '协议号',
                width: '16%',
                dataIndex: 'protocolNo',
                render(text, record) {
                    return (
                        <div className="order">{text}</div>
                    )
                }
            }, {
                title: '协议类型',
                dataIndex: 'protocolTypeName',
                render(text, record) {
                    return (
                        <div className="order">{text}</div>
                    )
                }
            }
        ];

        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };
        const labalsNameP = _this.state.labalsName.map((v, index) => {
            return (
                <li key={index}>{v}</li>
            )
        })
        const liLable =  _this.state.labalsName.map((v, index) => {
            return (
                <li key={index} onClick={this.liLableClick.bind(this,v,index)}>{v}</li>
            )
        });
        liLableList = _this.state.labalsName.map((v, index) => {
            let labelBtn;
            if(v == '头等舱'){
                labelBtn = <FirstClassCabin key={Math.random() * Math.random()} passengerId={this.state.passengerId} phone={this.state.phone} isRequest={this.state.isRequest1}/>;
            }
            else if(v == '金银卡'){
                labelBtn = <GoldCard key={Math.random() * Math.random()} passengerId={this.state.passengerId} phone={this.state.phone} isRequest={this.state.isRequest2}/>;
            }
            else if(v == '地方政要'){
                labelBtn = <LocalPoliticians key={Math.random() * Math.random()} passengerId={this.state.passengerId} phone={this.state.phone} isRequest={this.state.isRequest3}/>;
            }
            else if(v == 'VVIP'){
                labelBtn = <DeputyMinisterLevel key={Math.random() * Math.random()} passengerId={this.state.passengerId} phone={this.state.phone} isRequest={this.state.isRequest4}/>;
            }
            else if(v == '银行领导'){
                labelBtn = <BankLeadership key={Math.random() * Math.random()} passengerId={this.state.passengerId} phone={this.state.phone} isRequest={this.state.isRequest5}/>;
            }
            else if(v == '持卡用户'){
                labelBtn = <CardHolder key={Math.random() * Math.random()} passengerId={this.state.passengerId} phone={this.state.phone} isRequest={this.state.isRequest6}/>;
            }
            return (
                <li className="tag-list-detail-li" key={index} style={{display:'none'}}>{labelBtn}</li>
            )
        });
        
        return (
            <div>
                <div className="breadcrumb-box">
                    <div className="top-bar"></div>
                    <div className="breadcrumb">
                        <Breadcrumb>
                            <Breadcrumb.Item>CRM</Breadcrumb.Item>
                            <Breadcrumb.Item>智能CRM</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>

                <div className="box">
                    <ul className="tit">
                        <li>
                            <a href="javascript:;" className="active">用户详情</a>
                        </li>
                    </ul>

                    <div className="crm-box crm-user-detail" style={{ border: '1px solid #e6e6e6', padding: '20px 22px' }}>
                        <div className="user-head fl" style={{ width: '15%' }}>用户头像</div>
                        <div className="user-base-msg fl" style={{ width: '80%' }}>
                            <Form className="ant-advanced-search-form">
                                <Row>
                                    <Col span={8}>
                                        <FormItem label="用户编号" {...formItemLayout}>
                                            {getFieldDecorator("no", {
                                            })(
                                                <Input disabled />
                                                )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem label="姓名" {...formItemLayout}>
                                            {getFieldDecorator("name", {
                                            })(
                                                <Input />
                                                )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem label="性别" {...formItemLayout}>
                                            {getFieldDecorator("sex", {
                                            })(
                                                <Select>
                                                    <Option value="1">男</Option>
                                                    <Option value="0">女</Option>
                                                </Select>
                                                )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <FormItem label="身份证" {...formItemLayout}>
                                            {getFieldDecorator("idCard", {
                                            })(
                                                <Input />
                                                )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem label="电话" {...formItemLayout}>
                                            {getFieldDecorator("telephone", {
                                            })(
                                                <Input />
                                                )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <FormItem label="地址" {...formItemLayout}>
                                            {getFieldDecorator("adress", {
                                            })(
                                                <Input />
                                                )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24} style={{marginLeft:-170}}>
                                        <FormItem label="标签" {...formItemLayout}>
                                            {getFieldDecorator("clientName", {

                                            })(
                                                <ul className="tag selected-list">
                                                   {labalsNameP}
                                                </ul>
                                                )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </div>

                    <ul className="tab-list" style={{ marginTop: 36 }}>
                        <li onClick={this.isLableFun.bind(this)}>
                            <a href="javascript:;" className="active">服务信息</a>
                        </li>
                        <li onClick={this.isLableFun.bind(this)}>
                            <a href="javascript:;">标签信息</a>
                        </li>
                    </ul>
                    <div className="user-detail-category" style={{ marginTop: 30 }}>
                        <div className="base-service-list">
                            <Table columns={columns} dataSource={this.state.serviceInfoList} className="serveTable" />
                            <p style={{marginTop:'20px'}}>共搜索到{this.state.serviceInfoListLength}条数据</p>
                        </div>
                        <div className="service-category-list" style={{display:'none' }}>
                            <ul className="tag service-category-ul" >
                                {liLable}
                            </ul>
                            <ul className="tag-list-detail">
                                {liLableList}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

UserDetail = Form.create()(UserDetail);
export default UserDetail;

