// pages/feedback/feedback.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: null
  },
  bindFormSubmit: function(e) {
    var json = {
      "userId": app.globalData.userId,
      "feedbackContent": e.detail.value.textarea
    }
    console.log(json)
    wx.request({
      url: '#',
      data: json,
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success(res) {
        console.log(res)
        wx.showModal({
          title: '',
          content: '成功提交！感谢您的反馈！',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              wx.navigateBack({
                delta: 1,
                success: function () {
                  console.log("success");
                },
                fail: function () {
                  console.log("fail");
                },
                complete: function () {
                  console.log("complete");
                }
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        
      }
    })
  }

})