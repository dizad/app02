module.exports = {
//capitalize the 1s letter of the string
    capitalizeFirst: word => {
        return word.charAt(0).toUpperCase() + word.slice(1)
    },
//get friendly date time
    getFriendlyDateTime: date => {
        return moment(date).format('MM/DD/YY hh:mm A');
    },
//get friendly date
    getFriendlyDate: date => {
        return moment(date).format('MM/DD/YY');
    },
//get color
    getColor: (red, green, blue, opacity) => {
        return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
    },
//get key-value friendly
    getKeyValueFriendly: (key, value) => {
        return `${value}(${key})`;
    },
//get friendly dollar
    getDollarFriendly(value){
        if(value != null){
            return `$` + value.toLocaleString('en-US', {maximumFractionDigits : 2, minimumFractionDigits : 2 });
        }else{
            return ``;
        }
    },
}