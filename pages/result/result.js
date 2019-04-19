// pages/result/result.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    question: "",
    answerId: 0,
    list: [],
    flag: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 从"我的做题记录"页面传参过来：questionNum（题数），answerUseTime（用时），correctRate（正确率），answerId（答题表Id）
    var that = this;
    var grade = "", term = "";

    if(options.answerId) {
      this.setData({
        flag: true
      })
      switch (options.grade) {
        case "1": grade = "一"; break;
        case "2": grade = "二"; break;
        case "3": grade = "三"; break;
        case "4": grade = "四"; break;
        case "5": grade = "五"; break;
        case "6": grade = "六"; break;
      }
      switch (options.term) {
        case "1": term = "上"; break;
        case "2": term = "下"; break;
      }
      this.setData({
        answerId: options.answerId,
        questionNum: options.questionNum,
        time: that.dateformat(options.answerUseTime*1000), 
        score: Math.floor(options.correctRate) + "分",
        percent: options.correctRate,
        grade: grade,
        term: term
      });
      app.globalData.termIndex[1] = options.grade == "1" ? 0 : 1;

      wx.request({
        url: "#" + that.data.answerId,
        method: "GET",
        success: function (res) {
          var list = res.data.exerciseRecordQuestionList;
          if (list == null) {
            var toastText = "获取数据失败" + res.data.errMsg;
          } else {
            var question = list,
                thisOptions = [],
                optionNum,
                allOptions = ["optionA", "optionB", "optionC", "optionD", "optionE", "optionF"];
            for (var i in question) {
              question[i]['pid'] = parseInt(i)+1
              optionNum = parseInt(question[i]['optionNum']);
              thisOptions.push(allOptions.slice(0, optionNum));
              if (question[i]['selectedOption'] == question[i]['correctOption']) {
                question[i]['pickFlag'] = true;
              } else {
                question[i]['pickFlag'] = false;
              }
            }
            that.setData({
              question: question
            });
            app.globalData.question = question;
            app.globalData.options = thisOptions;
          }
        }
      })
      
    }
    else {
      switch (app.globalData.termIndex[0]) {
        case 0: grade = "一";break;
        case 1: grade = "二";break;
        case 2: grade = "三";break;
        case 3: grade = "四";break;
        case 4: grade = "五";break;
        case 5: grade = "六";break;
      }
      switch (app.globalData.termIndex[1]) {
        case 0: term = "上";break;
        case 1: term = "下";break;
      }
      var question = app.globalData.question,
        questionNum = question.length,
        correctNum = 0,
        that = this;
      //计算答题情况
      for (var i in question) {
        if (question[i]['pickFlag']) {
          correctNum += 1;
        }
      }
      var time = this.dateformat(options.time),
        percent = (parseFloat(correctNum / questionNum).toFixed(4)) * 100;
      //保存答题情况
      this.setData({
        question: question,
        questionNum: questionNum,
        percent: percent,
        score: Math.floor(percent) + "分",
        time: time,
        grade: grade,
        term:term
      });
      var picks = [];
      for (var i = 0; i < questionNum; ++i) {
        picks.push(question[i]['selectedOption']);
      }
      var json = {
        "answer": {
          "userID": app.globalData.userId,
          "answerUseTime": options.time * 0.001 + "",
          "answerCorrectNum": correctNum,
          "chapterID": parseInt(options.id),
          "questionNum": questionNum
        },
        "options": picks
      };
      //发送答题情况给服务器
      wx.request({
        url: '#',
        data: json,
        header: {
          'content-type': 'application/json' // 默认值
        },
        method: 'POST',
        success(res) {
          console.log(res)
        }
      })
    }
  },


  dateformat: function (micro_second) {
    // 总秒数
    var second = Math.floor(micro_second / 1000);
    // 总小时
    var hr = Math.floor(second / 3600);
    // 分钟位
    var min = Math.floor((second - hr * 3600) / 60);
    // 秒位
    var sec = (second - hr * 3600 - min * 60);// equal to => var sec = second % 60;
    return min + "分" + sec + "秒"
  },

  //跳转到某个问题答题情况页面
  goToQuestion: function (e) {
    var index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../situation/situation?index=' + index
    })
  },

  //跳转到所有问题答题情况页面
  goToAllQuestion: function () {
    wx.navigateTo({
      url: '../situations/situations',
    })
  },

  //跳转到首页
  goToHome: function () {
    var that = this
    wx.showModal({
      title: '提示',
      content: that.data.flag == true ? '请问您确定要返回上一页吗？' : '请问您确定要返回首页吗？',
      success(res) {
        if (res.confirm) {
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
        }
      }
    })
  },



  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // result页面卸载时，清除全局对象question的数据
    app.globalData.question = [];
    console.log(app.globalData.question)
  }

})