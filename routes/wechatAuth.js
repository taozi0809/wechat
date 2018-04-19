var express = require('express');
var router = express.Router();
var request = require('request')
var config = require('../config/config.json')

var demoUrlPre = "http://gdmj.backend.shenzhouxing.com/"
/* GET users listing. */
router.get('/wxLogin', function(req, res, next) {
    /**
     * 1.用户同意授权，获取code
     */
        var redirectUri = encodeURI(demoUrlPre+"/wechatAuth/getAccessToken")
        var snsapiUserinfo = "snsapi_userinfo"
        var getCodeUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+config.wechat.appID+"&redirect_uri="+redirectUri+"&response_type=code&scope="+snsapiUserinfo+"&state=STATE#wechat_redirect"
        res.redirect(getCodeUrl);
});
router.get('/getAccessToken', function(req, res, next) {
    /**
     * 2. 通过code换取网页授权access_token
     */
    var code = req.query.code;
    var getAccessTokenUrl = "https://api.weixin.qq.com/sns/oauth2/access_token?appid="+config.wechat.appID+"&secret="+config.wechat.appSecret+"&code="+code+"&grant_type=authorization_code"
    request.get(getAccessTokenUrl,function(error, response, body){
        if(response.statusCode == 200){
            /**
             * 3.拉取用户信息(需scope为 snsapi_userinfo)
             */
            var data = JSON.parse(body);
            var access_token = data.access_token;
            var openid = data.openid;
            var getUserInfoUrl = "https://api.weixin.qq.com/sns/userinfo?access_token="+access_token+"&openid="+openid+"&lang=zh_CN"
            request.get(getUserInfoUrl,function(error, response, body){
                if(response.statusCode == 200){
                    var userinfo = JSON.parse(body);

                    var openid = userinfo.openid
                    var nickname = userinfo.nickname
                    var sex = userinfo.sex
                    var province = userinfo.province
                    var city = userinfo.city
                    var country = userinfo.country
                    var headimgurl = userinfo.headimgurl
                    var privilege = userinfo.privilege
                    var unionid = userinfo.unionid

                    res.redirect(demoUrlPre+"/demo.html?openid="+openid+"&nickname="+nickname+"&sex="+sex+"&province="+province+"&city="+city+"&country="+country+"&headimgurl="+headimgurl+"&privilege="+privilege+"&unionid="+unionid+"");
                }else{
                    console.log(response.statusCode);
                }
            })
        }else{
            console.log(response.statusCode);
        }
    })

})



module.exports = router;
