const db = wx.cloud.database();
const tasks = db.collection('Tasks');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    task:{}
  },
  pageData:{

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.pageData.id = options.id;
     tasks.doc(options.id).get().then(res=>{
      this.setData({
        task:res.data
      })
    })
  },
  viewLocation:function(){
    wx.openLocation({
      latitude: this.data.task.location.latitude,
      longitude: this.data.task.location.longitude,
      name: this.data.task.location.name,
      address: this.data.task.location.address
    })
    // console.log("aa")
  }

})