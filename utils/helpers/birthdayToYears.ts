export default function birthdayToYears(birthtime: number) {
    const age = Math.floor(birthtime / 31536000000);
    return age;
}