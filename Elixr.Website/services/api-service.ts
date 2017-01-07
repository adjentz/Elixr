export default class ApiService {
    static $inject = ["$http"];
    private serviceUrl = "/api";

    constructor(private $http: angular.IHttpService) {

    }

    private addAuthTokenIfAvailable():void{
        let authTokenStr = localStorage.getItem("authToken");
        if(authTokenStr){
            this.$http.defaults.headers.common["authToken"] = authTokenStr;
        }
    }
    post<T, OutT>(resource: string, data: T): angular.IHttpPromise<OutT> {
        this.addAuthTokenIfAvailable();
        if (resource.indexOf("/") !== 0) {
            resource = "/" + resource;
        }
        return this.$http.post<OutT>(this.serviceUrl + resource, data)
    }

    get<OutT>(resource: string): angular.IHttpPromise<OutT> {
        this.addAuthTokenIfAvailable();
        if (resource.indexOf("/") !== 0) {
            resource = "/" + resource;
        }
        return this.$http.get<OutT>(this.serviceUrl + resource);
    }
}