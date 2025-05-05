import TrackCard from '../TrackCard/TrackCard';
import { FaTrash } from 'react-icons/fa';
interface Playlist {
  id: string;
  name: string;
  songs: {
    _id: string;
    title: string;
    artist: string;
    duration?: number;
    link?: string;
  }[];
}

interface PlaylistCardProps {
  playlist: Playlist;
  deletePlaylist: (id: string, e: React.MouseEvent<HTMLButtonElement>) => void;
  playTrack: (link: string) => void;
  deleteSong: (playlistId: string, songId: string) => void;
}

export default function PlaylistCard({ playlist, deletePlaylist, playTrack, deleteSong }: PlaylistCardProps) {
  return (
    <div
    key={playlist.id}
    className="playlist-card"
  >
    <div className="playlist-header">
      <h3>{playlist.name}</h3>
      <div className="playlist-meta">
        <span>{playlist.songs.length} songs</span>
        <button
          className="delete-btn"
          onClick={(e) => deletePlaylist(playlist.id, e)}
          aria-label="Delete playlist"
        >
          <FaTrash />
        </button>
      </div>
    </div>
    <ul className="songs-list">
      {playlist.songs.map((track) => (
        <TrackCard
          key={track._id}
          track={track}
          playTrack={playTrack}
          deleteSong={deleteSong}
          playlistId={playlist.id}
          ID="_id"
          />
      ))}
    </ul>
  </div>

  )
}
