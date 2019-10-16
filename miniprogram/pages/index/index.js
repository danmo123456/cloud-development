const app = getApp();
const db = wx.cloud.database();
const tasks = db.collection('Tasks');
const userInfos = db.collection('userInfos');
Page({
  data:{
   tasks:[],
   active:'home',
   canIUse: wx.canIUse('button.open-type.getUserInfo'),
   realName:''
  },
  //加载
onLoad:function(options){
  
  this.getData(res=>{
    console.log(app.globalData.openid)
    if (!app.globalData.openid){
      wx.redirectTo({
        url: '../authorize/authorize',
      })
    }
  });
  },
  
//触底刷新
onReachBottom:function(){
  this.getData();
},

//下拉刷新
onPullDownRefresh:function(){
  tasks.where({
    status: "in-progress",
    renyuan: this.data.realName
  }).get().then(res => {
    this.setData({
      tasks: res.data
    })
    wx.stopPullDownRefresh();
  })
  
},
  //获取数据以及用户信息接口
  getData: function (callback) {
    console.log("www"+app.globalData.openid)
    userInfos.where({
      _openid: app.globalData.openid
    })
      .get({
        success: res => {
          let realName = res.data[0].realName;
            this.setData({
              realName: realName
            })
          
          console.log("sss"+this.data.realName)
          if (!callback) {
            callback = res => { };
          }
          wx.showLoading({
            title: '数据加载中',
          })
          tasks.where({
            status: "in-progress",
            renyuan: this.data.realName
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
      case 'cell':
        instance.close();
        break;
      case 'right':
        tasks.doc(event.detail.name).update({
          // data 传入需要局部更新的数据
          data: {       
           status:"end"
          }
        })
          .then(res=>{
            this.onPullDownRefresh()
          })
          .catch(console.error)
        instance.close()
        break;
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
        renyuan: this.data.realName
      }).get().then(res => {
        this.setData({
          tasks: res.data
        })
      })
    }
  }

})