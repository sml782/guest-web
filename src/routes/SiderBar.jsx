import React from 'react';
import { hashHistory } from 'react-router';
import { Link} from 'react-router'
import { Menu, Icon, Switch,Dropdown,Modal } from 'antd';
import { serveUrl, User, cacheData,getCookie} from '../utils/config';
import $ from 'jquery';
import UpdatePwd from './UpdatePwd';//引入修改密码框
const SubMenu = Menu.SubMenu;

const ACTIVE = { color: 'red' };

class SiderBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            current: '1',
            openKeys: ['sub1'],
            username: '',
            siderBar:[],
            visible:false,
            status:true,
            png:0,
        }
    }

    handleClick = (e) => {
        this.setState({
            current: e.key
        })
    }
    onOpenChange = (openKeys) => {
        const state = this.state;
        const latestOpenKey = openKeys.find(key => !(state.openKeys.indexOf(key) > -1));
        const latestCloseKey = state.openKeys.find(key => !(openKeys.indexOf(key) > -1));

        let nextOpenKeys = [];
        if (latestOpenKey) {
            nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
        }
        if (latestCloseKey) {
            nextOpenKeys = this.getAncestorKeys(latestCloseKey);
        }
        this.setState({ openKeys: nextOpenKeys });
    }
    getAncestorKeys = (key) => {
        const map = {};
        return map[key] || [];
    }

    componentWillMount() {
        if (User.isLogin()) {
            
        } else {
            hashHistory.push('/login');
        }
        this.setState({
            username:cacheData.get('username')
        })
        const _this = this
        $.ajax({
            type: "GET",
            url: serveUrl+"guest-role/getMenuByUserId",
            //url:"http://192.168.1.199:8887/getMenuByUserId?access_token="+User.appendAccessToken().access_token,
            data:{access_token:User.appendAccessToken().access_token},
            success: function(data){
                
                _this.setState({
                    siderBar:data.data
                })
            }
        })
           $.ajax({
            type: "GET",
            url: serveUrl+'guest-order/getAirportCode?access_token='+ User.appendAccessToken().access_token,
            //url:"http://192.168.1.199:8887/getAirportCode?access_token="+User.appendAccessToken().access_token,
            success: function(data){
                let url;
                if(data.data.airportCode == 'SHA'){
                    _this.setState({
                        png:1
                    })
                }else{
                    _this.setState({
                        png:0
                    })
                
                }
            }
        })
        
    }

    componentDidMount = () => {
        $(".ant-menu-submenu-horizontal").css({marginRight:30});
        $(".ant-dropdown-link").css({color:'#333'});
        $(".ant-dropdown-menu").css({marginTop:100});
    }

    componentDidUpdate=()=>{
        $(".update-pwd .ant-dropdown-menu-item").css({width: 110,marginLeft: -20,textAlign: 'center',marginTop: 8});
        // $(".update-pwd").onMourseO
    }

    showModal=()=>{
        this.setState({
            visible: true
        });
    }
    handleOk = () => {
        this.setState({
            confirmLoading: true,
        });
        setTimeout(() => {
            this.setState({
                visible: false,
                confirmLoading: false,
            });
        }, 2000);
    }
    handleCancel = () => {
        this.setState({
            visible: false
        });
    }
    confirmUpdatePwd=()=>{
        this.setState({
            visible: false
        });
    }

    loginOut = () =>{
        const _this = this
        $.ajax({
            type: "GET",
            url: serveUrl+'guest-order/getAirportCode?access_token='+ User.appendAccessToken().access_token,
            //url:"http://192.168.1.199:8887/getAirportCode?access_token="+User.appendAccessToken().access_token,
            success: function(data){
                let url;
                if(data.data.airportCode == 'SHA'){
                    url = '/login'+data.data.airportCode;
                    _this.setState({
                        png:1
                    })
                }else{
                    url = '/login';
                    _this.setState({
                        png:0
                    })
                
                }
                User.logout();
                hashHistory.push(url);
            }
        })
    }

    scrollTopChange = (event) =>{  
        this.setState({scrollTop: $('.right-box')[0].scrollTop}); 
        if($('.right-box')[0].scrollTop >= 167){
            $('.title-fix').addClass('displayBlock')
        }else{
            $('.title-fix').removeClass('displayBlock')
        }
    }

    mouseShow=()=>{
        $(".update-password").show();
    }

    mouseHide=()=>{
        $(".update-password").hide();
    }
  
    render() {
        const siderBarOP = this.state.siderBar.map((v, index) => {
            const className='iconfont '+v.type;
            const key='sub' + v.menuId;
            let  childrens
            if(v.children !== null){
                 childrens = v.children.map((v,index) => <Menu.Item className='menuLiBg wordWhite'  key={v.menuId}><Link to={v.url}>{v.name}</Link></Menu.Item>)
            }
            return(
                <SubMenu key={key} className='borderBottom '  title={<span style={{color:'white'}}><i className={className} style={{width:20,marginTop:4}}></i><span style={{marginLeft:10,color:'white'}}>{v.name}</span></span>}>
                    {childrens}
                </SubMenu>
            )
        })
    
        return (
            <div>
                <div id="leftMenu" style={{overflowX:'auto'}}>
                    <div style={{marginBottom:28,marginTop:28}}>
                        <img src={this.state.png==0? require('../assets/images/logo2.png'):require('../assets/images/icon.png')} width="70" id="logo" />
                        <h3 className='wordWhite' style={{ paddingBottom: 8, marginLeft: 58, marginTop: -15 }}>{this.state.png==0?'丽江百事特':'贵宾云1.0'}</h3>
                    </div>
                    
                    <Menu theme="dark"
                        onClick={this.handleClick}
                        style={{ width: 185}}
                        mode="inline"
                        onOpenChange={this.onOpenChange}
                        openKeys={this.state.openKeys}
                        selectedKeys={[this.state.current]}
                        className='menuBg '
                        >
                        {siderBarOP}
                    </Menu>
                </div>
                <div id="rightWrap" >
                    <Menu mode="horizontal" className='rightTop' id='rightTop'>
                        <SubMenu  title={<Link to="" className='word333' style={{left:80}} onClick={this.loginOut}>退出</Link>}>
                        </SubMenu>
                        <SubMenu title={
                            <div className="update-pwd" onMouseOver={this.mouseShow} onMouseOut={this.mouseHide} style={{position:'relative'}}>
                                <div onClick={this.showModal} className="update-password">修改密码</div>
                                <span className='word333' className="ant-dropdown-link">
                                    {getCookie('user')}
                                </span> 
                            </div>
                        }>
                        </SubMenu>
                    </Menu>
                    <div className="right-box" onScroll={this.scrollTopChange}>
                        {this.props.children}
                    </div>
                </div>
                <Modal title="修改密码"
                    key={Math.random() * Math.random()}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    confirmLoading={this.state.confirmLoading}
                    onCancel={this.handleCancel}
                    >
                    <div>
                        <UpdatePwd  confirmUpdatePwd={this.confirmUpdatePwd}/>
                    </div>
                </Modal>
            </div>
        )
    }
}
export default SiderBar;