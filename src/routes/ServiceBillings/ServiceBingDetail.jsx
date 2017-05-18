import './ServiceBing.less'
import React from 'react';
import { hashHistory } from 'react-router';
import { Breadcrumb, Form, Row, Col, Input, Button, Icon, Select, Popconfirm, message, Table, Checkbox, AutoComplete, DatePicker } from 'antd';
import { Link } from 'react-router';
import $ from 'jquery';
import moment from 'moment';
import { serveUrl, User, cacheData,billClient,getCookie,setCookie } from '../../utils/config';

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const screenHeight = document.documentElement.clientHeight;

class ServiceList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            AutoClientList:[],
            protocolList:[],
            protocolNameList:[],
            productsData:[],
            queryCustomerId:null,
            queryProtocolType:null,
            page:1,
            rows:10,
            column:[],
            dataSource:[],
            billClientList:[],
            firstType:null,
            status:false,
            queryProductName:null,
            queryProtocolId:null,
            clientId:null,//客户id
            protocolId:null,//协议id
        }
    }

    componentWillMount() {
         if(User.isLogin()){
        } else{
            hashHistory.push('/login');
        }
    }
    componentDidUpdate=()=>{
        $(".ant-pagination").hide();
        $(".ant-table-tbody tr td").css({borderBottom:'none'});
    }
    componentDidMount = () => {
        $(".ant-breadcrumb-separator").html(">");
        $(".ant-breadcrumb-separator").css({ color: '#333' });
        $(".ant-col-5").removeClass('ant-col-5').addClass("ant-col-8");
        $(".ant-col-19").removeClass('ant-col-19').addClass("ant-col-16");
        $(".ulList li").on("click",function(){
            $(this).addClass("active").siblings().removeClass("active");
        })
        $(".right-box").css({position:'absolute',top:0,left:0,right:0,bottom:0,paddingLeft:0});
        $("#leftMenu").css({display:"none",height:0,width:0,position:'static'});
        $("#rightWrap").css({left:'0px'});

        //若列表页选择客户，则显示选择的客户，否则调用全部客户的接口
        if(getCookie("customerId") && !getCookie("protocolId")){//选择客户，未选择协议
            this.state.billClientList.push({
                id:getCookie("customerId"),
                key:getCookie("customerId"),
                value:getCookie("customerName")
            });
            this.setState({
                billClientList:this.state.billClientList
            });
            this.props.form.setFieldsValue({
                clientName:this.state.billClientList[0].value
            })
            this.getInitialData();
        }
        else if(!getCookie("customerId") && getCookie("protocolId")){//没选择客户，选择协议(因一个协议对应一个客户，所以相当于客户，协议都选择了)
            
        }
        else if(getCookie("customerId") && getCookie("protocolId")){//客户，协议都选择了
            //客户列表
            this.state.billClientList.push({
                id:getCookie("customerId"),
                key:getCookie("customerId"),
                value:getCookie("customerName")
            });
            this.setState({
                billClientList:this.state.billClientList
            });
            this.props.form.setFieldsValue({
                clientName:this.state.billClientList[0].value
            })
            //协议列表
            this.state.protocolNameList.push({
                id:getCookie("protocolId"),
                key:getCookie("protocolId"),
                value:getCookie("protocolName"),
                type:getCookie("protocolType")
            });
            this.setState({
                protocolNameList:this.state.protocolNameList
            });
            this.props.form.setFieldsValue({
                protocolName:this.state.protocolNameList[0].value
            })
             //根据协议获取产品
            const _this = this;
            $.ajax({
                type: "GET",
                url: serveUrl+'guest-protocol/view?access_token='+ User.appendAccessToken().access_token,
                data:{protocolId:_this.state.protocolNameList[0].id},
                success: function(data){
                    if(data.status == 200){
                        _this.setState({
                            productsData:data.data.protocolProductList,
                            queryProtocolType:_this.state.protocolNameList[0].type
                        })
                        $('.bingUl li').eq(0).removeClass("grey-li").addClass("blue-li");
                        if(data.data.protocolProductList.length>0){
                            _this.setState({
                                queryProductName:data.data.protocolProductList[0].productName,
                                queryProtocolId:data.data.protocolProductList[0].protocolId
                            });
                            //根据产品获取下面的服务
                            $.ajax({
                                type: "GET",
                                // url:'http://192.168.1.199:8887/customer-checklist?access_token='+ User.appendAccessToken().access_token,
                                url: serveUrl+'guest-check/customer-checklist?access_token='+ User.appendAccessToken().access_token,
                                data:{
                                    queryProductName:data.data.protocolProductList[0].productName,
                                    queryCustomerId:getCookie("customerId"),
                                    queryProtocolId:data.data.protocolProductList[0].protocolId,
                                    queryProtocolType:_this.state.protocolNameList[0].type,
                                    queryFlightDateBegin:getCookie("queryFlightDateBegin"),
                                    queryFlightDateEnd:getCookie("queryFlightDateEnd")
                                },
                                success: function(data){
                                    if(data.status == 200){
                                        if(data.data.rows.length>0){
                                            data.data.rows.map((v,index)=>{
                                                v.key= index
                                            })
                                            _this.setState({
                                                column:data.data.column,
                                                dataSource:data.data.rows
                                            })
                                        }  
                                    }
                                }
                            });
                        }
                    }
                }
            });
        }
        else if(!getCookie("customerId") && !getCookie("protocolId")) {//客户与协议都没有选择
            const _this = this;
            //获取所有客户
            $.ajax({
                type: "GET",
                url: serveUrl + "institution-client/queryInstitutionClientDropdownList?access_token=" + User.appendAccessToken().access_token,
                success: function (data) {
                    if (data.status == 200) {
                        if(data.data.length>0){
                            data.data.map(k=>{
                                k.key = k.id;
                            });
                            _this.setState({
                                billClientList:data.data
                            });
                            _this.props.form.setFieldsValue({
                                clientName: _this.state.billClientList[0].value
                            })
                            _this.getInitialData();
                        }
                    }
                }
            }); 
        } 
    }

    getInitialData=()=>{
        if(this.state.billClientList.length>0){
            const _this = this;
            //根据用户ID获取协议列表
            $.ajax({
                type: "GET",
                url: serveUrl + "guest-order/queryProtocolIdsInOrderInfoByCustomId?access_token="+User.appendAccessToken().access_token,
                // url:"http://192.168.0.124:8989/queryProtocolIdsInOrderInfoByCustomId?access_token="+User.appendAccessToken().access_token,
                data: {
                    customerIds: this.state.billClientList[0].id,
                    flag:getCookie('flagBill')
                },
                success: function (data) {
                    if (data.status == 200) {
                        if(data.data.length>0){
                            _this.setState({
                                protocolList: data.data,
                                protocolNameList:data.data[0].protocolVos
                            });
                        }
                        _this.props.form.setFieldsValue({
                            protocolName:data.data[0].protocolVos[0].value
                        })
                        _this.setState({
                            queryCustomerId:_this.state.billClientList[0].id
                        });
                        $(".ulList li").eq(0).addClass("active");
                        $('button').eq(0).addClass("blue-btn");
                        if(data.data.length>0 && data.data[0].protocolVos.length>0){
                            _this.state.firstType = data.data[0].protocolVos[0].type;
                            _this.setState({
                                firstType:_this.state.firstType
                            });
                            //根据协议获取产品
                            $.ajax({
                                type: "GET",
                                url: serveUrl+'guest-protocol/view?access_token='+ User.appendAccessToken().access_token,
                                data:{protocolId:data.data[0].protocolVos[0].id},
                                success: function(data){
                                    if(data.status == 200){
                                        _this.setState({
                                            productsData:data.data.protocolProductList,
                                            queryProtocolType:_this.state.firstType
                                        })
                                        $('.bingUl li').eq(0).removeClass("grey-li").addClass("blue-li");
                                        if(data.data.protocolProductList.length>0){
                                            _this.setState({
                                                queryProductName:data.data.protocolProductList[0].productName,
                                                queryProtocolId:data.data.protocolProductList[0].protocolId
                                            });
                                            //根据产品获取下面的服务
                                            $.ajax({
                                                type: "GET",
                                                // url:'http://192.168.1.199:8887/customer-checklist?access_token='+ User.appendAccessToken().access_token,
                                                url: serveUrl+'guest-check/customer-checklist?access_token='+ User.appendAccessToken().access_token,
                                                data:{
                                                    queryProductName:data.data.protocolProductList[0].productName,
                                                    queryCustomerId:_this.state.queryCustomerId,
                                                    queryProtocolId:data.data.protocolProductList[0].protocolId,
                                                    queryProtocolType:_this.state.queryProtocolType,
                                                    queryFlightDateBegin:getCookie("queryFlightDateBegin"),
                                                    queryFlightDateEnd:getCookie("queryFlightDateEnd")
                                                },
                                                success: function(data){
                                                    if(data.status == 200){
                                                        if(data.data.rows.length>0){
                                                            data.data.rows.map((v,index)=>{
                                                                v.key= index
                                                            })
                                                            _this.setState({
                                                                column:data.data.column,
                                                                dataSource:data.data.rows
                                                            })
                                                        } 
                                                    }
                                                }
                                            });
                                        }
                                    }
                                }
                            });
                        } 
                    }
                }
            });
        }
    }

    //客户名称改变
    clientChange=(e)=>{
        this.setState({
            clientId:e
        });
        const _this = this;
        $.ajax({
            type: "GET",
            url: serveUrl + "guest-order/queryProtocolIdsInOrderInfoByCustomId?access_token="+User.appendAccessToken().access_token,
            // url:"http://192.168.0.124:8989/queryProtocolIdsInOrderInfoByCustomId?access_token="+User.appendAccessToken().access_token,
            data: {
                customerIds: e,
                flag:getCookie('flagBill')
            },
            success: function (data) {
                if (data.status == 200) {
                    if(data.data.length>0){
                        _this.setState({
                            protocolList: data.data,
                            protocolNameList:data.data[0].protocolVos,
                            queryCustomerId:e,
                        });
                        _this.props.form.setFieldsValue({
                            protocolName:data.data[0].protocolVos[0].value
                        })
                    }
                    $('button').eq(0).addClass("blue-btn");
                    if(data.data.length>0 && data.data[0].protocolVos.length>0){
                        _this.state.firstType = data.data[0].protocolVos[0].type;
                        _this.setState({
                            firstType:_this.state.firstType
                        });
                        $.ajax({
                            type: "GET",
                            url: serveUrl+'guest-protocol/view?access_token='+ User.appendAccessToken().access_token,
                            data:{protocolId:data.data[0].protocolVos[0].id},
                            success: function(data){
                                if(data.status == 200){
                                    _this.setState({
                                        productsData:data.data.protocolProductList,
                                        queryProtocolType:_this.state.firstType
                                    })
                                    $('.bingUl li').eq(0).removeClass("grey-li").addClass("blue-li");
                                    if(data.data.protocolProductList.length>0){
                                        _this.setState({
                                            queryProductName:data.data.protocolProductList[0].productName,
                                            queryProtocolId:data.data.protocolProductList[0].protocolId
                                        });
                                        $.ajax({
                                            type: "GET",
                                            // url:'http://192.168.1.199:8887/customer-checklist?access_token='+ User.appendAccessToken().access_token,
                                            url: serveUrl+'guest-check/customer-checklist?access_token='+ User.appendAccessToken().access_token,
                                            data:{
                                                queryProductName:data.data.protocolProductList[0].productName,
                                                queryCustomerId:_this.state.queryCustomerId,
                                                queryProtocolId:data.data.protocolProductList[0].protocolId,
                                                queryProtocolType:_this.state.queryProtocolType,
                                                queryFlightDateBegin:getCookie("queryFlightDateBegin"),
                                                queryFlightDateEnd:getCookie("queryFlightDateEnd")
                                            },
                                            success: function(data){
                                                if(data.status == 200){
                                                    if(data.data.rows.length>0){
                                                        data.data.rows.map((v,index)=>{
                                                            v.key= index
                                                        })
                                                        _this.setState({
                                                            column:data.data.column,
                                                            dataSource:data.data.rows
                                                        })
                                                    }
                                                }
                                            }
                                        });
                                    }
                                }
                            }
                        });
                    }
                }
            }
        });
    }
    //协议名称改变
    protocolChange=(e)=>{
        this.setState({
            protocolId:e
        });
        const _this = this;
        $.ajax({
            type: "GET",
            url: serveUrl+'guest-protocol/view?access_token='+ User.appendAccessToken().access_token,
            data:{protocolId:e},
            success: function(data){
                _this.setState({
                    productsData:data.data.protocolProductList,
                    queryProtocolType:data.data.type
                })
                $('.bingUl li').eq(0).removeClass("grey-li").addClass("blue-li");
                if(data.data.protocolProductList.length>0){
                    _this.setState({
                        queryProductName:data.data.protocolProductList[0].productName,
                        queryProtocolId:data.data.protocolProductList[0].protocolId
                    });
                    $.ajax({
                        type: "GET",
                        // url:'http://192.168.1.199:8887/customer-checklist?access_token='+ User.appendAccessToken().access_token,
                        url: serveUrl+'guest-check/customer-checklist?access_token='+ User.appendAccessToken().access_token,
                        data:{
                            queryProductName:data.data.protocolProductList[0].productName,
                            queryCustomerId:_this.state.queryCustomerId,
                            queryProtocolId:data.data.protocolProductList[0].protocolId,
                            queryProtocolType:_this.state.queryProtocolType,
                            queryFlightDateBegin:getCookie("queryFlightDateBegin"),
                            queryFlightDateEnd:getCookie("queryFlightDateEnd")
                        },
                        success: function(data){
                            if(data.status == 200){
                                if(data.data.rows.length>0){
                                    data.data.rows.map((v,index)=>{
                                        v.key= index
                                    })
                                    _this.setState({
                                        column:data.data.column,
                                        dataSource:data.data.rows
                                    })
                                }
                            }
                        }
                    });
                }
            }
        });
    }

    btnClick =(v,index)=>{
        $('.bingUl li').removeClass("blue-li").addClass("grey-li");
        $('button').removeClass("blue-btn").addClass("dash-btn")
        $('button').eq(v).removeClass("dash-btn").addClass("blue-btn");
        const _this = this;
        $.ajax({
            type: "GET",
            url: serveUrl+'guest-protocol/view?access_token='+ User.appendAccessToken().access_token,
            data:{protocolId:index.id},
            success: function(data){
                _this.setState({
                    productsData:data.data.protocolProductList,
                    queryProtocolType:index.type
                })
                $('.bingUl li').eq(0).removeClass("grey-li").addClass("blue-li");
                if(data.data.protocolProductList.length>0){
                    _this.setState({
                        queryProductName:data.data.protocolProductList[0].productName,
                        queryProtocolId:data.data.protocolProductList[0].protocolId
                    });
                    $.ajax({
                        type: "GET",
                        // url:'http://192.168.1.199:8887/customer-checklist?access_token='+ User.appendAccessToken().access_token,
                        url: serveUrl+'guest-check/customer-checklist?access_token='+ User.appendAccessToken().access_token,
                        data:{
                            queryProductName:data.data.protocolProductList[0].productName,
                            queryCustomerId:_this.state.queryCustomerId,
                            queryProtocolId:data.data.protocolProductList[0].protocolId,
                            queryProtocolType:_this.state.queryProtocolType,
                            queryFlightDateBegin:getCookie("queryFlightDateBegin"),
                            queryFlightDateEnd:getCookie("queryFlightDateEnd")
                        },
                        success: function(data){
                            if(data.status == 200){
                                if(data.data.rows.length>0){
                                    data.data.rows.map((v,index)=>{
                                        v.key= index
                                    })
                                    _this.setState({
                                        column:data.data.column,
                                        dataSource:data.data.rows
                                    })
                                }
                            }
                        }
                    });
                }
            }
        });
    }

    protocolClick =(v,index,sub)=>{
        $('.bingUl li').removeClass("blue-li").addClass("grey-li");
        $('.bingUl li').eq(index).removeClass("grey-li").addClass("blue-li");
        const _this = this;
        _this.setState({
            queryProductName:v.productName,
            queryProtocolId:v.protocolId
        });
        $.ajax({
            type: "GET",
            // url:'http://192.168.1.199:8887/customer-checklist?access_token='+ User.appendAccessToken().access_token,
            url: serveUrl+'guest-check/customer-checklist?access_token='+ User.appendAccessToken().access_token,
            data:{
                queryProductName:v.productName,
                queryCustomerId:_this.state.queryCustomerId,
                queryProtocolId:v.protocolId,
                queryProtocolType:_this.state.queryProtocolType,
                queryFlightDateBegin:getCookie("queryFlightDateBegin"),
                queryFlightDateEnd:getCookie("queryFlightDateEnd")
            },
            success: function(data){
                if(data.status == 200){
                    if(data.data.rows.length>0){
                        data.data.rows.map((v,index)=>{
                            v.key= index
                        })
                        _this.setState({
                            column:data.data.column,
                            dataSource:data.data.rows
                        })
                    }
                }
            }
        });
    }
    //导出账单
    exportBill=()=>{
        var form = $("<form>"); //定义一个form表单
        form.attr('style', 'display:none'); //在form表单中添加查询参数
        form.attr('target', '');
        form.attr('method', 'GET');
        form.attr('action', serveUrl + "guest-check/exportFile");
        var input1 = $('<input>');
        input1.attr('type', 'hidden');
        input1.attr('name', 'queryCustomerId');
        input1.attr('value', this.state.queryCustomerId);
        var input2 = $('<input>');
        input2.attr('type', 'hidden');
        input2.attr('name', 'queryProtocolType');
        input2.attr('value', this.state.queryProtocolType);
        var input3 = $('<input>');
        input3.attr('type', 'hidden');
        input3.attr('name', 'queryProtocolId');
        input3.attr('value', this.state.queryProtocolId);
        var input4 = $('<input>');
        input4.attr('type', 'hidden');
        input4.attr('name', 'queryProductName');
        input4.attr('value', this.state.queryProductName);
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

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };
        const Options1 = this.state.billClientList.map(data => <Option key={data.id} value={data.id.toString()}>{data.value}</Option>);
        const Options2 = this.state.protocolNameList.map(data => <Option key={data.id} value={data.id.toString()}>{data.value}</Option>);

        let productsP = null
        if(this.state.productsData !=[]){
            productsP = this.state.productsData.map((v,index)=>{
                return <li key={index} onClick={this.protocolClick.bind(this,v,index)} className="grey-li">{v.productName}</li>
            })
        }
       
         let column = []
        this.state.column.map((v,index)=>{
        let width = 80 / this.state.column.length
        width = width +'%'
        column.push({
            title: v.displayName,
            dataIndex: v.columnName,
            key: index,
            width:width,
            render: (text, record) => {
            if(v.displayName == "航班日期"){
                return <span className="order">{text==null ? '':moment(text).format('YYYY-MM-DD')}</span>
            }
            return <span className="order">{text}</span>
            },
        })
        })

        return (
            <div>
                <div className="box" style={{paddingTop:0,paddingBottom:0}}>
                    <div className="box-right" style={{paddingTop:14,paddingBottom:50}}>
                        <div className='detailWord'><span className='detail'></span><span className='spanWord'>账单明细</span></div>
                        <Row style={{marginTop:20,borderBottom:'1px solid #ccc',marginLeft:'5%'}}>
                            <Col span={8}>
                                <FormItem label="客户名称" {...formItemLayout}>
                                    {getFieldDecorator("clientName", {
                                        rules: [{ message: '请选择客户名称!' }],
                                    })(
                                        <Select style={{width:200}} onChange={this.clientChange}>
                                            {Options1}
                                        </Select>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="协议名称" {...formItemLayout}>
                                    {getFieldDecorator("protocolName", {
                                        rules: [{message: '请选择协议名称!' }],
                                    })(
                                        <Select style={{width:200}} onChange={this.protocolChange}>
                                            {Options2}
                                        </Select>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={4} offset={3}>
                                <span className="btn-small" style={{float:'right'}} onClick={this.exportBill}>导出</span>
                            </Col>
                        </Row>
                        <ul className='bingUl' style={{marginLeft:"5%",padding:20}}>
                            {productsP}
                        </ul>
                        <Table style={{ marginLeft:'5%',marginTop:20 }} pagination={this.state.status}  dataSource={this.state.dataSource} columns={column}  className=" serveTable"/>
                    </div>
                </div>
            </div>
        )
    }
}

ServiceList = Form.create()(ServiceList);

export default ServiceList;