/*
 *微信相关操作api
 */
var wechatApi = {};
var config = require('../config/config');
var appID = config.wechat.appID;
var appSecret = config.wechat.appSecret;
var utils = require('./utils');
var sha1 = require('sha1');
var api = {
    accessToken : config.wechat.prefix+"token?grant_type=client_credential",
    upload : config.wechat.prefix+"media/upload?"
}

/**
 * 获取access_token(分享用的)
 * @return {字符串}
 */
wechatApi.updateAccessToken = function(){
    var url = api.accessToken+"&appid="+appID+"&secret="+appSecret+"";
    //console.log(url);
    var option = {
        url : url,
        json : true
    };
    return utils.request(option).then(function(data){
        return Promise.resolve(data);
    })
}

/**
 * 获取jsapi_ticket
 * @return {字符串}
 */
wechatApi.updateJsapiTicket = function(e){
    var url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token="+e+"&type=jsapi"
    //console.log(url);
    var option = {
        url : url,
        json : true
    };
    return utils.request(option).then(function(data){
        return Promise.resolve(data);
    })
}



/**
 * 签名算法
 * @return {字符串}
 */
// 生成签名的时间戳
var createTimestamp = function() {
        return parseInt(new Date().getTime() / 1000) + ''
    }

// 生成签名的随机串
var randomString = function(len) {
    len = len || 16;
    var $chars = '1234567890abcdefghijklmzopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var maxPos = $chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

// 当前网页的URL，不包含#及其后面部分
// var signatureUrl = "http://gdmj.backend.shenzhouxing.com/demo.html"

wechatApi.updateSignature = function(jsapiTicket,signatureUrl){
    var timestamp = createTimestamp()
    var noncestr = randomString()
    var str = "jsapi_ticket="+jsapiTicket+"&noncestr="+noncestr+"&timestamp="+timestamp+"&url="+signatureUrl+"";
    var signature = sha1(str);
    var data={
        timestamp:timestamp,
        noncestr:noncestr,
        signature:signature
    }
    return data
}



module.exports = wechatApi;