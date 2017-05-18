import './part.less'
import React from 'react';
import { hashHistory } from 'react-router';
import {Breadcrumb,Form, Row, Col, Input, Button, Icon,Select,Popconfirm,message,Table,Checkbox,Tree} from 'antd';
import { Link} from 'react-router';
import $ from 'jquery';
import { serveUrl, User, cacheData} from '../../utils/config';

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const msg = '是否删除?';
const TreeNode = Tree.TreeNode;

class ServiceList extends React.Component {
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
            children:[],
            expandedKeys: ["-1"],
            autoExpandParent: true,
            checkedKeys: [],
            selectedKeys: []
        }
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
    }
    componentDidUpdate=()=>{
        $(".ant-table-tbody tr td").css({borderBottom:'none'});
        $("table").css({border:'1px solid #f0f0f0'});
        $(".ant-pagination-options").hide();
       
    }

     getInit =()=>{
        this.setState({
                        menuListDate:[]
                    })
        const _this = this
        $.ajax({
            type: "GET",
            url: serveUrl+"guest-role/menuTree?access_token="+ User.appendAccessToken().access_token,
            success: function(data){
                let allCheckobj = {menuId:-1,name:"菜单",children:data.data}
                let arr = [allCheckobj]
                _this.setState({
                    menuListDate:arr
                })
                
            }
        })
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
    

   handleSubmit =(e)=>{
        const _this = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                
                const formData = {
                    data:[{
                        "name": values.name,//菜单管理
                        "description": values.description, //菜单排序
                        menuIdList:_this.state.menuIds
                    }]
                }
                $.ajax({
                    type: "POST",
                    contentType:'application/json;charset=utf-8',
                    url: serveUrl+"guest-role/saveOrUpdate?access_token="+ User.appendAccessToken().access_token,

                    data: JSON.stringify(formData),
                    success: function(data){
                        if(data.status == 200){
                            message.success(data.msg);
                            hashHistory.push('/partList');
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

  onExpand = (expandedKeys) => {
    //  console.log('onExpand', arguments);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }
  onCheck = (checkedKeys) => {
  //  console.log(checkedKeys)
    var newarr = [];
    for(var i=0;i<checkedKeys.length;i++){
        if(checkedKeys[i]!="-1"){
             var newkey = parseInt(checkedKeys[i])
             newarr.push(newkey)
        }
    }
    this.setState({
        menuIds:newarr
    });
  }
  onSelect = (selectedKeys, info) => {
    //  console.log(selectedKeys);
    //this.setState({ menuIds:selectedKeys });
  }


    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };
        const _this = this;
        //tree
        const loop = data => data.map((v,values) => {
            if (v.children) {
                return (
                <TreeNode key={v.menuId} title={v.name} >
                    {loop(v.children)}
                </TreeNode>
                );
            }
            return <TreeNode key={v.menuId} title={v.name} />;
        });
     
        return (
            <div>
                <div className="breadcrumb-box">
                    <div className="top-bar"></div>
                    <div className="breadcrumb">
                        <Breadcrumb>
                            <Breadcrumb.Item>角色管理</Breadcrumb.Item>
                            <Breadcrumb.Item>新增角色</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>

                 <div className="box">
                    <ul className="tit">
                        <li>
                            <a href="javascript:;" className="active">新增角色</a>
                        </li>

                    </ul>
                    
                    <Form horizontal onSubmit={this.handleSubmit} style={{marginTop:44}}>
                        <Row>
                            <FormItem label="角色名称" {...formItemLayout} hasFeedback required style={{marginLeft:-20}} >
                                {getFieldDecorator('name', {
                                    rules: [{ required: true, message: '请输入角色名称!' }],
                                })(
                                    <Input  placeholder="请输入角色名称" style={{width:358}}  className='required'/>
                                    
                                )}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem labelInValue label="角色描述" {...formItemLayout} required style={{marginLeft:-20}}>
                                {getFieldDecorator('description', {
                                    rules: [{ required: true, message: '请选择跟进人!' }],
                                })(
                                    <Input  placeholder="请输入角色名称" style={{width:358}}  className='required'/>
                                )}
                            </FormItem>
                        </Row>

                        
                        <div className="search-result-list" style={{marginLeft:14}}>
                             <Tree
                                checkable
                                onExpand={this.onExpand} expandedKeys={this.state.expandedKeys}
                                autoExpandParent={this.state.autoExpandParent}
                                onCheck={this.onCheck}  
                                onSelect={this.onSelect} selectedKeys={this.state.selectedKeys}
                            >
                                {loop(_this.state.menuListDate)}
                            </Tree>
                        </div>

                        <Row style={{marginTop:50 }}>
                            <Col span={24} style={{ textAlign: 'center'}} className="mb44">
                                <FormItem>
                                    <button className='btn-small' onClick={this.handleSubmit}>保存</button>
                                    &nbsp;&nbsp;&nbsp;
                                    <button className='btn-small' onClick={this.handleReset}>取消</button>
                                </FormItem>
                            </Col>
                        </Row>
                        
                    </Form>
                    
                 </div>
            </div>
        )
    }
}

ServiceList = Form.create()(ServiceList);

export default ServiceList;