import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { PlaylistDocument } from './Playlist';


export interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
  playlists: PlaylistDocument[];
  isCorrectPassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<UserDocument>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, match: [/.+@.+\..+/, 'Must use a valid email address'] },
    password: { type: String, required: true },
    playlists: [{ type: Schema.Types.ObjectId, ref: 'Playlist' }],
  },
  {
    toJSON: { virtuals: true },
  }
);

userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

userSchema.methods.isCorrectPassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

const UserModel = model<UserDocument>('User', userSchema);

export default UserModel;

