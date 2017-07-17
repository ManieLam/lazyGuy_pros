const API = require("../../utils/api.js");
const Auth = require("../../utils/auth.js");
const App = getApp();
let that;
Page({
    data: {
        share_title: '转发到微信群PK,让群里谁最懒的发红包',
        single: true,
        scene: getApp().globalData.scene,
        banner: API.getStorageSync('banner'),
        weapp: API.getStorageSync('weapp'),
        selfStep: {}, //个人步数
        stepData: [], //前3名
        stepList: [], //步数列表
        adds: {}, //广告
    },

    onLoad: function(options) {
        // 页面初始化 options为页面跳转所带来的参数
        that = this;
        API.getBanner().then(res => {
            this.setData({
                banner: res.banner,
                weapp: res.weapp
            });
        }, err => {
            console.log('获取Banner失败', res);
        });
    },
    onShow: function() {
        wx.showShareMenu({ withShareTicket: true });
        that.setData({
            scene: getApp().globalData.scene,
            isGroup: getApp().globalData.scene == 1044 ? true : false,
            selfStep: API.getStorageSync("selfStep"),
        });
        console.log("onshow:gid::", getApp().globalData.gid);
        Auth.checkOrLogin().then(user => {
            that.getRun().then(res => {
                if (getApp().globalData.scene == 1044) {
                    this.getGroupRunList().then(res => {
                        console.log("data", res.lazy_men.length);

                        let stepData = (res.lazy_men.length >= 3) ? res.lazy_men.splice(0, 3) : res.lazy_men;

                        if (stepData.length == 1) {
                            stepData = [].concat(stepData, [{}, {}]);
                        } else if (stepData.length == 2) {
                            stepData = [].concat(stepData, [{}]);
                        }

                        if (res.lazy_men.length >= 2) {
                            let temp = stepData[0];

                            stepData[0] = stepData[1];
                            stepData[1] = temp;
                        }


                        let stepList = (res.lazy_men.length >= 3) ? res.lazy_men.splice(3) : [];
                        // console.log(res.lazy_men.splice(0, 1));
                        that.setData({
                            stepList: stepList,
                            stepData: stepData,
                            gid: res.gid
                        })
                        App.globalData.gid = res.gid;

                        console.log("stepList:::", that.data.stepList, that.data.stepData);
                    }, err => {
                        console.log(err);
                    });
                }
            })
        });

    },

    getRun() {
        //获取运动数据
        let getRunTime = parseInt(API.getStorageSync("runtime_expired_in"), 10);
        that.setData({ userData: Auth.user() });
        // console.log("getrun:", getRunTime, "|||", Date.now());
        return new Promise(function(resolve, reject) {
            if (getRunTime && Date.now() < getRunTime) {
                console.log(1111);
                that.setData({ selfStep: wx.getStorageSync("selfStep") });
                resolve('123');
            } else {
                console.log(2222);
                Auth.code().then(code => {
                    wx.getWeRunData({
                        success: function(res) {
                            console.log("rundata::::", res);
                            API.getRunData({ code, iv: res.iv, encrypted_data: res.encryptedData }).then(data => {
                                console.log(data);

                                let result = data.step_info.stepInfoList;
                                that.setData({
                                    selfStep: result[result.length - 1].step,
                                    getRunTime: result[result.length - 1].timestamp,
                                });
                                wx.setStorageSync("selfStep", result[result.length - 1].step);
                                wx.setStorageSync("runtime_expired_in", parseInt(result[result.length - 1].timestamp, 10) * 1000 + 24 * 3600 * 1000) //记录过期时间

                                resolve(res);
                            }, err => {
                                reject(err);
                            });
                        },
                        fail: function(err) {
                            reject(err);
                        }
                    });
                });
            }
        })
    },

    getGroupRunList() {
        //获取群信息
        console.log(" App.globalData.gid:::", App.globalData.gid);
        // console.log("getGroup:shareTicket::", App.globalData.shareTicket);
        if (getApp().globalData.gid) {
            return API.getGroupRunList({ gid: getApp().globalData.gid });
            // return API.post('/api2/group.lazy.men.json', { gid: App.globalData.gid }).then(res => { resolve(res); }, err => { reject(err); })

        } else if (App.globalData.shareTicket) {
            return new Promise(function(resolve, reject) {
                // console.log('shareTicket: ', getApp().globalData.shareTicket);
                Auth.code().then(code => {
                    wx.getShareInfo({
                        shareTicket: getApp().globalData.shareTicket,
                        success: function(res) {
                            API.getGroupRunList({ code, iv: res.iv, encrypted_data: res.encryptedData }).then(res => {
                                resolve(res);
                            }, err => {
                                reject(err);
                            });
                        },
                        fail: function(err) {
                            reject(err);
                        }
                    });
                });
            });
        }

    },

    // 预览图片功能
    previewImageTap: function(e) {
        if (this.data.weapp.appid) {
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
            wx.previewImage({
                current: this.data.banner,
                urls: [this.data.banner]
            })
        }
    },
    onReady: function() {
        // 页面渲染完成

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