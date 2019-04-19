const app = getApp()
{
  Page({

    /**
     * 页面的初始数据
     */

    data: {
      termArray: [['默认','一年级', '二年级', '三年级', '四年级', '五年级', '六年级'], ['上学期', '下学期']],
      termIndex: [0, 0],

      chapterArray: app.globalData.g1t1chapterArray,
      chapterIndex: [0, 0],

      list:[],
      listc:[],

      myflag: false,
      userInfo: {},
      hasUserInfo: false,
      canIUse: wx.canIUse('button.open-type.getUserInfo'),

      curTab: 0,
      scrollLeft: 0
    },

    bindMultiPickerChange: function (e) {
      this.setData({
        multiIndex: e.detail.value
      })
    },
    //点击选择学期
    termChange: function (e) {
      this.setData({
        termIndex: e.detail.value
      })

      //请求章节
      var that = this,
        grade = this.data.termIndex[0],
        term = this.data.termIndex[1] + 1;

      if (grade == 0) {
        wx.request({
          url: '#',
          method: 'GET',
          data: {},
          success: function (res) {
            var list = res.data.userInfoListt;
            if (list == null) {
              var toastText = '获取数据失败' + res.data.errMsg;
              console.log(toastText)
            } else {
              for (var i in list) {
                list[i].avg = (list[i].allUseTime / list[i].allQuestionNum).toFixed(2)
                var r = (list[i].correctNum / list[i].allQuestionNum) * 100 + ""
                if (r.indexOf('.') > 0) {
                  list[i].right = ((list[i].correctNum / list[i].allQuestionNum) * 100).toFixed(2)
                } else {
                  list[i].right = (list[i].correctNum / list[i].allQuestionNum) * 100
                }
              }
              that.setData({
                list: list
              })
            }
          }
        })
      } else {
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

            var data = that.data;
            wx.request({
              url: '#'+ data.termIndex[0] + '/' + (data.termIndex[1] + 1) + '/' + (data.chapterIndex[0] + 1) + '/' + (data.chapterIndex[1] + 1),
              method: 'GET',
              success: function (res) {
                var listc = res.data.answers;
                if (listc == null) {
                  var toastText = '获取数据失败' + res.data.errMsg;
                  console.log(toastText)
                } else {
                  for(var i in listc) {
                    var r = (listc[i].answerCorrectNum / listc[i].questionNum) * 100 + ""
                    if (r.indexOf('.') > 0) {
                      listc[i].right = ((listc[i].answerCorrectNum / listc[i].questionNum) * 100).toFixed(2)
                    } else {
                      listc[i].right = (listc[i].answerCorrectNum / listc[i].questionNum) * 100
                    }
                  }
                  that.setData({
                    listc: listc
                  })
                }
              }
            })
          }
        })
      }
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

      var data = this.data;
      wx.request({
        url: '#'+ data.termIndex[0] + '/' + (data.termIndex[1] + 1) + '/' + (data.chapterIndex[0] + 1) + '/' + (data.chapterIndex[1] + 1),
        method: 'GET',
        success: function (res) {
          var listc = res.data.answers;
          if (listc == null) {
            var toastText = '获取数据失败' + res.data.errMsg;
            console.log(toastText)
          } else {
            for (var i in listc) {
              var r = (listc[i].answerCorrectNum / listc[i].questionNum) * 100 + ""
              if (r.indexOf('.') > 0) {
                listc[i].right = ((listc[i].answerCorrectNum / listc[i].questionNum) * 100).toFixed(2)
              } else {
                listc[i].right = (listc[i].answerCorrectNum / listc[i].questionNum) * 100
              }
            }
            that.setData({
              listc: listc
            })
          }
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
      //请求章节
      var that = this
      wx.request({
        url: '#',
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

          wx.request({
            url: '#',
            method: 'GET',
            data: {},
            success: function (res) {
              var list = res.data.userInfoListt;
              if (list == null) {
                var toastText = '获取数据失败' + res.data.errMsg;
                console.log(toastText)
              } else {
                for (var i in list) {
                  list[i].avg = (list[i].allUseTime / list[i].allQuestionNum).toFixed(2)
                  var r = (list[i].correctNum / list[i].allQuestionNum) * 100 + ""
                  if(r.indexOf('.') > 0) {
                    list[i].right = ((list[i].correctNum / list[i].allQuestionNum) * 100).toFixed(2)
                  } else {
                    list[i].right = (list[i].correctNum / list[i].allQuestionNum) * 100
                  }
                }
                that.setData({
                  list: list
                })
              }
            }
          })

        }
      })
    }
  })
}