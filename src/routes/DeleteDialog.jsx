import React from 'react';
import { hashHistory } from 'react-router';
import {Form, Row, Col, Input, Button, Icon,Select,message,Radio } from 'antd';
import { Link} from 'react-router';
import $ from 'jquery';
import { serveUrl, User, cacheData} from '../utils/config';

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const RadioGroup = Radio.Group;

class DeleteDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentWillMount=()=>{
         if(User.isLogin()){
        } else{
            hashHistory.push('/login');
        }
    }
    componentDidMount=()=>{
        $(".ant-modal-header").css({background:'#f4f7f9'});
        $(".ant-modal-footer").css({background:'#f4f7f9'});
        $(".ant-modal-title").css({textAlign:'center',fontSize:16,fontWeight:'normal'});
        $(".ant-modal").css({width:350,height:240,left:'50%',top:'50%',marginLeft:-175,marginTop:-92});
        $(".ant-btn").css({background:'#4778c7'});
        $(".ant-btn span").css({color:'#fff'});
        $(".ant-modal-body").css({height:80});
        $(".ant-modal-footer").css({textAlign:'center'});
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };

        return (
            <div style={{textAlign:'center',lineHeight:'46px'}}>
                {this.props.msg}
            </div>
        )
    }
}

DeleteDialog = Form.create()(DeleteDialog);
export default DeleteDialog;

