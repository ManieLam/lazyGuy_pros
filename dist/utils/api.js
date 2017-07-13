import { API_PATH } from 'config.js';
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
            url: API_PATH + url,
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
            url: API_PATH + url,
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
            url: API_PATH + url,
            data: data,
            method: 'POST',
            success: resolve,
            fail: reject
        })
    });
    return promise;
};

/**
 * 需要授权的接口调用
 * @param  {Function} fn
 * @return {Promise}
 */
const guard = function(fn) {
    console.info(1111)
    const self = this
    return function() {
        if (Auth.check()) {
            return fn.apply(self, arguments)
        } else {
            return Auth.login()
                .then(data => {
                    return fn.apply(self, arguments)
                })
        }
    }
}

export default {
    apiRequest,
    apiRequest2,
    apiPost,
    guard
}