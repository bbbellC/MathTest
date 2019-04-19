// pages/my/my.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    nameWarn: "",
    gradeArray: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'],
    gradeIndex: [0],
    sexArray: ['未知', '男', '女'],
    sexIndex: [0]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
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
        that.setData({
          name: res.data[0].realName,
          gradeIndex: res.data[0].grade - 1,
          sexIndex: res.data[0].sex
        })
      }
    })
  },
  save: function () {
    var name = this.data.name,
      grade = parseInt(this.data.gradeIndex) + 1;
    var json = {
      "openid": app.globalData.openid,
      "realName": name,
      "grade": grade
    }
    wx.request({
      url: '#',
      method: 'POST',
      data: json,
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        wx.showToast({
          title: '修改成功！',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },

  bindNameInput: function (e) {
    var name = e.detail.value
    var nameReg = /^[\u4E00-\u9FA5]+$/
    if (!nameReg.test(name)) {
      this.setData({
        nameWarn: "提醒：姓名必须为中文！"
      })
    } else {
      this.setData({
        nameWarn: "",
        name: name
      })
    }
  },

  gradeChange: function (e) {
    this.setData({
      gradeIndex: e.detail.value
    })
  }

})