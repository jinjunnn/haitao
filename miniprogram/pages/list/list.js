const AV = require('../../utils/av-live-query-weapp-min');
const common = require('../../model/common');
const image = require('../../image/image');
const app = getApp();
let index = 0;
let list = [];
let key;
let title;
let p;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    post:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    key = options.key;
    title = options.title;
    let {post=1} = options;
    p = post;
    wx.setNavigationBarTitle({title: title});
  },

    /**
   * 查询求购卡片的信息
   */
  query_list(key, begin, end) {
    let that = this;
    const paramsJson = {
      key: key,
      begin: begin,
      end: end,
    };
    console.log(paramsJson);
    AV.Cloud.run('get_list_details_new', paramsJson).then((result) => {
      index++;
      let r = result.filter(function (s) {
        return s !=null;
      });
      r.map(item => {
        let {status = '0'} = item;
        item.status = status;
        return item;
      })
      list = list.concat(r);
      that.setData({
        list: list,
        key:key,
        post:p,
      });
    });
  },

  tap_image(e) {
    console.log(e.currentTarget.dataset.url);
    let urls = [];
    urls.push(e.currentTarget.dataset.url);
    wx.previewImage({
      current: '',
      urls: urls,
    })
  },


  post(e) {
    if(app.globalData.userInfo.status == 3 || app.globalData.userInfo.status == 4){
        let url = '/pages/post/post?key=' + key + '&title=' + title;
        console.log(url);
        common.navigateTo(url);
        }
    else{
        common.showToast('发布内容需要提交您的微信和手机号码',common.navigateTo('/pages/user/login/login'));
    }

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    that.query_list(key, index * 20, index * 20 + 19);
  },

  contact(e) {
      let set_set = (name,value) => {
        let paramsJson = {
          key: name,
          value: value,
        };
        AV.Cloud.run('lpush', paramsJson).then((results) => {
        }).catch(error => {
          console.log(error);
        });
      }

      wx.showActionSheet({
        itemList: ['复制用户微信号','发布到我的小程序出售'],
        success (res) {
          if( res.tapIndex==0 ){
                let paramsJson = {
                  uid: app.globalData.userInfo.uid,
                  code: app.globalData.userInfo.code,
                  field: 'wechatid'
                };
                AV.Cloud.run('query_user_field', paramsJson).then((data) => {
                  if(data==-1||data==null){
                    common.showToast('查询用户微信号出现错误');
                  }else{
                    common.copy(data);
                  }
                });
          }
          else if( res.tapIndex==1 ){
            if(app.globalData.userInfo.uid != e.currentTarget.dataset.uid){
                set_set('mlist_' + app.globalData.userInfo.uid,'info_' + e.currentTarget.dataset.time);
            }else{
              common.showToast('添加成功');
            }
          }
        },
        fail (res) {
          console.log(res.errMsg);
        }
      });
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    index = 0;
    list = [];
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    index = 0;
    list = [];
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
      let that = this;
      that.query_list(key, index * 20, index * 20 + 19);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})