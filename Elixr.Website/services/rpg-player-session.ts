export class RPGPlayerSession {

    private _authToken;

    private get authToken(): any {
        if (!this._authToken) {
            let atJSON = localStorage.getItem("authToken");
            if (atJSON) {
                this._authToken = JSON.parse(atJSON);
            }
        }

        return this._authToken;
    }

    get isAuthenticated(): boolean {
        if(!localStorage.getItem("authToken")){
            this._authToken = null;
        }
        if (this.authToken) {
            return true;
        }
        return false;
    }
    get playerName(): string {
        if(!this.isAuthenticated){
            return "";
        }
        return this.authToken.playerName;
    }
    get playerId(): number {
        if(!this.isAuthenticated){
            return 0;
        }
        return this.authToken.playerId;
    }
}