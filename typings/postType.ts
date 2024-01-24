export type PostType = {
    authorId: string;
    userName: string;
    postOriginType: 'community' | 'profile';
    createdAt: number;
    postType: 'video' | 'photo' | 'link' | 'text';
    communityName?: string;
    caption?: string;
    likes: Array<string>;
    postMediaId?: string;
    link?: string;
    hashTags: Array<string>;
    comments: Array<CommentType>;
    _id: string;
};

export type CommentType = {
    authorId: string;
    postId: string;
    commentType: string;
    userName: string;
    createdAt: Date;
    caption?: string;
    postAuthorId: string;
    hashtags?: Array<string>;
    likes: Array<string>;
    postMediaId?: string;
    link?: string;
};