import { GroupType } from "./groupType";

export type UserType = {
    createdOn: number;
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
    blockedFrom: Array<string>;
    groupsBlockedFrom: Array<string>;
    groups: Array<string>;
    userGroups: Array<GroupType>;
};