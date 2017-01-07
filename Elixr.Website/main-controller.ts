import ModalService from "services/modal-service";
import { RPGPlayerSession } from "services/rpg-player-session"

export class MainController{

    static $inject = ["modalService",  "rpgPlayerSession"];
    constructor(private modalService:ModalService, private rpgPlayerSession:RPGPlayerSession){
    }

    forceSidebar = false;
    toggleSidebar():void{
        this.forceSidebar = !this.forceSidebar;
    }

    shouldRemoveScrollFromBody():boolean {
        if(!this.modalService){
            return false;
        }
        return this.modalService.modalActive;
    }

    get usernameText():string {
        if(!this.rpgPlayerSession.isAuthenticated) {
            return "Sign In";
        }
        return this.rpgPlayerSession.playerName;
    }
}