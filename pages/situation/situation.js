// pages/situation/situation.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    question: [],
    index: 0,
    options: ['optionA', 'optionB', 'optionC', 'optionD', 'optionE', 'optionF'], 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var index = options.index;
    var question = app.globalData.question[index-1],
        length = parseInt(question['optionNum']),
        options = this.data.options.slice(0, length);
    this.setData({
      question: question,
      index: index-1,
      options: options
    });
  },
  
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

  shuffle: function () {
    return Math.random() > 0.5 ? 1 : -1
  }

})