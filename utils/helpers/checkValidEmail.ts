export const checkValidEmail = (email: string) => {
    if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
        return false;
    }

    return true;
}