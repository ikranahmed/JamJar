import Tech, { ITech } from '../models/User.js';
import Matchup, { IMatchup } from '../models/Playlist.js';
import Playlist from '../models/Playlist';
import User from '../models/User';
import { AuthenticationError } from 'apollo-server-express';
import { signToken } from '../utils/auth';

const resolvers = {
    Query: {
      me: async (_, __, context) => {
        if (!context.user) throw new AuthenticationError('Not logged in');
        return User.findById(context.user._id).populate('playlists');
      },
  
      getUserPlaylists: async (_, __, context) => {
        if (!context.user) throw new AuthenticationError('Not logged in');
        return Playlist.find({ createdBy: context.user._id });
      },
  
      getPlaylistById: async (_, { playlistId }) => {
        return Playlist.findById(playlistId).populate('createdBy');
      },
  
      getPublicPlaylists: async () => {
        return Playlist.find({ isPublic: true }).populate('createdBy');
      },
  
      searchPlaylists: async (_, { tag }) => {
        return Playlist.find({ isPublic: true, tags: tag }).populate('createdBy');
      },
    },

Mutations: {
    addUser: async (_, { username, email, password }) => {
        const user = await User.create({ username, email, password });
        const token = signToken(user);
        return { token, user };
    },

    login: async (_, { email, password }) => {
        const user = await User.findOne({ email });
        if (!user || !(await user.isCorrectPassword(password))) {
          throw new AuthenticationError('Invalid credentials');
        }
        const token = signToken(user);
        return { token, user };
      },

      addPlaylist: async (_, { title, description, tags, isPublic }, context) => {
        if (!context.user) throw new AuthenticationError('Not logged in');
        const playlist = await Playlist.create({
          title,
          description,
          tags,
          isPublic,
          createdBy: context.user._id,
          songs: [],
        });
        await User.findByIdAndUpdate(context.user._id, { $push: { playlists: playlist._id } });
        return playlist;
      },

      updatePlaylist: async (_, { playlistId, title, description, tags, isPublic }, context) => {
        if (!context.user) throw new AuthenticationError('Not logged in');
  
        const playlist = await Playlist.findOneAndUpdate(
          { _id: playlistId, createdBy: context.user._id },
          { title, description, tags, isPublic },
          { new: true }
        );
  
        if (!playlist) throw new AuthenticationError('Playlist not found or unauthorized');
        return playlist;
      },

      deletePlaylist: async (_, { playlistId }, context) => {
        if (!context.user) throw new AuthenticationError('Not logged in');
  
        const deleted = await Playlist.findOneAndDelete({
          _id: playlistId,
          createdBy: context.user._id,
        });
  
        await User.findByIdAndUpdate(context.user._id, {
          $pull: { playlists: playlistId },
        });
  
        return deleted;
      },
      addSong: async (_, { playlistId, title, artist, link }, context) => {
        if (!context.user) throw new AuthenticationError('Not logged in');
  
        const playlist = await Playlist.findOneAndUpdate(
          { _id: playlistId, createdBy: context.user._id },
          { $push: { songs: { title, artist, link } } },
          { new: true }
        );
  
        if (!playlist) throw new AuthenticationError('Playlist not found or unauthorized');
        return playlist;
      },
  
      removeSong: async (_, { playlistId, songId }, context) => {
        if (!context.user) throw new AuthenticationError('Not logged in');
  
        const playlist = await Playlist.findOneAndUpdate(
          { _id: playlistId, createdBy: context.user._id },
          { $pull: { songs: { _id: songId } } },
          { new: true }
        );
  
        return playlist;
      },
      },
    }

