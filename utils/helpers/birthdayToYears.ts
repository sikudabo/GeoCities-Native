export default function birthdayToYears(dob: Date) {
    const diff_ms = new Date().getTime() - new Date(dob).getTime();
    const age_dt = new Date(diff_ms); 
    return Math.abs(age_dt.getUTCFullYear() - 1970);
}