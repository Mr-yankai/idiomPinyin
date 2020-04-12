
export default class SoundManager {

    //当前正播放的音乐url
    public static music_playing_url: string = null; 

    //当前是否正在播放背景音乐
    public static music_playing: boolean = false;

    //本地储存音乐开关状态
    public static localstorage_music_status(status: string): void{
        cc.sys.localStorage.setItem("music_status",status);
    }

    //本地储存音效开关状态
    public static localstorage_effect_status(status: string): void{
        cc.sys.localStorage.setItem("effect_status",status);
    }

    //获取音乐开关状态
    public static get_music_status(): string{
        let status: string = cc.sys.localStorage.getItem("music_status");
        if( status === null || status === ""){   //没有存储值,默认为开
            return "on";
        }
        else{
            return status;
        }
    }

    //获取音效开关状态
    public static get_effect_status(): string{
        let status: string = cc.sys.localStorage.getItem("effect_status");
        if( status === null || status === ""){
            return "on";
        }
        else{
            return status;
        }
    }

    //转换音乐开关状态
    public static turn_music_status(): void{
        let music_status: string = this.get_music_status();
        if(music_status == "on"){
            music_status = "off";
            this.localstorage_music_status("off");
            this.stop_music();
        }
        else {
            music_status = "on";
            this.localstorage_music_status("on");
            this.play_music(this.music_playing_url);
        }
    }

    //转换音效开关状态
    public static turn_effect_status(): void{
        let effect_status: string = this.get_effect_status();
        if(effect_status == "on"){
            effect_status = "off";
            this.localstorage_effect_status("off");
        }
        else {
            effect_status = "on";
            this.localstorage_effect_status("on");
        }
    }

    //播放背景音乐
    public static play_music(url: string){
        let music_status: string = this.get_music_status();
        if(music_status == "on" || this.music_playing){
            return;
        }
        cc.audioEngine.stopMusic();
        cc.loader.loadRes(url, cc.AudioClip, (err, clip) => {
             cc.audioEngine.playMusic(clip, true); 
             this.music_playing_url = url;
             this.music_playing = true ;
        });        
    }

    //停止播放背景音乐
    public static stop_music(): void{
        if(!this.music_playing){
            return;
        }
        cc.audioEngine.stopMusic();
        this.music_playing = false;
    }

    //播放音效
    public static play_effect(url: string){
        let effect_status: string = this.get_effect_status();
        if(effect_status == "off"){
            return;
        }
        cc.loader.loadRes(url, cc.AudioClip, function (err, clip) {
            cc.audioEngine.playEffect(clip, false);
        });
    }
}
