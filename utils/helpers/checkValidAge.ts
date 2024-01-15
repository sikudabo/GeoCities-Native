export const checkValidAge = (birthdateMilliseconds: number) => {
    const todayMilliseconds = Date.now();

    if(todayMilliseconds - birthdateMilliseconds < 410240038000) {
        return false;
    }

    return true;
}