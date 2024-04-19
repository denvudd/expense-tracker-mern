import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

export const userResolver = {
  Query: {
    authUser: async (_, _, context) => {
      try {
        const user = context.getUser();

        return user;
      } catch (error) {
        console.log("Error in authUser:", error);
        throw new Error(error.message || "Internal server error");
      }
    },

    user: async (_, { userId }) => {
      try {
        const user = await User.findById(userId);

        return user;
      } catch (error) {
        console.log("Error in user:", error);
        throw new Error(error.message || "Internal server error");
      }
    },
  },
  Mutation: {
    signUp: async (_, { input }, context) => {
      try {
        const { username, name, password } = input;

        if (!username || !name || !password) {
          throw new Error("All fields are required");
        }

        const isUserExists = await User.findOne({ username });

        if (isUserExists) {
          throw new Error("User already exists");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
          username,
          name,
          password: hashedPassword,
          profilePicture: boyProfilePic,
          gender,
          profilePicture: gender === "male" ? boyProfilePic : girlProfilePic,
        });

        await newUser.save();
        await context.login(newUser);

        return newUser;
      } catch (error) {
        console.error("Error in signUp: ", err);
        throw new Error(err.message || "Internal server error");
      }
    },

    login: async (_, { input }, context) => {
      try {
        const { username, password } = input;

        const { user } = await context.authenticate("graphql-local", {
          username,
          password,
        });

        await context.login(user);
        return user;
      } catch (error) {
        console.error("Error in login:", err);
        throw new Error(err.message || "Internal server error");
      }
    },

    logout: async (_, { input }, context) => {
      try {
        await context.logout();

        req.session.destroy((error) => {
          if (error) {
            throw new Error(error);
          }
        });
        req.clearCookies("connect.sid");

        return {
          message: "Logged out successfully",
        };
      } catch (error) {
        console.error("Error in login:", err);
        throw new Error(err.message || "Internal server error");
      }
    },
  },
};
