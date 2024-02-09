import { months } from "../constants";

export default function createdDate(createdOn: Date) {
    const createdDate = new Date(createdOn);
    const createdDay = createdDate.getDate();
    const createdMonth = createdDate.getMonth();
    const createdYear = createdDate.getFullYear();
    const createdMonthString = months[createdMonth];
    return `${createdMonthString} ${createdDay}, ${createdYear}`;
}