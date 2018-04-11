export class Convert {

    listNumeber = ['0','1','2','3','4','5','6','7','8','9'];
    public number:number;
    numberS:string = '';

    convertToNumber(value: any): any {
        let number: number;
        if(this.listNumeber.find(c=> c ==  value)){
           this.numberS = this.numberS + value;
           this.number = parseInt(this.numberS);
        }else{

        }
    }


}
