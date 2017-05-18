
import React from 'react';
import { hashHistory } from 'react-router';
import {Form, Row, Col, Input, Button, Icon,Select,message,Radio } from 'antd';
import { Link} from 'react-router';
import $ from 'jquery';
import { serveUrl, User, cacheData} from '../../utils/config';

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const RadioGroup = Radio.Group;
const msg = '是否删除?';

class updateMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pId:null,
            menuId:null
        }
    }
    componentWillMount() {
        if(User.isLogin()){
        } else{
            hashHistory.push('/login');
        }
        const _this = this;
    
        $.ajax({
            type: "GET",
            url: serveUrl+'guest-role/viewMenu?access_token='+ User.appendAccessToken().access_token,
            data:{airportCode:'LJG',menuId:_this.props.name},
            success: function(data){
            //    console.log(data)
                _this.setState({
                    pId:data.data.pId,
                    menuId:data.data.menuId
                })
                _this.props.form.setFieldsValue({
                    name: data.data.name,
                    type:data.data.type,
                    url:data.data.url,
                    position:data.data.position
                });
            }
        })
    }
   componentDidMount=()=>{
        $(".ant-modal-footer .ant-btn").hide();
        $(".ant-modal-header").css({background:'#f4f7f9'});
        $(".ant-modal-footer").css({background:'#f4f7f9'});
        $(".ant-modal-footer").css({height:'50'});
        $(".ant-modal").css({top:'50%',left:'50%',marginTop:'-268px',marginLeft:'-260px'});
    }

  handleSubmit = (e) =>{
      const _this = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const formData = {
                    data:[{
                        airportCode: "LJG",
                        menuId:_this.state.menuId,
                        "pid": _this.state.pId,//菜单父id
                        "name": values.name,//菜单管理
                        "url": values.url,//菜单url 
                        "position": values.position, //菜单排序
                        type:values.type
                    }]
                }
                $.ajax({
                    type: "POST",
                    contentType:'application/json;charset=utf-8',
                    url: serveUrl+'guest-role/addMenu?access_token='+ User.appendAccessToken().access_token,
                    data: JSON.stringify(formData),
                    success: function(data){
                        if(data.status == 200){
                            message.success(data.msg);
                            _this.props.confirmClose();
                        }
                        else{
                            message.error(data.msg);
                        }
                    }
                });  
            }
        });
  }

  render() {
       const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };
    return (
      <div>
         <div className="box">
            <Form horizontal  style={{marginTop:44,marginLeft:40,float:'left'}}>
                <FormItem label="菜单名称" {...formItemLayout} hasFeedback   >
                    {getFieldDecorator('name', {
                            rules: [{ required: true,message: '请输入菜单名称!' }],
                    })(
                        <Input   style={{width:358}}  className='required'/>
                        
                    )}
                </FormItem>
                <FormItem label="菜单链接" {...formItemLayout} hasFeedback   >
                    {getFieldDecorator('url', {
                            rules: [{ required: true,message: '请输入菜单链接!'  }],
                    })(
                        <Input   style={{width:358}}  className='required'/>
                        
                    )}
                </FormItem>
                <FormItem label="菜单排序" {...formItemLayout} hasFeedback   >
                    {getFieldDecorator('position', {
                            rules: [{ required: true,message: '请输入菜单排序!'  }],
                    })(
                        <Input   style={{width:358}}  className='required'/>
                        
                    )}
                </FormItem>
                <FormItem label="菜单图标" {...formItemLayout} hasFeedback   >
                    {getFieldDecorator('type', {
                    })(
                        <Input  placeholder="请输入菜单图标" style={{width:318}}  className='required'/>
                        
                    )}
                </FormItem>

                <Row>
                    <Col span={24} offset={8}>
                        <FormItem style={{ marginTop:50}}>
                            <button className='btn-small' onClick={this.handleSubmit}>保存</button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
         </div>
      </div>
    )
  }
}

updateMenu = Form.create()(updateMenu);

export default updateMenu;