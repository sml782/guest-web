import './product.less';
import React from 'react';
import { hashHistory } from 'react-router';
import {Form, Row, Col, Input, Button, Icon,Select,message,Radio,Breadcrumb,Table,Popconfirm,Modal} from 'antd';
import { Link} from 'react-router';
import $ from 'jquery';
import { serveUrl, User, cacheData} from '../../utils/config';
import DeleteDialog from '../DeleteDialog';//引入删除弹框

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const RadioGroup = Radio.Group;
const msg = '确认删除该产品吗?';
const url = "http://192.168.1.129:8887/";

class ProductList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            productList:[],
            productListDateLength: null,
            productListDateCurrent: 1,
            productListDatePageSize: 10,
            visible:false,
            productId:null
        }
    }

     componentWillMount() {
          if(User.isLogin()){
        } else{
            hashHistory.push('/login');
        }
        this.getInitList(this.state.productListDateCurrent,this.state.productListDatePageSize);
    }
    componentDidMount=()=>{
        $(".ant-breadcrumb-separator").html(">");
        $(".box").css({minHeight:700});
    }

    //分页的显示与隐藏
    componentDidUpdate=()=>{
        // if (this.state.productListDateLength <= 10) {
        //     $(".ant-pagination").hide();
        // }
        // else {
        //     $(".ant-pagination").show();
        // }
        // $(".ant-pagination-item-active").css({backgroundColor:'#4778c7',borderColor:'#4778c7'});
        $(".ant-table-tbody tr td").css({borderBottom:'none'});
        $("table").css({border:'1px solid #f0f0f0'});
        $(".ant-pagination-options").hide();
    }

    getInitList=(page,rows)=>{
        const _this = this;
        $.ajax({
            type: "GET",
            // url: url + "list",
            url: serveUrl + "guest-product/list",
            data: {access_token:User.appendAccessToken().access_token,page:page,rows:rows},
            success: function (data) {
                if (data.status == 200) {
                    data.data.rows.map((data)=>{
                        data.key = data.productId
                    })
                    _this.setState({
                        productList:data.data.rows,
                        productListDateLength:data.data.total
                    });
                }
            }
        });
    }

    showModal = (record) => {
        
        this.setState({
            visible: true,
            productId:record.productId
        });
    }
    handleOk = () => {
        setTimeout(() => {
            this.setState({
                visible: false,
            });
            //删除产品
            const _this = this;
            $.ajax({
                type: "POST",
                contentType: 'application/json;charset=utf-8',
                url: serveUrl + "guest-product/deleteProduct?access_token="+User.appendAccessToken().access_token,
                // url: url + "deleteProduct?access_token="+User.appendAccessToken().access_token,
                data: JSON.stringify({
                    data: [parseInt(_this.state.productId)]
                }),
                success: function (data) {
                    if (data.status == 200) {
                        _this.getInitList(_this.state.productListDateCurrent, _this.state.productListDatePageSize);
                    }
                }
            });
        }, 1000);
    }
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }
    
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };
        const _this = this;
        const pagination = {
            total: this.state.productListDateLength,
            showSizeChanger: true,
            onShowSizeChange(current, pageSize) {
                _this.state.productListDateCurrent = current;
                _this.state.productListDatePageSize = pageSize;
                _this.getInitList(_this.state.productListDateCurrent,_this.state.productListDatePageSize);
            },
            onChange(current) {
                _this.state.productListDateCurrent = current;
                _this.getInitList(_this.state.productListDateCurrent,_this.state.productListDatePageSize);
            }
        };
        const columns = [
            {
                title: '产品编号',
                width: '33%',
                dataIndex: 'productNo',
                render(text, record) {
                    return (
                        <div className="order">
                            {text}
                        </div>
                    )
                }
            }, {
                title: '产品名称',
                width: '33%',
                dataIndex: 'productName',
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
                            <a href={`#/SetProduct/${record.productId}`} style={{ marginRight: 10,color:'#4778c7'}}>配置</a>
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
                        </Breadcrumb>
                    </div>
                </div>

                 <div className="box">
                    <ul className="tit">
                        <li>
                            <a href="javascript:;" className="active">产品管理</a>
                        </li>
                    </ul>

                    <div className="mid-box">     
                        <div className="product-sort" >
                            <p className="msg mb44">通过将基础服务组合成新的产品，销售给客户使用。</p>
                            
                            <div >
                                <Table columns={columns} dataSource={this.state.productList} pagination={pagination} className="serveTable" />
                                <p style={{marginTop: 20}}>共搜索到{this.state.productListDateLength}条数据</p>
                            </div>
                        </div>
                    </div>
                 </div>
                 <div id="delete-modal">
                     <Modal title="警告"
                         key={Math.random() * Math.random()}
                         visible={this.state.visible}
                         onOk={this.handleOk}
                         confirmLoading={this.state.confirmLoading}
                         onCancel={this.handleCancel}
                         >
                         <div>
                             <DeleteDialog msg={msg} />
                         </div>
                     </Modal>
                 </div>
            </div>
        )
    }
}

ProductList = Form.create()(ProductList);

export default ProductList;

