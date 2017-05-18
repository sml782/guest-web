import './menu.less'
import React from 'react';
import { hashHistory } from 'react-router';
import {Breadcrumb,Form, Row, Col, Input, Button, Icon,Select,Popconfirm,message,Table,Checkbox,Menu,Modal } from 'antd';
import { Link} from 'react-router';
import $ from 'jquery';
import { serveUrl, User, cacheData} from '../../utils/config';
import UpdateVIPShuttleBus from './updataMenu';
import DeleteDialog from '../DeleteDialog';//引入删除弹框

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const CheckboxGroup = Checkbox.Group;
const SubMenu = Menu.SubMenu;
const msg = '确认删除该菜单吗?';
const plainOptions = ['Apple', 'Pear', 'Orange'];
const defaultCheckedList = ['Apple', 'Orange'];
const plainOptions1 = ['Apple', 'Pear', 'Orange'];

class ServiceList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedList: defaultCheckedList,
            checkedList1: defaultCheckedList,
            indeterminate: true,
            checkAll: false,
            indeterminate1: true,
            checkAll1: false,
            productTypeData:[],
            serveTypeData:[],
            serveListDate: [],
            serveListDateLength:null,
            serveListDateCurrent:1,
            serveListDatePageSize:10,
            selectedRowKeys: [],
            searchValue:'',
            siderBar1:[],
            current: '1',
            openKeys: [''],
            pId:0,
            menuListDate:[],
            menuListDateLen:null,
            visible: false,
            reviseId:null,
            visibleDel:false,
            menuId:null
        }
    }

    
    handleClick = (e) => {
        this.setState({
            current: e.key,
            pId:e.key,
        })
    }
    onOpenChange = (openKeys) => {
        const state = this.state;
        const latestOpenKey = openKeys.find(key => !(state.openKeys.indexOf(key) > -1));
        const latestCloseKey = state.openKeys.find(key => !(openKeys.indexOf(key) > -1));
        this.setState({
            pId:latestOpenKey,
        })
        let nextOpenKeys = [];
        if (latestOpenKey) {
            nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
        }
        if (latestCloseKey) {
            nextOpenKeys = this.getAncestorKeys(latestCloseKey);
        }
        this.setState({ openKeys: nextOpenKeys });
    }
    getAncestorKeys = (key) => {
        const map = {};
        return map[key] || [];
    }
     componentWillMount() {
          if(User.isLogin()){
              
        } else{
            hashHistory.push('/login');
        }
        this.getInit()
    }
    componentDidMount=()=>{
        $(".ant-breadcrumb-separator").html(">");
        $(".ant-breadcrumb-separator").css({color:'#333'});
        $('.ant-modal-footer').css({display: 'none'})
    }

    componentDidUpdate=()=>{    
        $(".ant-table-tbody tr td").css({borderBottom:'none'});
        $("table").css({border:'1px solid #f0f0f0'});
    }
    getInit =()=>{
        this.setState({
            menuListDate: []
        })
        const _this = this
        $.ajax({
            type: "GET",
            url: serveUrl+'guest-role/menuTree?access_token='+ User.appendAccessToken().access_token,
            success: function(data){
                _this.setState({
                      menuListDate:data.data
                })
            }
        })
    }
    revise = (_this,text) =>{
        this.setState({
            visible: true,
            reviseId:_this.menuId
        });
    }

    handleOk = () => {
        this.setState({
        visible: false
        });
    }
    handleCancel = (e) => {
        this.setState({
        visible: false
        });
    }
    confirmClose=()=>{
        this.setState({
        visible: false
        });
    }

    addMenuBtn=()=>{
        hashHistory.push('/addMenu');
    }

    //删除弹框
    showModalDel = (record,e) => {
        this.setState({
            visibleDel: true,
            menuId:record.menuId
        });
    }
    //删除确认
    handleOkDel = () => {
        setTimeout(() => {
            this.setState({
                visibleDel: false
            });
            //删除菜单
            const _this = this;
            $.ajax({
                type: "POST",
                contentType: 'application/json;charset=utf-8',
                url: serveUrl + "guest-role/deleteMenus?access_token="+User.appendAccessToken().access_token,
                data: JSON.stringify({
                    data: [parseInt(_this.state.menuId)]
                }),
                success: function (data) {
                    if(data.status == 200 ){
                        if(data.data != null){
                            message.error(data.data);
                        }else{
                            message.success(data.msg);
                        }
                    }else{
                        message.error(data.msg);
                    }
                    _this.getInit()
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
        const siderBarOP = this.state.siderBar1.map((v, index) => {
            const key=v.menuId;
            let childrens = null;
            if(v.children){
                 childrens = v.children.map((v,index) => <Menu.Item className='floatNone'  key={v.menuId}>{v.name}</Menu.Item>)
            }
            return(
                <SubMenu key={key} className='floatNone' title={<span >{v.name}</span>}>
                    {childrens}
                </SubMenu>
            )
        })
        const _this = this
        const columns = [{
            title: '菜单大类',
            width: '30%',
            dataIndex: 'name',
            menuId:'name',
            // render(text,record) {
            //     return (
            //             <div>
            //                  <div className="order menuclassfiy">{text}</div>
            //             </div>
            //             )
            // }
        },{
            title: '位置',
            width: '30%',
            dataIndex: 'position',
            // render(text,record) {
            //     return (
            //             <div className="order">{text}</div>
            //             )
            // }
        },{
            title: '操作',
            width: '40%',
            render(text,record) {
                return (
                        <div className="order">
                            <a onClick={_this.revise.bind(_this,text)} style={{marginRight:10,color:'#4778c7'}}>修改</a>
                            <a onClick={_this.showModalDel.bind(_this,record)} style={{color:'#4778c7'}}>删除</a>
                        </div>
                        )
            }
        }]
         const rowSelection = {
            // onChange: (selectedRowKeys, selectedRows) => {
            //     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            // },
            onSelect: (record, selected, selectedRows) => {
       //         console.log(record, selected, selectedRows);
                selected='false'
            },
            // onSelectAll: (selected, selectedRows, changeRows) => {
            //     console.log(selected, selectedRows, changeRows);
            //     selected = true;
            // },
        };
        return (
            <div>
                <Modal title="修改菜单"
                     key={Math.random()*Math.random()}
                     visible={this.state.visible}
                     onOk={this.handleOk}
                     onCancel={this.handleCancel}
                     >
                     <div>
                         <UpdateVIPShuttleBus name={this.state.reviseId} confirmClose={this.confirmClose}/>
                     </div>
                 </Modal>
                <div className="breadcrumb-box">
                    <div className="top-bar"></div>
                    <div className="breadcrumb">
                        <Breadcrumb>
                            <Breadcrumb.Item>菜单管理</Breadcrumb.Item>
                            <Breadcrumb.Item>新增菜单</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>

                 <div className="box">
                    <ul className="tit">
                        <li>
                            <a href="javascript:;" className="active">新增菜单</a>
                        </li>
                    </ul>
                    <button className="btn" style={{marginTop:20}} onClick={this.addMenuBtn}>新增菜单</button>
                    <div className="search-result-list" >
                        <Table style={{marginTop:20}} columns={columns} rowKey="menuId" dataSource={_this.state.menuListDate} className="serveTable"/>
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