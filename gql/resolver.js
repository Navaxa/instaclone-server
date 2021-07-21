const { register, login, getUser, updateAvatar, deleteAvatar  } = require('../controllers/user');

const resolvers = {
    Query: {
        // User
        getUser: (_, {id, username}) => getUser(id, username)
    },

    Mutation: {
        // User
        register: async (_, {input}) => register(input),
        login: async (_, {input}) => login(input),
        updateAvatar: (_, {file}, ctx) => updateAvatar(file, ctx),
        deleteAvatar: (_, {}, ctx) => deleteAvatar(ctx)
    }
};

module.exports = resolvers;