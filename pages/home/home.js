const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    termArray: [['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'], ['上学期', '下学期']],
    termIndex: [0, 0],

    chapterArray: app.globalData.g1t1chapterArray,
    chapterIndex: [0, 0],
    chapterId: 1,

    myflag: false,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  //点击开始测试按钮 跳转到做题页面
  goToTest: function () {
    app.globalData.chapterId = this.data.chapterId
    var grade = this.data.termIndex[0],
      term = this.data.termIndex[1];
    app.globalData.chapterIndex = this.data.chapterIndex
    app.globalData.termIndex = this.data.termIndex;
    wx.navigateTo({
      url: '../test/test?grade=' + grade + '&term=' + term + '&id=' + this.data.chapterId,
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
  },

  //点击选择学期
  termChange: function (e) {
    app.globalData.termIndex = e.detail.value;
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
        that.setData({
          chapterArray: [[...arr], [...arr[0].children]],
          arr: arr,
          rarr: res.data,
          chapterId: res.data[0].chapterId
        })
      }
    })
  },

  //点击选择章节按钮
  chapterChange: function (e) {
    var that = this;
    var pick = this.data.rarr.find(
      function(item) {
        return (item.chapterNum == (that.data.chapterIndex[0] + 1) 
        && item.sectionNum == (that.data.chapterIndex[1] + 1) );
      }
    );
    this.setData({
      chapterIndex: e.detail.value,
      chapterId: pick.chapterId
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
        //data.chapterArray[1] = this.data.arr[e.detail.value].children;
        data.chapterArray[1] = this.data.chapterArray[0][e.detail.value].children;
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
        "label": data[i].sectionName
      }
      obj.children.push(tmp);
    }
    res.push(obj);
    return res;
  },  

  onLoad: function () {
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
        that.setData({
          chapterArray: [[...arr], [...arr[0].children]],
          arr: arr,
          rarr: res.data
        })
      }
    })

    //已登录的用户获取openid
    wx.login({
      success: function (res) {
        var code = res.code;//登录凭证
        console.log({ encryptedData: res.encryptedData, iv: res.iv, code: code })
        if (code) {
          //2、调用获取用户信息接口
          wx.getUserInfo({
            success: function (res) {
              console.log({ encryptedData: res.encryptedData, iv: res.iv, code: code })
              //3.请求自己的服务器，解密用户信息 获取unionId等加密信息
              wx.request({
                url: '#',//自己的服务接口地址
                method: 'post',
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                data: { encryptedData: res.encryptedData, iv: res.iv, code: code },
                success: function (data) {
                  console.log(data.data)

                  //4.解密成功后 获取自己服务器返回的结果
                  if (data.data.status == 1) {
                    var userInfo_ = data.data.userInfo;
                    console.log(userInfo_)
                    app.globalData.openid = userInfo_.openid

                  } else {
                    console.log('解密失败')
                  }

                },
                fail: function () {
                  console.log('系统错误')
                }
              })
            },
            fail: function () {
              console.log('获取用户信息失败')
            }
          })

        } else {
          console.log('获取用户登录态失败！' + r.errMsg)
        }
      },
      fail: function () {
        console.log('登陆失败')
      }
    })

    //用户信息
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        myflag: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          myflag: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
            myflag: true
          })
        }
      })
    }
  },

  bindGetUserInfo: function (event) {
    var that = this
    console.log(event.detail.userInfo)
    this.setData({
      userInfo: event.detail.userInfo,
      hasUserInfo: true,
      myflag: true
    })
    //新用户登陆获取openid
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.login({
            success: function (res) {
              var code = res.code;//登录凭证
              console.log({ encryptedData: res.encryptedData, iv: res.iv, code: code })
              if (code) {
                //2、调用获取用户信息接口
                wx.getUserInfo({
                  success: function (res) {
                    console.log({ encryptedData: res.encryptedData, iv: res.iv, code: code })
                    //3.请求自己的服务器，解密用户信息 获取unionId等加密信息
                    wx.request({
                      url: '#',//自己的服务接口地址
                      method: 'post',
                      header: {
                        'content-type': 'application/x-www-form-urlencoded'
                      },
                      data: { encryptedData: res.encryptedData, iv: res.iv, code: code },
                      success: function (data) {
                        console.log(data.data)
                        //4.解密成功后 获取自己服务器返回的结果
                        if (data.data.status == 1) {
                          var userInfo_ = data.data.userInfo;
                          console.log(userInfo_)
                          app.globalData.openid = userInfo_.openid
                          wx.request({
                            url: '#',
                            method: 'POST',
                            data: {
                              "openid": userInfo_.openid,
                              "gender": userInfo_.gender,
                              "nickName": userInfo_.nickName
                            },
                            header: {
                              'content-type': 'application/json'
                            },
                            success(res) {
                              console.log("添加用户成功");
                            }
                          })

                        } else {
                          console.log('解密失败')
                        }

                      },
                      fail: function () {
                        console.log('系统错误')
                      }
                    })
                  },
                  fail: function () {
                    console.log('获取用户信息失败')
                  }
                })

              } else {
                console.log('获取用户登录态失败！' + r.errMsg)
              }
            },
            fail: function () {
              console.log('登陆失败')
            }
          })

        } else {
          console.log('获取用户信息失败')

        }
      }
    })
  },


  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
      myflag: true
    })
  },
  showMask: function () {
    this.setData({ myflag: false })
  },
  closeMask: function () {
    this.setData({ myflag: true })
  }

})