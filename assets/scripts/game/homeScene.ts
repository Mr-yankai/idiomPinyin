
import Scene from "../utills/scene"

export default class HomeScene extends Scene {

    public UIName: string = "homeUI";

    public res_pkg: object = {

        prefabs: ["ui_prefabs/homeUI" ],
     
        sprite_frames:[],
        
        audio_clips: [],
        
        sprite_atlases: ["animation/cowlist"],
    };

}
