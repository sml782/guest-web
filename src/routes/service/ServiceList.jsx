import './service.less';
import React from 'react';
import { hashHistory } from 'react-router';
import {Breadcrumb,Form, Row, Col, Input, Button, Icon,Select,Popconfirm,message,Table,Menu,Modal} from 'antd';
import { Link} from 'react-router';
import $ from 'jquery';
import { serveUrl, User, cacheData} from '../../utils/config';
import VIPLoungeList from './VIPLoungeList';//贵宾厅列表
import VIPShuttleBusList from './VIPShuttleBusList';//VIP摆渡车列表
import ShuttleMachineList from './ShuttleMachineList';//迎送机陪同列表
import ParkingList from './ParkingList';//停车场列表
import LoungeList from './LoungeList';//休息室列表
import SecurityChannelList from './SecurityChannelList';//安检通道列表
import RemoteBoardGateList from './RemoteBoardGateList';//远机位摆渡车列表

const url = 'http://192.168.1.130:8887/';
const SubMenu = Menu.SubMenu;
const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const msg = '确认删除该服务吗?';
let openKeys = [];

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
            menuList:[],
            key:1,//当前显示服务类别标识
            serviceList:[],//具体服务的列表
            serviceListLength:null,
            serviceListPage:1,
            serviceListRows:10,
            record:null,
            visible11:false,
            servId:null,
            categoryListPage:1,
            categoryListRows:10,
            categoryListLength:null

        };
    }

    componentWillMount() {
        if (User.isLogin()) {
        } else {
            hashHistory.push('/login');
        }
        const _this = this;
        //获取服务菜单
        $.ajax({
            type: "GET",
            url: serveUrl + "guest-service/service-menu-list",
            // url:url+'service-menu-list',
            data: { access_token: User.appendAccessToken().access_token},
            success: function (data) {
                if (data.status == 200) {
                    _this.setState({
                        menuList: data.data,
                    });
                }
            }
        });
        //获取服务分类列表
        $.ajax({
            type: "GET",
            url: serveUrl + "guest-service/service-type-allocation-list",
            data: { access_token: User.appendAccessToken().access_token,page:_this.state.categoryListPage,rows:_this.state.categoryListRows},
            success: function (data) {
                if (data.status == 200) {
                    data.data.rows.map(data=>{
                        data.key = data.typeId;
                    });
                    _this.setState({
                        categoryList: data.data.rows,
                        categoryListLength:data.data.total
                    });
                }
            }
        });
    }

    componentDidMount=()=>{
        
        $(".ant-breadcrumb-separator").html(">");
        $(".ant-breadcrumb-separator").css({color:'#333'});
        const height = $(".right-content").css('height');
        const height1 = $(".mid-box-sidebar").css('height');
        if(height>height1){
            $(".mid-box-sidebar").css({height:height});
        }
        else{
            $(".right-content").css({height:height1});
        }
        $(".tit li").on("click",function(){
            $(this).find("a").addClass("active").parents("li").siblings().find("a").removeClass("active");
            
            if($(this).index() == 0){
                $(".base-service").show();
                $(".service-sort").hide();
            }
            else{
                $(".base-service").hide();
                $(".service-sort").show();
            }
        })
    }

    //分页的显示与隐藏
    componentDidUpdate=()=>{
        //服务分类的显示与隐藏
        // if (this.state.categoryListLength <= 10) {
        //     $(".service-sort").find('.ant-pagination').hide();
        // }
        // else {
        //     $(".service-sort").find('.ant-pagination').show();
        // }
        // $(".ant-pagination-item-active").css({backgroundColor:'#4778c7',borderColor:'#4778c7'});
        $(".ant-table-tbody tr td").css({borderBottom:'none'});
        $("table").css({border:'1px solid #f0f0f0'});
        $(".ant-pagination-options").hide();
    }

    //内容区侧导航点击
    click = (e) => {
        this.state.key = e.key;
        this.setState({
            key:this.state.key
        });
        $(".sub-service").eq(e.key-1).show().siblings().hide();
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };
        const _this = this;
        
        const columnsSort = [
            {
                title: '大类',
                width: '33%',
                dataIndex: 'category',
                render(text, record) {
                    return (
                        <div className="order">{text}</div>
                    )
                }
            }, {
                title: '类别',
                width: '33%',
                dataIndex: 'type',
                render(text, record) {
                    return (
                        <div className="order">{text}</div>
                    )
                }
            }, {
                title: '备注说明',
                dataIndex: 'description',
                render(text, record) {
                    return (
                        <div className="order">{text}</div>
                    )
                }
            }
        ];

        const { selectedRowKeys } = this.state;

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };

        const paginationCategory = {
            total: this.state.categoryListLength,
            showSizeChanger: true,
            onShowSizeChange(current, pageSize) {
                _this.state.categoryListPage = current;
                _this.state.categoryListRows = pageSize;
            },
            onChange(current) {
                _this.state.categoryListPage = current;
            }
        };
        const sidebarOption = this.state.menuList.map(data=>{
            const key='menu' + data.typeId;
            openKeys.push(key);
            const childrens = data.serviceTypeList.map(data => <Menu.Item key={data.id}>{data.value}</Menu.Item>)
            return(
                <SubMenu key={key}  title={<span><span>{data.category}</span></span>}>
                    {childrens}
                </SubMenu>
            )
        });
        return (
            <div>
                <div className="breadcrumb-box">
                    <div className="top-bar"></div>
                    <div className="breadcrumb">
                        <Breadcrumb>
                            <Breadcrumb.Item>服务产品</Breadcrumb.Item>
                            <Breadcrumb.Item>基础服务</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
                 <div className="box">
                    <ul className="tit">
                        <li>
                            <a href="javascript:;" className="active">基础服务</a>
                        </li>
                        <li>
                            <a href="javascript:;">服务分类</a>
                        </li>
                    </ul>
                    <div className="mid-box">
                        <div className="base-service">
                            <ul className="tab">
                                <li>服务类别</li>
                                <li>详细服务</li>
                            </ul>
                            <div className="mid-box-content">
                                <div className="mid-box-sidebar">
                                    <Menu
                                        onClick={this.click}
                                        style={{ width: 156 }}
                                        defaultSelectedKeys={['1']}
                                        defaultOpenKeys={openKeys}
                                        mode="inline"
                                        >
                                        {sidebarOption}
                                    </Menu>
                                </div>
                                <ul className="right-content" id="right-content">
                                    <li className="vip-lounge sub-service">
                                        <VIPLoungeList key={this.state.key}/>
                                    </li>
                                    <li className="vip-shuttle-bus sub-service" style={{display:'none'}}>
                                        <VIPShuttleBusList/>
                                    </li>
                                    <li className="shuttle-machine sub-service" style={{display:'none'}}>
                                        <ShuttleMachineList />
                                    </li>
                                    <li className="parking sub-service" style={{display:'none'}}>
                                        <ParkingList />
                                    </li>
                                    <li className="lounge sub-service" style={{display:'none'}}>
                                        <LoungeList />
                                    </li>
                                    <li className="security-channel sub-service" style={{display:'none'}}>
                                        <SecurityChannelList />
                                    </li>
                                    <li className="remote-board-gate sub-service" style={{display:'none'}}>
                                        <RemoteBoardGateList />
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="service-sort" >
                            <p className="msg">服务分类为贵宾基础服务的类别，为可对客户进行销售的服务；如需增加新的类别，请联系运营人员。</p>
                            <div className="categoryList" style={{marginTop:20}}>
                                <Table columns={columnsSort} dataSource={this.state.categoryList} pagination={paginationCategory} className="serveTable" />
                                <p style={{marginTop: 20}}>共搜索到{this.state.categoryListLength}条数据</p>
                            </div>
                        </div>
                    </div>
                 </div>
            </div>
        )
    }
}
ServiceList = Form.create()(ServiceList);

export default ServiceList;

