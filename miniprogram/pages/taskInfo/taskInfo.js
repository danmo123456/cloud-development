const db = wx.cloud.database();
const tasks = db.collection('Tasks');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    task:{},
    images:[]
  },
  pageData:{

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.pageData.id = options.id;
     tasks.doc(options.id).get().then(res=>{
       console.log(res.data.image)
      this.setData({
        task:res.data,
        images:res.data.image
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
    //console.log(task.image)
    const currentIndex = e.currentTarget.dataset.index;
    // 获取当前被点击的图片的实际地址
    const currentUrl = this.data.task.image[currentIndex]
 
    wx.previewImage({
      current: currentUrl,
      urls: this.data.task.image // 需要预览的图片http链接列表
    })
  }
 

})