export default function postTimeDifference(date_1: number) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const firstDate = new Date(date_1);
    const monthIndex = firstDate.getMonth();
    const month = months[monthIndex];
    const dayOfMonth = firstDate.getDate();
    const year = firstDate.getFullYear();
    const dateString = `${month} ${dayOfMonth}, ${year}`;
    const date_2 = Date.now();
    const difference = date_2 - date_1;
    const daysDifference = Math.floor(difference/1000/60/60/24);
    const hoursDifference = Math.floor(difference/1000/60/60);
    const minutesDifference = Math.floor(difference/1000/60);
    const secondsDifference = Math.floor(difference/1000);

    if(daysDifference > 0) {
        return dateString;
    }
    else if(hoursDifference > 0 && hoursDifference < 23) {
        return `${hoursDifference} hr ago`;
    }
    else if(minutesDifference > 0 && minutesDifference < 60) {
        return `${minutesDifference} min ago`;
    }
    else if(minutesDifference === 0) {
        return `${secondsDifference} secs ago`
    }
    else {
        return dateString;
    }
}