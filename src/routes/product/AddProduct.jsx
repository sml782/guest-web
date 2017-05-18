import './product.less';
import React from 'react';
import { hashHistory } from 'react-router';
import {Form, Row, Col, Input, Button, Icon,Select,message,Radio,Breadcrumb,Table,Popconfirm,Checkbox } from 'antd';
import { Link} from 'react-router';
import $ from 'jquery';
import { serveUrl, User, cacheData} from '../../utils/config';

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const RadioGroup = Radio.Group;
const msg = '是否删除?';
const url = "http://192.168.1.129:8887/";

class AddProduct extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categoryList:[],
            categoryListLength:null,
            categoryListPage:1,
            categoryListRows:10,
            serviceTypeIds:[]
        }
    }

     componentWillMount() {
          if(User.isLogin()){
        } else{
            hashHistory.push('/login');
        }
        this.getInitList(this.state.categoryListPage,this.state.categoryListRows);
    }

    getInitList = (page, rows) => {
         //获取服务分类列表
         const _this = this;
         $.ajax({
             type: "GET",
            //   url: "http://192.168.1.130:8887/service-type-allocation-list",
             url: serveUrl + 'guest-service/service-type-allocation-list',
             data: { access_token: User.appendAccessToken().access_token, page: page, rows: rows },
             success: function (data) {
                 if (data.status == 200) {
                     data.data.rows.map(data => {
                         data.key = data.typeId;
                     });
                     _this.setState({
                         categoryList: data.data.rows,
                         categoryListLength: data.data.total
                     });
                 }
             }
         });
     }

     componentDidMount=()=>{
         $(".ant-breadcrumb-separator").html(">");
     }

     componentDidUpdate=()=>{
        // $(".ant-pagination-item-active").css({backgroundColor:'#4778c7',borderColor:'#4778c7'});
        $(".ant-table-tbody tr td").css({borderBottom:'none'});
        $("table").css({border:'1px solid #f0f0f0'});
        $(".ant-pagination-options").hide();
    }

     //获取选中服务数组
    onChange = (record, e) => {
        //e为事件源对象,record为该条数据
        
        
        const serviceTypeIds = this.state.serviceTypeIds;
        Array.prototype.indexOf = function (val) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] == val) return i;
            }
            return -1;
        };
        Array.prototype.remove = function (val) {
            var index = this.indexOf(val);
            if (index > -1) {
                this.splice(index, 1);
            }
        };
        if (e.target.checked) {
            serviceTypeIds.push(record.typeId);
        } 
        else {
            serviceTypeIds.remove(record.typeId);
        }
        this.setState({serviceTypeIds});
    }

    //提交表单
    handleSubmit=(e)=>{
        const _this=this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (_this.state.serviceTypeIds.length > 0) {
                const formatData = {
                    data: [
                        {
                            productName: values.productName,
                            serviceTypeIds: _this.state.serviceTypeIds
                        }
                    ]
                }
                $.ajax({
                    type: "POST",
                    url: serveUrl + "guest-product/addProduct?access_token="+User.appendAccessToken().access_token,
                    // url: "http://192.168.1.126:8887/addProduct?access_token="+User.appendAccessToken().access_token,
                    contentType: 'application/json;charset=utf-8',
                    data: JSON.stringify(formatData),
                    success: function (data) {
                        if (data.status == 200) {
                            hashHistory.push('productList');
                        }
                        if (data.status == 5001) {
                            message.error(data.msg);
                        }
                    }
                });
            }
            else{
                message.error('服务不能为空，请选择服务！');
            }   
        })
    }

    //点击取消
    handleReset=()=>{
        this.props.form.resetFields();
        hashHistory.push('productList');
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };
        const _this = this;
        const pagination = {
            total: this.state.categoryListLength,
            showSizeChanger: true,
            onShowSizeChange(current, pageSize) {
                _this.state.categoryListPage = current;
                _this.state.categoryListRows = pageSize;
                _this.getInitList(_this.state.categoryListPage,_this.state.categoryListRows);
            },
            onChange(current) {
                _this.state.categoryListPage = current;
                _this.getInitList(_this.state.categoryListPage,_this.state.categoryListRows);
            }
        };
        //远机位摆渡车列表表头
        const columns = [
            {
                title: '大类',
                width: '33%',
                dataIndex: 'category',
                render(text, record) {
                    return (
                        <div className="order">
                            {text}
                        </div>
                    )
                }
            }, {
                title: '类别',
                width: '33%',
                dataIndex: 'type',
                render(text, record) {
                    return (
                        <div className="order">{text}</div>
                    )
                }
            }, {
                title: '操作',
                render(text, record) {
                    return (
                        <div className="order">
                            <Checkbox onChange={_this.onChange.bind(_this,record)}>选择</Checkbox>
                        </div>
                    )
                }
            }
        ];

        return (
            <div>
                <div className="breadcrumb-box">
                    <div className="top-bar"></div>
                    <div className="breadcrumb">
                        <Breadcrumb>
                            <Breadcrumb.Item>服务产品</Breadcrumb.Item>
                            <Breadcrumb.Item>产品管理</Breadcrumb.Item>
                            <Breadcrumb.Item>添加产品</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>

                 <div className="box">
                    <ul className="tit">
                        <li>
                            <a href="javascript:;" className="active">添加产品</a>
                        </li>
                    </ul>

                    <div className="mid-box">     
                        <div className="product-sort" >
                            <Form
                                horizontal
                                className="ant-advanced-search-form"
                                onSubmit={this.handleSubmit}
                                style={{marginTop:54}}
                                >
                                <Row >
                                    <Col span={12}>
                                        <FormItem label="产品名称" {...formItemLayout} hasFeedback>
                                            {getFieldDecorator('productName', {
                                                rules: [{ required: true, message: '请输入产品名称!' }],
                                                // initialValue: 'P001'
                                            })(
                                                <Input style={{ width: 300 }}  />
                                                )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <p className="product-ser" style={{marginTop:12,marginBottom:20}}>该选择该产品所包含服务</p>
                                <div >
                                    <Table columns={columns} dataSource={this.state.categoryList} pagination={pagination} className="serveTable" />
                                    <p style={{marginTop: 20}}>共搜索到{this.state.categoryListLength}条数据</p>
                                </div>
                                <Row >
                                    <Col span={24} style={{ textAlign: 'center',marginTop:50}} className="mb44">
                                        <button className="btn-small">保&nbsp;&nbsp;存</button>
                                        <button className="btn-small ml30" onClick={this.handleReset}>取&nbsp;&nbsp;消</button>
                                    </Col>
                                </Row>
                            </Form>
                            
                        </div>
                    </div>
                 </div>
            </div>
        )
    }
}

AddProduct = Form.create()(AddProduct);

export default AddProduct;

