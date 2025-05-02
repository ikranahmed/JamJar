import { IResolvers } from '@graphql-tools/utils';
import { User } from '../models/index.js';
import UserModel from '../models/User.js';
import PlaylistModel from '../models/Playlist.js';
import { signToken } from '../services/auth.js';

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
  duration: number;
  link: string;
}

interface PlaylistInput {
  name: string;
  songs: SongInput[];
  user?: string;
}

const resolvers: IResolvers = {
  Query: {
    user: async (_parent, args: { username: string }) => {
      const user = await User.findOne({ username: args.username }).populate('playlists.songs');
      if (!user) throw new Error('User not found');
      return user;
    },

    song: async (_parent, args: { title: string }) => {
      const song = await PlaylistModel.findOne({ 'songs.title': args.title }, { 'songs.$': 1 });
      if (!song || !song.songs || song.songs.length === 0) {
          throw new Error('Song not found');
      }
      const foundSong = song.songs[0];
      if (!foundSong.title) {
          throw new Error('Song title is missing');
      }
      return {
        title: foundSong.title,
        artist: foundSong.artist,
        duration: foundSong.duration,
        link: foundSong.link,
    };
  },
  
    me: async (_parent, _args, context) => {
      if (!context.user) throw new Error('Not authenticated');
      const me = await User.findById(context.user.id).populate('playlists.songs');
      if (!me) throw new Error('User not found');
      return me;
    },
  
    playlists: async (_parent, _args, context) => {
      if (!context.user) throw new Error('Not authenticated');
      const playlists = await PlaylistModel.find({ user: context.user.userId }).populate('songs');
      return playlists;
    },
  
    playlist: async (_parent, args: { id: string }) => {
      const playlist = await PlaylistModel.findById(args.id).populate('songs');
      if (!playlist) throw new Error('Playlist not found');
      return playlist;
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
        console.error('Error creating user:', error);
        throw new Error('Error creating user');
      }
    },

    login: async (_parent, { email, password }: LoginArgs) => {
      try {
        const user = await User.findOne({ email });
        if (!user) throw new Error('No user found with this email address');

        const isCorrectPassword = await user.isCorrectPassword(password);
        if (!isCorrectPassword) throw new Error('Incorrect password');

        const token = signToken(user.username, user.email, user._id);
        return { token, user };
      } catch (error) {
        console.error('Error logging in:', error);
        throw new Error('Error logging in');
      }
    },

    addPlaylist: async (_parent, { input }: { input: PlaylistInput }, context: any) => {
      if (!context.user) {
        console.error('User not authenticated');
        throw new Error('You need to be logged in to add a playlist!');
      }

      console.log('Context User:', context.user);
      const user = context.user;
      console.log('Creating new playlist with data:', {
        name: input.name,
        songs: input.songs || [],
        user: user.userId, // Check this value
    });

    try {
        const founduser = await UserModel.findById(context.user.userId).select('username');
    
        if (!founduser) throw new Error('User not found');

        const newPlaylist = await PlaylistModel.create({
          name: input.name,
          songs: input.songs || [],
          user: user.userId,
        });

        await UserModel.findByIdAndUpdate(
          context.user.userId,
          { $addToSet: { playlists: newPlaylist._id } },
          { new: true }
        );

        return {
          name: newPlaylist.name,
          songs: newPlaylist.songs.map(song => ({
            title: song.title ?? '',
            artist: song.artist ?? '',
            duration: song.duration ?? 0,
            link: song.link ?? '',
          })),
          user: {
            username: founduser.username,
          },
        };
      } catch (error) {
        console.error('Error saving playlist:', error);
        throw new Error('Error saving playlist');
      }
    },

    addSong: async (
      _parent,
      { playlistName, songInput }: { playlistName: string; songInput: SongInput },
      context: any
    ) => {
      if (!context.user) {
        console.error('User not authenticated');
        throw new Error('You need to be logged in to add a song!');
      }

      try {
        const updatedPlaylist = await PlaylistModel.findOneAndUpdate(
          { user: context.user.userId, name: playlistName },
          { $push: { songs: songInput } },
          { new: true }
        );
        console.log('Updated Playlist:', updatedPlaylist);

        if (!updatedPlaylist) {
          console.error('Playlist not found or user does not have permission to modify it');
          throw new Error('Playlist not found or you do not have permission to modify it.');
        }

        return updatedPlaylist;
      } catch (error) {
        console.error('Error saving song:', error);
        throw new Error('Error saving song');
      }
    },

    removeSong: async (_parent, { songInput }: { songInput: SongInput }, context: any) => {
      if (!context.user) {
        console.error('User not authenticated');
        throw new Error('You need to be logged in to remove a song!');
      }

      try {
        const updatedPlaylist = await PlaylistModel.findOneAndUpdate(
          { user: context.user.userId },
          { $pull: { songs: songInput } },
          { new: true }
        );

        if (!updatedPlaylist) {
          console.error('Playlist not found or user does not have permission to modify it');
          throw new Error('Playlist not found or you do not have permission to modify it.');
        }

        return updatedPlaylist;
      } catch (error) {
        console.error('Error removing song:', error);
        throw new Error('Error removing song');
      }
    },

    removePlaylist: async (_parent, { playlistName }: { playlistName: string }, context: any) => {
      if (!context.user) {
        console.error('User not authenticated');
        throw new Error('You need to be logged in to remove a playlist!');
      }

      try {
        const deletedPlaylist = await PlaylistModel.findOneAndDelete({
          name: playlistName,
          user: context.user.userId,
        });

        if (!deletedPlaylist) {
          console.error('Playlist not found or user does not have permission to modify it');
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

