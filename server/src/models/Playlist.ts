import { Schema, model } from 'mongoose';

const songSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  artist: {
    type: String,
    required: true,
  },

  link: {
    type: String,
    required: true,
  },

  mood: {
    type: String,
    enum: ['chill', 'hype', 'sad', 'happy', 'study', 'party', 'other'],
    default: 'other',
  },

  tags: [String],

  addedAt: {
    type: Date,
    default: Date.now,
  }
});

const playlistSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  songs: [songSchema],

  isPublic: {
    type: Boolean,
    default: false,
  },

  mood: {
    type: String,
    enum: ['chill', 'hype', 'sad', 'happy', 'study', 'party', 'other'],
  },

  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Playlist = model('Playlist', playlistSchema);

module.exports = Playlist;


