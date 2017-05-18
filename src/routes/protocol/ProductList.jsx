import React from 'react';
import { hashHistory } from 'react-router';
import {Form, Row, Col, Input, Button, Icon,Select,message,Radio,Breadcrumb,Table,Popconfirm,Modal,Checkbox} from 'antd';
import { Link} from 'react-router';
import $ from 'jquery';
import { serveUrl, User, cacheData} from '../../utils/config';
import DeleteDialog from '../DeleteDialog';//引入删除弹框

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const RadioGroup = Radio.Group;
const msg = '确认删除该产品吗?';
const url = "http://192.168.1.130:8887/";

class ProductList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            productList:[],
            productListDateLength: null,
            productListDateCurrent: 1,
            productListDatePageSize: 10,
            visible:false,
            productId:null,
            productIds:[],
            productData:[]
        }
    }
    componentWillMount() {
         if(User.isLogin()){
        } else{
            hashHistory.push('/login');
        }
        this.getInitList(this.state.productListDateCurrent, this.state.productListDatePageSize);
    }
    componentDidMount = () => {
        $(".ant-modal-footer").hide();
        $(".ant-modal-content").css({ width: 700 });
        // $(".ant-modal-content").css({webkitTransform: 'translate(-50%,-50%)'});
    }
    //分页的显示与隐藏
    componentDidUpdate=()=>{
        // $(".ant-pagination-item-active").css({backgroundColor:'#4778c7',borderColor:'#4778c7'});
        $(".ant-pagination-options").hide();
        $(".ant-table-tbody tr td").css({borderBottom:'none'});
        $("table").css({border:'1px solid #f0f0f0'});
    }
    //初始获取产品列表
    getInitList=(page,rows)=>{
        const _this = this;
        $.ajax({
            type: "GET",
            url:serveUrl+'guest-service/product-and-service-list',
            data: {access_token: User.appendAccessToken().access_token,page:page,rows:rows},
            success: function (data) {
                if (data.status == 200) {
                    // 
                    const length = data.data.rows.length;
                     _this.props.productIds.map(w=>{
                         data.data.rows.map(v=>{
                             if(v.productId == w){
                                 v.state = true;
                             }
                             return ;
                         })
                     })

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

    //获取选中服务数组
    onChange = (record, e) => {
        //e为事件源对象,record为该条数据
        // 
        // 
        const productIds = this.props.productIds;
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
            record.state = true;
            this.props.productIds.push(record.productId);
            this.state.productData.push(record);
        } 
        else {
            record.state = false;
            let num = null;
            for(let i =0;i<this.state.productData.length;i++){
                if(this.state.productData[i].productId == record.productId){
                    num = i;
                    this.state.productData.splice(i, 1);
                    this.props.productIds.remove(record.productId);
                    // return;
                }
            }
        }
        this.setState({
            productData:this.state.productData
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
            },{
                title: '选择',
                render(text, record) {
                    return (
                        <div className="order">
                            <Checkbox onChange={_this.onChange.bind(_this,record)} checked={record.state}></Checkbox>
                        </div>
                    )
                }
            }
        ];

        return (
                <div>
                    <Table columns={columns} dataSource={this.state.productList} pagination={pagination} className="serveTable" />
                    <p style={{marginTop: 20}}>共搜索到{this.state.productListDateLength}条数据</p>
                    <FormItem wrapperCol={{ span: 6, offset: 9 }} style={{ marginTop: 50 }}>
                        <button className="mt14 btn-small" onClick={data=>{
                            this.props.confirmSelect(this.state.productData,this.props.productIds);
                        }}>确认选择</button>
                    </FormItem>
                </div>
        )
    }
}

ProductList = Form.create()(ProductList);
export default ProductList;

