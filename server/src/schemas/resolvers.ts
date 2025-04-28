import { User } from '../models/index.js';
import { signToken} from '../services/auth.js';
import PlaylistModel from '../models/PlaylistModel.js';
import { IResolvers } from '@graphql-tools/utils';


interface AddUserArgs {
  input: { 
    username: string; 
    email: string; 
    password: string };
}

interface LoginArgs {
  email: string;
  password: string;
}

interface SongInput {
  name: string;
  artist: string;
}

interface PlaylistInput { 
  name: string;
  songs: SongInput[];
}

interface Playlist { 
  name: string;
  songs: SongInput[];
  user: string;
}

const resolvers: IResolvers = {
  Query: {
    user: async (args: { username: string }) => {
      const user = await User.findOne({ username: args.username }).populate('playlists.songs');
      if (!user) throw new Error('User not found');
      return user;
    },

  },

  Mutation: {
    addUser: async (_parent, { input }: AddUserArgs) => {
      try {
        const user = await User.create(input);
        const token = signToken(user.username, user.email, user._id);
        return { token, user };
      } catch (error) {
        throw new Error('Error creating user: ');
      }
    },

    login: async ({ email, password }: LoginArgs): Promise<any> => {
      try {
          const user = await User.findOne({ email });
          if (!user) {
              throw new Error('No user found with this email address');
          }
          const isCorrectPassword = await user.isCorrectPassword(password);
          if (!isCorrectPassword) {
              throw new Error('Incorrect password');
          }
          const token = signToken(user.username, user.email, user._id);
          return { token, user };
      } catch (error) {
          throw new Error('Error logging in: ')
      }
    },

    addPlaylist: async (_parent, { input }: { input: PlaylistInput }, context: any): Promise<Playlist> => {
      if (!context.user) {
        throw new Error('You need to be logged in to add a playlist!');
      }
    
      const { name, songs } = input;
    
      try {
        const newPlaylist = await PlaylistModel.create({
          name,
          songs,
          user: context.user._id,
        });
    
        return newPlaylist; // This should conform to the Playlist interface
      } catch (error) {
        console.error('Error saving playlist');
        throw new Error('Error saving playlist');
      }
    },

    addSong: async (_parent, { songInput }: { songInput: SongInput }, context: any) => {
      if (!context.user) {
          throw new Error('You need to be logged in to add a song!');
      }
  
      const { name, artist } = songInput;
  
      try {
          const updatedPlaylist = await PlaylistModel.findOneAndUpdate(
              { user: context.user._id },
              { $push: { songs: { name, artist } } },
              { new: true }
          );
  
          if (!updatedPlaylist) {
              throw new Error('Playlist not found or you do not have permission to modify it.');
          }
  
          return updatedPlaylist; // Return the updated playlist
      } catch (error) {
          console.error('Error saving song:', error);
          throw new Error('Error saving song: ' + error.message);
      }
  }
    },

    removeSong: async ({ songInput }: { songInput: SongInput }, context: any) => {
      if (!context.user) {
          throw new Error('You need to be logged in to remove a song!');
      }
  
      const { name, artist } = songInput;
  
      try {
          const updatedPlaylist = await PlaylistModel.findOneAndUpdate(
              { user: context.user._id },
              { $pull: { songs: { name, artist } } },
              { new: true }
          );
  
          if (!updatedPlaylist) {
              throw new Error('Playlist not found or you do not have permission to modify it.');
          }
  
          return updatedPlaylist;
      } catch (error) {
          console.error('Error removing song');
          throw new Error('Error removing song');
      }
  },

    removePlaylist: async (_parent, { playlistName }, context) => {
      if (!context.user) {
          throw new Error('You need to be logged in to remove a playlist!');
      }
  
      try {
          const deletedPlaylist = await PlaylistModel.findOneAndDelete({
              name: playlistName,
              user: context.user._id,
          });
  
          if (!deletedPlaylist) {
              throw new Error('Playlist not found or you do not have permission to modify it.');
          }
  
          return deletedPlaylist;
      } catch (error) {
          console.error('Error deleting playlist');
          throw new Error('Error deleting playlist:');
      }
    },
  }

export { resolvers };