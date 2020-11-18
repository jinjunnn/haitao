const {
  User
} = require('../../utils/av-live-query-weapp-min');
const common = require('../../model/common');
const image = require('../../image/image');
const AV = require('../../utils/av-live-query-weapp-min');
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onLoad: function (options) {
    let that = this;
    that.query_teams();
    that.query_service_notice_model();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  query_service_notice_model(){
        let that = this;
        const paramsJson = {
          key: 'service_notice_model_haitao',
          begin:0,
          end:-1,
        };
        console.log(paramsJson);
        return AV.Cloud.run('get_list_details_strings', paramsJson).then((x) => {
          console.log(x);
          that.setData({
            notice_model: x,
          });
        });
  },

  query_teams() {
    let that = this;
    const paramsJson = {
          key: 'subs_wraps',          
          begin:0,
          end:-1,
    };
    console.log(paramsJson);
    return AV.Cloud.run('get_list_details_new', paramsJson).then((x) => {
      console.log(x);
      that.setData({
        cards: x,
      });
    });
  },


  bind_subs(e){
    console.log(e);
    let that = this;
    if (!app.globalData.userInfo.status){
      console.log('信息不完整');
      common.showToast('请完善信息',common.navigateTo('/pages/user/login/login'));
    }else{
      wx.requestSubscribeMessage({
        tmplIds: that.data.notice_model,
        success(res) {
          for (const i of that.data.notice_model) {
              if(res[i]=='accept'){
                  const paramsJson = {
                    key: 'service_notice_' + i + '_' + that.data.cards[e.currentTarget.dataset.index].key,
                    field: app.globalData.userInfo.objectid,
                    value: 1,
                  };
                  console.log(paramsJson);
                  AV.Cloud.run('increField', paramsJson).then((x) => {
                    console.log('result:', x);
                  });
              }
          }
          common.showToast('您已成功订阅一次礼品卡资讯');
        },
        fail(res){
          console.log(res);
        }
      });
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
})