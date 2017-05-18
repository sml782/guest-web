import './protocol.less';
import React from 'react';
import { hashHistory } from 'react-router';
import {Form, Row, Col, Input, Button, Icon,Select,message,Radio,Table,Checkbox } from 'antd';
import { Link} from 'react-router';
import $ from 'jquery';
import { serveUrl, User, cacheData,protocolMsg,newAddFlag} from '../../utils/config';

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const msg = '是否删除?';
const url = 'http://192.168.1.130:8887/';

class VIPLoungeProduct extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 1,
            listData:[],
            listDataLength:null,
            listDataPage:1,
            listDataRow:10,
            price:null,
            oldPrice:null,
            isPricing:'true',
            flag:false
        }
    }

     componentWillMount() {
          if(User.isLogin()){
        } else{
            hashHistory.push('/login');
        }  
        
    }


    getInitialValue=(page,rows)=>{
        const _this = this;
         //获取协议产品服务子列表(有协议产品id)
        $.ajax({
            type: "GET",
            // url: "http://192.168.1.130:8080/get-service-list-by-type-and-protocol-product-id",
            url: serveUrl + "guest-protocol/get-service-list-by-type-and-protocol-product-id",
            data: { access_token: User.appendAccessToken().access_token, page: page, rows: rows, typeId: 1, protocolProductId: _this.props.protocolProductId },
            success: function (data) {
                if (data.status == 200) {
                    
                    _this.setState({
                        flag: true
                    });
                    if (data.data.rows.length > 0) {
                        data.data.rows.map(k => {
                            k.key = k.protocolProductServiceId;
                            if (k.isPrioritized) {
                                k.state = true;
                            }
                            else {
                                k.state = false;
                            }

                            if (k.isAvailabled) {
                                k.state1 = true;
                            }
                            else {
                                k.state1 = false;
                            }
                        });
                        if(data.data.rows[0].price){
                            _this.setState({
                                oldPrice:data.data.rows[0].price,
                                price: data.data.rows[0].price
                            });
                        }
                        else{
                            _this.setState({
                                price:0,
                                oldPrice:0
                            });
                        }
                        _this.setState({
                            listData: data.data.rows,
                            isPricing: data.data.rows[0].isPricing,
                            listDataLength: data.data.total
                        });
                    }
                }
            }
        });
    }

    componentDidMount=()=>{
        $(".ant-modal-footer").hide();
        this.getInitialValue(this.state.listDataPage,this.state.listDataRow); 
    }

    componentDidUpdate=()=>{
        // $(".ant-pagination-item-active").css({backgroundColor:'#4778c7',borderColor:'#4778c7'});
        $(".ant-table-tbody tr td").css({borderBottom:'none'});
        $("table").css({border:'1px solid #f0f0f0'});
        $(".ant-pagination-options").hide();
    }

    //是否需要计价
    onChange = (e) => {
        
        this.setState({
            isPricing:e.target.value
        });
    }
    //优先使用改变
    priorityChange=(record,index,e)=>{
        // 
        if(e.target.checked){
             record.state = true;
             record.isPrioritized = true;
         }
         else{
             record.state = false;
             record.isPrioritized = false;
         }
         this.setState({ 
             listData:this.state.listData
         });
    }
    //是否可用改变
    availableChange=(record,index,e)=>{
        if(e.target.checked){
             record.state1 = true;
             record.isAvailabled = true;
         }
         else{
             record.state1 = false;
             record.isAvailabled = false;
         }
         this.setState({ 
             listData:this.state.listData
         });
    }
    //调价格
    changePrice=(e)=>{
        this.setState({
            price:e.target.value
        })  
    }

    //保存列表
    saveBtn=()=>{
        const _this = this;
        const listData = [];
        _this.state.listData.map(data=>{
            if(data.isPrioritized){
                data.isPrioritized = 1;
            }
            else{
                data.isPrioritized = 0;
            }
            if(data.isAvailabled){
                data.isAvailabled = 1;
            }
            else{
                data.isAvailabled = 0;
            }
            if(data.isPricing){
                data.isPricing = 1;
            }
            else{
                data.isPricing = 0;
            }
            if(parseInt(_this.state.price)){
                _this.state.price =parseInt(_this.state.price);
            }
            else{
                _this.state.price = parseInt(_this.state.oldPrice);
            }
            listData.push({
                protocolProductServiceId:data.protocolProductServiceId,
                protocolProductId:parseInt(_this.props.protocolProductId),
                isPricing:data.isPricing,
                isPrioritized:data.isPrioritized,
                isAvailabled:data.isAvailabled,
                price:_this.state.price,
                serviceTypeAllocationId:1
            });
        })
        $.ajax({
            type: "POST",
            contentType: 'application/json;charset=utf-8',
            // url:"http://192.168.1.130:8080/protocol-product-service-save-or-update?access_token="+User.appendAccessToken().access_token,
            url: serveUrl + "guest-protocol/protocol-product-service-save-or-update?access_token="+User.appendAccessToken().access_token,
            data: JSON.stringify({
                data: listData
            }),
            success: function (data) {
                if (data.status == 200) {
                    message.success(data.msg);
                }
                else if(data.status == 5003){
                    message.error(data.msg);
                }
            }
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
            total: this.state.listDataLength,
            showSizeChanger: true,
            // onShowSizeChange(current, pageSize) {
            //     _this.state.listDataPage = current;
            //     _this.state.listDataRow = pageSize;
            //     _this.getInitialValue(_this.state.listDataPage,_this.state.listDataRow);
            // },
            // onChange(current) {
            //     _this.state.listDataPage = current;
            //     _this.getInitialValue(_this.state.listDataPage,_this.state.listDataRow);
            // }
        };
        const columns = [
            {
                title: '服务编号',
                width: '25%',
                dataIndex: 'no',
                render(text, record) {
                    return (
                        <div className="order">
                            {text}
                        </div>
                    )
                }
            }, {
                title: '贵宾厅名称',
                width: '25%',
                dataIndex: 'name',
                render(text, record) {
                    return (
                        <div className="order">{text}</div>
                    )
                }
            }, {
                title: '优先使用',
                width: '25%',
                dataIndex: 'isPrioritized',
                render(text, record,index) {
                    return (
                        <div className="order">
                            <Checkbox onChange={_this.priorityChange.bind(_this,record,index)} checked={record.state}></Checkbox>
                        </div>
                    )
                }
            },{
                title: '是否可用',
                dataIndex: 'isAvailabled',
                render(text, record,index) {
                    return (
                        <div className="order">
                            <Checkbox onChange={_this.availableChange.bind(_this,record,index)} checked={record.state1}></Checkbox>
                        </div>
                    )
                }
            }
        ];

        return (
            <div>
                <div className="sub-tit">
                    <p className="f16 fl">贵宾厅配置</p>
                    <button className="btn-small fr" onClick={this.saveBtn}>保&nbsp;&nbsp;存</button>
                </div>
                <div className="mt14">
                    <span>是否需要计价</span>
                    <RadioGroup onChange={this.onChange} defaultValue={this.state.isPricing} style={{ marginLeft: 22 }}>
                        <RadioButton value="true">是</RadioButton>
                        <RadioButton value="false">否</RadioButton>
                    </RadioGroup>
                </div>
                <div className="mt14">
                    <span>计价规则</span>
                    <span style={{ marginLeft: 48 }}>单价<input placeholder={this.state.oldPrice} className="serverInput" onBlur={this.changePrice}/>元/人次</span>
                </div>
                <p style={{ marginTop: 28 }}>共<span>{this.state.listDataLength}</span>个贵宾厅</p>
                <div className="search-result-list">
                    <Table key='t1' columns={columns} dataSource={this.state.listData} pagination={pagination} className="serveTable" />
                    <p style={{marginTop: 20}}>共搜索到{this.state.listDataLength}条数据</p>
                </div>
            </div>
        )
    }
}

VIPLoungeProduct = Form.create()(VIPLoungeProduct);

export default VIPLoungeProduct;

