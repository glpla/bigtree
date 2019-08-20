// 引入SDK核心类
let QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
// 实例化API核心类
let qqmapsdk = new QQMapWX({
  key: 'U6QBZ-ROQ3W-PFMRZ-O4VA5-LZOKQ-G7FZA'
});
let db = wx.cloud.database()
Page({


  data: {
    city: "",
    prov: ""
  },
  del() {
    wx.cloud.callFunction({
      name: 'db-item-del'
    }).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  },
  onLoad: function(options) {
    wx.getLocation({
      type: 'wgs84',
      success: res => {
        // console.log('wx.getLocation')
        // console.log(res)

        // 调用sdk接口
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: res => {
            //获取当前地址成功
            // console.log('reverse GEO');
            // console.log(res);
            this.setData({
              city: res.result.address_component.city
            })
          },
          fail: res => {
            console.log('获取当前地址失败');
          }
        });
      },
    })

    // qqmapsdk.search({
    //   keyword: '酒店',
    //   success: function(res) {
    //     console.log('ok');
    //     console.log(res);
    //   },
    //   fail: function(res) {
    //     console.log(res);
    //   },
    //   complete: function(res) {
    //     console.log('done');
    //     console.log(res);
    //   }
    // });
  }
})