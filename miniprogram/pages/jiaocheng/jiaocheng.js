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
    cards:[]
  },

  onLoad: function (options) {
    let that = this;
    that.query_teams();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  query_teams() {
    let that = this;
    const paramsJson = {
      key: 'study_wraps',
      begin:0,
      end:-1
    };
    return AV.Cloud.run('get_list_details_new', paramsJson).then((x) => {
      that.setData({
        cards: x.map(item =>{
          item.status =0;
          return item;
        }),
      });
    });
  },

  bind_status(e){
    console.log(e.currentTarget.dataset.status);
    console.log(e.currentTarget.dataset.index);
    let that = this;
    if (e.currentTarget.dataset.status==0){
      let cards = that.data.cards;
      cards[e.currentTarget.dataset.index].status = 1;
      that.setData({
        cards:cards
      })
    }
    else{
      let cards = that.data.cards;
      cards[e.currentTarget.dataset.index].status = 0;
      that.setData({
        cards: cards
      })
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

  }
})