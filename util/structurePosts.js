

const structurePosts = (posts) => {

    const restructuredData = {};
    const postMap = new Map(posts.map(post => [post.PostID, post]));

    for (const post of posts) {
        if (post.ParentID) {
            const parentPost = postMap.get(post.ParentID);
            if (parentPost) {
                parentPost.Comments = (parentPost.Comments || 0) + 1;
                parentPost.CommentsList = parentPost.CommentsList || [];
                parentPost.CommentsList.push(post);
            }
        } else {
            restructuredData[post.PostID] = post;
        }
    }

    return restructuredData;
}

module.exports = structurePosts
