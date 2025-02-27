// pages/my/my.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrls:[
            'https://p1.music.126.net/-yvyLG8Dn74GSJ1kSYMMFw==/109951166881494876.jpg?imageView&quality=89',
            'https://p1.music.126.net/KyKT3QXoBYUj5ZABeUmRBA==/109951166881501959.jpg?imageView&quality=89',
            'https://p1.music.126.net/tYNnUgQ7MtI_Bmxgc4d1vw==/109951166882054920.jpg?imageView&quality=89'
        ],

        songs:[
            {
                id: "1901371647",
                name:"孤勇者",
                album:{
                    picUrl:"https://p2.music.126.net/aG5zqxkBRfLiV7A8W0iwgA==/109951166702962263.jpg",
                    name:"孤勇者"
                },
                artists:"陈奕迅"
            },
            {
                id: "1894094482",
                name:"漠河舞厅·2022",
                album:{
                    picUrl:"https://p2.music.126.net/m8BMzRWR53lMu2uaMYV2mA==/109951166609630672.jpg",
                    name:"漠河舞厅·2022"
                },
                artists:"柳爽"
            },
            {
                id: "1859245776",
                name:"STAY",
                album:{
                    picUrl:"https://p1.music.126.net/e5cvcdgeosDKTDrkTfZXnQ==/109951166155165682.jpg",
                    name:"STAY"
                },
                artists:"Justin Bieber"
            }
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    // 
    gotoPlay:function(e){
        var id = e.currentTarget.dataset.id;
        var ids=[];
        for(var i = 0; i<this.data.songs.length;i++){
            ids.push(this.data.songs[i].id);
        }
        console.log("跳转至播放界面");
        wx.navigateTo({
            url: '/pages/play/play?mid='+id+'&ids='+ids,
        })

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