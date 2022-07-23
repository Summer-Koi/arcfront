<script>
import axios from 'axios'

export default {
    data() {
        return {
            info:{},
            info_loaded:false,
            chap_sel:'',
            song_sel:{
                name:'',
                id:''
            },
            song_ans:{
                name:'',
                id:''
            },
            point:0,
            round:0,
            round_over:false,
            slice_len:2000,
            all_song_list:[]
        }
    },
    mounted() {
        axios.get('http://82.157.195.45:5000/songlist')
            .then((res) => {
                this.info = res.data;
                this.info_loaded = true;
                this.init();
            })
            .catch(() => {
                console.log('Get Songlist Error')
            })
    },
    methods:{
        init(){
            this.point = 0;
            this.round = 0;
            this.round_over = false;
            this.chap_sel = this.info.chapters[0].chapter_id;
            for (var i = 0; i < this.info.chapters.length; i++){
                this.all_song_list.push(...this.info.chapters[i].chapter_songs)
            }
            this.random_new_song();
        },
        change_chap_sel(chap_id){
            this.chap_sel = chap_id;
            this.song_sel.id = '';
            this.song_sel.name = '';
        },
        change_song_sel(song_name,song_id){
            this.song_sel.name = song_name;
            this.song_sel.id = song_id;
        },
        random_new_song(){
            let s = Math.floor(Math.random()*this.all_song_list.length + 1) - 1;
            this.song_ans.name = this.all_song_list[s].name;
            this.song_ans.id = this.all_song_list[s].id;
        },
        check_answer(){
            if (this.song_sel.id === '')
                console.log('empty')
            else if (this.round_over)
                console.log('round over');
            else
            {
                if (this.song_sel.id === this.song_ans.id)
                {
                    console.log('correct');
                    this.point ++;
                }
                else
                {
                    console.log('error');
                }
                this.round_over = true;
            }
        },
        next_round(){
            if (this.round_over)
            {
                this.round ++;
                this.round_over = false;
                this.random_new_song();
                this.song_sel.id = '';
                this.song_sel.name = '';
            }
        }
    },
    computed:{
        songlist : function(){
            if (this.info == null)
                return []
            else
                return this.info.chapters.find(x => x.chapter_id === this.chap_sel).chapter_songs
        },
        song_src : function(){
            if (this.song_ans.id === '')
                return ''
            else
                return 'http://82.157.195.45:5000/song/'+this.song_ans.id + '+' + this.slice_len + '+' + Math.random().toString(10).substr(2,8)
        }
    }
}

</script>

<template>
    <div id="wrapper">
        <div id="quizStatus">
            <div class="status">进度:{{round}}/10</div>
            <div class="status">得分:{{point}}</div>
        </div>
        <audio id="audioPlayer" controls autoplay :src="song_src"></audio>
        <div>
            <br style="clear: both;">
        </div>
        <div id="answerTitle">
            <div>当前选择：{{song_sel.name}}</div>
            <div v-show="round_over">正确答案：{{song_ans.name}}</div>
        </div>
        <div id="chapter-list" v-if="info_loaded">
            <div class="selectable"
            :class="{selected:chap.chapter_id===chap_sel}"
            v-for="chap in info.chapters" 
            :key="chap.chapter_id"
            @click="change_chap_sel(chap.chapter_id)">
                {{chap.chapter_name}}
            </div>
        </div>
        <div id="song-list" v-if="info_loaded">
            <div class="selectable"
            :class="{selected:song.id===song_sel.id}"
            v-for="song in songlist"
            :key="song.id"
            @click="change_song_sel(song.name,song.id)">
            {{song.name}}
            </div>
        </div>
        <div style="clear: both;height: 2px;"></div>
        <div id="buttonGroup">
            <div id="ok" class="clickable" :class="{disabled:song_sel.name===''}" @click="check_answer">确定</div>
            <div style="clear: both;height: 2px;"></div>
            <div id="next" class="clickable" :class="{disabled:round_over===false}" @click="next_round">下一题</div>
        </div>
        
    </div>
</template>


<style>

#wrapper {
    width: 482px;
}

#quizStatus {
    float: left;
    padding: 8px;
    text-align: left;
}

#answerTitle {
    width: 482px;
    height: 40px;
    text-align: left;
    padding: 8px;
}

#audioPlayer {
    float: right;
}

#chapter-list {
    width: 180px;
    height: 394px;
    float: left;
    overflow: auto;
    border-right: 2px solid #E8E8E8;
    background: #F4F4F4;
}
#song-list {
    width: 300px;
    height: 394px;
    float: right;
    overflow: auto;
    background: #F4F4F4;
}
.selectable {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    cursor: pointer;
    background: #e8ebef;
    font-weight: normal;
    padding: 2px 4px;
    line-height: normal;
    vertical-align: middle;
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
    box-sizing: border-box;
}
.selectable:nth-child(odd){
    background-color: rgb(246,248,249);
}

.selectable:hover, .selectable:focus{
    color: #F2B040;
}

#chapter-list .selected{
    background: #A7D7F3;
}
#song-list .selected{
    background: #A7D7F3;
}

.clickable {
    text-align: center;
    border-radius: 4px;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    cursor: pointer;
    border: 1px solid #E8E8E8;
    background: #E8E8E8;
    font-weight: normal;
    font-size: 1em;
    padding: .4em 1em;
    line-height: normal;
    vertical-align: middle;
    overflow: visible;
}

.clickable:hover, .clickable:focus{
    border: 1px solid #F2B040;
    background: #F4F4F4;
    color: #252525;
}

#buttonGroup .disabled {
    color: gray;
}

</style>