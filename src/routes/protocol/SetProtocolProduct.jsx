import './protocol.less';
import React from 'react';
import { hashHistory } from 'react-router';
import {Breadcrumb,Form, Row, Col, Input, Button, Icon,Select,Popconfirm,message,Table,Checkbox,Radio,DatePicker,Modal,Menu} from 'antd';
import { Link} from 'react-router';
import moment from 'moment';
import $ from 'jquery';
import { serveUrl, User, cacheData,protocolMsg,newAddFlag} from '../../utils/config';
import VIPLoungeProduct from './VIPLoungeProduct';//配置贵宾厅产品
import VIPShuttleBusProduct from './VIPShuttleBusProduct';//配置VIP摆渡车产品
import ShuttleMachineProduct from './ShuttleMachineProduct';//配置迎送机陪同产品
import ParkingProduct from './ParkingProduct';//配置停车场产品
import LoungeProduct from './LoungeProduct';//配置休息室产品
import SecurityChannelProduct from './SecurityChannelProduct';//配置安检通道产品
import RemoteBoardGateProduct from './RemoteBoardGateProduct';//配置远机位摆渡车产品

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const CheckboxGroup = Checkbox.Group;
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const SubMenu = Menu.SubMenu;
let openKeys = [];
// const url = "http://192.168.1.198:8080/";

