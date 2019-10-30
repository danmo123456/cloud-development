const app = getApp();
const db = wx.cloud.database();
import Dialog from 'vant-weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:false,
    userInfo:{},
    avatarUrl: '',
    hasUserInfo: false,
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              app.globalData.hasLogin = true
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo,
                hasUserInfo: true,
                hasUser:true
              })
              
            }
          })
        }
      }
    })
  },

 toShow:function(){
 this.setData({
   show:true
 })
 },

  getUserInfo(e) {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
      
        app.globalData._openid = res.result.openid
    
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      
      }
    })

    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      app.globalData.realName = e.detail.userInfo.nickName
      app.globalData.hasLogin = true
      console.log(e.detail.userInfo)
      this.setData({
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      console.log("bindGetUserInfo+++++触发")
      this.addUser(app.globalData.userInfo)
     
      wx.reLaunch({
        url: '../index/index',
      })
    } 
  },

  onClose() {
    this.setData({
       show: false
        });
  },

  // 如果数据库没有此用户，则添加
  async addUser(user) {
    if (app.globalData.hasUser) {
      return
    }
 
    let result = await db.collection('userInfos').add({
      data: {
        nickName: user.nickName,
        avatarUrl: user.avatarUrl,
        province: user.province,
        city: user.city,
        realName: user.nickName
      }
    });
    // app.globalData.realName = user.nickName
    // app.globalData.hasLogin = true
  },
  onShareAppMessage:function(){
    return {
      title: '这里是look任务小程序',
      path: '/pages/index/index',
      success: function (res) {
        console.log(res.shareTickets[0])
        // console.log
        wx.getShareInfo({
          shareTicket: res.shareTickets[0],
          success: function (res) { console.log(res) },
          fail: function (res) { console.log(res) },
          complete: function (res) { console.log(res) }
        })
      },
      fail: function (res) {
        // 分享失败
        console.log(res)
      }
    }
  }

  
 
})