import './part.less'
import React from 'react';
import { hashHistory } from 'react-router';
import {Breadcrumb,Form, Row, Col, Input, Button, Icon,Select,Popconfirm,message,Table,Checkbox,Modal,Tree} from 'antd';
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
            siderBar1:[],
            description:null,
            passengerVisible:false,
            partListDate: [],
            partListDateLength:null,
            partListDateCurrent:1,
            partListDatePageSize:100,
            keys:[],
            checkedKeys:null,
            permissionId:null,
            roleId:null,
            rolePressionId:null
        }
    }

     componentWillMount() {
         if(User.isLogin()){
        } else{
            hashHistory.push('/login');
        }
        this.getInit()
        this.getInit2()
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

    getTableInit =(initList)=>{
        const _this = this
        $.ajax({
            type: "GET",
            //url: serveUrl+"guest-role/deleteRoles/?access_token="+ User.appendAccessToken().access_token,
            //url:'http://192.168.0.161:8080/data-permission-list?access_token='+ User.appendAccessToken().access_token,
            url: serveUrl+'guest-permission/list?access_token='+ User.appendAccessToken().access_token,
            data:{page:1,rows:10,roleId:_this.props.params.id},
            success: function(data){
                
                //  _this.props.form.setFieldsValue({
                //     name: data.data[0].name,
                //     username:data.data[0].account,
                //     password:data.data[0].password

                // });
                data.data.rows.map((v,index)=>{
                    const permissionId = v.permissionId
                    const rolePermissionId = v.rolePermissionId
                    initList.map((v,index)=>{
                        if(permissionId == v.permissionId){
                            v.rolePermissionId = rolePermissionId
                            v.status = true
                            _this.state.menuIds.push({airportCode:"LJG",permissionId:v.permissionId,roleId:_this.props.params.id,rolePermissionId:v.rolePermissionId})
                        }
                    })
                })
                initList.map((v,index)=>{
                    if(!v.status){
                        v.status = false
                    }
                })
                
                _this.setState({
                    siderBar1:initList
                })
                
            }
        })
         
    }

    getInit =()=>{
        const _this = this
        $.ajax({
            type: "GET",
            url: serveUrl+'guest-permission/data-permission-list?access_token='+ User.appendAccessToken().access_token,
            // url:'http://192.168.0.161:8080/data-permission-list?access_token='+ User.appendAccessToken().access_token,
            //url: 'http://192.168.1.130:8081/'+"list",
            data:{page:1,rows:10,roleId:_this.props.params.id},
            success: function(data){
                if(data.status == 200){
                    data.data.rows.map((v,index)=>{
                        v.key = v.permissionId
                    })
                    _this.getTableInit(data.data.rows)
                }
                
                
            }
        })
       
    }
    getInit2 =()=>{
        const _this = this
        $.ajax({
            type: "GET",
            url: serveUrl+"guest-role/view?access_token="+ User.appendAccessToken().access_token,
            data:{airportCode:'LJG',roleId:_this.props.params.id},
            success: function(data){
                _this.props.form.setFieldsValue({
                    name: data.data.name,
                    description:data.data.description,
                });
                _this.setState({
                    description:data.data.description
                })
            }
        })
        
    }

    
    
    onChange = (_this,text) => {
       
        // Array.prototype.remove = function(index) {  
        //     if (index > -1) {  
        //         this.splice(index, 1);  
        //     } 
        // }; 
        
        // const __this = this
        // _this.status = !_this.status
        // if(text.target.checked){
        //     __this.state.menuIds.push({airportCode:"LJG",permissionId:_this.permissionId,roleId:__this.props.params.id})
            
        // }else{
        //     //__this.state.menuIds.remove(_this.permissionId); 
        //     for (var i = 0; i < this.state.menuIds.length; i++) {  
                
        //          if (this.state.menuIds[i].permissionId == _this.permissionId){
        //              this.state.menuIds.remove(i)
        //          }
                
        //     }
        // }
        // this.setState({
        //     menuListDate:this.state.menuListDate
        // })
    }
    

    handleSubmit =(e)=>{
        // const _this = this;
        // e.preventDefault();
        // this.props.form.validateFields((err, values) => {
        //     if (!err) {
        //     $.ajax({
        //         type: "POST",
        //         contentType:'application/json;charset=utf-8',
        //         url: serveUrl+'guest-permission/update-role-permission?access_token='+ User.appendAccessToken().access_token,
        //         //url: 'http://192.168.1.130:8081/update-role-permission',
        //         data: JSON.stringify({data:_this.state.menuIds}),
        //         success: function(data){
                    
        //             if(data.status == 200){
        //                 message.success(data.msg);
        //             }
        //             else if(data.status == 500){
        //                 message.error(data.msg);
        //             }
        //             hashHistory.push('/partList');
                    
        //         }
        //     });  
        //     }
        // });
    }

    handleReset = () =>{
        hashHistory.push('/partList');
    }
    showModel = (v,e)=>{
        let keys;
        if(v.roleIds != null && v.roleIds != ''){
            keys = v.roleIds.split(',')
        }
        this.state.rolePermissionId = v.rolePermissionId;
        this.setState({
            passengerVisible:true,
            keys:keys,
            permissionId:v.permissionId,
            rolePressionId:this.state.rolePermissionId
        })
    }
    handleCancel1 = () =>{
        this.setState({
            passengerVisible:false
        })
    }
    onOK = ()=>{
        let roleIds = '';
        if(this.state.checkedKeys){
            this.state.checkedKeys.map((v,index)=>{
                if(v != '0-0'){
                    if(index == 0){
                        roleIds = v
                    }else{
                        roleIds = roleIds + ',' +v
                    }
                }
            })
        }
        
        const _this = this;
        if(_this.state.rolePermissionId == undefined || _this.state.rolePermissionId == null ){
            _this.state.rolePermissionId = '';
        }
        let format = {
            "data": [
                {
                "permissionId": _this.state.permissionId,
                "roleIds": roleIds,
                "roleId":parseInt(_this.props.params.id),
                "rolePermissionId":_this.state.rolePermissionId
                }
            ]
            }
        $.ajax({
            type: "POST",
            contentType:'application/json;charset=utf-8',
            // url:'http://192.168.0.161:8080/save-or-update?access_token='+ User.appendAccessToken().access_token,
           url: serveUrl+'guest-permission/save-or-update?access_token='+ User.appendAccessToken().access_token,
            //url: 'http://192.168.1.130:8081/update-role-permission',
            data: JSON.stringify(format),
            success: function(data){
                 _this.setState({
                    passengerVisible:false
                })
                _this.getInit()
                _this.getInit2()
                _this.getInitList(_this.state.partListDateCurrent,_this.state.partListDatePageSize)
                if(data.status ==200){
                    message.success('更新成功')
                }else{
                    message.error('更新失败')
                }
            }
        })
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

    onSelect = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
    }
    onCheck = (checkedKeys, info) => {
        this.state.checkedKeys = checkedKeys
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };
        const _this = this;
        const columns = [{
            title: '数据名称',
            width: '12.5%',
            dataIndex: 'name',
            render(text,record) {
                return (
                        <div className="order">{text}</div>
                        )
            }
        }, {
            title: '数据权限配置',
            width: '12.5%',
            dataIndex: 'airportCode',
            render(text,record) {
                return (
                        <div className="order" ><a onClick={_this.showModel.bind(_this,record)}>{text}</a></div>
                        )
            }
        }]
        let keys = []
        const TreeNodes = this.state.partListDate.map((v,index)=>{
            return  <TreeNode title={v.name} key={v.roleId} />
        })

        

       
        return (
            <div>
                <div className="breadcrumb-box">
                    <div className="top-bar"></div>
                    <div className="breadcrumb">
                        <Breadcrumb>
                            <Breadcrumb.Item>角色管理</Breadcrumb.Item>
                            <Breadcrumb.Item>配置角色权限</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>

                 <div className="box">
                    <ul className="tit">
                        <li>
                            <a href="javascript:;" className="active">配置角色权限</a>
                        </li>
                    </ul>
                    
                    <Form horizontal style={{marginTop:44}}>
                        <FormItem label="角色名称" {...formItemLayout} hasFeedback style={{marginLeft:-20}} >
                            {getFieldDecorator('name', {
                            })(
                                <span>{this.props.params.name}</span>
                                
                            )}
                        </FormItem>
                        <FormItem label="角色描述" {...formItemLayout} hasFeedback style={{marginLeft:-20}} >
                            {getFieldDecorator('description', {
                            })(
                                <span>{this.state.description}</span>
                                
                            )}
                        </FormItem>

                        
                        <div className="search-result-list" style={{marginLeft:14}}>
                            <Table style={{marginTop:20}} columns={columns} dataSource={this.state.siderBar1}  className=" serveTable"/>
                        </div>
                    </Form>
                 </div>
                 <div id="detail-msg">
                    <Modal title="数据角色"
                        key={Math.random() * Math.random()}
                        visible={this.state.passengerVisible}
                        onCancel={this.handleCancel1}
                        onOk={this.onOK}
                        >
                        <div>
                            <Tree
                                checkable
                                defaultExpandedKeys={['0-0']}
                                defaultSelectedKeys={['0-0']}
                                defaultCheckedKeys={this.state.keys}
                                onSelect={this.onSelect}
                                onCheck={this.onCheck}
                            >
                                <TreeNode title="数据权限角色" key="0-0">
                                    {TreeNodes}
                                </TreeNode>
                            </Tree>
                        </div>
                    </Modal>
                </div>
            </div>
        )
    }
}

ServiceList = Form.create()(ServiceList);

export default ServiceList;