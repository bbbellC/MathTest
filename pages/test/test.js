// pages/test/test.js
var app = getApp(),
    countdown_time = 600 * 1000;  //这是10分钟倒计时
    
Page({

  /**
   * 页面的初始数据
   */
  data: {
    question: "", //问题
    clock: '',  //倒计时
    index: 0, //当前问题下标
    allOptions: ["optionA", "optionB", "optionC", "optionD", "optionE", "optionF"], 
    id: 1,  //章节id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if(options.grade && options.term) {
      // 获取题目信息
      var that = this;
      wx.request({
        url: '#' + options.id, 
        header: {
          'content-type': 'application/json' // 默认值
        },
        method: 'POST',
        success(res) {
          var questionData = res.data['questions'],
              thisOptions = [];
          for (var i in questionData) {
            questionData[i]['selectedOption'] = "";
            questionData[i]['pickFlag'] = false;
            questionData[i]['pid'] = parseInt(i) + 1;
            var optionNum = parseInt(questionData[i]['optionNum']);
            thisOptions.push(that.data.allOptions.slice(0, optionNum));
            app.globalData.question.push(questionData[i]);
          }
          app.globalData.options = thisOptions;
          that.setData({
            question: questionData,
            perScore: parseFloat(100 / questionData.length),
            thisOptions: thisOptions,
            id: options.id
          })
        }
      })
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
  //
  getTitleWidth: function(e) {
    var width = e.detail.width
    if (width > 100) {
      width = width * 4
    }
    else if (width < 100 && width > 50) {
      width = width * 5
    }
    else if (width < 50) {
      width = width * 6
    }
    this.setData({
      titleWide: width
    })
  },

  //随机
  shuffle: function () {
    return Math.random() > 0.5 ? 1 : -1
  },

  //处理点击选项->保存答案->跳转到下一题
  handleClickOption: function(e) {
    var pickOption = e.currentTarget.dataset.pick;
    var that = this,
      index = this.data.index;
    app.globalData.question[index]['selectedOption'] = pickOption;  //将被选择的答案保存在app全局对象中
    if (pickOption == this.data.question[index]['correctOption']) { //答案正确做标记
      app.globalData.question[index]['pickFlag'] = true;
    }
    if (index < this.data.question.length - 1) { //未结束答题->跳转到下一题
      this.setData({  //setData后逻辑层重新渲染视图
        index: this.data.index + 1,
        animationname: 'slide-top'
      });
      setTimeout(function () {
        that.setData({
          animationname: ''
        })
      }, 550);
    } else {  //结束答题->跳转到答题结果页面
      var takeTime = (600 * 1000 - this.data.current_time);
      wx.redirectTo({
        url: '../result/result?time=' + takeTime + '&id=' + this.data.id,
      })
    }
  },

  //倒计时函数
  countdown: function() {
    if(countdown_time <= 0) { //时间到->跳转到做题结果页面
      this.setData({
        clock: "00分00秒"
      });
      var takeTime = this.dateformat(600*1000 - this.data.current_time);  //记录当前用时->作为参数传递
      wx.redirectTo({
        url: '../result/result?time=' + takeTime,
      });
      return;
    }
    var time = setTimeout(()=>{ //每1秒调用倒计时函数
      countdown_time -= 1000;
      this.countdown();
    }, 1000);
    this.setData({  //更新当前用时
      clock: this.dateformat(countdown_time), //渲染页面中的格式化倒计时时间
      timeFunction: time,
      current_time: countdown_time
    });
  },

  // 时间格式化输出，如1天天23时时12分分12秒秒12 。每100ms都会调用一次
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
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.countdown(); //开始倒计时
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearTimeout(this.data.timeFunction); //清除倒计时的延迟函数
    countdown_time = 600 * 1000;
  }
})