import moment from 'moment';
function amendTime(YMD,HMS) {
    let allDate;
    if(Number.isInteger(YMD) && Number.isInteger(HMS)){
          allDate = YMD + HMS;
    }else{
          allDate = YMD +' '+ HMS;
    }
   

    return moment(allDate)
    
};



export default {
    amendTime
};