export type PostType = {
    authorId: string;
    userName: string;
    postOriginType: string;
    createdAt: Date;
    postType: string;
    communityName?: string;
    caption?: string;
    likes: Array<string>;
    postMediaId?: string;
    link?: string;
    hashtags: Array<string>;
    comments: Array<CommentType>;
    _id: string;
};

export type CommentType = {
    authorId: string;
    userName: string;
    createdAt: Date;
    caption: string;
    postAuthorId: string;
    hashtags: Array<string>;
};