module.exports = {
//get a deep clone
    deepClone: shallowClone => {           
        return JSON.parse(JSON.stringify(shallowClone));
    },
//get next id
    getNextId: data => {
        let max = 1;
        for(let i = 0; i < data.length; i++){
            let count = parseInt(data[i].substring(4));
            if(max <= count){
                max = count + 1;
            }
        }
        return max;
    },
//get hours from now
    getHoursFromNow: (date) => {
        let hours = moment(date).diff(moment(), 'hours', true);
        return Math.round(hours * 100) / 100; //round to 2
    }, 
}