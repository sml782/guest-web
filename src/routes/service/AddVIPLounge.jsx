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

class AddVIPLounge extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 1,
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
        $(".ant-modal").css({top:'50%',marginTop:'-168px'});
    }

    //单选按钮发生改变时触发的事件
     onChange = (e) => {
         this.setState({
             value: e.target.value,
         });
         this.props.form.setFieldsValue({ type: this.state.value });
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
                        <FormItem label="贵宾厅名称" {...formItemLayout} hasFeedback>
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: '请输入贵宾厅名称!' }]
                            })(
                                <Input  />
                                )}
                        </FormItem>
                        <FormItem label="出发类型" {...formItemLayout} hasFeedback>
                            {getFieldDecorator('departType', {
                                 rules: [{ required: true, message: '请选择出发类型!' }]
                            })(
                                <RadioGroup onChange={this.onChange} >
                                    <Radio value='国内'>国内</Radio>
                                    <Radio value='国际'>国际</Radio>
                                    <Radio value='国内国际'>国内国际</Radio>
                                </RadioGroup>
                                )}
                        </FormItem>
                        <FormItem label="区域" {...formItemLayout} hasFeedback>
                            {getFieldDecorator('region', {
                                rules: [{ required: true, message: '请输入区域!' }]
                            })(
                                <Input  />
                                )}
                        </FormItem>
                        <FormItem label="位置数量" {...formItemLayout} hasFeedback>
                            {getFieldDecorator('positionNum', {
                                rules: [{ required: true, message: '请输入位置数量!' }]
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
                                                        serviceTypeAllocationId: 1,
                                                        name: _this.props.form.getFieldValue('name'),
                                                        departType: _this.props.form.getFieldValue('departType'),
                                                        region: _this.props.form.getFieldValue('region'),
                                                        positionNum: _this.props.form.getFieldValue('positionNum')
                                                    }]
                                                };
                                                $.ajax({
                                                    type: "POST",
                                                    url: serveUrl+ "guest-service/save-or-update?access_token="+User.appendAccessToken().access_token,
                                                    // url:"http://192.168.1.130:8080/save-or-update?access_token="+User.appendAccessToken().access_token,
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

AddVIPLounge = Form.create()(AddVIPLounge);

export default AddVIPLounge;

