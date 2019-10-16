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
    this.globalData = {}
  },
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
  }

  
})
