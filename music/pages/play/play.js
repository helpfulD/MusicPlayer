// pages/play/play.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 控制声音播放暂停
        action:{
            method:"play"
        },
        // 歌曲id
        id:"",
        // 定义存放所有歌曲id数组
        ids:[],
        // 控制暂停变量
        state:"play",
        // 定义变量接受当前歌曲详情
        song:null,
        // 默认循环模式
        mode:'single',
        //定义一个歌词数组
        lyricArray:[],
        // 竖向滚动条位置初始值为0
        marginTop:0,
        //记录当前唱到的行号
        currentIndex:0,
         //歌曲总时长
        max:0,
        //当前歌曲进度时间
        move:0,
        //当前播放时间
        playTime:"00:00",
        //结束时长
        endTime:""
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var mid = options.mid;
        var idsStr = options.ids;
        var ids = idsStr.split(",");
        this.setData({
            id:mid,
            ids:ids
        })
        this.getSongInfoById();
        this.getLyricById();
    },


    // 根据id获取歌曲详情
    getSongInfoById:function(){
        var currentId = this.data.id;
        var that = this;
        //https://music.163.com/api/song/detail/?id=1901371647&ids=[1901371647]
        wx.request({
          url: 'https://music.163.com/api/song/detail/?id='+currentId+'&ids=['+currentId+']',
          success:function(res){
            var musicInfo = res.data.songs[0];
            that.setData({
                song:musicInfo
            })
        }
        })
    },


    // 通过id获取歌词
    getLyricById:function(){
        var that = this;
        var currentId = this.data.id;
        wx.request({
          url: 'https://music.163.com/api/song/lyric?os=pc&id='+currentId+'&lv=-1&kv=-1&tv=-1',
          success:function(res){
            var lyrics =  res.data.lrc.lyric;
            var result = that.parseLyric(lyrics);
            var finalResult = that.sliceNull(result);
            that.setData({lyricArray:finalResult})
          }
        })
    },


    //解析歌词
    parseLyric:function(lyrics){
        var lyricResult = [];
        var lyricArray = lyrics.split("\n");
        if(lyricArray[lyricArray.length-1]==""){
            lyricArray.pop();
        }
        var pattern = /\[\d{2}:\d{2}\.\d{2,3}\]/;
        lyricArray.forEach(function(v,i,a){
            //console.log(v);
            var realLyric =  v.replace(pattern,"");
            var time = v.match(pattern);
            //console.log(time);
              if(time!=null){
                 var timeResult = time[0].slice(1,-1);
                 //console.log(timeResult);
                 var timeArray = timeResult.split(":");
                 var finalTime = parseFloat(timeArray[0]) * 60 + parseFloat(timeArray[1]);
                 lyricResult.push([finalTime,realLyric])
             }
        })
        return lyricResult;
    },


    // 去掉空歌词,保留非空
    sliceNull:function(lyricArray){
        var result=[];
        for(var i = 0; i < lyricArray.length; i++){
            if(lyricArray[i][1]!=""){
                result.push(lyricArray[i]);
            }
        }
        return result;
    },

    // 控制音乐的播放与暂停
    playOrPasue:function(){
        var mstate = this.data.state;
        if (mstate=="play"){
            this.setData({action:{method:"pause"},state:"pause"})
        }else{
            this.setData({action:{method:"play"},state:"play"})
        }
    },

    // 上一首
    prevSong:function(){
        var currentId = this.data.id;
        var index = 0;
        for(var i = 0;i<this.data.ids.length;i++){
            if(currentId==this.data.ids[i]){
                index=i;
                break;
            }
        }
        var preIndex = index==0?this.data.ids.length-1:index-1;
        var prevId = this.data.ids[preIndex];
        this.setData({id:prevId})
        this.setData({action:{method:"play"}})
        this.setData({marginTop:0,currentIndex:0})
        this.getSongInfoById();
        this.getLyricById();
    },

    // 下一首
    nextSong:function(){
        var currentId = this.data.id;
        var index = 0;
        for(var i = 0;i<this.data.ids.length;i++){
            if(currentId==this.data.ids[i]){
                index=i;
                break;
            }
        }
        var nextIndex = index==this.data.ids.length-1?0:index+1;
        var nextId = this.data.ids[nextIndex];
        this.setData({id:nextId})
        this.setData({action:{method:"play"}})
        this.setData({marginTop:0,currentIndex:0})
        this.getSongInfoById();
        this.getLyricById();
    },

    // 点击切换播放模式
    changeMode:function(){
        var mode = this.data.mode;
        if(mode=="single"){
            this.setData({mode:'loop'})
        }else{
            this.setData({mode:'single'})
        }
    },

    // 音乐结束时切换音乐
    changeMusic:function(){
        var mode = this.data.mode;
        if(mode=="single"){
            this.setData({id:this.data.id})
            this.setData({action:{method:"play"}})
        }else{
            this.nextSong();
        }
        this.setData({marginTop:0,currentIndex:0})
    },

      dragProgress:function(e){
        //获取拖动位置的值(时间)
        var value = e.detail.value;
        //修改歌曲进度
        this.setData({
          action:{
            method:"setCurrentTime",
            data:value
          }
        })
      },
      /**
       * 歌曲进度改变时,触发执行的方法
       */
      changeTime:function(e){
        //1.---进度条实现
        var currentTime = e.detail.currentTime;
        var duration = e.detail.duration;
        var playMinutes = Math.floor(currentTime/60);
        var playSeconds = Math.floor(currentTime%60);
        if(playMinutes<10){
          playMinutes = "0"+playMinutes;
        } 
        if(playSeconds<10){
          playSeconds = "0"+playSeconds;
        }
        //2.---将歌曲总时长转换为几分几秒的格式
        var endMinutes = Math.floor(duration/60);
        var endSeconds = Math.floor(duration%60);
        if (endMinutes < 10) {
          endMinutes = "0" + endMinutes;
        }
        if (endSeconds < 10) {
          endSeconds = "0" + endSeconds;
        }
        //给data中的max和move、playTime、endTime赋值
        this.setData({
          max:duration,
          move:currentTime,
          playTime:playMinutes+":"+playSeconds,
          endTime:endMinutes+":"+endSeconds
        })
    
        //2---获取所有的歌词(二维数组)
        var lyricArray = this.data.lyricArray;
        if (lyricArray!=null){
          if (this.data.currentIndex >= 4) {
            this.setData({
              marginTop: (this.data.currentIndex - 4) * 39
            })
           } 

          if (this.data.currentIndex == lyricArray.length - 2) {
            if (currentTime >= lyricArray[lyricArray.length - 1][0]) {
              this.setData({currentIndex: lyricArray.length - 1})
            }
          } else {
            for (var i = 0; i < lyricArray.length - 1; i++) {
              if (currentTime >= lyricArray[i][0] && currentTime < lyricArray[i + 1][0]) {
                this.setData({currentIndex: i })
              }
            }
          }
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