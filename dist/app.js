//app.js
import Auth from "utils/auth"

App({
    onLaunch: function(options) {},

    onShow: function(options) {
        this.globalData.scene = options.scene

        if (options.scene == 1044) {
            this.globalData.shareTicket = options.shareTicket
        }

    },

    // getUserInfo: function(cb) {
    //     var that = this
    //     if (this.globalData.userInfo) {
    //         typeof cb == "function" && cb(this.globalData.userInfo)
    //     } else {
    //         //调用登录接口
    //         wx.login({
    //             success: function() {
    //                 wx.getUserInfo({
    //                     success: function(res) {
    //                         that.globalData.userInfo = res.userInfo
    //                         typeof cb == "function" && cb(that.globalData.userInfo)
    //                     }
    //                 })
    //             }
    //         })
    //     }
    // },

    globalData: {
        userInfo: null,
        // deviceInfo: null,
        shareTicket: null,
        scene: 0,
        // API_PATH: 'https://apple110.wpweixin.com'
    }
})