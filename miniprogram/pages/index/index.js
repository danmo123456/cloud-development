const db = wx.cloud.database();
const tasks = db.collection('Tasks');
Page({
  data:{
   tasks:[]
  },
onLoad:function(options){
   this.getData();
  //  tasks.get().then(res=>{
  //    this.setData({
  //      tasks:res.data
  //    })
  //  })
},

//触底刷新
onReachBottom:function(){
 this.getData();
},

//下拉刷新
onPullDownRefresh:function(){
    
    this.getData(res=>{
      this.data.tasks = [];
      this.pageData.skip = 0;
    wx.stopPullDownRefresh();     
    
    
    });
},
getData:function(callback){
  if(!callback){
    callback = res => {};
  }
  wx.showLoading({
    title: '数据加载中',
  })
  tasks.skip(this.pageData.skip).get()
  .then(res => {
    let oldData = this.data.tasks;
    console.log(res.data)
    if(res.data.length!==0){
      this.setData({
        tasks: oldData.concat(res.data)
      }, res => {
        this.pageData.skip = this.pageData.skip + 20
        console.log(this.pageData.skip)
        wx.hideLoading()
        callback();
      })
    }else{
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
  skip:0
}

})