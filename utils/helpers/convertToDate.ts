export default function convertToDate(date_1: number) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const firstDate = new Date(date_1);
    const monthIndex = firstDate.getMonth();
    const month = months[monthIndex];
    const dayOfMonth = firstDate.getDate();
    const year = firstDate.getFullYear();
    const dateString = `${month} ${dayOfMonth}, ${year}`;

    return dateString;
}