import './crm.less';
import React from 'react';
import { hashHistory } from 'react-router';
import { Breadcrumb, Form, Row, Col, Input, Button, Icon, Select, Popconfirm, message, Table, AutoComplete, Modal, DatePicker } from 'antd';
import { Link } from 'react-router';
import $ from 'jquery';
import moment from 'moment';
import { serveUrl, User, cacheData } from '../../utils/config';
import DeleteDialog from '../DeleteDialog';//引入删除弹框
// const $ = require('jquery')

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const Option1 = AutoComplete.Option;
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const msg = '确认删除该协议吗?';
const url = "http://192.168.1.130:8887/";


class CRMList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startValue: null,
            endValue: null,
            endOpen: false,
            customerId: null,
            protocolId: null,
            productData: [],
            AutoClientList: [],
            protocolTypeList: [],
            getPassengerList: [],
            getPassengerListLength: null,
            PassengerListPage: 1,
            PassengerListRows: 10,
            Firstclass: null,
            Goldclass: null,
            Localclass: null,
            VIPclass: null,
            Cardholderclass: null,
            Bankclas:null,
            labels: [],
        }
    }

    componentWillMount() {
          if(User.isLogin()){
        } else{
            hashHistory.push('/login');
        }
        const _this = this
        $.ajax({
            type: "GET",
            //url: 'http://192.168.1.130:8887/getProtocolNameDropdownList?access_token='+ User.appendAccessToken().access_token,
            url: serveUrl + 'guest-protocol/getProtocolNameDropdownList?access_token=' + User.appendAccessToken().access_token,
            success: function (data) {
                const Adata = [];
                data.data.map((v, index) => {
                    Adata.push(data.data[index].value)
                })
                _this.setState({
                    productData: Adata,
                })
            }
        });
        $.ajax({
            type: "GET",
            // url: "192.168.1.126:8887/queryInstitutionClientDropdownList",
            url: serveUrl + "institution-client/queryInstitutionClientDropdownList?access_token=" + User.appendAccessToken().access_token,
            success: function (data) {
                if (data.status == 200) {
                    const Adata = [];
                    _this.setState({
                        AutoClientList: []
                    })
                    data.data.map((data) => {
                        Adata.push(data.value);
                    })
                    _this.setState({
                        AutoClientList: Adata
                    })
                }
            }
        });
        $.ajax({
            type: "GET",
            url: serveUrl + "guest-protocol/protocolTypeSelect",
            // url: url + "protocolTypeSelect",
            data: { access_token: User.appendAccessToken().access_token },
            success: function (data) {
                if (data.status == 200) {
                    const Adata = []
                    data.data.map((v, index) => {
                        Adata.push({
                            text: v.value,
                            value: v.id
                        })
                    })
                    _this.setState({
                        protocolTypeList: Adata
                    });
                }
            }
        });

        $.ajax({
            type: "GET",
            //url: 'http://192.168.0.105:8887/getPassengerList?access_token=' + User.appendAccessToken().access_token,
            url: serveUrl + 'guest-crm/getPassengerList?access_token=' + User.appendAccessToken().access_token,
            data: { page: _this.state.PassengerListPage, rows: _this.state.PassengerListRows },
            success: function (data) {
                data.data.rows.map((v, index) => {
                    v.key = v.passengerId
                })
                _this.setState({
                    getPassengerList: data.data.rows,
                    getPassengerListLength: data.data.total
                })

            }
        });
    }

    componentDidMount = () => {
        $(".ant-breadcrumb-separator").html(">");
        // $(".ant-col-5").removeClass('ant-col-5').addClass("ant-col-4");
        $(".ant-calendar-picker").eq(0).css({ marginRight: 20 });
    }

    componentDidUpdate=()=>{    
        $(".ant-table-tbody tr td").css({borderBottom:'none'});
        $("table").css({border:'1px solid #f0f0f0'});
    }

    onChange = (field, value) => {
        this.setState({
            [field]: value,
        });
    }

    //查询
    handleSearch = (e) => {
        const _this = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                _this.getAnyList(_this.state.PassengerListPage, _this.state.PassengerListRows, values)

            }
        });
    }

    customerIdChange = (value) => {
        const _this = this
        $.ajax({
            type: "GET",
            //url: 'http://192.168.0.105:8887/getAuthorizerDropdownList?access_token='+ User.appendAccessToken().access_token,
            url: serveUrl + 'institution-client/queryInstitutionClientDropdownList?access_token=' + User.appendAccessToken().access_token,
            data: { name: value },
            success: function (data) {
                

                _this.setState({
                    customerId: data.data[0].id
                })

            }
        });
    }

    productChange = (value) => {
        const _this = this
        $.ajax({
            type: "GET",
            url: serveUrl + 'guest-protocol/getProtocolNameDropdownList?access_token=' + User.appendAccessToken().access_token,
            data: { protocolName: value },
            success: function (data) {
                const Adata = []
                data.data.map((v, index) => {
                    Adata.push(data.data[index].value)
                })
                _this.setState({
                    productData: Adata,
                    protocolId: data.data[0].id
                })

            }
        });
    }

    GetDateStr = (AddDayCount) => {
        var dd = new Date();
        dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期  
        var y = dd.getFullYear();
        var m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1);//获取当前月份的日期，不足10补0  
        var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();//获取当前几号，不足10补0  
        return y + "-" + m + "-" + d;
    }
    allChose = () => {
        this.props.form.resetFields(['queryDateBegin','queryDateEnd'])
       
    }
    Chose = (count, v) => {
        const _this = this
        this.props.form.setFieldsValue({
            queryDateBegin: moment(_this.GetDateStr(parseInt(count))),
            queryDateEnd: moment(new Date())
        })
    }

    getAnyList = (page, rows, formValue) => {
        const _this = this
        let forname = null
        if (formValue.type == '用户编号') {
            forname = 'passengerNo'
        } else if (formValue.type == '姓名') {
            forname = 'name'
        } else if (formValue.type == '手机') {
            forname = 'phone'
        } else if (formValue.type == '身份证') {
            forname = 'identityCard'
        }
       
        let labels = ""
        this.state.labels.map((v, index) => {
            if(index == 0){
                if (v == '头等舱') {
                    labels = labels + '10'
                } else if (v == "金银卡") {
                    labels = labels + '9'
                } else if (v == "地方政要") {
                    labels = labels + '4,5'
                } else if (v == "副部级VIP") {
                    labels = labels + '6'
                } else if (v == "持卡用户") {
                    labels = labels + '7,2'
                } else if (v == '银行领导') {
                    labels = labels + '1'
                }
            }else{
                if (v == '头等舱') {
                    labels = labels + ','+ '10'
                } else if (v == "金银卡") {
                    labels = labels + ','+ '9'
                } else if (v == "地方政要") {
                    labels = labels+ ',' + '4,5'
                } else if (v == "副部级VIP") {
                    labels = labels + ','+ '6'
                } else if (v == "持卡用户") {
                    labels = labels + ','+ '7,2'
                } else if (v == '银行领导') {
                    labels = labels + ','+ '1'
                }
            }
        })
        $.ajax({
            type: "GET",
            //url: serveUrl+"list",
            //url: serveUrl+'guest-order/list?access_token=' + User.appendAccessToken().access_token,
            //url:"http://192.168.0.105:8887/getPassengerList?access_token="+User.appendAccessToken().access_token,
            url: serveUrl + 'guest-crm/getPassengerList?access_token=' + User.appendAccessToken().access_token,
            data: {
                page: page,
                rows: rows,
                [forname]:formValue.userNo,
                queryDateBegin:formValue.queryDateBegin == null ?"":moment(formValue.queryDateBegin).format('YYYY-MM-DD'),
                queryDateEnd:formValue.queryDateEnd == null ? "":moment(formValue.queryDateEnd).format('YYYY-MM-DD'),
                clientName:formValue.clientName,
                labels:labels,
            },
            success: function (data) {
               data.data.rows.map((v, index) => {
                    v.key = v.passengerId
                })
                _this.setState({
                    getPassengerList: data.data.rows,
                    getPassengerListLength: data.data.total
                })
            }
        });
    }

    Firstclass = (e, v) => {
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
        const _this = this
        if (e == '头等舱') {
            if (this.state.Firstclass == null) {
                _this.state.labels.push(e)
                _this.setState({
                    Firstclass: 'active'
                })
            } else {
                _this.state.labels.remove(e)
                _this.setState({
                    Firstclass: null
                })
            }

        } else if (e == '金银卡') {
            if (this.state.Goldclass == null) {
                _this.state.labels.push(e)
                _this.setState({
                    Goldclass: 'active'
                })
            } else {
                _this.state.labels.remove(e)
                _this.setState({
                    Goldclass: null
                })
            }

        } else if (e == '地方政要') {
            if (this.state.Localclass == null) {
                _this.state.labels.push(e)
                _this.setState({
                    Localclass: 'active'
                })
            } else {
                _this.state.labels.remove(e)
                _this.setState({
                    Localclass: null
                })
            }

        } else if (e == '副部级VIP') {
            if (this.state.VIPclass == null) {
                _this.state.labels.push(e)
                _this.setState({
                    VIPclass: 'active'
                })
            } else {
                _this.state.labels.remove(e)
                _this.setState({
                    VIPclass: null
                })
            }
        } else if (e == '持卡用户') {
            if (this.state.Cardholderclass == null) {
                _this.state.labels.push(e)
                _this.setState({
                    Cardholderclass: 'active'
                })
            } else {
                _this.state.labels.remove(e)
                _this.setState({
                    Cardholderclass: null
                })
            }
        } else if (e == '银行领导') {
            if (this.state.Bankclass == null) {
                _this.state.labels.push(e)
                _this.setState({
                    Bankclass: 'active'
                })
            } else {
                _this.state.labels.remove(e)
                _this.setState({
                    Bankclass: null
                })
            }
        }

    }



    render() {
        const { startValue, endValue, endOpen } = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };
        const _this = this;
        const columns = [
            {
                title: '用户编号',
                width: '13%',
                render(text, record) {
                    const tagList = record.labalsName.map(data => <span key={data} className="tag-border">{data}</span>);
                    return (
                        <div className="order">
                            <p>{record.passengerNo}</p>
                            <p>{tagList}</p>
                        </div>
                    )
                }
            }, {
                title: '姓名',
                width: '12%',
                dataIndex: 'name',
                render(text, record) {
                    return (
                        <div className="order">{text}</div>
                    )
                }
            }, {
                title: '手机号',
                width: '13%',
                dataIndex: 'phone',
                render(text, record) {
                    return (
                        <div className="order">{text}</div>
                    )
                }
            }, {
                title: '身份证',
                width: '13%',
                dataIndex: 'identityCard',
                render(text, record) {
                    return (
                        <div className="order">{text}</div>
                    )
                }
            }, {
                title: '使用次数',
                width: '12%',
                dataIndex: 'buyTimes',
                render(text, record) {
                    return (
                        <div className="order">{text}</div>
                    )
                }
            }, {
                title: '最后使用时间',
                width: '13%',
                dataIndex: 'createTime',
                render(text, record) {
                    return (
                        <div className="order">{moment(text).format('YYYY-MM-DD hh:mm')}</div>
                    )
                }
            }, {
                title: '来源',
                width: '13%',
                dataIndex: 'clientName',
                render(text, record) {
                    return (
                        <div className="order">{text}</div>
                    )
                }
            }, {
                title: '操作',
                render(text, record) {
                    return (
                        <div className="order">
                            <a href={`#/UserDetail/${record.passengerId}`} style={{ marginRight: 10,color:'#4778c7' }}>查看详情</a>
                        </div>
                    )
                }
            }
        ];
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };
        const pagination = {
            total: this.state.getPassengerListLength,
            onChange(current) {
                const formValue = _this.props.form.getFieldsValue()
                _this.getAnyList(current, _this.state.PassengerListRows, formValue)
            }
        };
        //协议类型下拉菜单
        const Options = this.state.protocolTypeList.map(data => <Option key={data.value} value={data.value.toString()}>{data.text}</Option>);

        return (
            <div>
                <div className="breadcrumb-box">
                    <div className="top-bar"></div>
                    <div className="breadcrumb">
                        <Breadcrumb>
                            <Breadcrumb.Item>CRM</Breadcrumb.Item>
                            <Breadcrumb.Item>智能CRM</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>

                <div className="box">
                    <ul className="tit">
                        <li>
                            <a href="javascript:;" className="active">智能CRM</a>
                        </li>
                    </ul>

                    <div className="crm-box">
                        <Form className="ant-advanced-search-form">
                            <Row>
                                <Col span={8} style={{ marginLeft: 40 }}>
                                    <FormItem label="数据区间" {...formItemLayout}>
                                        {getFieldDecorator("queryDateBegin", {
                                        })(
                                            <DatePicker
                                                format="YYYY-MM-DD"
                                                />
                                            )}
                                    </FormItem>
                                </Col>
                                <Col span={6} style={{ marginLeft: -100 }}>
                                    <FormItem {...formItemLayout}>
                                        {getFieldDecorator("queryDateEnd", {
                                        })(
                                            <DatePicker
                                                format="YYYY-MM-DD"
                                                />
                                            )}
                                    </FormItem>
                                </Col>
                                <Col span={10} style={{ marginLeft: '-5%' }}>
                                    <FormItem {...formItemLayout}>
                                        {getFieldDecorator("chose", {
                                        })(
                                            <div className='tagsClick'>
                                                <a onClick={this.allChose} style={{color:'#4778c7'}}>所有</a>
                                                <a onClick={this.Chose.bind(this, '-30')} style={{color:'#4778c7'}}>近30天</a>
                                                <a onClick={this.Chose.bind(this, '-90')} style={{color:'#4778c7'}}>近90天</a>
                                                <a onClick={this.Chose.bind(this, '-180')} style={{color:'#4778c7'}}>近180天</a>
                                                <a onClick={this.Chose.bind(this, '-360')} style={{color:'#4778c7'}}>近1年</a>
                                            </div>
                                            )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={2} style={{ marginLeft: 35 }}>
                                    <FormItem {...formItemLayout}>
                                        {getFieldDecorator("type", {
                                            initialValue: '用户编号'
                                        })(
                                            <Select>
                                                <Option value="用户编号">用户编号</Option>
                                                <Option value="姓名">姓名</Option>
                                                <Option value="手机">手机</Option>
                                                <Option value="身份证">身份证</Option>
                                            </Select>
                                            )}
                                    </FormItem>
                                </Col>
                                <Col span={9} style={{ marginLeft: -12 }}>
                                    <FormItem {...formItemLayout}>
                                        {getFieldDecorator("userNo", {

                                        })(
                                            <Input style={{ width: 220 }} />
                                            )}
                                    </FormItem>
                                </Col>
                                <Col span={9} style={{ marginLeft: 20 }}>
                                    <FormItem label="客户名称" {...formItemLayout}>
                                        {getFieldDecorator("clientName", {

                                        })(
                                            <AutoComplete
                                                style={{ width: 220 }}
                                                dataSource={this.state.AutoClientList}
                                                onChange={this.customerIdChange}
                                                />
                                            )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem label="用户标签" {...formItemLayout}>
                                        {getFieldDecorator("clientId", {

                                        })(
                                            <ul className="tag">
                                                <li className={this.state.Firstclass} onClick={this.Firstclass.bind(this, '头等舱')}>头等舱</li>
                                                <li className={this.state.Goldclass} onClick={this.Firstclass.bind(this, '金银卡')}>金银卡</li>
                                                <li className={this.state.Localclass} onClick={this.Firstclass.bind(this, '地方政要')}>地方政要</li>
                                                <li className={this.state.VIPclass} onClick={this.Firstclass.bind(this, '副部级VIP')}>副部级VIP</li>
                                                <li className={this.state.Cardholderclass} onClick={this.Firstclass.bind(this, '持卡用户')}>持卡用户</li>
                                                <li className={this.state.Bankclass} onClick={this.Firstclass.bind(this, '银行领导')}>银行领导</li>
                                            </ul>
                                            )}
                                    </FormItem>
                                </Col>
                                <Col span={4} offset={8}>
                                    <button className='btn-small' onClick={this.handleSearch} style={{ marginRight: 5 }}>查询</button>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                    <div className="search-result-list" style={{ marginTop: 16 }}>
                        <Table columns={columns} pagination={pagination} dataSource={this.state.getPassengerList} className="serveTable" />
                        <p style={{marginTop:'20px'}}>共搜索到{this.state.getPassengerListLength}条数据</p>
                    </div>
                </div>
            </div>
        )
    }
}

CRMList = Form.create()(CRMList);
export default CRMList;

