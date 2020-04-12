
export default class ResManager {

    public static instance: ResManager = null;

    public static getInstance(): ResManager{
        if(this.instance == null){
         this.instance = new ResManager();
     }
     return this.instance;
    }

    public init(src): void {
        console.log(src);
    }

    /**
     * 获取资源包集合中的资源总数量
     * @param res_set 资源包集合
     */
    private getResTotalCount(res_set): number {
        let total_num = 0;
        for(let key in res_set){
            total_num += res_set[key].length;
        }
        return total_num;
    }

    /**
     * 预列加载场景资源集合包
     * @param res_set {prefabs: [], sprite_frames:[], audio_clips: [], sprite_atlases: []}
     * @param on_progress 进度条函数: function(per) [per: 0, 1]
     */
    public async preload_res_pkg(res_set: any, on_progress: Function): Promise<boolean>{
        let now_loaded  = 0;
        let total_num = this.getResTotalCount(res_set);
 
        let promise = new Promise<boolean>((resolve)=>{
            if(total_num === 0){
                 resolve(true);
             }
            for(let key in res_set){
                let type: any = null;
                switch (key) {
                    case "prefabs":
                        type = cc.Prefab;
                        break;
                    case "sprite_frames":
                        type = cc.SpriteFrame;
                        break;
                    case "audio_clips":
                        type = cc.AudioClip;
                        break;
                    case "sprite_atlases":
                        type = cc.SpriteAtlas;
                        break;
                    default:
                        break;
                }
                for(let i: number = 0; i < res_set[key].length; i++){
                    let url: string = res_set[key][i];
                    cc.loader.loadRes(url, type, (err, obj)=>{
                        if(err){
                            cc.error("[error]:",err);
                            resolve(false);
                        }
                        now_loaded ++ ;
     
                        if(on_progress){
                            on_progress(now_loaded / total_num);
                        }
     
                        if (now_loaded >= total_num) {
                            resolve(true);
                        }
                    })
                }
            }
        })
        return promise;       
    }
 
    
    /**
    * 释放一个资源集合包
    * @param res_set  资源集合包
    */
    public release_res_pkg(res_set: any): void {
        if (res_set.sprite_frames && res_set.sprite_frames.length > 0) {
            cc.loader.release(res_set.sprite_frames)
        }
 
        if (res_set.audio_clips && res_set.audio_clips.length > 0) {
            cc.loader.release(res_set.audio_clips)
        }
 
        if (res_set.sprite_atlases && res_set.sprite_atlases.length > 0) {
            cc.loader.release(res_set.sprite_atlases)
        }
 
        if (res_set.prefabs && res_set.prefabs.length > 0) {
            for(var i = 0; i < res_set.prefabs.length; i ++) {
                var url = res_set.prefabs[i];
                var deps = cc.loader.getDependsRecursively(url);
                cc.loader.release(deps);
                cc.loader.release(url);
            }
        }
    }
 
    /**
     * 返回我们要获取的资源
     * @param url 资源路径
     */
    public get_res(url: string, type?: any): any {
        return cc.loader.getRes(url, type);
    }

}
