const db = wx.cloud.database();
const tasks = db.collection('Tasks');
Page({
data:{
  title:'',
  renyuan:'',
  yaoqiu:''
},
  submit: function () {
  
    // console.log(this.data.title);
    // console.log(this.data.renyuan);
    // console.log(this.data.yaoqiu);
    tasks.add({
      data:{
        title: this.data.title,
        renyuan: this.data.renyuan,
        yaoqiu: this.data.yaoqiu
      }
    }).then(res=>{
      //console.log(res);
      wx.showToast({
        title: '任务创建成功',
        icon:'success'
      })
    })
  },

  onTitleChange: function (event) {
    this.setData({
      title: event.detail,
  
    });
   // console.log(this.data.title);
  },
  onRenYuanChange: function (event) {
    this.setData({
    
      renyuan: event.detail
      
    });
    // console.log(this.data.title);
  },
  onYaoQiuChange: function (event) {
    this.setData({
      yaoqiu: event.detail
    });
    // console.log(this.data.title);
  },
})