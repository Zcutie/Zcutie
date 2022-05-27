/*
*暂定未实现：
*使用定时器实现歌曲播放进度条的变化
*设置音量
*自动顺序播放
*播放板块之间的切换
*动态实现歌曲数组变化
*用户登陆，数据库连接
*歌手、封面可以自定义命名再实现变化
*/

const music = new Audio();
music.src = '../Audio/1.mp3'

var arr = [];


//歌曲相关信息存储 songs数组
const songs = [
    {
        id:'1',
        songName:'周杰伦 <br><div class="subtitle">晴天</div>',
        poster:"../image/music/song/Jay.jpg"
    },
    {
        id:'2',
        songName:'陈奕迅 <br><div class="subtitle">富士山下</div>',
        poster:"../image/music/song/What's Going On.jpg"
    },
    {
        id:'3',
        songName:'银临&Aki阿杰 <br><div class="subtitle">牵丝戏</div>',
        poster:"../image/music/song/qiansixi.jpg"
    },
    {
        id:'4',
        songName:'张远 <br><div class="subtitle">嘉宾</div>',
        poster:"../image/music/song/jiabin.jpg"
    },
    {
        id:'5',
        songName:'一支榴莲 <br><div class="subtitle">海底</div>',
        poster:"../image/music/song/haidi.jpg"
    },
    {
        id:'6',
        songName:'毛阿敏 <br><div class="subtitle">相思</div>',
        poster:"../image/music/song/xiangsi.jpg"
    },
    {
        id:'7',
        songName:'任然 <br><div class="subtitle">花雨落</div>',
        poster:"../image/music/song/huayuluo.jpg"
    },
    {
        id:'8',
        songName:'林忆莲 <br><div class="subtitle">至少还有你</div>',
        poster:"../image/music/song/zhishaohaiyouni.jpg"
    },
    {
        id:'9',
        songName:'田馥甄 <br><div class="subtitle">寂寞寂寞就好</div>',
        poster:"../image/music/song/jimojimojiuhao.jpg"
    },
    {
        id:'10',
        songName:'柳爽 <br><div class="subtitle">漠河舞厅</div>',
        poster:"../image/music/song/mohewuting.jpg"
    },
    {
        id:'11',
        songName:'杨千嬅 <br><div class="subtitle">处处吻</div>',
        poster:"../image/music/song/chuchuwen.jpg"
    },
    {
        id:'12',
        songName:'叶丽仪 <br><div class="subtitle">上海滩</div>',
        poster:"../image/music/song/shanghaitan.jpg"
    },
    {
        id:'13',
        songName:'伍佰 <br><div class="subtitle">晚风</div>',
        poster:"../image/music/song/wanfeng.jpg"
    },
    {
        id:'14',
        songName:'杨一歌 <br><div class="subtitle">苏公堤</div>',
        poster:"../image/music/song/sugongdi.jpg"
    },
];

//可以通过追加元素实现列表初始化，使页面结构整洁，但如果加载慢，则会出现页面只有一两个元素
Array.from(document.getElementsByClassName('songItem')).forEach((element,i)=>{
    //改变播放列表中的封面
    element.getElementsByTagName('img')[0].src=songs[i].poster;
    //歌手和歌曲名
    element.getElementsByTagName('h5')[0].innerHTML = songs[i].songName;
})

let masterPlay = document.getElementById('masterPlay');
let wave = document.getElementsByClassName('wave')[0];
//主播放器播放功能
masterPlay.addEventListener('click',function(){
    if(music.paused || music.currentTime <= 0){
        music.play();
        this.classList.remove('fa-play');
        this.classList.add('fa-pause');
        wave.classList.add('active2');
    }else{
        //fa-pause
        music.pause();
        this.classList.remove('fa-pause');
        this.classList.add('fa-play');
        wave.classList.remove('active2');
    }
})

//播放按钮的排他思想实现
const makeAllPlays = () =>{
    Array.from(document.getElementsByClassName('playListPlay')).forEach((element)=>{
            element.classList.remove('fa-pause-circle');
            element.classList.add('fa-play-circle');
            
    })
}
//播放歌曲时显示的颜色深浅排他实现
const makeAllBackgrounds = () =>{
    Array.from(document.getElementsByClassName('songItem')).forEach((element)=>{
            element.style.background = "rgb(105,105,170,0)";
            
    })
}

let index = 0;//音乐索引号
let poster_master_play = document.getElementById('poster_master_play');
let title = document.getElementById('title');

/*播放列表的音乐播放实现*/
Array.from(document.getElementsByClassName('playListPlay')).forEach((element)=>{
    element.addEventListener('click',(e)=>{
        index = e.target.id;
        makeAllPlays();
        e.target.classList.remove('fa-play-circle');
        e.target.classList.add('fa-pause-circle');
        music.src = '../Audio/'+index+'.mp3';
        //利用存储的歌曲的数组songs的poster找到对应的封面图片
        //index是从1开始的，但是songs数组从0开始，所以-1时才会对齐
        poster_master_play.src = songs[index-1].poster;
        music.play();
        let song_title = songs.filter((ele)=>{
            return ele.id == index;
        })

        song_title.forEach(ele=>{
            let {songName} = ele;
            title.innerHTML = songName;
        })
        masterPlay.classList.remove('fa-play');
        masterPlay.classList.add('fa-pause');
        wave.classList.add('active2');
        music.addEventListener('ended',()=>{
            masterPlay.classList.remove('fa-pause');
            masterPlay.classList.add('fa-play');
            wave.classList.remove('active2');
        })
        makeAllBackgrounds();
        //使得正在播放的播放列表的歌曲背景变深一点
        Array.from(document.getElementsByClassName('songItem'))[index-1].style.background = "rgb(105,105,170,.1)";
    })
})

