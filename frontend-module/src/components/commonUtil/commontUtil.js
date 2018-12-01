/*
DOES NOT EXTENDS FROM REACT COMPONENT
UTIL CLASS FOR DATA PROCESSING
ALL METHODS ARE STATIC
*/
class CommonUtil {

    static getCorrectDateFromLong(longValue) {
        let d = new Date(longValue);
        let dd = d.getDate();
        if (dd > 0 && dd < 10) {
            dd = `0${dd}`;
        }
        let mm = d.getMonth() + 1;
        if (mm > 0 && mm < 10) {
            mm = `0${mm}`;
        }
        let yyyy = d.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
    }

    static isDateCorrect(date) {
        date = date.toString();
        let regex = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/;
        console.log(date.match(regex));
        return date.match(regex)
    }

    static moveElementInArray(array,from, to) {
        array.splice(to, 0, array.splice(from, 1)[0]);
    };
}

export default CommonUtil;