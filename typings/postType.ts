export type PostType = {
    authorId: string;
    userName: string;
    postOriginType: 'community' | 'profile';
    createdAt: number;
    postType: 'video' | 'photo' | 'link' | 'text';
    groupName?: string;
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
    commentType: 'video' | 'photo' | 'link' | 'text';
    userName: string;
    createdAt: number;
    caption?: string;
    postAuthorId: string;
    hashTags?: Array<string>;
    likes: Array<string>;
    postMediaId?: string;
    link?: string;
    _id: string;
};