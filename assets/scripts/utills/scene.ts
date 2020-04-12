
import ResManager from "../managers/resManager"
import UIManager from "../managers/UIManager"

export default class Scene {

    protected canvas: cc.Node = cc.find("Canvas");
    protected ui: cc.Node = null;
    protected UIName: string = null;

    protected res_pkg: object = {
        prefabs: [],    
        sprite_frames:[],        
        audio_clips: [],       
        sprite_atlases: [],
    };

    /**
     * 预加载场景资源
     * @param on_process 进度条函数，参数为百分比
     */
    public async preload(on_process: Function): Promise<boolean> {
        try {
            await ResManager.instance.preload_res_pkg(this.res_pkg, on_process);
        } catch (error) {
            cc.log("加载资源出错！")
        }
        return;
    } 
 
    /**
     * 进入场景
     */
    public enter(): void {
        if (this.canvas === null) {
            cc.error("[game_app]: canvas is null");
        }
        this.ui = UIManager.show_ui_at(this.canvas, this.UIName);
    }
 
    /**
     * 删除当前场景的数据
     * @param bRelease 是否执行资源卸载; 同一个场景切换不用卸载资源
     */
    public destroy(bRelease: boolean): void { 
        //this.ui.removeFromParent();
        this.ui.destroy();
        if (bRelease) { 
            ResManager.instance.release_res_pkg(this.res_pkg);
        }
    }

}
