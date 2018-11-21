export default class ValidationUtil {

    static validateStringForLength(string, min,max){
        return string!==undefined && string.toString().length >= min && string.toString().length <= max;
    }

    static validateDateForNotThisYear(date){
        let b = this.validateDateToPattern(date);
        if (b){
            date = Array.isArray(date) ? date.join('') : date;
            return Number(date.split('/')[2]) < new Date().getFullYear();
        }else{
            return false;
        }
    }

    static validateForNumber(string){
        return /^-?[\d.]+(?:e-?\d+)?$/.test(string)
    }

    static validateDateToPattern(date){ //pattern = dd/MM/yyyy
        return /^([0-2][0-9]|(3)[0-1])(\/)(((0)[1-9])|((1)[0-2]))(\/)\d{4}$/.test(date.toString());
    }

    static validateNumberInTheRage(number, min, max){
        return number >= min && number <= max;
    }

    static validateEmailForPattern(email){
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
    }

    static reformatDateFromInput(oldFormatDate){//yyyy-MM-dd
        let split = oldFormatDate.split('-');
        return `${split[2]}/${split[1]}/${split[0]}`
    }

    static getStringFromUnnownObject(obj){
        return Array.isArray(obj) ? obj.join('') : obj;
    }


}