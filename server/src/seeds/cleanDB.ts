import {Playlistmodel, User} from '../models/index.js';


export default async () => {
  try {
   await User.deleteMany({});
   await Playlistmodel.deleteMany({});
  } catch (err) {
    throw err;
  }
}
