const db = wx.cloud.database();
const tasks = db.collection('Tasks');

Page({
data:{
  title:'',
  renyuan:'',
  yaoqiu:'',
  image:'',
 imageList:[]
},
pageData:{

},
chooseImage:function(e){
  console.log(e)
wx.chooseImage({
  success: res=> {
    this.setData({
      image: res.tempFilePaths[0],
      imageList: [res.tempFilePaths[0]]
    })
  },
})
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
        // this.pageData.locationObj = locationObj
         this.setData({
           locationObj: locationObj
         })
       }
     })
  },

//点击提交任务信息
  submit: function (event) {
    console.log(event)
    //添加图片
    if (this.data.image){
      wx.cloud.uploadFile({
        cloudPath: `${Math.floor(Math.random() * 10000000)}.png`,
        filePath: this.data.image
      }).then(res => {
        this.setData({
          image: res.fileID
        })
        //添加任务
        tasks.add({
          data: {
            title: this.data.title,
            renyuan: this.data.renyuan,
            yaoqiu: this.data.yaoqiu,
            location: this.data.locationObj,
            status: "in-progress"
          }
        }).then(res => {
          console.log(res);
          wx.cloud.callFunction({
            name: 'msgMe',
            data: {
              formId: event.detail.formId,
              taskId: res._id
            }
          }).then(console.log)
          wx.showToast({
            title: '任务创建成功',
            icon: 'success',
            success: res2 => {
              //成功之后情况输入框等信息
              this.setData({
                title: '',
                renyuan: '',
                yaoqiu: '',
                locationObj: {},
              })
              //成功之后跳转到首页
              wx.reLaunch({
                url: '/pages/index/index'
              })
            }
          })
        })
      }).catch(err => {
        console.error(err)
      });
   }else{
      //添加任务
      tasks.add({
        data: {
          title: this.data.title,
          renyuan: this.data.renyuan,
          yaoqiu: this.data.yaoqiu,
          location: this.data.locationObj,
          image: this.data.image,
          status: "in-progress"
        }
      }).then(res => {
        console.log(res);
        wx.cloud.callFunction({
          name: 'msgMe',
          data: {
            formId: event.detail.formId,
            taskId: res._id
          }
        }).then(console.log)
        wx.showToast({
          title: '任务创建成功',
          icon: 'success',
          success: res2 => {
            //成功之后情况输入框等信息
            this.setData({
              title: '',
              renyuan: '',
              yaoqiu: '',
              locationObj: {},
              image: '',
              imageList: []
            })
            //成功之后跳转到首页
            wx.reLaunch({
              url: '/pages/index/index'
            })
          }
        })
      })
     
   }
   
  
  },
//title输入框内容
  onTitleChange: function (event) {
    this.setData({
      title: event.detail,
  
    });
   // console.log(this.data.title);
  },
  //人员输入框内容
  onRenYuanChange: function (event) {
    this.setData({
    
      renyuan: event.detail
      
    });
    // console.log(this.data.title);
  },
  //要求输入框的内容
  onYaoQiuChange: function (event) {
    this.setData({
      yaoqiu: event.detail
    });
    // console.log(this.data.title);
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