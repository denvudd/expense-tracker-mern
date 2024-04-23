import passport from "passport";
import bcrypt from "bcryptjs";
import { GraphQLLocalStrategy } from "graphql-passport";

import User from "../models/user.model.js";

export const configurePassport = async () => {
  // Serialize user ID for session.
  passport.serializeUser((user, done) => {
    console.log("Serializing user", user);
    done(null, user.id);
  });

  // Deserialize user from session and find user by ID.
  passport.deserializeUser(async (id, done) => {
    console.log("Deserializing user", id);

    try {
      const user = User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Sort of middleware for authentication. Calls every time a request for auth is made.
  passport.use(
    new GraphQLLocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ username });

        if (!user) {
          throw new Error("Invalid username or password");
        }

        console.log('USER PASSWORD', user)

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
          throw new Error("Invalid username or password");
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );
};
