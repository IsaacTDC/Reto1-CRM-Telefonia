

export default class RespGeneric {
    public cod:number;
    public msg:string;
    public data:{[key: string]: any};
 
    constructor() {
        this.cod = 0;
        this.msg = "";
        this.data = {};
    }
}