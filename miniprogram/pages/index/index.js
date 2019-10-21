const app = getApp();
const db = wx.cloud.database();
const tasks = db.collection('Tasks');
const _ = db.command
Page({
  data:{
   tasks:[],
   active:'home',
   canIUse: wx.canIUse('button.open-type.getUserInfo'),
  createTaskopenid:''
  },
  //加载
onLoad:function(options){
  this.checkUser().then(res=>{
   tasks.where({
    status: "in-progress",
     renyuan: _.all([app.globalData.realName]) 
    //renyuan: app.globalData.realName
  }).get().then(res => {
    this.setData({
      tasks: res.data,
      
    })
  }) 
  })
  },
  //检查是否有用户
  async checkUser(){
    //读取数据
    const userInfos = await db.collection('userInfos').get();
    console.log("打印用户信息",userInfos)
    if(userInfos.data.length===0){
      app.globalData.hasUser = false
      return wx.redirectTo({
        url: '../authorize/authorize',
      })
    }
    const userInfo = userInfos.data[0]
    app.globalData.hasUser = true
    app.globalData._openid = userInfo._openid
    app.globalData.realName = userInfo.realName;
    this.setData({
      createTaskopenid: userInfo._openid
    })
  },
//触底刷新
onReachBottom:function(){
  this.getData();
},

//下拉刷新
onPullDownRefresh:function(){
  tasks.where({
    status: "in-progress",
    //renyuan: app.globalData.realName
     renyuan: _.all([app.globalData.realName]) 
  }).get().then(res => {
    this.setData({
      tasks: res.data
    })
    wx.stopPullDownRefresh();
  }) 
},
  //获取数据以及用户信息接口
  getData: function (callback) {
    if (!callback) {
      callback = res => { };
    }
    wx.showLoading({
      title: '数据加载中',
    })
    tasks.where({
      status: "in-progress",
      renyuan: _.all([app.globalData.realName]) 
     // renyuan: app.globalData.realName
    }).skip(this.pageData.skip).get()
      .then(res => {
        let oldData = this.data.tasks;
        console.log(res.data)
        if (res.data.length !== 0) {
          this.setData({
            tasks: oldData.concat(res.data)
          }, res => {
            this.pageData.skip = this.pageData.skip + 20
            console.log(this.pageData.skip)
            wx.hideLoading()
            callback();
          })
        } else {
          wx.hideLoading()
          wx.showModal({
            title: '提示',
            content: '数据已经完全加载啦',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })

        }

      })
  },
pageData:{
  skip:0,
  
},
//右滑点击事件（已完成）
  onClose(event) {
    console.log(event.detail)
    const { position, instance } = event.detail;
    switch (position) {
      case 'left':
        console.log(event.detail.name)
        tasks.doc(event.detail.name).remove().then(res=>{
          instance.close()
          this.onPullDownRefresh()
        })
          .catch(console.error)
      case 'cell':
        instance.close();
        break;
      case 'right':
        wx.cloud.callFunction({
          name:'updata',
          data:{
            taskId:event.detail.name
          }
        }).then(res=>{
          instance.close()
          this.onPullDownRefresh()
        })
       
    }
  },
  //搜索（title）
  onSearch:function(event){
    console.log(event.detail);
    tasks.where({
      title:db.RegExp({
        regexp: event.detail,
        option:'i'
      }) ,
      status: "in-progress",
      renyuan: this.data.realName
    }).get().then(res => {
      this.setData({
        tasks: res.data
      })
    
    })
  },
  onSearchChange:function(event){
    if(!event.detail){
      tasks.where({
        status: "in-progress",
        renyuan: _.all([app.globalData.realName])
      
        //renyuan: this.data.realName
      }).get().then(res => {
        this.setData({
          tasks: res.data
        })
      })
    }
  }

})