import React from 'react';
import { hashHistory } from 'react-router';
import {Form, Row, Col, Input, Button, Icon,Select,message,Radio,Breadcrumb,Table,Popconfirm,Modal,Checkbox} from 'antd';
import { Link} from 'react-router';
import $ from 'jquery';
import { serveUrl, User, cacheData,getCookie} from '../../utils/config';
import DeleteDialog from '../DeleteDialog';//引入删除弹框

const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const RadioGroup = Radio.Group;
const msg = '确认删除该产品吗?';
const url = "http://192.168.1.145:8887/";

class LoungeList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            VIPLoungeList:[],
            loungeListDateLength: null,
            loungeListDateCurrent: 1,
            loungeListDatePageSize: 10,
            // visible:false,
            loungeId:null,
            loungeIds:[],
            VIPLoungeData:[],
            indexList:[],
            username:''           
        }
    }
    componentWillMount() {
         if(User.isLogin()){
        } else{
            hashHistory.push('/login');
        }
        this.setState({
            username:cacheData.get('username')
        })
        this.getInitList(this.state.loungeListDateCurrent, this.state.loungeListDatePageSize);
    }
    componentDidMount = () => {
        $(".ant-modal-footer").hide();
        $(".ant-modal-content").css({ width: 700 });
        // $(".ant-modal-content").css({webkitTransform: 'translate(-50%,-50%)'});
    }
    //分页的显示与隐藏
    componentDidUpdate=()=>{
        $(".ant-table-tbody tr td").css({borderBottom:'none'});
        $("table").css({border:'1px solid #f0f0f0'});
        $(".ant-pagination-options").hide();
    }
    //初始获取贵宾厅列表
    getInitList=(page,rows)=>{
        const _this = this;
        $.ajax({
            type: "GET",
            url: serveUrl + "guest-service/getServNameAndPositionNum",
            data: {access_token: User.appendAccessToken().access_token,typeId:5,isShowAll:true},
            success: function (data) {
                if (data.status == 200) {
                    data.data.map(data=>{
                        data.key = data.servId;
                    });
                    _this.setState({
                        VIPLoungeList:data.data
                    });
                }
            }
        });
    }

    //获取选中服务数组
    onChange = (record, index,e) => {
        //e为事件源对象,record为该条数据
        const loungeIds = this.state.loungeIds;
        const indexList = this.state.indexList;
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
        if (e.target.checked) {
            loungeIds.push(record.servId);
            indexList.push(index);
            this.state.VIPLoungeData.push(record);
        } 
        else {
            let num = null;
            for(let i =0;i<this.state.VIPLoungeData.length;i++){
                if(this.state.VIPLoungeData[i].servId == record.servId){
                    num = i;
                    this.state.VIPLoungeData.splice(num, 1);
                    loungeIds.remove(record.servId);
                    indexList.remove(index);
                    // return;
                }
            }
        }
        this.setState({
            loungeIds:loungeIds,
            indexList:indexList
        });
    }
    
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };
        const _this = this;
        // const pagination = {
        //     total: this.state.loungeListDateLength,
        //     showSizeChanger: true,
        //     onShowSizeChange(current, pageSize) {
        //         _this.state.loungeListDateCurrent = current;
        //         _this.state.loungeListDatePageSize = pageSize;
        //         _this.getInitList(_this.state.loungeListDateCurrent,_this.state.loungeListDatePageSize);
        //     },
        //     onChange(current) {
        //         _this.state.loungeListDateCurrent = current;
        //         _this.getInitList(_this.state.loungeListDateCurrent,_this.state.loungeListDatePageSize);
        //     }
        // };
        const columns = [
            {
                title: '选择',
                render(text, record,index) {
                    return (
                        <div className="order">
                            <Checkbox onChange={_this.onChange.bind(_this,record,index)}></Checkbox>
                        </div>
                    )
                }
            },{
                title: '休息室编号',
                width: '33%',
                dataIndex: 'no',
                render(text, record) {
                    return (
                        <div className="order">
                            {text}
                        </div>
                    )
                }
            }, {
                title: '休息室名称',
                width: '33%',       
                dataIndex: 'name',
                render(text, record) {
                    return (
                        <div className="order">{text}</div> 
                    )
                }
            }
        ];

        return (
                <div >
                    <span style={{marginRight:10}}>当前用户</span>
                    <span>{getCookie('user')}</span>
                    <Table columns={columns} dataSource={this.state.VIPLoungeList} className="serveTable" />
                    <FormItem wrapperCol={{ span: 6, offset: 9 }} style={{ marginTop: 24 }}>
                        <button style={{marginTop:50}} className="btn" onClick={data=>{
                            const _this = this;
                            $.ajax({
                                type: "POST",
                                contentType: 'application/json;charset=utf-8',
                                url: serveUrl + "guest-service/setDefaultRoom?access_token=" + User.appendAccessToken().access_token,
                                data: JSON.stringify({
                                    data:_this.state.loungeIds
                                }),
                                success: function (data) {
                                    if (data.status == 200) {
                                        _this.props.confirmSelect(_this.state.loungeIds,_this.state.indexList);
                                        // _this.getInitList(_this.state.productListDateCurrent, _this.state.productListDatePageSize);
                                    }
                                }
                            });
                        }}>确认选择</button>
                    </FormItem>
                </div>
        )
    }
}

LoungeList = Form.create()(LoungeList);
export default LoungeList;

