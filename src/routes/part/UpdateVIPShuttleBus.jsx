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
const url = 'http://192.168.1.130:8080/';

class UpdateVIPShuttleBus extends React.Component {
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
                        <FormItem label="VIP摆渡车名称" {...formItemLayout} hasFeedback>
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: '请输入VIP摆渡车名称!' }],
                                initialValue:this.props.record.name
                            })(
                                <Input  />
                                )}
                        </FormItem>
                        <FormItem label="座位数" {...formItemLayout} hasFeedback>
                            {getFieldDecorator('seatNum', {
                                 rules: [{ required: true, message: '请输入座位数!' }],
                                 initialValue:this.props.record.seatNum
                            })(
                                <Input  />
                                )}
                        </FormItem>
                        <FormItem label="车牌" {...formItemLayout} hasFeedback>
                            {getFieldDecorator('plateNumber', {
                                rules: [{  message: '请输入车牌!' }],
                                initialValue:this.props.record.plateNumber
                            })(
                                <Input  />
                                )}
                        </FormItem>
                        <Row>
                            <Col span={24} style={{ textAlign: 'left' }}>
                                <button className="btn" onClick={
                                    (data)=>{
                                        this.props.form.validateFields((err, values) => {
                                            if (!err) {
                                                //修改保存
                                                const _this = this;
                                                const formatData = {
                                                    data: [{
                                                        servId: _this.props.record.servId,
                                                        airportCode: "LJG",
                                                        name: _this.props.form.getFieldValue('name'),
                                                        seatNum: _this.props.form.getFieldValue('seatNum'),
                                                        plateNumber: _this.props.form.getFieldValue('plateNumber')
                                                    }]
                                                };
                                                $.ajax({
                                                    type: "POST",
                                                    url: url + "save-or-update",
                                                    contentType: 'application/json;charset=utf-8',
                                                    data: JSON.stringify(formatData),
                                                    success: function (data) {
                                                        if (data.status == 200) {
                                                            _this.props.handleClick();
                                                            _this.props.form.resetFields();
                                                        }
                                                        else if (data.status == 5003) {
                                                            message.error(data.msg);
                                                        }
                                                        else if(data.status == 5001){
                                                            message.error(data.msg);
                                                        }
                                                        hashHistory.push('/partList');
                                                    }
                                                });
                                            }
                                        })
                                    }
                                }>保存</button>
                            </Col>
                        </Row>
                    </Form>

                 </div>
            </div>
        )
    }
}

UpdateVIPShuttleBus = Form.create()(UpdateVIPShuttleBus);

export default UpdateVIPShuttleBus;

