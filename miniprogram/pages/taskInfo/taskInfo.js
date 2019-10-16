const db = wx.cloud.database();
const tasks = db.collection('Tasks');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    task:{},
    imageList:[]
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
        task:res.data,
        imageList:[res.data.image]
      })
    })
  },
  //导航路径
  viewLocation:function(){
    wx.openLocation({
      latitude: this.data.task.location.latitude,
      longitude: this.data.task.location.longitude,
      name: this.data.task.location.name,
      address: this.data.task.location.address
    })
    // console.log("aa")
  },
  /** 
	 * 预览图片
	 */
  previewImage: function (e) {
    
    wx.previewImage({
      
      urls: this.data.imageList // 需要预览的图片http链接列表
    })
  }
 

})