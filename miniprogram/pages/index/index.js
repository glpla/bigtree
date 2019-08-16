// 引入SDK核心类
let QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
// 实例化API核心类
let qqmapsdk = new QQMapWX({
  key: 'U6QBZ-ROQ3W-PFMRZ-O4VA5-LZOKQ-G7FZA'
});
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    openid: 'ofaJG4zF9VE6g206HAu-9zhajhck',
    city: null,
    province: null
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框

          wx.getUserInfo({
            lang: "zh_CN",
            success: res => {
              console.log(res.userInfo)
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
    wx.getLocation({
      type: 'wgs84',
      success: res => {
        // 调用sdk接口
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: res => {
            //获取当前地址成功
            console.log(res);
            this.setData({
              city: res.result.address_component.city,
              province: res.result.address_component.province
            })
          },
          fail: res => {
            console.log('获取当前地址失败');
          }
        });
      },
    })
  },

  onGetUserInfo: function(e) {
    // console.log(e)
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onLogs: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login]: ', res)
        app.globalData.openid = res.result.openid
        if (res.result.openid == this.data.openid) {
          wx.navigateTo({
            url: '../edit/edit',
          })
        } else {
          wx.navigateTo({
            url: '../logs/logs',
          })
        }
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  // onLogs() {
  //   wx.redirectTo({
  //     url: '../logs/logs',
  //   })
  // }
})