const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({_id: context.user._id}).select('-__v -password');
      }
      throw new AuthenticationError("You must be logged in!");
    },
  },

  Mutation: {
    login: async (parent, { email, password }) => {
        const user = await User.findOne({ email });
        if (!user) {
            throw new AuthenticationError("No user found with this email address");
        };

        const correctPW = await user.isCorrectPassword(password);
        if (!correctPW) {
            throw new AuthenticationError("Incorrect login credentials!");
        };

        const token = signToken(user);
        return { token, user };
    },
    
    addUser: async (parent, { username, email, password }) => {
        const user = await User.create({ username, email, password });
        const token = signToken(user);
        return { token, user };
      },

      saveBook: async (parent, { bookData }, context) => {
        if (context.user) {
            const updatedUser = await User
                .findOneAndUpdate(
                    { _id: context.user._id }, 
                    { $addToSet: { savedBooks: bookData } },
                    { new: true, runValidators: true  },
                )
            return updatedUser;
        };
        throw new AuthenticationError("You must be logged in to save books!");
    },

    removeBook: async (parent, { bookId }, context) => {
        if (context.user) {
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId } } },
                { new: true },
            );
            return updatedUser;
        };
        throw new AuthenticationError("You must be logged in to delete books!");
    }
},
};

module.exports = resolvers;