class SetProtocolProduct  extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categoryListPage:1,
            categoryListRows:10,
            categoryListLength:null,
            serviceIds:[1,2,3],
            menuList:[],
            typeId:null,//协议产品服务id
        }
    }

    componentWillMount = () => {
        if(User.isLogin()){
        } else{
            hashHistory.push('/login');
        }
        const _this = this;
        //获取协议产品下面对应的服务类别树（有协议产品id）
        $.ajax({
            type: "GET",
            url: serveUrl + 'guest-protocol/get-service-type-tree-by-protocol-product-id',
            data: { access_token: User.appendAccessToken().access_token, protocolProductId: _this.props.params.protocolProductId },
            success: function(data) {
                if (data.status == 200) {
                    data.data.map(k=>{
                        k.key =k.serviceTypeId; 
                        k.serviceTypeList.map(i=>{
                            i.key = i.serviceTypeId;
                        })
                    });
                    _this.setState({
                        menuList: data.data
                    });
                    const menuList = [];
                    _this.state.menuList.map(k => {
                        menuList.unshift(k);
                    })
                    _this.setState({
                        menuList: menuList
                    });
                }
            }
        });
    }

    componentDidMount =()=>{
        $(".ant-breadcrumb-separator").html(">");
        $(".ant-col-3").removeClass('ant-col-3').addClass("ant-col-4");
        $("textarea").css({borderRadius:3,border:'1px solid #ccc',padding:'0px 2px',outline:'none'});
        $('.right-box').animate({scrollTop:0},100);
    }

    componentDidUpdate=()=>{
        // $(".ant-pagination-item-active").css({backgroundColor:'#4778c7',borderColor:'#4778c7'});
    }

    click = (e) => {
        this.setState({
           typeId:e.key 
        });
        $(".sub-service").eq(e.key-1).show().siblings().hide();
        
    }

    goBack = ()=>{
        // history.go(-1);
        hashHistory.push(`/updateProtocol/${this.props.params.protocolId}`);
    }
    //保存说明按钮
    saveRemark=()=>{
        protocolMsg.productDesc = this.props.form.getFieldValue('remark');
        const _this = this;
        $.ajax({
            type: "POST",
            contentType: 'application/json;charset=utf-8',
            url: serveUrl + "guest-protocol/protocol-product-save-or-update?access_token="+User.appendAccessToken().access_token,
            data: JSON.stringify({
                data: [{
                    productId:parseInt(_this.props.params.id),
                    productDesc:_this.props.form.getFieldValue('remark'),
                    protocolId:parseInt(this.props.params.protocolId),
                    protocolProductId:parseInt(this.props.params.protocolProductId)
                }]
            }),
            success: function (data) {
                if (data.status == 200) {
                    message.success(data.msg);
                }
            }
        });
    }

     render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 10 }
        };
        let sidebarOption = null;
        sidebarOption = this.state.menuList.map(data => {
            const key = 'menu' + data.serviceTypeAllocationId;
            openKeys.push(key);
            const childrens = data.serviceTypeList.map(data => <Menu.Item key={data.serviceTypeAllocationId}>{data.type}</Menu.Item>)
            return (
                <SubMenu key={key} title={<span><span>{data.category}</span></span>}>
                    {childrens}
                </SubMenu>
            )
        });

        return (
            <div>
                <div className="breadcrumb-box">
                    <div className="top-bar"></div>
                    <div className="breadcrumb">
                        <Breadcrumb>
                            <Breadcrumb.Item>协议管理</Breadcrumb.Item>
                            <Breadcrumb.Item>产品管理</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
                <div className="box">
                    <ul className="tit">
                        <li>
                            <a href="javascript:;" className="active">产品配置</a>
                        </li>
                    </ul>

                    <div className="mid-box">
                        <div className="protocol-sort">
                            <Form horizontal  className="" style={{ position: 'relative' }}>
                                <Row>
                                    <Col span={12}>
                                        <FormItem label="协议名称" {...formItemLayout}>
                                            {getFieldDecorator("institutionClientId", {
                                                rules: [{message: '请选择机构客户!' }],
                                                initialValue: protocolMsg.protocolName
                                            })(
                                                <input className="input-radius" type="text" disabled style={{width:'190%'}}/>
                                                )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12} >
                                        <FormItem label="产品名称" {...formItemLayout}>
                                            {getFieldDecorator("name", {
                                                rules: [{message: '请输入协议名称!' }],
                                                initialValue: protocolMsg.productName
                                            })(
                                                <input className="input-radius" type="text" disabled style={{width:'200%'}}/>
                                                )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12} >
                                        <FormItem label="产品说明" {...formItemLayout}>
                                            {getFieldDecorator("remark", {
                                                rules: [{ message: '请输入产品说明!' }],
                                                initialValue: protocolMsg.productDesc
                                            })(
                                                <textarea style={{width:'440%'}} rows="2" ></textarea>
                                                )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="ant-table-pagination">
                                        <FormItem>
                                            <button className="btn-small" onClick={this.saveRemark}>保存说明</button>
                                        </FormItem>
                                    </Col>
                                </Row>
                                
                            </Form>
                            <p className="msg">该产品包含以下服务，您可以点击服务类别，配置相应的单价和信息；配置完后，请点击保存。全部配置好，可点击<a onClick={this.goBack} style={{color:'#4778c7'}}>返回该协议界面</a>。</p>

                            <div className="mid-box-content">
                                <div className="mid-box-sidebar mt14">
                                    <Menu
                                        onClick={this.click}
                                        style={{ width: 157 }}
                                        // defaultSelectedKeys={['1']}
                                        defaultOpenKeys={openKeys}
                                        mode="inline"
                                        >
                                        {sidebarOption}
                                    </Menu>
                                </div>
                                <ul className="right-content mt14" id="right-content">
                                    <li className="vip-lounge sub-service" style={{display:'none'}}>
                                        <VIPLoungeProduct productId={this.props.params.id} protocolId={this.props.params.protocolId} protocolProductId={this.props.params.protocolProductId}/>
                                    </li>
                                     <li className="vip-shuttle-bus sub-service" style={{display:'none'}}>
                                        <VIPShuttleBusProduct productId={this.props.params.id} protocolId={this.props.params.protocolId} protocolProductId={this.props.params.protocolProductId}/>
                                    </li>
                                    <li className="shuttle-machine sub-service" style={{display:'none'}}>
                                        <ShuttleMachineProduct productId={this.props.params.id} protocolId={this.props.params.protocolId} protocolProductId={this.props.params.protocolProductId}/>
                                    </li>
                                    <li className="parking sub-service" style={{display:'none'}}>
                                        <ParkingProduct productId={this.props.params.id} protocolId={this.props.params.protocolId} protocolProductId={this.props.params.protocolProductId}/>
                                    </li>
                                    <li className="lounge sub-service" style={{display:'none'}}>
                                        <LoungeProduct productId={this.props.params.id} protocolId={this.props.params.protocolId} protocolProductId={this.props.params.protocolProductId}/>
                                    </li>
                                    <li className="security-channel sub-service" style={{display:'none'}}>
                                        <SecurityChannelProduct productId={this.props.params.id} protocolId={this.props.params.protocolId} protocolProductId={this.props.params.protocolProductId}/>
                                    </li>
                                    <li className="remote-board-gate sub-service" style={{display:'none'}}>
                                        <RemoteBoardGateProduct productId={this.props.params.id} protocolId={this.props.params.protocolId} protocolProductId={this.props.params.protocolProductId}/>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
SetProtocolProduct  = Form.create()(SetProtocolProduct );

export default SetProtocolProduct ;