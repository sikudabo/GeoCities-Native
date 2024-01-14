export type UserType = {
    firstName: string;
    lastName: string;
    email: string;
    dob: any;
    followers: Array<string>;
    following: Array<string>;
    avatar: string;
    geoScore: number;
    communities: Array<string>;
    locationCity: string;
    locationState: string;
    blockList: Array<string>;
};