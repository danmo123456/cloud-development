const app = getApp();
const db = wx.cloud.database();
const userInfos = db.collection('userInfos');
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              //用户已经授权过
              wx.switchTab({
                url: '/pages/index/index'
              })
            }
          });
        }
      }
    })
  },
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      //插入登录的用户的相关信息到数据库
      console.log(app.globalData.openid)
      userInfos.where({
        _openid: app.globalData.openid
      }).get().then(res=>{
        console.log(res.data.length)
           // 授权成功后，跳转进入小程序首页
           if(res.data.length===0){
             userInfos.add({
               data: {
                 nickName: e.detail.userInfo.nickName,
                 avatarUrl: e.detail.userInfo.avatarUrl,
                 province: e.detail.userInfo.province,
                 city: e.detail.userInfo.city,
                 
               },
             }).then(res => {
               console.log("插入小程序登录用户信息成功！");
             }).catch(console.error)
           }
             wx.switchTab({
               url: '/pages/index/index'
             })
           
      
      }).catch(res=>{
         console.log(error)
      })


  
    
    } else {
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

})
