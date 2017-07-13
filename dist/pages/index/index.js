const Api = require("../../utils/api.js");
const Auth = require("../../utils/auth.js");
const App = getApp();
let that;
Page({
    data: {
        share_title: '转发到微信群PK,让群里谁最懒的发红包',
        single: true,
    },

    onLoad: function(options) {
        // 页面初始化 options为页面跳转所带来的参数
        that = this;

    },
    getRun() {
        //获取运动数据

    },
    onReady: function() {
        // 页面渲染完成

    },
    onShow: function() {
        // 页面显示
        wx.showShareMenu({ withShareTicket: true });
        this.setData({ scene: App.globalData.scene });
        Api.guard(that.getRun());
    },
    onHide: function() {
        // 页面隐藏
    },
    onUnload: function() {
        // 页面关闭
    },
    // 分享页面功能
    onShareAppMessage: function() {
        return {
            title: '本群懒人排行榜，最懒的发红包！',
            path: '/pages/index/index',
            success(res) {
                console.log('share', res)
            }
        }
    },
})