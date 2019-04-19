// pages/situations/situations.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    question: [],
    length: 0,
    index: 0,
    options: ["optionA", "optionB", "optionC", "optionD", "optionE", "optionF"],
    nextW: { text: "下一题", src: "../images/right.png" },
    lastW: { text: "上一题", src: "../images/left.png" },
  },

  //跳转到下一题
  goToNext: function() {
    if(this.data.index+1 == this.data.length) {
      wx.navigateBack({
        delta: 1,
      });
    } else {
      this.setData({
        index: this.data.index + 1
      });
    }
  },

  goToLast: function() {
    if(this.data.index == 0) {
      wx.navigateBack({
        delta: 1,
      });
    } else {
      this.setData({
        index: this.data.index - 1
      });
    }
  },

  //
  getWidth: function (e) {
    var width = e.detail.width
    if (width > 100) {
      width = width * 1
    }
    else if (width < 100 && width > 50) {
      width = width * 2
    }
    else if (width < 50) {
      width = width * 3
    }
    this.setData({
      wide: width
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      question: app.globalData.question,
      options: app.globalData.options, 
      length: app.globalData.question.length
    });
  }

})