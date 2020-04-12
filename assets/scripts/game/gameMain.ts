import HomeScene from "./homeScene"
import GameScene from "./gameScene"
import Energy from "../dataCenter/energy"
import UserData from "../dataCenter/userData";
import Playing from "../dataCenter/playing"
import ResManager from "../managers/resManager"
import StageCfg from "../config/StageCfg"
import CloudFunc from "../wx/cloudFunc"
import Animation from "../utills/animation"

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameMain extends cc.Component {

    private cur_scene = null;

    public async onLoad(): Promise<any> {
        console.log("init game framework ... ...")

        // 初始化，框架里面的每个管理模块
        const resManager: ResManager = ResManager.getInstance();
        resManager.init("[resManager]模块初始化成功！");

        const cloudFunc: CloudFunc = CloudFunc.getInstance();
        cloudFunc.init("[cloudFunc]模块初始化成功！");

        const energy: Energy = Energy.getInstance();
        energy.init("[energy]模块初始化成功！");

        const userData: UserData = UserData.getInstance();
        userData.init("[userData]模块初始化成功！");

        const stageCfg: StageCfg = StageCfg.getInstance();
        await stageCfg.init("[stageCfg]模块初始化成功！");

        const playing: Playing = Playing.getInstance();
        playing.init("[playing]模块初始化成功！");

        const animation: Animation = Animation.getInstance();
        animation.init("[animation]模块初始化成功！")

        console.log("init game framework success!");
    }

    public start(): void {
        this.enterScene("homeScene");
    }

    // update (dt) {}

    /**
     * 切换场景函数
     * @param scene 场景名称
     */
    public async enterScene(sceneName: string): Promise<boolean> {
        switch (sceneName) {
            case "homeScene":
                let home_scene = new HomeScene();
                await this._enterScene(home_scene);
                this.cur_scene = home_scene;
                break;
            case "gameScene":
                let game_scene = new GameScene();
                await this._enterScene(game_scene);
                this.cur_scene = game_scene;
                break;
            default:
                break;
        }
        return;
    }

    /**
     * 单个场景进入时的处理逻辑
     * @param scene 场景名称
     */
    private async _enterScene(scene: HomeScene | GameScene): Promise<boolean> {
        if (scene === null) {
            return;
        }
        if (this.cur_scene !== null) {
            await scene.preload(null);
            this.cur_scene.destroy(this.cur_scene === scene);
            scene.enter();
        } else {
            await scene.preload(null);
            scene.enter();
        }
        return;
    }

}
