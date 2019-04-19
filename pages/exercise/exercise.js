// pages/exercise/exercise.js
/**
 * @author csm
 * 练习记录
 */
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
  },

  /** 
   * 跳转函数：点击每条记录之后，跳转到做完题显示结果页面
   */
  toggleResult: function (e) {
    console.log(e.currentTarget.dataset);
    wx.navigateTo({
      url: '../result/result?questionNum=' + e.currentTarget.dataset.questionNum + '&answerUseTime=' + e.currentTarget.dataset.answerUseTime + '&correctRate=' + e.currentTarget.dataset.correctRate + '&answerId=' + e.currentTarget.dataset.answerId + '&grade=' + e.currentTarget.dataset.chapterGrade + '&term=' + e.currentTarget.dataset.chapterTerm
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    console.log(app.globalData.userId)
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
    wx.request({
      url: "#" + app.globalData.userId,
      method: "GET",
      success: function (res) {
        console.log(res)
        var list = res.data.myExerciseRecordList;
        if (list == null) {
          var toastText = "获取数据失败" + res.data.errMsg;
          wx.showToast({
            title: toastText,
            icon: "",
            duration: 2000
          });
        } else {
          that.setData({
            list: list
          });
        }
        console.log(that.data.list);
      }
    })
  },

})