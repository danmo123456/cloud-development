const app = getApp();
const db = wx.cloud.database();
const tasks = db.collection('Tasks');
import Notify from 'vant-weapp/notify/notify';
Page({
data:{
  title:'',
  renyuan:[],
  yaoqiu:'',
  image:[],
  show:false,
  currentDate: new Date().getTime(),
  minDate: new Date().getTime(),
  formatter(type, value) {
    if (type === 'year') {
      return `${value}年`;
    } else if (type === 'month') {
      return `${value}月`;
    }
    return value;
  }

},
pageData:{

},

  //加载
  onLoad: function (options) {
     this.checkUser();
     let Time = this.timestampToTime(new Date().getTime())
     this.setData({
       Time:Time
     })
  
  },
  focus:function(){
    this.setData({
      show: true
    })
  },
 onClose:function(){
   this.setData({
     show: false
   })
 },
  onConfirm:function(event) {
    console.log(event.detail)
   let tt = this.timestampToTime(event.detail)
    this.setData({
      currentDate: event.detail,
      Time:tt,
      show: false
    })
  },
  onCancel: function(){
    this.setData({
      show: false
    })
  },
  //转换日期格式
 timestampToTime:function(timestamp) {
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate();
    var creatDate = Y + M + D;
    return creatDate ;
  },
  //检查是否有用户
  async checkUser() {
    //读取数据
    const userInfos = await db.collection('userInfos').get();
    console.log("打印用户信息", userInfos)
    if (userInfos.data.length === 0) {
      app.globalData.hasUser = false
      return 
    }
  },


//选择图片
chooseImage:function(e){
  console.log(e)
  const items = this.data.image
wx.chooseImage({
  count: 9,
  sizeType: ['original', 'compressed'],
  sourceType: ['album', 'camera'],
  success: res=> {
    // tempFilePath可以作为img标签的src属性显示图片
    const tempFilePaths = res.tempFilePaths
    for (const tempFilePath of tempFilePaths) {
      items.push({
        src: tempFilePath
      })
    }
    this.setData({
      image: items,
      //imageList: items
    })
  },
})
},

//选择地点
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
  // 上传图片
  uploadPhoto(filePath) {
    return wx.cloud.uploadFile({
      cloudPath: `${Date.now()}-${Math.floor(Math.random(0, 1) * 1000)}.png`,
      filePath
    })
  },
//点击提交任务信息
  submit: function (event) {
    console.log(event)
if(!this.data.title||!this.data.renyuan){
  Notify({ type: 'danger', message: '任务名和人员配置为必填项！' });
}else{
  //添加图片
  if (this.data.image) {
    if(this.data.image.length>9){
      Notify({ type: 'danger', message: '图片最多为九张！请长按删除适量图片' });
    }else{
    const uploadTasks = this.data.image.map(item => this.uploadPhoto(item.src))
    Promise.all(uploadTasks).then(res => {
      let imageList = []
      console.log(res)
      for (const p in res) {
        imageList.push(res[p].fileID)
      }
      console.log(imageList)
      this.setData({
        image: imageList
      })
      //添加任务
      tasks.add({
        data: {
          title: this.data.title,
          renyuan: this.data.renyuan,
          yaoqiu: this.data.yaoqiu,
          location: this.data.locationObj,
          image: this.data.image,
          status: "in-progress",
          createDate:this.data.Time
        }
      }).then(res => {
        console.log(res);
        // wx.cloud.callFunction({
        //   name: 'msgMe',
        //   data: {
        //     formId: event.detail.formId,
        //     taskId: res._id
        //   }
        // }).then(console.log)
        wx.showToast({
          title: '任务创建成功',
          icon: 'success',
          success: res2 => {
            //成功之后情况输入框等信息
            this.setData({
              title: '',
              renyuan: [],
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
    }
  }else {
    //添加任务
    tasks.add({
      data: {
        title: this.data.title,
        renyuan: this.data.renyuan,
        yaoqiu: this.data.yaoqiu,
        location: this.data.locationObj,
        status: "in-progress",
        createDate: this.data.Time
      }
    }).then(res => {
      console.log(res);
      // wx.cloud.callFunction({
      //   name: 'msgMe',
      //   data: {
      //     formId: event.detail.formId,
      //     taskId: res._id
      //   }
      // }).then(console.log)
      wx.showToast({
        title: '任务创建成功',
        icon: 'success',
        success: res2 => {
          //成功之后情况输入框等信息
          this.setData({
            title: '',
            renyuan: [],
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
    var sArr = event.detail.split(" ");
    this.data.renyuan=sArr

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
  async  previewImage (e) {
    const current = e.target.dataset.src
    const photos = this.data.image.map(photo => photo.src)

    wx.previewImage({
      current: current.src,
      urls: photos // 需要预览的图片http链接列表
    })
  },
      // 删除图片
  //   cancel(e) {
  //   const index = e.currentTarget.dataset.index
  //     const image= this.data.image.filter((p, idx) => idx !== index)

  //   this.setData({
  //     image: image
  //   })
  // },

  // 长按事件
  longpress(e) {
    const index = e.currentTarget.dataset.index

    // 展示操作菜单
    wx.showActionSheet({
      itemList: ['删除照片'],
      success: res => {
     
          //this.deleteFile(imgIndex)
          const image = this.data.image.filter((p, idx) => idx !== index)
          this.setData({
            image: image
          });
          console.log("删除照片")
        
      }
    })
  }
 
})
    