let currentStart = document.getElementById('currentStart');
let currentEnd = document.getElementById('currentEnd');
let seek = document.getElementById('seek');
let bar2 = document.getElementById('bar2');
let dot = document.getElementsByClassName('dot')[0];


music.addEventListener('timeupdate',()=>{
    let music_curr = music.currentTime;
    let music_dur = music.duration;
    let min = Math.floor(music_dur/60);
    let sec = Math.floor(music_dur%60);
    sec = sec < 10 ? '0'+sec : sec;
    //换歌的时候会出现短暂的NaN
    currentEnd.innerText = min + ':' + sec;

    let min1 = Math.floor(music_curr/60);
    let sec1 = Math.floor(music_curr%60);
    sec1 = sec1 < 10 ? '0'+sec1 : sec1;

    currentStart.innerText = min1 + ':' + sec1;

    let progressbar = parseInt((music.currentTime/music.duration)*100);
    seek.value = progressbar;
    let seekbar = seek.value;
    //歌曲播放时每秒的进度条变化
    bar2.style.width = seekbar +'%';
    dot.style.left = seekbar + '%';
})

seek.addEventListener('change',()=>{
    music.currentTime = seek.value * music.duration / 100;
})

music.addEventListener('ended',()=>{
    masterPlay.classList.remove('fa-pause');
    masterPlay.classList.add('fa-play');
    wave.classList.remove('active2');
})

let vol_icon = document.getElementById('vol_icon');
let vol = document.getElementById('vol');
let vol_dot = document.getElementById('vol_dot');
let vol_bar = document.getElementsByClassName('vol_bar')[0];

vol.addEventListener('change',()=>{
    if(vol.value == 0){
        vol_icon.classList.remove('fa-volume-down');
        vol_icon.classList.add('fa-volume-off');
        vol_icon.classList.remove('fa-volume-up');
    }
    if(vol.value > 0){
        vol_icon.classList.add('fa-volume-down');
        vol_icon.classList.remove('fa-volume-off');
        vol_icon.classList.remove('fa-volume-up');
    }
    if(vol.value > 50){
        vol_icon.classList.remove('fa-volume-down');
        vol_icon.classList.remove('fa-volume-off');
        vol_icon.classList.add('fa-volume-up');
    }

    //音量条的变化
    let vol_a = vol.value;
    vol_bar.style.width = vol_a + '%';
    vol_dot.style.left = vol_a + '%';
    music.volume = vol_a / 100;
})

let back = document.getElementById('back');
let next = document.getElementById('next');

//回退功能
back.addEventListener('click',()=>{
    index -= 1;
    if(index < 1){
        index = Array.from(document.getElementsByClassName('songItem')).length;
    }
    music.src = '../Audio/'+index+'.mp3';
    poster_master_play.src = songs[index-1].poster;
    music.play();
    let song_title = songs.filter((ele)=>{
        return ele.id == index;
    })
    song_title.forEach(ele=>{
        let {songName} = ele;
        title.innerHTML = songName;
    })
    makeAllPlays();
    document.getElementById(index-1).classList.remove('fa-play');
    document.getElementById(index-1).add('fa-pause');
    makeAllBackgrounds();
    Array.from(document.getElementsByClassName('songItem'))[index-1].style.background = "rgb(105,105,170,.1)";
})

//前进功能
next.addEventListener('click',()=>{
    index -= 0;
    index += 1;
    if(index > Array.from(document.getElementsByClassName('songItem')).length){
        index = 1;
    }
    music.src = '../Audio/'+index+'.mp3';
    poster_master_play.src = songs[index-1].poster;
    music.play();
    let song_title = songs.filter((ele)=>{
        return ele.id == index;
    })
    song_title.forEach(ele=>{
        let {songName} = ele;
        title.innerHTML = songName;
    })
    makeAllPlays();
    document.getElementById(index-1).classList.remove('fa-play');
    document.getElementById(index-1).add('fa-pause');
    makeAllBackgrounds();
    Array.from(document.getElementsByClassName('songItem'))[index-1].style.background = "rgb(105,105,170,.1)";
})

let left_scroll = document.getElementById('left_scroll');
let right_scroll = document.getElementById('right_scroll');
let pop_song = document.getElementsByClassName('pop_song')[0];

left_scroll.addEventListener('click',function(){
    pop_song.scrollLeft -= 330;
})

right_scroll.addEventListener('click',function(){
    pop_song.scrollLeft += 330;
})

let left_scrolls = document.getElementById('left_scrolls');
let right_scrolls = document.getElementById('right_scrolls');
let item = document.getElementsByClassName('item')[0];

left_scrolls.addEventListener('click',function(){
    item.scrollLeft -= 330;
})

right_scrolls.addEventListener('click',function(){
    item.scrollLeft += 330;
})



/*推荐板块的按钮播放功能实现
var buttons = document.querySelector('#buttons');

//父元素查找指定子元素方法不行
//firstElementChild可以找到第一个button子元素，因为只有两个按钮，简单操作
var content_btn_play = buttons.firstElementChild;

content_btn_play.addEventListener('click',function(){
    makeAllPlays();
    music.src = '../Audio/1.mp3';
    index =1;
    poster_master_play.src = songs[index].poster;
    music.play();
    //播放按钮的改变
    masterPlay.classList.remove('fa-play');
    masterPlay.classList.add('fa-pause');
})*/