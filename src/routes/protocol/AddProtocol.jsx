import './protocol.less';
import React from 'react';
import { hashHistory } from 'react-router';
import {Breadcrumb,Form, Row, Col, Input, Button, Icon,Select,Popconfirm,message,Table,Checkbox,Radio,DatePicker,Modal,AutoComplete} from 'antd';
import { Link} from 'react-router';
import moment from 'moment';
import $ from 'jquery';
import { serveUrl, User, cacheData,protocolMsg} from '../../utils/config';
import ProductList from './ProductList';//添加新产品
import DeleteDialog from '../DeleteDialog';//引入删除弹框

const msg = '确认删除该协议产品吗?';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const CheckboxGroup = Checkbox.Group;
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
let productList = [];
// const url = "http://192.168.1.198:8080/";

class AddProtocol  extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [{
            title: '产品编号',
            dataIndex: 'productNo',
            width: '33%',
            render(text,record) {
                return (
                        <div className="order">{text}</div>
                        )
            }
           },{
            title: '产品名称',
            dataIndex: 'productName',
            width: '33%',
            render(text,record) {
                return (
                        <div className="order">{text}</div>
                        )
            }
            }, {
            title: '操作',
            dataIndex: 'operation',
            render: (text, record, index) => {
                return (
                    this.state.protocolProductList.length > 0 ?
                    (
                        <div className="order">
                            <a href="javascript:;" onClick={this.showProductService.bind(this,record)} style={{marginRight:10,color:'#4778c7'}} >配置</a>
                            <a href='javascript:;' onClick={this.showModalDel.bind(this,record,index)} style={{color:'#4778c7'}}>删除</a>
                        </div>
                    ) : null
                    );
            },
        }];
        this.state = {
            serveTypeData:[],
            getProductCategory:[],
            institutionClientList:[],//协议客户列表
            // keys: [],
            // selectedRowKeys: [],
            
            uuid:0,
            record:null,
            index:null,
            visible: false,
            productData:[],
            productDateLength:null,
            productDateCurrent:1,
            productDatePageSize:10,
            status:false,
            protocolTypeList:[],//协议类型列表
            productIds:[],//协议id列表
            visibleDel:false,
            protocolId:null,
            protocolProductList:[],
            //日期选择器的参数
            startValue: null,
            endValue: null,
            endOpen: false,
            startDate:null,
            endDate:null,
            AutoClientList:[],
            institutionClientId:null,
            btnState:false
        }
    }

    componentWillMount=()=> { 
        if(User.isLogin()){
        } else{
            hashHistory.push('/login');
        }
         const _this = this;
        //获取协议类型列表
        $.ajax({
            type: "GET",
            url: serveUrl + "guest-protocol/protocolTypeSelect",
            data: {access_token: User.appendAccessToken().access_token},
            success: function (data) {
                if (data.status == 200) {
                    _this.setState({
                        protocolTypeList:data.data
                    });
                }
            }
        }); 
        //获取客户名称模糊匹配
        $.ajax({
            type: "GET",
            url: serveUrl + "institution-client/queryInstitutionClientDropdownList",
            data: { access_token: User.appendAccessToken().access_token },
            success: function(data) {
                if (data.status == 200) {
                    const Adata = [];
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
        $(".ant-col-offset-4").removeClass("ant-col-offset-4").addClass("ant-col-offset-3");
        // $(".ant-calendar-picker").addClass('ant-col-12');
        $(".ant-breadcrumb-separator").html(">");
    }

    getInitList = (page,rows)=>{
        const _this = this;
        $.ajax({
            type: "GET",
            url: serveUrl + "guest-protocol/protocol-product-list",
            data: {access_token: User.appendAccessToken().access_token,page:page,rows:rows,protocolId: _this.state.protocolId},
            success: function (data) {
                if (data.status == 200) {
                    const productIds = [];
                    if(data.data.rows.length>0){
                        data.data.rows.map(data => {
                            data.key = data.protocolProductId;
                            productIds.push(data.productId);
                        });
                        _this.setState({
                            protocolProductList: data.data.rows,
                            productIds: productIds,
                            productDateLength: data.data.total
                        })
                    } 
                    else {
                        _this.setState({
                            protocolProductList: [],
                            productIds: [],
                            productDateLength: 0
                        })
                    }
                }
            }
        });
    }

    componentDidUpdate=()=>{
        // $(".ant-pagination-item-active").css({backgroundColor:'#4778c7',borderColor:'#4778c7'});
        $(".ant-table-tbody tr td").css({borderBottom:'none'});
        $("table").css({border:'1px solid #f0f0f0'});
        $(".ant-pagination-options").hide();
    }
    //协议客户名称的模糊匹配
    AutoCompleteChange=(e)=>{
        const _this = this;
        $.ajax({
            type: "GET",
            url: serveUrl + "institution-client/queryInstitutionClientDropdownList",
            data: { access_token: User.appendAccessToken().access_token,name:e},
            success: function(data) {
                if (data.status == 200) {
                    if(data.data.length == 1){
                        _this.setState({
                            institutionClientId:data.data[0].id
                        });
                    }
                }
            }
        });
    }

    //删除弹框
    showModalDel = (record,index) => {
        this.setState({
            visibleDel: true,
            protocolProductId:record.protocolProductId
        });
    }
    //删除确认
    handleOkDel = () => {
        this.setState({
            visibleDel: false,
        });
        //删除协议
        const _this = this;
        $.ajax({
            type: "POST",
            contentType: 'application/json;charset=utf-8',
            url: serveUrl + "guest-protocol/protocol-product-delete?access_token="+User.appendAccessToken().access_token,
            data: JSON.stringify({
                data: [parseInt(_this.state.protocolProductId)]
            }),
            success: function (data) {
                if (data.status == 200) {
                    message.success(data.msg);
                    _this.getInitList(_this.state.productDateCurrent,_this.state.productDatePageSize);
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

    //预约人是否勾选
    changeBox=(e)=>{
        if(e.target.checked){
            this.add();
            $(".person").show();
            this.setState({
                status:true
            });
        }
        else{
            const { form } = this.props;
            form.setFieldsValue({'keys':[]});
            this.setState({
                status:false
            });
            $(".person").hide();
        }
    }
    //某协议下可配置的产品
    showModal=()=>{
        this.setState({
            visible:true
        });
    }

     handleOk=()=> {
        this.setState({
            confirmLoading: true,
            visible:false
        });
    }

    handleCancel=()=> {
        this.setState({
            visible: false
        });
    }
    //新增产品选择框关闭
    confirmSelect=(productData,productIds)=>{
        productData.map(data=>{
            data.key = data.productId;
            this.state.productData.push(data);
            this.state.protocolProductList.push(data);
        });
        this.setState({
            visible: false,
            productData:this.state.productData,
            productIds:productIds,
            protocolProductList:this.state.protocolProductList
        });
        productList = this.state.productData;
        //新增协议产品
        const _this = this;
        const protocolProductList = [];
        _this.state.productData.map(data=>{
            if(data.serviceList){
                data.serviceList.map(k=>{
                    k.protocolProductId=null;
                    k.serviceId=k.servId;
                });
            }
            protocolProductList.push({
                productId:data.productId,
                productDesc:'',
                protocolId:parseInt(_this.state.protocolId),
                serviceList:data.serviceList
            });
        });
        if (productData.length > 0) {
            $.ajax({
                type: "POST",
                contentType: 'application/json;charset=utf-8',
                url: serveUrl + "guest-protocol/protocol-product-save-or-update?access_token=" + User.appendAccessToken().access_token,
                data: JSON.stringify({
                    data: protocolProductList
                }),
                success: function (data) {
                    if (data.status == 200) {
                        _this.getInitList(_this.state.productDateCurrent, _this.state.productDatePageSize);
                    }
                }
            });
        }
    }

    //跳转到产品配置页
    showProductService=(record)=>{
        protocolMsg.productName = record.productName;
        protocolMsg.productDesc = record.productDesc;
        protocolMsg.protocolName = this.props.form.getFieldValue('name');//获取协议名称
        hashHistory.push(`/setProtocolProduct/${this.state.protocolId}/${record.productId}/${record.protocolProductId}`);
    }

    remove = (k) => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        if (keys.length < 1) {
            return;
        }
        if(keys.length <= 1){
            this.setState({
                status:false
            });
            $(".person").hide();
        }
        else{
            this.setState({
                status:true
            });
        }
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
    }

    add = () => {
        const uuid = this.state.uuid+1;
        this.setState({
            uuid:uuid
        });
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(uuid);
        form.setFieldsValue({
            keys: nextKeys,
        });
    }

    showModal1=(record,index)=>{
        this.setState({
            visibleProSer: true,
            record:record,
            index:index
        });
    }

    handleReset=()=>{
        this.props.form.resetFields();
        hashHistory.push('protocolList');
    }

     //表单提交
    handleSubmit = (e)=>{
        // $(".save-btn").addClass("grey-btn").removeClass("btn-small");
        this.setState({
            btnState:true
        });
        const _this=this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const authorizerArr = [];
                for(let j = 1;j<=values.keys.length;j++){
                    authorizerArr.push({
                        cellphone: values[`cellphone-${j}`],
                        name: values[`authorizerName-${j}`],
                        telephone: values[`telephone-${j}`],
                        isDeleted:0
                    });
                }
                var formatData = {
                    data: [
                        {
                            authorizer:authorizerArr,
                            name: values.name,
                            remark: values.remark,
                            type: parseInt(values.type),
                            institutionClientId:parseInt(_this.state.institutionClientId),
                            startDate:_this.state.startDate,
                            endDate:_this.state.endDate,
                            reservationNum:parseInt(values.reservationNum)
                        }
                    ]
                }
                $.ajax({
                    type: "POST",
                    contentType:'application/json;charset=utf-8',
                    url: serveUrl+"guest-protocol/save-or-update?access_token="+User.appendAccessToken().access_token,
                    // url:'http://192.168.1.130:8080/guest-protocol/save-or-update',
                    data: JSON.stringify(formatData),
                    success: function(data){
                        if(data.status == 200){
                            setTimeout(function(){
                                // $(".save-btn").addClass("btn-small").removeClass("grey-btn");
                            },1500);
                            _this.setState({
                                btnState:false
                            });
                            message.success(data.msg);
                            $(".productList").show();
                            _this.setState({
                                protocolId:data.data
                            });
                            hashHistory.push(`/updateProtocol/${data.data}`);
                        }
                        else if(data.status == 5003){
                            message.error(data.msg);
                        }
                        else if(data.status == 5001){
                            message.error(data.msg);
                        }  
                        else if(data.status == 4999){
                            message.error(data.msg);
                        }
                    }
                });    
            }
        });
    }

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
        this.state.startDate = moment(value._d).format('YYYY-MM-DD');
        this.setState({
            startDate:this.state.startDate
        });
    }

    onEndChange = (value) => {
        this.onChange('endValue', value);
        this.state.endDate = moment(value._d).format('YYYY-MM-DD');
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
         const { startValue, endValue, endOpen } = this.state;
         const { getFieldDecorator, getFieldValue } = this.props.form;
         const formItemLayout = {
             labelCol: { span: 3 },
             wrapperCol: { span: 10 }
         };
         const formItemLayoutWithOutLabel = {
             wrapperCol: { span: 20, offset: 4 },
         };
        const Options1 = this.state.protocolTypeList.map(data => <Option key={data.id} value={data.id.toString()}>{data.value}</Option>);
        const Options2 = this.state.institutionClientList.map(data => <Option key={data.id} value={data.id.toString()}>{data.value}</Option>);
        getFieldDecorator('keys', { initialValue: []});
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => {
            return (
                <div key={index} style={{position:'relative'}} >
                    <FormItem  label="姓名"  labelCol={{span:3}} {...formItemLayout} required>
                            <Col span={10}>
                                <FormItem>
                                    {getFieldDecorator(`authorizerName-${k}`, {
                                        rules: [{
                                            required: true, message: '请输入预约人姓名！'
                                        }],
                                    })(
                                        <Input placeholder="请输入预约人姓名" style={{width:170}}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={10}>
                                <FormItem>
                                    {getFieldDecorator(`cellphone-${k}`, {
                                        rules: [
                                            {
                                                message: "联系方式输入有误，请重新输入！",
                                                pattern: /^1[3-8]\d{9}$|^\d{3}-\d{8}$|^\d{4}-\d{7}$/
                                            }, {
                                                message: '请输入联系方式！'
                                            }
                                        ]
                                    })(
                                        <Input placeholder="请输入预约人联系方式" style={{width:170}}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={2}>
                                <a href="javascript:;" className="dynamic-delete-button-1" disabled={keys.length < -1} onClick={() => this.remove(k)} style={{color:'#4778c7',width:30}}>删除</a>
                            </Col>
                        </FormItem>
                </div>
            );
        });

        const _this = this;
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };
        
        const columns = this.columns;
        const pagination = {
            total: this.state.productDateLength,
            showSizeChanger: true,
            onShowSizeChange(current, pageSize) {
                _this.state.productDateCurrent = current;
                _this.state.productDatePageSize = pageSize;
                _this.getInitList(_this.state.productDateCurrent,_this.state.productDatePageSize);
            },
            onChange(current) {
                _this.state.productDateCurrent = current;
                _this.getInitList(_this.state.productDateCurrent,_this.state.productDatePageSize);
            }
        };

        return (
            <div>
                <div className="breadcrumb-box">
                    <div className="top-bar"></div>
                    <div className="breadcrumb">
                        <Breadcrumb>
                            <Breadcrumb.Item>协议管理</Breadcrumb.Item>
                            <Breadcrumb.Item>添加协议</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
                <div className="box">
                    <ul className="tit">
                        <li>
                            <a href="javascript:;" className="active">添加协议</a>
                        </li>
                    </ul>

                    <div className="mid-box">
                        <div className="protocol-sort">
                            <Form horizontal  className="" style={{ position: 'relative' }}>
                                <FormItem label="客户名称" {...formItemLayout} style={{marginBottom:27}}>
                                    {getFieldDecorator("institutionClientId", {
                                        rules: [{message: '请选择机构客户!' }],
                                    })(
                                        <AutoComplete
                                            dataSource={this.state.AutoClientList}
                                            placeholder="请输入客户名称"
                                            onChange={this.AutoCompleteChange}
                                            />
                                        )}
                                </FormItem>

                                <FormItem label="协议名称" {...formItemLayout} required>
                                    {getFieldDecorator("name", {
                                        rules: [{ required: true, message: '请输入协议名称!' }],
                                    })(
                                        <Input />
                                        )}
                                </FormItem>
                                <FormItem label="协议类型" {...formItemLayout}>
                                    {getFieldDecorator("type", {
                                        rules: [{ required: true, message: '请选择协议类型!' }],
                                    })(
                                        <Select>
                                            {Options1}
                                        </Select>
                                        )}
                                </FormItem>
                                <FormItem label="预约号" {...formItemLayout}>
                                    {getFieldDecorator("reservationNum", {
                                        rules: [{
                                            message: "预约号输入有误，请重新输入！",
                                            pattern: /^\d+$/
                                        }, {
                                            message: '请输入预约号！'
                                        }],
                                    })(
                                        <Input />
                                        )}
                                </FormItem>
                                <FormItem label="有效期" {...formItemLayout}>
                                    {getFieldDecorator("expire", {
                                        rules: [{  message: '请选择有效期!' }],
                                    })(
                                        <div>
                                            <DatePicker
                                                disabledDate={this.disabledStartDate}
                                                format="YYYY-MM-DD"
                                                value={startValue}
                                                placeholder="选择日期"
                                                onChange={this.onStartChange}
                                                onOpenChange={this.handleStartOpenChange}
                                                />&nbsp;&nbsp;~&nbsp;&nbsp;
                                            <DatePicker
                                                disabledDate={this.disabledEndDate}
                                                format="YYYY-MM-DD"
                                                value={endValue}
                                                placeholder="选择日期"
                                                onChange={this.onEndChange}
                                                open={endOpen}
                                                onOpenChange={this.handleEndOpenChange}
                                                />
                                        </div>
                                        )}
                                </FormItem>

                                <FormItem label="协议说明" {...formItemLayout}>
                                    {getFieldDecorator("remark", {
                                        rules: [{message: '请输入协议说明!' }],
                                    })(
                                        <Input type="textarea" id="control-textarea" rows="3" style={{height:112}} />
                                        )}
                                </FormItem>

                                <FormItem label="预约人" {...formItemLayout} >
                                    {getFieldDecorator("authorizerArr", {
                                    })(
                                        <Checkbox id="checkbox" onChange={this.changeBox} checked={this.state.status}>是否有预约人</Checkbox>
                                        )}
                                </FormItem>

                                <div className="border person" style={{ display: 'none' }}>
                                    {formItems}
                                    <FormItem {...formItemLayoutWithOutLabel} labelCol={{span:3}}>
                                        <Col span={10}>
                                            <button onClick={this.add}  style={{width:200,height:30,lineHeight:'30px',textAlign:'center',color:'#b7b7b7',backgroundColor:'#fff',border:'1px dashed #b7b7b7',display:'block',cursor:'pointer'}}>+增加预约人</button>
                                        </Col>
                                    </FormItem>
                                </div>

                                <FormItem wrapperCol={{ span: 6, offset: 9 }} style={{ marginTop: 24 }}>
                                    <button className="btn-small save-btn" onClick={this.handleSubmit} >保&nbsp;&nbsp;存</button>
                                    &nbsp;&nbsp;&nbsp;
                                    <button className="btn-small" onClick={this.handleReset}>取&nbsp;&nbsp;消</button>
                                </FormItem>
                            </Form>
                            <div className="productList" style={{display:'none'}}>
                                <Row style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 10, marginBottom: 10 }}>
                                    <Col span={2}>
                                        <span style={{ fontSize: 16 }}>产品列表</span>
                                    </Col>
                                </Row>
                                <p className="msg">可以选择该协议的<span style={{ color: '#4778c7',cursor:'pointer'}} onClick={this.showModal}>可用产品</span>，再配置产品的详细服务单价与信息。</p>
                                <div className="search-result-list">
                                    <Table style={{ marginTop: 20 }} columns={columns} dataSource={this.state.protocolProductList}  pagination={pagination} className="serveTable" />
                                </div>
                            </div>
                            

                            <Modal title="选择产品"
                                key={Math.random() * Math.random()}
                                visible={this.state.visible}
                                onOk={this.handleOk}
                                confirmLoading={this.state.confirmLoading}
                                onCancel={this.handleCancel}
                                >
                                <div>
                                    <ProductList confirmSelect={this.confirmSelect} productIds={this.state.productIds}/>
                                </div>
                            </Modal>
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
                </div>
            </div>
        )
    }
}
AddProtocol  = Form.create()(AddProtocol );

export default AddProtocol ;