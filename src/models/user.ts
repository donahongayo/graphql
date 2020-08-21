import { Schema, model, Document } from 'mongoose';

export interface User extends Document {
  email: string;
  password: string;
  name?: string;
}

const schema = new Schema({
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  name: {
    type: String,
  },
});

const userSchema = new Schema(schema, { timestamps: true });

export default model<User>('users', userSchema);
