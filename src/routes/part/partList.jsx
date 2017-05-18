import './part.less'
import React from 'react';
import { hashHistory } from 'react-router';
import {Breadcrumb,Form, Row, Col, Input, Button, Icon,Select,Popconfirm,message,Table,Checkbox,Modal} from 'antd';
import { Link} from 'react-router';
import $ from 'jquery';
import { serveUrl, User, cacheData} from '../../utils/config';
import DeleteDialog from '../DeleteDialog';//引入删除弹框

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const msg = '是否删除该角色?';

class ServiceList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            productTypeData:[],
            serveTypeData:[],
            partListDate: [],
            partListDateLength:null,
            partListDateCurrent:1,
            partListDatePageSize:10,
            selectedRowKeys: [],
            searchValue:'',
            menuListDate:[],
            menuIds:[],
            visibleDel:false,
            roleId:null
        }
    }

    componentWillMount() {
         if(User.isLogin()){
        } else{
            hashHistory.push('/login');
        }
        this.getInitList(this.state.partListDateCurrent,this.state.partListDatePageSize)
    }
    componentDidMount=()=>{
        $(".ant-breadcrumb-separator").html(">");
        $(".ant-breadcrumb-separator").css({color:'#333'});
    }

    componentDidUpdate=()=>{    
        $(".ant-table-tbody tr td").css({borderBottom:'none'});
        $("table").css({border:'1px solid #f0f0f0'});
    }
    

   handleSubmit =(e)=>{
        // const _this = this;
        // e.preventDefault();
        // this.props.form.validateFields((err, values) => {
        //     if (!err) {
        //         
        //         const formData = {
        //             data:[{
        //                 airportCode: "LJG",
        //                 "name": values.name,//菜单管理
        //                 "description": values.description, //菜单排序
        //                 menuIdList:_this.state.menuIds
        //             }]
        //         }
        //         $.ajax({
        //             type: "POST",
        //             contentType:'application/json;charset=utf-8',
        //             url: 'http://192.168.1.126:8080/saveOrUpdate',
        //             data: JSON.stringify(formData),
        //             success: function(data){
        //                 if(data.status == 200){
        //                     message.success(data.msg);
        //                 }
        //                 else if(data.status == 500){
        //                     message.error(data.msg);
        //                 }
        //             }
        //         });  
        //     }
        // });
    }
   
     getInitList(page,rows){
        const data = [];
        const _this = this;
         $.ajax({
             type: "GET",
             
             url: serveUrl+"guest-role/list?access_token="+ User.appendAccessToken().access_token,
             data:{
                 page:page,
                 rows:rows
                },
             success: function(data){
                 data.data.rows.map((v,index)=>{
                     v.key = v.roleId
                 })
                _this.setState({
                    partListDate: data.data.rows,
                    partListDateLength:data.data.total
                })
            }
         });  
    }

    //增加角色
    addRoleBtn=()=>{
        hashHistory.push('/addpart');
    }

    //删除弹框
    showModalDel = (record) => {
        
        this.setState({
            visibleDel: true,
            roleId:record.roleId
        });
    }
    //删除确认
    handleOkDel = () => {
        setTimeout(() => {
            this.setState({
                visibleDel: false
            });
            //删除协议
            const _this = this;
            $.ajax({
                type: "POST",
                contentType: 'application/json;charset=utf-8',
                url: serveUrl + "guest-role/deleteRoles?access_token="+User.appendAccessToken().access_token,
                data: JSON.stringify({
                    data: [parseInt(_this.state.roleId)]
                }),
                success: function (data) {
                    if(data.status == 200 ){
                        if(data.data != ''){
                            message.error(data.data);
                        }else{
                            message.success(data.msg);
                        }
                    }else{
                        message.error(data.msg);
                    }
                    _this.getInitList(_this.state.partListDateCurrent,_this.state.partListDatePageSize)
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

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };
        const _this = this;

        const pagination = {
            total: this.state.partListDateLength,
          
            onChange(current) {
                _this.getInitList(current,_this.state.partListDatePageSize);
            }
        };

        const columns = [{
            title: '角色名称',
            width: '12.5%',
            dataIndex: 'name',
            render(text,record) {
                return (
                        <div className="order">{text}</div>
                        )
            }
        }, {
            title: '角色描述',
            width: '12.5%',
            dataIndex: 'description',
            render(text,record) {
                return (
                        <div className="order">{text}</div>
                        )
            }
        },{
            title: '操作',
            width: '12.5%',
            render(text,record) {
                return (
                        <div className="order">
                            <a href={`#/rolePermission/${record.roleId}/${record.name}`} style={{marginRight:10,color:'#4778c7'}}>配置</a>
                            <a href={`#/updataPart/${record.roleId}`} style={{marginRight:10,color:'#4778c7'}}>修改</a>
                            <a onClick={_this.showModalDel.bind(_this,record)} style={{color:'#4778c7'}}>删除</a>
                        </div>
                        )
            }
        }]
        return (
            <div className="">
                <div className="breadcrumb-box">
                    <div className="top-bar"></div>
                    <div className="breadcrumb">
                        <Breadcrumb>
                            <Breadcrumb.Item>角色管理</Breadcrumb.Item>
                            <Breadcrumb.Item>角色列表</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>

                 <div className="box">
                    <ul className="tit">
                        <li>
                            <a href="javascript:;" className="active">角色列表</a>
                        </li>
                    </ul>
                        <button className="btn" style={{marginTop:10}} onClick={this.addRoleBtn}>新增角色</button>
                        <div className="search-result-list" >
                            <Table  pagination={pagination} style={{marginTop:20}} columns={columns} dataSource={this.state.partListDate} className=" serveTable"/>
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

ServiceList = Form.create()(ServiceList);

export default ServiceList;