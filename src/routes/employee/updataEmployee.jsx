import './employee.less'
import React from 'react';
import { hashHistory } from 'react-router';
import {Breadcrumb,Form, Row, Col, Input, Button, Icon,Select,Popconfirm,message,Table,Checkbox} from 'antd';
import { Link} from 'react-router';
import $ from 'jquery';
import { serveUrl, User, cacheData} from '../../utils/config';

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const msg = '是否删除?';

class ServiceList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            productTypeData: [],
            serveTypeData: [],
            serveListDate: [],
            serveListDateLength: null,
            serveListDateCurrent: 1,
            serveListDatePageSize: 10,
            selectedRowKeys: [],
            searchValue: '',
            menuListDate: [],
            menuIds: [],
            siderBar1: [],
            oldPassword: null,
            totalSideBar: null
        }
    }

    componentWillMount() {
        if (User.isLogin()) {
        } else {
            hashHistory.push('/login');
        }

        this.getTableInit()
        this.getInit()

    }
    componentDidMount = () => {
        $(".ant-breadcrumb-separator").html(">");
        $(".ant-breadcrumb-separator").css({ color: '#333' });
    }
    componentDidUpdate = () => {
        $(".ant-table-tbody tr td").css({ borderBottom: 'none' });
        $("table").css({ border: '1px solid #f0f0f0' });
    }

    getTableInit = () => {
        const _this = this
        $.ajax({
            type: "GET",
            url: serveUrl + "guest-employee/view?access_token=" + User.appendAccessToken().access_token,
            data: { employeeId: _this.props.params.id },
            success: function (data) {
                _this.props.form.setFieldsValue({
                    name: data.data.name,
                    username: data.data.account,
                });
            }
        })

    }

    getInit = () => {
        this.setState({
            menuListDate: []
        })
        const _this = this;
        //初始化角色列表
        $.ajax({
            type: "GET",
            url: serveUrl + "guest-role/list?access_token=" + User.appendAccessToken().access_token,
            data: { airportCode: 'LJG' },
            success: function (data) {
                data.data.rows.map((v, index) => {
                    v.key = v.roleId
                })
                _this.setState({
                    siderBar1: data.data.rows,
                    totalSideBar: data.data.total
                })
                //初始化角色权限
                $.ajax({
                    type: "GET",
                    url: serveUrl + "guest-employee/getRoleByUserId?access_token=" + User.appendAccessToken().access_token,
                    data: { employeeId: _this.props.params.id },
                    success: function (data) {
                        data.data.map((v, index) => {
                            const roleId = v.roleId;
                            _this.state.siderBar1.map((v, index) => {
                                if (v.roleId == roleId) {
                                    v.status = true;
                                }
                            })
                        })
                        _this.state.siderBar1.map((v, index) => {
                            if (v.status != true) {
                                v.status = false
                            } else {
                                _this.state.menuIds.push(v.roleId)
                            }
                        })
                        _this.setState({
                            siderBar1: _this.state.siderBar1
                        })
                    }
                })
            }
        })
    }

    getInitList(page, rows) {
        const data = [];
        const _this = this;
        $.ajax({
            type: "GET",
            url: serveUrl + "guest-role/list?access_token=" + User.appendAccessToken().access_token,
            data: {
                page: page,
                rows: rows
            },
            success: function (data) {
                data.data.rows.map((v, index) => {
                    v.key = v.roleId
                })
                _this.setState({
                    siderBar1: data.data.rows,
                    totalSideBar: data.data.total
                })
                //角色权限是否勾选
                _this.state.menuIds.map((v, index) => {
                    const roleId = v;
                    _this.state.siderBar1.map((k, index) => {
                        if (k.roleId == roleId) {
                            k.status = true;
                        }
                    })
                });
                _this.state.siderBar1.map((j, index) => {
                    if (j.status != true) {
                        j.status = false
                    } else {
                        _this.state.menuIds.push(j.roleId)
                    }
                })
                _this.setState({
                    siderBar1: _this.state.siderBar1
                })
            }
        });
    }

    onChange = (_this, text) => {
        Array.prototype.indexOf = function (val) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] == val) return i;
            }
            return -1;
        };
        Array.prototype.remove = function (val) {
            var index = this.indexOf(val);
            if (index > -1) {
                this.splice(index, 1);
            }
        };
        const __this = this;
        _this.status = !_this.status;
        if (text.target.checked) {
            __this.state.menuIds.push(_this.roleId)

        } else {
            __this.state.menuIds.remove(_this.roleId);
        }
        this.setState({
            menuListDate: this.state.menuListDate
        })
    }


    handleSubmit = (e) => {
        const _this = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const formData = {
                    data: [{
                        employeeId: parseInt(_this.props.params.id),
                        isExist: 1,
                        name: values.name,
                        roleIdList: _this.state.menuIds.unique()
                    }]
                }
                $.ajax({
                    type: "POST",
                    contentType: 'application/json;charset=utf-8',
                    // url: "http://192.168.1.199:8887/saveOrUpdate?access_token=" + User.appendAccessToken().access_token,
                    url: serveUrl + "guest-employee/saveOrUpdate?access_token=" + User.appendAccessToken().access_token,
                    data: JSON.stringify(formData),
                    success: function (data) {
                        if (data.status == 200) {
                            message.success(data.msg);
                        }
                        else if (data.status == 500) {
                            message.error(data.msg);
                        }
                        hashHistory.push('/employeeList');
                    }
                });
            }
        });
    }

    //跳到列表页
    handleReset = () => {
        hashHistory.push('/employeeList');
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };
        const _this = this;
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
                            <Checkbox checked={text.status} onChange={_this.onChange.bind(_this,text)}></Checkbox>
                        </div>
                        )
            }
        }]
         const pagination = {
            total: this.state.totalSideBar,
            onShowSizeChange(current, pageSize) {
                _this.state.serveListDateCurrent = current;
                _this.state.serveListDatePageSize = pageSize;
                _this.getInitList(_this.state.serveListDateCurrent,_this.state.serveListDatePageSize);
            },
            onChange(current) {
                _this.state.serveListDateCurrent = current;
                _this.getInitList(_this.state.serveListDateCurrent,_this.state.serveListDatePageSize);
            }
        };
       
        return (
            <div>
                <div className="breadcrumb-box">
                    <div className="top-bar"></div>
                    <div className="breadcrumb">
                        <Breadcrumb>
                            <Breadcrumb.Item>员工管理</Breadcrumb.Item>
                            <Breadcrumb.Item>修改员工</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>

                 <div className="box">
                    <ul className="tit">
                        <li>
                            <a href="javascript:;" className="active">修改员工</a>
                        </li>

                    </ul>
                    
                    <Form horizontal  style={{marginTop:44}}>
                        <FormItem label="员工名称" {...formItemLayout} hasFeedback required style={{marginLeft:-20}} >
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: '请输入员工名称!' }],
                            })(
                                <Input  placeholder="请输入员工名称" style={{width:358}}  className='required'/>
                                
                            )}
                        </FormItem>

                        <FormItem label="员工账号" {...formItemLayout} hasFeedback required style={{marginLeft:-20}} >
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: '请输入员工账号!' }],
                            })(
                                <Input  placeholder="请输入员工账号" style={{width:358}}  className='required' disabled/>
                                
                            )}
                        </FormItem>
                        <div className="search-result-list" style={{marginLeft:14}}>
                            <Table style={{marginTop:20}} columns={columns}  dataSource={this.state.siderBar1} pagination={pagination} className=" serveTable"/>
                            <p style={{marginTop: 20}}>共搜索到{this.state.totalSideBar}条数据</p>
                        </div>

                        <Row>
                            <Col span={24} offset={10} style={{marginTop:50 }} className="mb44">
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