const util = require('../../utils/util.js');
const app = getApp();
const db = wx.cloud.database();
Page({
  data: {
    msg: '',
    imgs: [],
    fileID: []
  },
  change(e) {
    console.log(e.detail)
    this.setData({
      msg: e.detail
    })
  },
  uploadImg() {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        this.setData({
          imgs: res.tempFilePaths
        })
      }
    })
  },
  previewImg(e) {
    let src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src,
      urls: this.data.imgs
    })
  },
  submit() {
    wx.showToast({
      title: '提交中',
    })
    let promissAll = []
    this.data.imgs.forEach((item, index) => {
      // console.log(index)
      promissAll.push(
        new Promise((resolve, reject) => {
          wx.cloud.uploadFile({
            cloudPath: index + '.jpg',
            filePath: this.data.imgs[index],
            success: res => {
              // console.log(res.fileID)
              this.setData({
                //数组追加哦,否则后面会覆盖前面
                fileID: this.data.fileID.concat(res.fileID)
              })
              //返回处理结果
              resolve()
            },
            fail: console.error
          })
        })
      )
    })
    Promise.all(promissAll).then(res => {
      //所有的上传都结束了才会执行入库操作
      // console.log('upload done')
      db.collection('daily').add({
          data: {
            time: util.formatTime(new Date()),
            msg: this.data.msg,
            fileID: this.data.fileID
          }
        })
        .then(res => {
          wx.hideToast()
          wx.showToast({
            title: '提交成功',
          })
        })
        .catch(err => {
          console.error(err)
        })
    }).catch()
  },
  history() {
    wx.navigateTo({
      url: '../history/history',
    })
  },
  onLoad: function(options) {
    console.log(util.formatTime(new Date()))
  },

  onReady: function() {

  },


  onShow: function() {

  },


  onHide: function() {

  },


  onUnload: function() {

  },


  onPullDownRefresh: function() {

  },


  onReachBottom: function() {

  },


  onShareAppMessage: function() {

  }
})