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
    this.checkUser();
    // 查看是否授权
    wx.getSetting({
      success:res=>{
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res=> {
              this.globalData.userInfo = res.userInfo;
              this.globalData.hasLogin = true
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            
            }
          });
        }
      }
    })
  },

  //检查是否有用户
  async checkUser() {
    //读取数据
    const db = wx.cloud.database();
    const userInfos = await db.collection('userInfos').get();
    console.log("appjs打印用户信息", userInfos)
    if (userInfos.data.length === 0) {
       return
    }
    const userInfo = userInfos.data[0]
    this.globalData.hasUser = true
    this.globalData._openid = userInfo._openid
    this.globalData.realName = userInfo.realName;
  
  },

  globalData: {
    hasUser: false, // 判断数据库中是否有用户
    hasUserInfo: false, // 判断小程序的userInfo是否有获取
    userInfo: [],
    _openid :'',
    realName:'',
    hasLogin:false
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
