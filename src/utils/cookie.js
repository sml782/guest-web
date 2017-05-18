var CookieUitl = {
    /**
     * 设置cookie
     * @param key cookie名
     * @param value cookie值
     * @param expires 有效时间 number型 如：输入7 表示有效期为7天
     * @param path cookie 路径
     * @param domain 域名
     * @param isSecure 是否安全标志
     */
    setCookie: function(key, value, expires, path, domain, isSecure) {
        var str = encodeURIComponent(key) + "=" + encodeURIComponent(value);

        if (typeof expires == "number") {
            var date = new Date();
            date.setDate(date.getDate() + expires);
            str += ";expires=" + date;
        }
        if (path) {
            str += ";path=" + path;
        }
        if (domain) {
            str += ";domain=" + domain;
        }
        if (isSecure) {
            str += ";secure";
        }

        document.cookie = str;
    },
    removeCookie: function(key) {
        //this 表示当前对象
        this.setCookie(key, "", -1);
    },
    getCookie: function(key) {
        //user=456; user2=abc; user3=123

        //user=周自兴&password=123&name=xxxx; user2=周自兴2&password=456&name=xxxx
        var str = document.cookie;
        //[user=456,user2=abc,user3=123]
        var arr = str.split("; ");

        for (var i = 0; i < arr.length; i++) {
            if (arr[i].indexOf(key) != -1) {
                var temp = arr[i].split("=");
                if (temp[0] == key) {
                    return decodeURIComponent(temp[1]);
                }
            }
        }

        return null;
    },

    /**
     * 从cookie 串中获取子cookie值
     *
     * @param key1 表示第一个key
     * @param key2 后面的子cookie key
     * @returns {*}
     */
    //sno_123=name=苹果&price=5&num=2;
    getCookieFromMulti: function(key1, key2) {
        //周自兴2&password=456&name=xxxx
        var value1 = CookieUitl.getCookie(key1);
        //[周自兴2, password=456,name=xxxx]
        if (!value1) {
            return;
        }
        var valueArr = value1.split("&");

        if (!key2) {
            return valueArr[0];
        }
        for (var i = 0; i < valueArr.length; i++) {
            //password=456
            if (valueArr[i].indexOf(key2) != -1) {
                //valueArr[i]--password=456
                // [password, 456]
                var tempArr = valueArr[i].split("=");
                //tempArr[0]--password  key--password
                if (tempArr[0] == key2) {
                    //456
                    return decodeURIComponent(tempArr[1]);
                }
            }
        }
        return null;
    },

    //sno_123=name=苹果&price=5&num=2;
    setCookieAtMulti: function(key1, key2, value, expires) {
        //name=苹果&num=2&price=5
        var val = this.getCookie(key1);
        //[name=苹果,num=2,tnum=4, price=5]
        var subValList = val.split("&");

        for (var i = 0; i < subValList.length; i++) {
            if (subValList[i].indexOf(key2) != -1) {
                //num=2
                var temp = subValList[i].split("=");
                if (temp[0] == key2) {
                    subValList[i] = key2 + "=" + value;
                    //[name=苹果,num=2,tnum=4, price=5]
                    //转为 name=苹果&num=2&tnum=4&price=5
                    val = subValList.join("&");
                    this.setCookie(key1, val, expires || 7);
                    break;
                }
            }

        }

    }

}
export default CookieUitl;
