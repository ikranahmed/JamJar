import { FaPlus, FaPlay, FaMinus } from 'react-icons/fa';

interface Track {
  id?: string;
  _id?: string;
  title: string;
  artist: string;
  duration?: number;
  link?: string;
  selected?: boolean;
}

interface TrackCardProps {
  track: Track;
  playTrack: (link: string) => void;
  deleteSong: (playlistId: string, trackId: string) => void;
  playlistId: string;
  ID: string;
}

const TrackCard: React.FC<TrackCardProps> = ({ track, playTrack, deleteSong, playlistId,ID }) => {
    return (
        <li key={String(track[ID as keyof Track] || '')} className={`song-item ${track.selected ? 'selected' : ''}`}>
        <div className="song-info">
          <span className="song-title">{track.title}</span>
          <span className="song-artist">{track.artist}</span>
          {track.duration && (
            <span className="song-duration">
              {new Date(track.duration).toISOString().substr(14, 5)}
            </span>
          )}
        </div>
           <div className="song-controls">
        <button
          className="play-btn"
          onClick={() => playTrack(track.link || '')}
          aria-label={`Play ${track.title}`}
        >
          <FaPlay />
        </button>
        <button
            className="select-btn"
            onClick={() => {
              const trackId = String(track[ID as keyof Track] || '');
              deleteSong(playlistId, trackId);
            }}
            aria-label={track.selected ? 'Remove from playlist' : 'Add to playlist'}
            >
                             {track.selected || playlistId ? <FaMinus /> : <FaPlus />}
          </button>
          </div>
      </li>
    );
}

export default TrackCard;