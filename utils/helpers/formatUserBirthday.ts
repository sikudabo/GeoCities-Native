export const  formatUserBirthday = (val: any) => {
    const formattedUserBirthday = new Date(val).getTime();
    return formattedUserBirthday;
}