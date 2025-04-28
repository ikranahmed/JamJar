import mongoose from 'mongoose';

export interface PlaylistDocument extends Document {
  name: string;
  songs: Song[];
  user: string;
}

export interface Song {
    name: string;
    artist: string;
}

export interface Playlist {
    id: string;
    name: string;
    songs: Song[];
    user: string;
}

const songSchema = new mongoose.Schema({
    name: String,
    artist: String,
});

const playlistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    songs: [songSchema],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const PlaylistModel = mongoose.model('Playlist', playlistSchema);

export default PlaylistModel;


