import { API_HOST } from 'config.js';
const Auth = require('auth.js');

// 请求方式为GET
var apiRequest = function(url, data) {
    wx.showLoading({
        title: '加载中',
    })
    setTimeout(function() {
        wx.hideLoading()
    }, 1000)
    var promise = new Promise(function(resolve, reject) {
        wx.request({
            url: API_HOST + url,
            data: data,
            method: 'GET',
            header: { 'content-type': 'application/json' },
            success: resolve,
            fail: reject
        })
    });
    return promise;
};

var apiRequest2 = function(url, data) {
    // wx.showLoading({
    //     title: '加载中',
    // })
    // setTimeout(function() {
    //     wx.hideLoading()
    // }, 1000)
    var promise = new Promise(function(resolve, reject) {
        wx.request({
            url: API_HOST + url,
            data: data,
            method: 'GET',
            header: { 'content-type': 'application/json' },
            success: resolve,
            fail: reject
        })
    });
    return promise;
};

// 请求方式为POST
var apiPost = function(url, data) {
    var promise = new Promise(function(resolve, reject) {
        wx.request({
            url: API_HOST + url,
            data: data,
            method: 'POST',
            success: res => {
                wx.hideLoading();
                resolve(res);
            },
            fail: reject
        })
    });
    return promise;
};

//test
// var apiTest = function(url, data) {
//     var promise = new Promise(function(resolve, reject) {
//         wx.request({
//             url: "https://apple110.wpweixin.com/api/" + url,
//             data: data,
//             method: 'POST',
//             success: resolve,
//             fail: reject
//         })
//     });
//     return promise;
// };

/**
 * 需要授权的接口调用
 * @param  {Function} fn
 * @return {Promise}
 */
var guard = function(fn) {
    console.info(1111)
    const self = this
    return function() {
        if (Auth.check()) {
            console.log(1);
            return fn.apply(self, arguments)
        } else {
            console.log(2);
            return Auth.login()
                .then(data => {
                    return fn.apply(self, arguments)
                })
        }
    }
}



module.exports = {
    apiRequest,
    apiRequest2,
    apiPost,
    // apiTest
    // getRun: getRun,
}