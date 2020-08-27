/* eslint-disable @typescript-eslint/ban-types */
import User from '../models/user';

const EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

const userRoot = {
  Query: {
    users() {
      return User.find();
    },
    user: async (root: object, args: { id: string }) => {
      const user = await User.findOne({ id: args.id }).exec();
      return user;
    },
  },

  Mutation: {
    createUser: async (
      root: object,
      args: {
        email: string;
        password: string;
        name: string;
      },
    ) => {
      const argsParse = JSON.parse(JSON.stringify(args));
      //console.log(argsParse);
      //console.log(argsParse.input.email);
      const account = await User.findOne({ email: argsParse.input.email });
      if (account) {
        throw new Error('Email exists');
      } else if (!EMAIL_REGEXP.test(argsParse.input.email)) {
        throw new Error('Please try another email');
      } else {
        const user = new User({
          email: argsParse.input.email,
          password: argsParse.input.password,
          name: argsParse.input.name,
        });
        return await user.save();
      }
    },
    updateProfile: async (
      root: object,
      args: {
        id: string;
        name: string;
        password: string;
      },
    ) => {
      const argsParse = JSON.parse(JSON.stringify(args));
      console.log(argsParse);
      const documentQuery = { _id: argsParse.input.id };
      await User.updateOne(documentQuery, {
        password: argsParse.input.password,
        name: argsParse.input.name,
      }).exec();

      const user = await User.findOne(documentQuery).exec();
      return user;
    },
  },
};
export default userRoot;
