function TaoUtils(){
    /**
     *  说明：解析url
     *  参数url：要解析的url
     *  返回值{
     *      scheme：通信协议 (常用的http,ftp,maito等)
     *      host：主机 (域名或IP)
     *      port：端口号
     *      path：路径
     *      query：查询（可选，用于给动态网页（如使用CGI、ISAPI、PHP/JSP/ASP/ASP.NET等技术制作的网页）传递参数，可有多个参数，用”&”符号隔开，每个参数的名和值用”=”符号隔开。）
     *      file：文件名
     *      hash：锚点
     *      portocol：协议
     *      relatIve：协议相对 URL
     *      segments：详细的url分段
     *      souurce：完整路径
     *  }
     */
    if(typeof this.parseURL!='function'){
        TaoUtils.prototype.parseURL=function(url){
            var a =  document.createElement('a');
            a.href = url;
            return {
                source: url,
                protocol: a.protocol.replace(':',''),
                host: a.hostname,
                port: a.port,
                query: a.search,
                params: (function(){
                    var ret = {},
                        seg = a.search.replace(/^\?/,'').split('&'),
                        len = seg.length, i = 0, s;
                    for (;i<len;i++) {
                        if (!seg[i]) { continue; }
                        s = seg[i].split('=');
                        ret[s[0]] = s[1];
                    }
                    return ret;
                })(),
                file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
                hash: a.hash.replace('#',''),
                path: a.pathname.replace(/^([^\/])/,'/$1'),
                relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
                segments: a.pathname.replace(/^\//,'').split('/')
            };
        }
    }

    /**
     * 说明：去除字符串两边空格函数
     * 参数str：要去除空格的文本框
     * 返回值：去除空格之后的字符串
     */
    if(typeof this.trim!='function'){
        TaoUtils.prototype.trim=function(str){
            return str.replace(/(^\s*)|(\s*$)/g, "");
        }
    }

    /**
     *
     *  说明：显示错误信息函数
     *  参数obj：出现错误信息的文本框
     *  参数errmsg：错误信息
     */
    if(typeof this.showError!='function'){
        TaoUtils.prototype.showError=function(obj, errmsg){
            console.log(errmsg);
            try{
                obj.focus();
            }catch(e) {

            }
        }
    }

    /**
     * 说明：检查是否为空函数
     * 参数obj：要检查的文本框
     * 返回值：判断结果 true不为空 false为空
     */
    if(typeof this.checkEmpty!='function'){
        TaoUtils.prototype.checkEmpty=function(obj){
            if(obj == "") {
                return false;
            } else {
                return true;
            }
        }
    }

    /**
     * 说明：检查长度函数
     * 参数obj：要检查长度的文本框
     * 参数min：最小长度
     * 参数max：最大长度
     * 返回值：判断结果 true在要求长度中 false超出要求长度
     */
    if(typeof this.checkLength!='function'){
        TaoUtils.prototype.checkLength=function(obj, min, max){
            if(obj.length < min || obj.length > max) {
                return false;
            } else {
                return true;
            }
        }
    }

    /**
     * 说明：下拉列表选中函数
     * 参数obj：要选中的下拉列表
     * 参数selectvalue：标识选中的参数
     */
    if(typeof this.selectitem!='function'){
        TaoUtils.prototype.selectitem=function(obj , selectvalue){
            var options = obj.options;
            for(var i = 0; i < options.length; i++) {
                if(selectvalue == options[i].value) {
                    options[i].selected = true;
                }
            }
        }
    }

    /**
    * 说明：判断value变量值是否是数字
    * 参数value:输入值
    * 返回值：是数字返回true，否则false
    */
    if(typeof this.isNumeric!='function'){
        TaoUtils.prototype.isNumeric=function(value){
            if( value != null && value.length>0 && isNaN(value) == false){
                return true;
            }
            else{
                return false;
            }
        }
    }

    /**
     * 说明：判断value变量值是否是中文
     * 参数value:输入值
     * 返回值：是中文返回false，否则true
    */
    if(typeof this.isChn!='function'){
        TaoUtils.prototype.isChn=function(str){
            var reg = /^([\u4E00-\u9FA5]|[\uFE30-\uFFA0])*$/;
            if(reg.test(str)){
                return true;
            }
            return false;
        }
    }

    /**
     * 说明：对复选框的全选或不选
     * 参数state:输入值 1 全选 2 全部选
     * 返回值：是中文返回false，否则true
     */
    if(typeof this.change!='function'){
        TaoUtils.prototype.change=function(str){
            try{
                var checks=document.getElementsByTagName("input");
                var i=0;
                var length=checks.length;
                var flag=true;
                if(state==1){
                    flag=true;
                }
                if(state==0){
                    flag=false;
                }
                for(i;i<length;i++){
                    if(checks[i].type=="checkbox"){
                        checks[i].checked=flag;
                    }
                }
            }catch(e){
                window.alert(e.message);
            }
        }
    }

    /**
     * 是否是由字母或数字组成的字符串
     * @param {}
     * letVale
     */
    if(typeof this.checkLetOrNum!='function'){
        TaoUtils.prototype.checkLetOrNum=function(letVale){
            var regex = /^([a-zA-Z_]{1})([\w]*)$/g;
            var b = regex.test(letVale);
            return b;
        }
    }

    /**
     * 取字符串的第index的字符
     * @param {}
     * source
     * @param {}
     * index
     */
    if(typeof this.interceptStr!='function'){
        TaoUtils.prototype.interceptStr = function(source, index){
            var temp = source.charAt(index);
            return temp;
        }
    }

    /**判断是否是手机号**/
    if(typeof this.checkPhoneNum!='function'){
        TaoUtils.prototype.checkPhoneNum = function(tel){
            var reg =/^0?1[3|4|5|7|8][0-9]\d{8}$/;
            return reg.test(tel);
        }
    }

    /**判断是不是数字**/
    if(typeof this.isNum!='function'){
        TaoUtils.prototype.isNum = function(num){
            var reNum = /^[0-9]+$/;
            return reNum.test(num);
        }
    }




}