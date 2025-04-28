import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PLAYLIST, REMOVE_SONG_FROM_PLAYLIST } from '../utils/mutations';
import { FaPlay, FaTrash, FaShareAlt } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import './PlaylistView.css';

const PlaylistView = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_PLAYLIST, {
    variables: { playlistId }
  });
  
  const [removeSong] = useMutation(REMOVE_SONG_FROM_PLAYLIST, {
    refetchQueries: [{ query: GET_PLAYLIST, variables: { playlistId } }]
  });

  const handlePlaySong = (songId: string) => {
    // Implement song playback functionality
    console.log('Playing song:', songId);
  };

  const handleRemoveSong = (songId: string) => {
    removeSong({ variables: { playlistId, songId } });
  };

  const handleSharePlaylist = () => {
    // Implement share functionality
    navigator.clipboard.writeText(window.location.href);
    alert('Playlist link copied to clipboard!');
  };

  if (loading) return <div className="loading">Loading playlist...</div>;
  if (error) return <div className="error">Error loading playlist</div>;

  return (
    <div className="playlist-view-container">
      <header className="playlist-header">
        <h1>Playlist Pal</h1>
        <nav>
          <button onClick={() => navigate('/playlists')}>Playlists</button>
          <button onClick={() => Auth.logout()}>Logout</button>
        </nav>
      </header>

      <main className="playlist-content">
        <div className="playlist-info">
          <h2>My Playlist: {data?.playlist?.name}</h2>
          <button 
            className="share-btn"
            onClick={handleSharePlaylist}
          >
            <FaShareAlt /> Send to a friend
          </button>
        </div>

        <div className="song-list">
          {data?.playlist?.songs?.map((song: any) => (
            <div key={song._id} className="song-item">
              <div className="song-details">
                <h3>{song.title}</h3>
                <p>{song.artist}</p>
              </div>
              <div className="song-actions">
                <button 
                  className="play-btn"
                  onClick={() => handlePlaySong(song._id)}
                >
                  <FaPlay /> Play
                </button>
                <button 
                  className="remove-btn"
                  onClick={() => handleRemoveSong(song._id)}
                >
                  <FaTrash /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="playlist-footer">
        <p>© {new Date().getFullYear()} JamJar - Your Music, Your Way</p>
      </footer>
    </div>
  );
};

export default PlaylistView;