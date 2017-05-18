import './part.less'
import React from 'react';
import { hashHistory } from 'react-router';
import {Breadcrumb,Form, Row, Col, Input, Button, Icon,Select,Popconfirm,message,Table,Checkbox,Tree,Modal,AutoComplete,Pagination} from 'antd';

import { Link} from 'react-router';
import $ from 'jquery';
import { serveUrl, User, cacheData} from '../../utils/config';

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const msg = '是否删除?';
const TreeNode = Tree.TreeNode;

class Choosepart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            productTypeData:[],
            serveTypeData:[],
            serveListDate: [],
            serveListDateLength:null,
            serveListDateCurrent:1,
            serveListDatePageSize:10,
            selectedRowKeys: [],
            searchValue:'',
            menuListDate:[],
            menuIds:[],
            visible:false,
            expandedKeys: ["-1"],
            autoExpandParent: true,
            checkedKeys: [],
            selectedKeys: [],
            partJurisdictionDate:[],
            modulequeryDate:[],
            moduleListData:[],
            permissionId:[],
            roleId:[],
            moduleListDateLenght:null,
            moduleListDateCurrent:1,
            moduleListDatePageSize:100,
        }
    }
   
     componentWillMount() {
         if(User.isLogin()){
        } else{
            hashHistory.push('/login');
        }
        this.getInit();
        this.getInitList(this.state.moduleListDateCurrent,this.state.moduleListDatePageSize)
    }
    componentDidMount=()=>{
        $(".ant-breadcrumb-separator").html(">");
        $(".ant-breadcrumb-separator").css({color:'#333'});
      //  this.handleSubmit();
    }
    componentDidUpdate=()=>{
        $(".ant-table-tbody tr td").css({borderBottom:'none'});
        $("table").css({border:'1px solid #f0f0f0'});
        // $(".ant-pagination-options").hide();
    }
    //弹出框
    showModal = () => {
        this.setState({
           visible: true,
        });
    }
    handleOk = () => {
        this.setState({
           visible: false,
        });
    }
    handleCancel = () => {
        this.setState({
           visible: false,
        });
    }

     getInit =()=>{
        this.setState({
                        menuListDate:[]
                    })
        const _this = this
        $.ajax({
            type: "GET",
            url: serveUrl+"guest-role/list?access_token="+ User.appendAccessToken().access_token,
            success: function(data){
                let allCheckobj = {menuId:-1,name:"菜单",children:data.data.rows}
                let arr = [allCheckobj]
                _this.setState({
                    menuListDate:arr
                })
            }
        })
    }
    //模块查询功能
      getInitList(page,rows){
       // e.preventDefault();
        var _this = this;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                $.ajax({
                    type: "GET",
                   // url: "http://192.168.0.161:8080/permission-list?access_token="+ User.appendAccessToken().access_token,
                    url: serveUrl+"guest-permission/permission-list?access_token="+ User.appendAccessToken().access_token,
                    data:{
                        name:values.protocolName,
                        menuName:values.institutionClientName,
                        page:page,
                        rows:rows
                    },
                    success: function(data){
                        data.data.rows.map((v,index)=>{
                            v.key = v.permissionId
                        })
                        _this.setState({
                            moduleListData:data.data.rows,
                            moduleListDateLenght:data.data.total
                        })
                    }
                })
            }
        });
    } 
    onChange = (_this,text) => {
        Array.prototype.indexOf = function(val) {              
            for (var i = 0; i < this.length; i++) {  
                if (this[i] == val) return i;  
            }  
            return -1;  
        }; 
        Array.prototype.remove = function(val) {  
            var index = this.indexOf(val);  
            if (index > -1) {  
                this.splice(index, 1);  
            }  
        }; 
        
        const __this = this
        if(text.target.checked){
            __this.state.menuIds.push(_this.id)
            
        }else{
            __this.state.menuIds.remove(_this.id); 
        }
        
    }

    //角色权限数据提交
    partJurisdictionSubmit = (e)=>{
        const _this = this;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                $.ajax({
                    type: "POST",
                    contentType:'application/json;charset=utf-8',
                    url: serveUrl+"guest-permission/allocate-permission-to-role?access_token="+ User.appendAccessToken().access_token,
                 //   url: "http://192.168.0.161:8080/allocate-permission-to-role?access_token="+ User.appendAccessToken().access_token,
                    data: JSON.stringify({
                        data:[
                        {
                            roleId:_this.state.roleId,
                            permissionId:_this.state.permissionId
                        }
                    ]}),
                    success: function(data){
                        if(data.status == 200){
                           // console.log("成功")
                            message.success(data.msg);
                            _this.setState({
                                visible:false
                            })
                        }
                        else{
                            message.error(data.msg);
                        }
                        
                    }
                });  
            }
        });
    }

    handleReset=()=>{
        hashHistory.push('/partList');
    }

    //树形控件
    onCheck = (checkedKeys) => {
        var newarr = [];
        for(var i=0;i<checkedKeys.length;i++){
            if(checkedKeys[i]!="-1"){
                var newkey = parseInt(checkedKeys[i])
                newarr.push(newkey)
            }
        }
        this.setState({
            roleId:newarr
        });
    }
    onSelect = (selectedKeys, info) => {
       // this.setState({ menuIds:selectedKeys });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };
        const _this = this;
        const columns = [{
            title: '模块',
            dataIndex: 'menuName',
            key:'permissionId',
            width: '30%',
            render: text => <a href="#">{text}</a>,
        }, {
            title: '所属功能模块',
            dataIndex: 'name',
            width: '40%',
        }, {
            title: '',
            dataIndex: '',
            width: '30%',
        }];
        //分页
        const pagination1 = {
            total: _this.state.moduleListDateLenght,
            onShowSizeChange(current, pageSize) {
                _this.state.moduleListDateCurrent = current;
                _this.state.moduleListDatePageSize = pageSize;
                _this.getInitList(_this.state.moduleListDateCurrent,_this.state.moduleListDatePageSize);
            },
            onChange(current) {
                _this.state.moduleListDateCurrent = current;
                _this.getInitList(_this.state.moduleListDateCurrent,_this.state.moduleListDatePageSize);
            },
            showQuickJumper:true,
            pageSizeOptions:['10','20','50','100'],
            showSizeChanger:true,
        };
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                let arr = [];
                selectedRows.map((v, values) => {
                    arr.push(v.permissionId)
                })
                _this.setState({
                    permissionId: arr,
                })
            },
            onSelect: (record, selected, selectedRows) => {
                // console.log(record);
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
                //console.log(selectedRows);
            },
            // getCheckboxProps: record => ({
            //     disabled: record.name === 'Disabled User',    // Column configuration not to be checked
            // }),
        };

        const loop = data => data.map((v,values) => {
            if (v.children) {
                return (
                <TreeNode key={v.menuId} title={v.name} >
                    {loop(v.children)}
                </TreeNode>
                );
            }
            return <TreeNode key={v.roleId} title={v.name} />;
        });
        return (
            <div className="partConfig">
                <div className="breadcrumb-box">
                    <div className="top-bar"></div>
                    <div className="breadcrumb">
                        <Breadcrumb>
                            <Breadcrumb.Item>角色管理</Breadcrumb.Item>
                            <Breadcrumb.Item>角色权限</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <div className="box">
                        <ul className="tit">
                            <li>
                                <a href="javascript:;" className="active">角色权限</a>
                            </li>
                        </ul>
                    </div>

                    <div className="banner">
                        <Form inline horizontal
                            className="ant-advanced-search-form"
                            onSubmit={this.getInitList.bind(this,this.state.moduleListDateCurrent,this.state.moduleListDatePageSize)}
                            >
                            <Row>
                                <FormItem label="模块名称:" {...formItemLayout} hasFeedback style={{ width:29+'%' }}>
                                    {getFieldDecorator('institutionClientName', {
                                    })(
                                        <AutoComplete
                                            dataSource={this.state.AutoClientList}
                                            placeholder="请输入模块名称"
                                            style={{width:170}}
                                            />
                                        )}
                                </FormItem>
                                <FormItem label="功能名称:" {...formItemLayout} hasFeedback style={{ width:29+'%' }}>
                                    {getFieldDecorator('protocolName', {

                                    })(
                                        <AutoComplete
                                            dataSource={this.state.AutoProtocolList}
                                            placeholder="请输入功能名称"
                                            style={{width:170}}
                                            />
                                        )}
                                </FormItem>
                                <button className='btn-small' onClick={this.handleSearch} style={{marginRight:26,marginLeft:15}}>查&nbsp;&nbsp;询</button>
                                <button className='btn-small' onClick={this.showModal} style={{}}>配&nbsp;&nbsp;置</button>
                            </Row>
                        </Form>
                    </div>
                </div>

                 <div className="box">
                    
                    <Form horizontal  style={{marginTop:44}}>
                        <div>
                            <Modal title="选择角色" visible={this.state.visible}
                                onOk={this.partJurisdictionSubmit} onCancel={this.handleCancel}
                                okText="确定" cancelText="取消"
                            >
                            <Tree
                                checkable
                                onExpand={this.onExpand} expandedKeys={this.state.expandedKeys}
                                autoExpandParent={this.state.autoExpandParent}
                                onCheck={this.onCheck} 
                                onSelect={this.onSelect} selectedKeys={this.state.selectedKeys}
                            >
                                {loop(_this.state.menuListDate)}
                            </Tree>
                               
                            </Modal>
                        </div>

                        
                        <div className="search-result-list" style={{marginLeft:14}}>
                             <Table style={{marginTop:20}} columns={columns} dataSource={this.state.moduleListData} className="serveTable" rowSelection={rowSelection} pagination={pagination1}/>
                        </div>

                        <p style={{marginTop:20}}>共搜索到{this.state.moduleListDateLenght}条数据</p>
                    </Form>
                    
                 </div>
            </div>
        )
    }
}

Choosepart = Form.create()(Choosepart);

export default Choosepart;