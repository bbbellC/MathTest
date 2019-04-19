// pages/wrongs/wrongs.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    question: [],
    q: {},
    
    qi: 0,
    hide: 0, 
    options: ["optionA", "optionB", "optionC", "optionD", "optionE", "optionF"], 
    allOptions: ["optionA", "optionB", "optionC", "optionD", "optionE", "optionF"], 

    termArray: [['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'], ['上学期', '下学期']],
    termIndex: [0, 0],

    chapterArray: [],
    chapterIndex: [0, 0],
    arr: []
  },
 
  // 点击错题标题之后，显示或隐藏错题内容
  toggle: function(e) {
    var hide = this.data.hide,
        length = parseInt(this.data.question[e.currentTarget.id-1]['optionNum']),
        options = this.data.allOptions.slice(0, length);
    this.setData({
      q: this.data.question[e.currentTarget.id-1],
      qi: e.currentTarget.id-1,
      options: options,
      hide: hide == e.currentTarget.id ? 0 : e.currentTarget.id,
      animationname: hide == e.currentTarget.id ? '' : 'slide-top'
    }) 
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

  //点击选择学期
  termChange: function (e) {
    this.setData({
      termIndex: e.detail.value
    })
    //请求章节
    var that = this,
      grade = this.data.termIndex[0] + 1,
      term = this.data.termIndex[1] + 1;
    wx.request({
      url: '#' + grade + '/' + term,
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success(res) {
        var arr = that.convertToTree(res.data, 1);
        var pick = res.data.find(
          function (item) {
            return (item.chapterNum == (that.data.chapterIndex[0] + 1)
              && item.sectionNum == (that.data.chapterIndex[1] + 1));
          }
        );
        that.setData({
          chapterArray: [[...arr], [...arr[0].children]],
          arr: arr,
          rarr: res.data,
          chapterId: pick.chapterId
        })
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
          }
        })

        //请求错题数据
        wx.request({
          url: '#' + app.globalData.userId + '/' + that.data.chapterId,
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            that.setData({
              question: res.data
            })
          }
        })
      }
    })

  },
  
  //点击选择章节按钮
  chapterChange: function (e) {
    var that = this;
    var pick = that.data.rarr.find(
      function (item) {
        return (item.chapterNum == (that.data.chapterIndex[0] + 1)
          && item.sectionNum == (that.data.chapterIndex[1] + 1));
      }
    );
    this.setData({
      chapterIndex: e.detail.value,
      chapterId: pick.chapterId
    })

    //请求错题数据
    wx.request({
      url: '#'+app.globalData.userId+'/' + that.data.chapterId,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          question: (res.data)
        })
      }
    })
  },

  //不同的章对应不同的节
  partChange: function (e) {
    var data = {
      chapterArray: this.data.chapterArray,
      chapterIndex: this.data.chapterIndex
    };
    data.chapterIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        data.chapterArray[1] = this.data.arr[e.detail.value].children;
        break;
    }
    this.setData({
      chapterArray: data.chapterArray,
      chapterIndex: data.chapterIndex
    })
  },

  //将章节数据转换成树
  convertToTree: function (data, pid) {
    const res = [];
    let tmp = [];
    let obj = {
      "id": data[0].chapterNum,
      "label": data[0].chapterName,
      children: []
    };
    for (let i = 0; i < data.length; ++i) {
      if (data[i].chapterNum === pid) {
      } else {
        pid++;
        res.push(obj);
        obj = {
          "id": data[i].chapterNum,
          "label": data[i].chapterName,
          children: []
        };
      }
      tmp = {
        "id": data[i].sectionNum,
        "label": data[i].sectionName,
      }
      obj.children.push(tmp);
    }
    res.push(obj);
    return res;
  }, 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var grade = this.data.termIndex[0] + 1,
      term = this.data.termIndex[1] + 1;
    //请求章节
    wx.request({
      url: '#' + grade + '/' + term,
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success(res) {
        var arr = that.convertToTree(res.data, 1);
        that.setData({
          chapterArray: [[...arr], [...arr[0].children]],
          arr: arr,
          rarr: res.data
        })
        //请求错题数据
        var userId = app.globalData.userId
        wx.request({
          url: '#' + userId + '/1',
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            that.setData({
              question: (res.data)
            })
          }
        })
      }
    })
  }
})