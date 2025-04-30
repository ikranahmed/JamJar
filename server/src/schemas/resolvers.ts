import { User } from '../models/index.js';
import { signToken } from '../services/auth.js';
import PlaylistModel from '../models/Playlist.js';
import { IResolvers } from '@graphql-tools/utils';


interface AddUserArgs {
  input: {
    username: string;
    email: string;
    password: string;
  };
}

interface LoginArgs {
  email: string;
  password: string;
}

interface SongInput {
  title: string;
  artist: string;
}

interface Playlist {
  id?: string;
  name: string;
  songs: SongInput[];
  user: string;
}

const resolvers: IResolvers = {
  Query: {
    user: async (_parent, args: { username: string }) => {
      const user = await User.findOne({ username: args.username }).populate('playlists.songs');
      if (!user) throw new Error('User not found');
      return user;
    },
  },

  Mutation: {
    addUser: async (_parent, { input }: AddUserArgs) => {
      try {
        console.log('Creating user with input:', input);
        const user = await User.create(input);
        const token = signToken(user.username, user.email, user._id);
        return { token, user };
      } catch (error) {
        console.log('Error creating user:', error);
        throw new Error('Error creating user');
      }
    },

    login: async (_parent, { email, password }: LoginArgs): Promise<any> => {
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
        throw new Error('Error logging in');
      }
    },

    addPlaylist: async (_parent: any, { input }: { input: Playlist }, context: any): Promise<Playlist> => {
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

        const playlist: Playlist = {
          id: newPlaylist._id.toString(),
          name: newPlaylist.name,
          songs: newPlaylist.songs.map(song => ({
            title: song.name || '',
            artist: song.artist || '',
          })),
          user: newPlaylist.user.toString(),
        };

        return playlist;
      } catch (error) {
        console.error('Error saving playlist:', error);
        throw new Error('Error saving playlist');
      }
    },

    addSong: async (_parent: any, { playlistName, songInput }: { playlistName: string; songInput: SongInput }, context: any) => {
      if (!context.user) {
        throw new Error('You need to be logged in to add a song!');
      }

      const { title, artist } = songInput;

      try {
        const updatedPlaylist = await PlaylistModel.findOneAndUpdate(
          { user: context.user._id, name: playlistName },
          { $push: { songs: { title, artist } } },
          { new: true }
        );

        if (!updatedPlaylist) {
          throw new Error('Playlist not found or you do not have permission to modify it.');
        }

        return updatedPlaylist;
      } catch (error) {
        console.error('Error saving song:', error);
        throw new Error('Error saving song');
      }
    },

    removeSong: async (_parent: any, { songInput }: { songInput: SongInput }, context: any) => {
      if (!context.user) {
        throw new Error('You need to be logged in to remove a song!');
      }

      const { title, artist } = songInput;

      try {
        const updatedPlaylist = await PlaylistModel.findOneAndUpdate(
          { user: context.user._id },
          { $pull: { songs: { title, artist } } },
          { new: true }
        );

        if (!updatedPlaylist) {
          throw new Error('Playlist not found or you do not have permission to modify it.');
        }

        return updatedPlaylist;
      } catch (error) {
        console.error('Error removing song:', error);
        throw new Error('Error removing song');
      }
    },

    removePlaylist: async (_parent: any, { playlistName }: { playlistName: string }, context: any) => {
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
        console.error('Error deleting playlist:', error);
        throw new Error('Error deleting playlist');
      }
    },
  },
};

export { resolvers };
