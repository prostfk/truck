export default class ValidationUtil {

    static validateStringForLength(string, min,max){
        return string.length >= min && string.length <= max;
    }

    static validateDate(date){
        return date < new Date().getTime();
    }

    static validateForNumber(string){
        return /^-?[\d.]+(?:e-?\d+)?$/.test(string)
    }

    static validateDateToPattern(date){ //pattern = dd/MM/yyyy
        return /^([0-2][0-9]|(3)[0-1])(\/)(((0)[1-9])|((1)[0-2]))(\/)\d{4}$/.test(date.toString())
    }

    static validateNumberInTheRage(number, min, max){
        return number >= min && number <= max;
    }

    static validateEmailForPattern(email){
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
    }

}