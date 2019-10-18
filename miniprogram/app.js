//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
    // 查看是否授权
    wx.getSetting({
      success:res=>{
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res=> {

              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
              //用户已经授权过
              wx.switchTab({
                url: '/pages/index/index'
              })
            }
          });
        }else{
          wx.redirectTo({
            url: '../authorize/authorize',
          })
        }
      }
    })
  
  },
  globalData: {
    hasUser: false, // 判断数据库中是否有用户
    hasUserInfo: false, // 判断小程序的userInfo是否有获取
    userInfo: null,
  } ,
  onChange: function (event) {
    this.setData({
      active: event.detail
    }, res => {
      if (event.detail === 'me') {
        wx.switchTab({
          url: `../me/me`,
        })
      } else {    
        wx.switchTab({
          url: `../index/index`,
        })
      
      }
    })
  },


  
})
