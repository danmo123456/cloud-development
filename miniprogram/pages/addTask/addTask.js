const db = wx.cloud.database();
const tasks = db.collection('Tasks');

Page({
data:{
  title:'',
  renyuan:'',
  yaoqiu:''
},
pageData:{

},
  chooseLocation:function(e){
     wx.chooseLocation({
       success:res=>{
         //console.log(res);
         let locationObj={
           latitude: res.latitude,
           longitude: res.longitude,
           name: res.name,
           address: res.address

         }
         this.pageData.locationObj = locationObj
       }
     })
  },


  submit: function (event) {
    console.log(event)

    tasks.add({
      data:{
        title: this.data.title,
        renyuan: this.data.renyuan,
        yaoqiu: this.data.yaoqiu,
        location:this.pageData.locationObj,
        status: "in-progress"
      }
    }).then(res=>{
      //console.log(res);
      wx.cloud.callFunction({
        name:'msgMe',
        data:{
          formId:event.detail.formId,
          taskId:res._id
        }
      }).then(console.log)
      wx.showToast({
        title: '任务创建成功',
        icon:'success',
        success:res2=>{
          wx.switchTab({
            url: '/pages/index/index'
          })
        }
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