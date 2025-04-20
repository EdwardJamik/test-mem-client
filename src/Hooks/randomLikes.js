export const generateRandomLikes = (posts) => {
    return posts.map(post => {
        return {
            ...post,
            randomLikes: Math.floor(Math.random() * 990) + 10
        };
    });
};