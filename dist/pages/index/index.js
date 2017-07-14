const Api = require("../../utils/api.js");
const Auth = require("../../utils/auth.js");
const App = getApp();
let that;
Page({
    data: {
        share_title: '转发到微信群PK,让群里谁最懒的发红包',
        single: true,
        selfStep: {},
        stepData: [],
        stepList: [],
        adds: {}, //广告
    },

    onLoad: function(options) {
        // 页面初始化 options为页面跳转所带来的参数
        that = this;

    },
    getLogin() {
        if (Auth.check()) {
            that.getRun();
        } else {
            Auth.login().then(data => {
                that.getRun();
            })
        }
    },
    getRun() {
        //获取运动数据
        that.setData({ userData: wx.getStorageSync("user") })
        let getRunTime = parseInt(wx.getStorageSync("getRunTime"), 10)
        console.log("getrun:", getRunTime, "|||", Date.now());
        // wx.showLoading({title:"拼命加载中"});

        wx.login({
            fail: e => {
                console.log("login::", e);
                wx.hideLoading()
            },
            success: data => {
                App.globalData.code = data.code;
                if (App.globalData.scene == 1044) { that.getGroup(); }
                if (getRunTime && Date.now() < getRunTime) return;
                wx.getWeRunData({
                    success: res => {
                        Api.apiPost("weixin.run.json", {
                            encrypted_data: res.encryptedData,
                            iv: res.iv,
                            code: App.globalData.code,
                        }).then(suc => {
                            console.log("222", suc);
                            if (suc.data.errcode == 0) {
                                console.log(111);
                                let result = suc.data.step_info.stepInfoList;
                                that.setData({
                                    selfStep: result[result.length - 1].step,
                                    getRunTime: result[result.length - 1].timestamp,
                                });
                                wx.setStorageSync("selfStep", result[result.length - 1].step);
                                wx.setStorageSync("getRunTime", parseInt(result[result.length - 1].timestamp, 10) * 1000 + 24 * 3600 * 1000) //记录过期时间
                            }

                        });
                    },
                })
            }
        })

    },

    getGroup() {
        //获取群信息
        console.log("getGroup:shareTicket::", App.globalData.shareTicket);
        wx.getShareInfo({
            shareTicket: App.globalData.shareTicket,
            success: res => {
                Api.apiPost("group.lazy.men.json", {
                    encrypted_data: res.encryptedData,
                    iv: res.iv,
                    code: App.globalData.code,
                }).then(result => {
                    console.log("getGroup:suc:", result);
                });
            },
            fail: err => {
                console.log("group:fail:", err);
                wx.hideLoading();
            }
        });
    },

    previewImageTap: function(e) {
        if (wx.navigateToMiniProgram) {
            wx.navigateToMiniProgram({
                appId: this.data.weapp.appid,
                path: this.data.weapp.path,
                envVersion: this.data.weapp.version,
                success(res) {
                    // 打开成功
                    console.log('跳转成功');
                }
            })
        } else {
            console.log("不兼容程序跳转")
            wx.previewImage({
                current: this.data.adds,
                urls: [this.data.adds]
            })
        }
    },
    onReady: function() {
        // 页面渲染完成

    },
    onShow: function() {
        // 页面显示
        wx.showShareMenu({ withShareTicket: true });
        that.setData({
            scene: App.globalData.scene,
            isGroup: App.globalData.scene == 1044 ? true : false,
            selfStep: wx.getStorageSync("selfStep"),
        });
        console.log(that.data.selfStep);
        // that.getRun();

        that.getLogin();
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