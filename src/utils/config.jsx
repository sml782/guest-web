// const serveUrl='http://ifeicloud.zhiweicloud.com/';
const serveUrl='https://api.iairportcloud.com/';
// const serveUrl='http://101.37.106.176/';
const userMsg = {};
const billClient={};


let protocolMsg = {};
let newAddFlag = {};//判断该协议产品是否新增，0为原有协议产品，1相反
let loginFlag = {};//判断是否登录

function formatDateTime(inputTime) {
    let date = new Date(inputTime);
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    let d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    let h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    let minute = date.getMinutes();
    let second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
};
function getCookie(name){
    var start = document.cookie.indexOf(name + "=");
    var len = start + name.length + 1;
    if ((!start) && (name != document.cookie.substring(0, name.length))) {
        return null;
    }
    if (start == -1) return null;
    var end = document.cookie.indexOf(';', len);
    if (end == -1) end = document.cookie.length;
    return unescape(document.cookie.substring(len, end));
}
function setCookie(name, value, expires){
    var today = new Date();
    today.setTime(today.getTime());
    if (expires) {
        expires = expires * 1000 * 60 * 60 * 24;
    }
    var expires_date = new Date(today.getTime() + (expires));
    document.cookie = name + '=' + escape(value) +
        ((expires) ? ';expires=' + expires_date.toGMTString() : '')  //expires.toGMTString() 
    // ((path) ? ';path=' + path : '') +
    // ((domain) ? ';domain=' + domain : '') +
    // ((secure) ? ';secure' : '');
}

function defaultEvent(){
       document.onkeydown = (e)=>{
            var target, code, tag;    
            if (!event) {    
                event = window.event; //针对ie浏览器    
                target = event.srcElement;    
                code = event.keyCode;    
                if (code == 13) {    
                    tag = target.tagName;    
                    if (tag == "TEXTAREA") { return true; }    
                    else { return false; }    
                }    
            }    
            else {    
                target = event.target; //针对遵循w3c标准的浏览器，如Firefox    
                code = event.keyCode;    
                if (code == 13) {    
                    tag = target.tagName;    
                    if (tag == "INPUT") { return false; }    
                    else { return true; }    
                }    
            }  
        }
}

 

const FieldName = {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    TOKEN_EXPIRE: 'expires_in',
    LAST_LOGIN_TIME: 'last_login_time',
    LAST_REFRESH_TIME: 'last_refresh_time',
}

//本地存储
var CacheClass = function() {
    this.set = function(key, value) {
        if (typeof value == 'object') {
            value = JSON.stringify(value);
        }
        localStorage.setItem(key, value);
    }
    this.get = function(key) {
        return localStorage.getItem(key);
    }
    this.remove = function(key) {
        localStorage.removeItem(key);
    }
}
var cacheData = new CacheClass();

//用户信息
var userClass = function() {
    var accessToken = cacheData.get(FieldName.ACCESS_TOKEN);
    var expire;
    var lastLoginTime;

    this.appendAccessToken = function(json) {
        if (!json) {
            json = {}
        }
        json['access_token'] = getAccessToken();
        return json;
    }

    this.getAccessToken = function() {
        return cacheData.get(FieldName.ACCESS_TOKEN);
    }

    this.login = function(data) {
        accessToken = data[FieldName.ACCESS_TOKEN];
        cacheData.set(FieldName.ACCESS_TOKEN, data[FieldName.ACCESS_TOKEN]);
        cacheData.set(FieldName.TOKEN_EXPIRE, data[FieldName.TOKEN_EXPIRE]);
        lastLoginTime = (new Date()).getTime();
        cacheData.set(FieldName.LAST_LOGIN_TIME, lastLoginTime);
    }

    this.isLogin = function() {
        if (!getAccessToken()) {
            return false;
        }
        else {
            init();
            var currentTime = (new Date()).getTime();
            if (currentTime - lastLoginTime >= expire * 1000) {
                this.logout();
                return false;
            }
            return true;
        }
    }

    this.logout = function() {
        accessToken = '';
        localStorage.removeItem('access_token');
        localStorage.removeItem('expires_in');
        localStorage.removeItem('last_login_time');
        localStorage.removeItem('username');
    }

    init();

    function getAccessToken() {
        return cacheData.get(FieldName.ACCESS_TOKEN);
    }

    function init() {
        expire = parseInt(cacheData.get(FieldName.TOKEN_EXPIRE));
        lastLoginTime = parseInt(cacheData.get(FieldName.LAST_LOGIN_TIME));
    }
    }
    var User = new userClass();

    Array.prototype.unique = function(key) {
        var arr = this;
        var n = [arr[0]];
        for (var i = 1; i < arr.length; i++) {
            if (key === undefined) {
                if (n.indexOf(arr[i]) == -1) n.push(arr[i]);
            } else {
                inner: {
                    var has = false;
                    for (var j = 0; j < n.length; j++) {
                        if (arr[i][key] == n[j][key]) {
                            has = true;
                            break inner;
                        }
                    }
                }
                if (!has) {
                    n.push(arr[i]);
                }
            }
        }
        return n;
    }

    export default {
        formatDateTime,serveUrl,cacheData,User,protocolMsg,newAddFlag,loginFlag,userMsg,getCookie,setCookie,billClient,defaultEvent
    };
