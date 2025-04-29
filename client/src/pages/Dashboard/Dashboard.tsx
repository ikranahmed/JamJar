import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PLAYLISTS } from '../../utils/queries';
import { FaPlay, FaPlus, FaSearch, FaShareAlt } from 'react-icons/fa';
import './Dashboard.css';

const PlaylistsPage = () => {
  const { loading, error, data } = useQuery(GET_PLAYLISTS);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);

  // Mock data structure that matches your mocks.ts
  const mockPlaylists = data?.playlists || Array.from({ length: 4 }, (_, i) => ({
    id: `mock-${i}`,
    name: ['Workout Mix', 'Chill Vibes', 'Focus Flow', 'Road Trip'][i],
    songs: Array.from({ length: 3 }, (_, j) => ({
      id: `song-${i}-${j}`,
      title: ['Pump It Up', 'Relaxation', 'Concentration', 'Open Road'][j] || `Song ${j+1}`,
      artist: ['Energy Master', 'Calm Artist', 'Deep Work', 'Adventure'][j] || `Artist ${j+1}`,
      duration: [180000, 240000, 195000, 210000][j] || 200000,
      link: `https://open.spotify.com/track/${Math.random().toString(36).substring(2,10)}`
    }))
  }));

  const handleCreatePlaylist = () => {
    setShowCreateForm(false);
    setNewPlaylistName('');
  };

  const handlePlaySong = (link: string) => {
    window.open(link, '_blank');
  };

  if (loading) return <div className="loading">Loading your playlists...</div>;
  if (error) return <div className="error">Error loading playlists</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Playlist Pal</h1>
        <button className="share-btn">
          <FaShareAlt />
        </button>
      </header>

      <div className="dashboard-content">
        <div className="search-section">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Search playlists..." />
          </div>
        </div>

        <div className="playlists-section">
          <h2>My Playlists</h2>
          <div className="playlists-grid">
            {mockPlaylists.map((playlist) => (
              <div key={playlist.id} className="playlist-card">
                <h3>{playlist.name}</h3>
                <ul>
                  {playlist.songs.map((song) => (
                    <li key={song.id} className="song-item">
                      <span>{song.title} - {song.artist}</span>
                      <button onClick={() => handlePlaySong(song.link)}>
                        <FaPlay />
                      </button>
                    </li>
                  ))}
                </ul>
                <button className="remove-btn" onClick={() => setSelectedPlaylist(playlist.id)}>
                  Remove Playlist
                </button>
              </div>
            ))}
            <button className="add-playlist-btn" onClick={() => setShowCreateForm(true)}>
              <FaPlus /> Create New Playlist
            </button>
          </div>
          {showCreateForm && (
            <div className="create-playlist-form">
              <input
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="New Playlist Name"
              />
              <button onClick={handleCreatePlaylist}>Create</button>
            </div>
          )}
        </div>
        <footer className="dashboard-footer">
          <p>© {new Date().getFullYear()} Playlist Pal - Your Music, Your Way</p>
        </footer>
      </div>
    </div>
  );
}

export default PlaylistsPage;