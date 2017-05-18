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
const msg = '确认删除该调度事件吗?';
const url = "http://192.168.1.130:8887/";

class ServEventManage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            servEventList:[],
            servEventListPage:1,
            servEventListRows:10,
            servEventListLength:null,
            visibleDel:false,
            scheduleEventId:null
        }
    }
    componentWillMount() {
         if(User.isLogin()){
        } else{
            hashHistory.push('/login');
        }
        this.getInitList(this.state.servEventListPage, this.state.servEventListRows);
    }
    componentDidMount = () => {
        $(".ant-breadcrumb-separator").html(">");
        $(".ant-modal-footer").hide();
        $(".ant-modal-content").css({ width: 700 });
    }
    //分页的显示与隐藏
    componentDidUpdate=()=>{
        if (this.state.productListDateLength <= 10) {
            $(".ant-pagination").hide();
        }
        else {
            $(".ant-pagination").show();
        }
        $(".ant-pagination-item-active").css({backgroundColor:'#4778c7',borderColor:'#4778c7'});
        $(".ant-table-tbody tr td").css({borderBottom:'none'});
        $("table").css({border:'1px solid #f0f0f0'});
        $(".ant-pagination-options").hide();
    }
    //初始获取服务管理列表
    getInitList=(page,rows)=>{
        const _this = this;
        $.ajax({
            type: "GET",
            url:serveUrl+'flight-info/schedule-event-list',
            data: {access_token: User.appendAccessToken().access_token,page:page,rows:rows},
            success: function (data) {
                if (data.status == 200) {
                    data.data.rows.map((data)=>{
                        data.key = data.scheduleEventId;
                        if(data.isApproach== 1){
                            data.isApproach='进港';
                        }
                        else if(data.isApproach== 0){
                            data.isApproach='出港';
                        }
                    })
                    _this.setState({
                        servEventList:data.data.rows,
                        servEventListLength:data.data.total
                    });
                }
            }
        });
    }

    //删除弹框
    showModalDel = (record) => {
        
        this.setState({
            visibleDel: true,
            scheduleEventId:record.scheduleEventId
        });
    }
    //删除确认
    handleOkDel = () => {
        setTimeout(() => {
            this.setState({
                visibleDel: false
            });
            //删除调度事件
            const _this = this;
            $.ajax({
                type: "POST",
                contentType: 'application/json;charset=utf-8',
                // url:"http://192.168.1.130:8080/schedule-event-delete?access_token="+User.appendAccessToken().access_token,
                url: serveUrl + "flight-info/schedule-event-delete?access_token="+User.appendAccessToken().access_token,
                data: JSON.stringify({
                    data: [parseInt(_this.state.scheduleEventId)]
                }),
                success: function (data) {
                    if (data.status == 200) {
                        _this.getInitList(_this.state.servEventListPage, _this.state.servEventListRows);
                    }
                    else if(data.status==5004){
                        message.error(data.msg);
                    }
                }
            });
        }, 1000);
    }
    //删除取消
    handleCancelDel = () => {
        this.setState({
            visibleDel: false
        });
    }
    //添加调度事件
    addClick=()=>{
        hashHistory.push('/addServEvent');
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };
        const _this = this;
        const pagination = {
            total: this.state.servEventListLength,
            showSizeChanger: true,
            onShowSizeChange(current, pageSize) {
                _this.state.servEventListPage = current;
                _this.state.servEventListRows = pageSize;
                _this.getInitList(_this.state.servEventListPage, _this.state.servEventListRows);
            },
            onChange(current) {
                _this.state.servEventListPage = current;
                _this.getInitList(_this.state.servEventListPage, _this.state.servEventListRows);
            }
        };
        const columns = [
            {
                title: '序号',
                width: '20%',
                dataIndex: 'no',
                render(text, record) {
                    return (
                        <div className="order">
                            {text}
                        </div>
                    )
                }
            }, {
                title: '类别',
                width: '20%',
                dataIndex: 'type',
                render(text, record) {
                    return (
                        <div className="order">{text}</div>
                    )
                }
            },{
                title: '进港/出港',
                width: '20%',
                dataIndex: 'isApproach',
                render(text, record) {
                    return (
                        <div className="order">{text}</div>
                    )
                }
            },{
                title: '事件描述',
                width: '20%',
                dataIndex: 'name',
                render(text, record) {
                    return (
                        <div className="order">{text}</div>
                    )
                }
            },{
                title: '操作',
                render(text, record) {
                    return (
                        <div className="order">
                            <a href={`#/UpdateServEvent/${record.scheduleEventId}`} style={{ marginRight: 10,color:'#4778c7'}}>修改</a>
                            <a href='javascript:;' style={{color:'#4778c7'}} onClick={_this.showModalDel.bind(_this,record)}>删除</a>
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
                            <Breadcrumb.Item>订单管理</Breadcrumb.Item>
                            <Breadcrumb.Item>服务事件管理</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>

                <div className="box">
                    <ul className="tit">
                        <li>
                            <a href="javascript:;" className="active">服务事件</a>
                        </li>
                    </ul>

                    <div className="mid-box" style={{marginTop:30}}>
                        <button className='btn' onClick={this.addClick} style={{ marginRight: 5 }}>添加调度事件</button>
                    </div>

                    <div className="search-result-list " style={{ marginTop: 16 }}>
                        <Table columns={columns} dataSource={this.state.servEventList} pagination={pagination} className="serveTable" />
                        <p style={{marginTop: 20}}>共搜索到{this.state.servEventListLength}条数据</p>
                    </div>
                </div>
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
        )
    }
}

ServEventManage = Form.create()(ServEventManage);
export default ServEventManage;

