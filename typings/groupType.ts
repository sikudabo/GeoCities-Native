export type GroupType = {
    avatar: string;
    blockList?: Array<string>;
    creator: string;
    createdAt: number;
    description: string;
    groupName: string;
    members: Array<string>;
    moderators?: Array<string>;
    rules?: Array<string>;
    topic: string;
};