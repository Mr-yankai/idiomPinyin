
import Scene from "../utills/scene"

export default class GameScene extends Scene {

    public UIName: string = "gameUI";

    public res_pkg: object = {

        prefabs: ["ui_prefabs/gameUI"],
     
        sprite_frames:[],
        
        audio_clips: [],
        
        sprite_atlases: [],
    };

}
