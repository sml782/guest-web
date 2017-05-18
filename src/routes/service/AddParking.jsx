import './service.less'
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
const url = 'http://192.168.1.130:8887/';

class AddParking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

     componentWillMount() {
          if(User.isLogin()){
        } else{
            hashHistory.push('/login');
        }
        
    }

    componentDidMount=()=>{
        $(".ant-modal-footer").hide();
        $(".ant-modal").css({top:'50%',marginTop:'-96px'});
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
                    <Form
                        horizontal
                        className="ant-advanced-search-form"
                        onSubmit={this.handleSearch}
                        >
                        <FormItem label="停车场名称" {...formItemLayout} hasFeedback>
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: '请输入停车场名称!' }]
                            })(
                                <Input  />
                                )}
                        </FormItem>
                        <Row>
                            <Col span={24} style={{ textAlign: 'left' }} offset={10}>
                                <button className="btn-small" onClick={
                                    (data)=>{
                                        this.props.form.validateFields((err, values) => {
                                            if (!err) {
                                                //保存表单
                                                const _this = this;
                                                const formatData = {
                                                    data: [{
                                                        serviceTypeAllocationId:4,
                                                        name: _this.props.form.getFieldValue('name')
                                                    }]
                                                };
                                                $.ajax({
                                                    type: "POST",
                                                    url: serveUrl + "guest-service/save-or-update?access_token="+User.appendAccessToken().access_token,
                                                    contentType: 'application/json;charset=utf-8',
                                                    data: JSON.stringify(formatData),
                                                    success: function (data) {
                                                        if (data.status == 200) {
                                                            message.success(data.msg);
                                                            _this.props.handleClick();
                                                            _this.props.form.resetFields();
                                                        }
                                                        else if (data.status == 5003) {
                                                            message.error(data.msg);
                                                        }
                                                        else if(data.status == 5001){
                                                            message.error(data.msg);
                                                        }
                                                        else if(data.status == 4995){
                                                            message.error(data.msg);
                                                        }
                                                    }
                                                });
                                            }
                                        })
                                    }
                                }>保&nbsp;&nbsp;存</button>
                            </Col>
                        </Row>
                    </Form>

                 </div>
            </div>
        )
    }
}

AddParking = Form.create()(AddParking);

export default AddParking;

