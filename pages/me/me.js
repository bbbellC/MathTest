// pages/me/me.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curTab: 1,
    scrollLeft:0
  },

  //底部导航栏
  tabSelect(e) {
    console.log(e);
    if (e.currentTarget.dataset.id == "0") {
      wx.redirectTo({
        url: '/pages/home1/home1',
      })
    } else if (e.currentTarget.dataset.id == "1") {
      wx.redirectTo({
        url: '/pages/me/me',
      })
    }
    this.setData({
      curTab: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  }, 

  //点击关于我们按钮
  goToDev: function() {
    wx.navigateTo({
      url: '../developer/developer',
    })
  },

  //点击反馈按钮
  goToFeedback: function() {
    wx.navigateTo({
      url: '../feedback/feedback',
    })
  },

  //点击个人信息按钮
  goToMy: function () {
    wx.navigateTo({
      url: '../my/my',
    })
  },

  //点击错题记录按钮
  goToWrongs: function() {
    wx.navigateTo({
      url: '../wrongs/wrongs',
    })
  },

  //点击做题记录按钮
  goToExercise: function() {
    wx.navigateTo({
      url: '../exercise/exercise',
    })
  },

  //点击排行榜按钮
  goToRank: function() {
    wx.navigateTo({
      url: '../rank/rank',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: '#',
      method: 'POST',
      data: {
        "openid": app.globalData.openid
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        app.globalData.userId = res.data;
        console.log('获取userId成功:', res.data)
      }
    })
  },

})