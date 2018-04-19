var express = require('express');
var router = express.Router();

var utils = require('../common/utils')
var config = require('../config/config')
var wechatApi = require('../common/wechatapi')
var xml2js = require('xml2js')


// router.post('/postUrlAt', function(req, res, next) {
//     signatureUrl =req.body.url;
//     console.log("signatureUrl:"+signatureUrl)
//     res.send("post success")
//     res.end("yes");
// });
var signatureUrl = "http://gdmj.backend.shenzhouxing.com"

//获取,验证access_token,存入redis中
router.use(function(req, res, next) {

    //根据token从redis中获取access_token
    utils.get(config.wechat.token).then(function(data){
        //获取到值--往下传递
        if (data) {
            return Promise.resolve(data);
        }
        //没获取到值--从微信服务器端获取,并往下传递
        else{
            return wechatApi.updateAccessToken();
        }
    }).then(function(data){
        // console.log(data);
        //没有expire_in值--此data是redis中获取到的
        if (!data.expires_in) {
            console.log('redis获取到值');
            req.accessToken = data;
            /**
             * 获取jsapi_ticket
             */

            utils.get("jsapiTicket").then(function(ret){
                //获取到值--往下传递
                if (ret) {
                    return Promise.resolve(ret);
                }
                //没获取到值--从微信服务器端获取,并往下传递
                else{
                    return wechatApi.updateJsapiTicket(data);
                }
            }).then(function(ret){
                if (!ret.expires_in) {
                    console.log('redis获取到jsapiTicket值');
                    req.wxconfig = wechatApi.updateSignature(ret,signatureUrl)
                    req.jsapiTicket = ret;
                }else{
                    console.log('redis中无值');
                    utils.set("jsapiTicket",ret.ticket,7180).then(function(result){
                        if (result == 'OK') {
                            req.wxconfig = wechatApi.updateSignature(ret.ticket,signatureUrl)
                            req.jsapiTicket = ret.ticket;
                            next();
                        }
                    })
                }
                next();
            })

        }
        //有expire_in值--此data是微信端获取到的
        else{
            console.log('redis中无值');
            /**
             * 保存到redis中,由于微信的access_token是7200秒过期,
             * 存到redis中的数据减少20秒,设置为7180秒过期
             */
            utils.set(config.wechat.token,data.access_token,7180).then(function(result){
                if (result == 'OK') {
                    req.accessToken = data.access_token;
                    /**
                     * 获取jsapi_ticket
                     */
                    utils.get("jsapiTicket").then(function(ret){
                        //获取到值--往下传递
                        if (ret) {
                            return Promise.resolve(ret);
                        }
                        //没获取到值--从微信服务器端获取,并往下传递
                        else{
                            return wechatApi.updateJsapiTicket(data.access_token,signatureUrl);
                        }
                    }).then(function(ret){
                        if (!ret.expires_in) {
                            console.log('redis获取到jsapiTicket值');
                            req.wxconfig = wechatApi.updateSignature(ret)
                            req.jsapiTicket = ret;
                        }else{
                            console.log('redis中无值');
                            utils.set("jsapiTicket",ret.ticket,7180).then(function(result){
                                if (result == 'OK') {
                                    req.wxconfig = wechatApi.updateSignature(ret.ticket,signatureUrl)
                                    req.jsapiTicket = ret.ticket;
                                    next();
                                }
                            })
                        }
                        next();
                    })

                }
            })
        }
    })

})

/* GET home page. */
router.get('/getWechatConfig', function(req, res, next) {
  console.log("access_token:"+req.accessToken,"jsapi_ticket:"+req.jsapiTicket,"wxconfig:"+req.wxconfig)
  res.send(req.wxconfig)
});

module.exports = router;
