import { Document, Schema, model } from 'mongoose';

export interface Song {
    title: string;
    artist: string;
    duration?: number;
    link?: string;
}


export interface PlaylistDocument extends Document {
    name: string;
    songs: Song[];
    user: Schema.Types.ObjectId;
}


export interface Playlist {
    name: string;
    songs: Song[];
    user: string;
}

const songSchema = new Schema<Song>({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    duration: { type: Number, required: false },
    link: { type: String, required: false },
});


const playlistSchema = new Schema<PlaylistDocument>({
    name: { type: String, required: true },
    songs: [songSchema],
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});


const PlaylistModel = model<PlaylistDocument>('Playlist', playlistSchema);

export default PlaylistModel;


