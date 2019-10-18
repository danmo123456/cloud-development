const app = getApp();
const db = wx.cloud.database();
const userInfos = db.collection('userInfos');
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      console.log("app.globalData.userInfo+++触发")
      this.addUser(app.globalData.userInfo);

    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        console.log("this.data.canIUse+++触发")
        this.addUser(res.userInfo)
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo

          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })

          this.addUser(app.globalData.userInfo);

        }
      })
    }
  },
  bindGetUserInfo (e) {
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      console.log(e.detail.userInfo)
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      console.log("bindGetUserInfo+++++触发")
      this.addUser(app.globalData.userInfo)
       wx.switchTab({ url: '/pages/index/index' })
    }else{
        //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },
  // 如果数据库没有此用户，则添加
  async addUser(user) {
    if (app.globalData.hasUser) {
      return
    }
    const db = wx.cloud.database()
    let result = await db.collection('userInfos').add({
      data: {
        nickName: user.nickName,
        avatarUrl: user.avatarUrl,
        province: user.province,
        city: user.city,
        realName: user.nickName
      }
    });
    console.log(result._openid)
    app.globalData.realName = user.nickName
    app.globalData._openid = result._openid
    //app.globalData.hasUser = true
  }
})
