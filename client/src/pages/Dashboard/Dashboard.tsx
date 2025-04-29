import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PLAYLISTS } from '../../utils/queries';
import { FaPlay, FaPlus, FaSearch, FaShareAlt, FaHome, FaMusic, FaUser } from 'react-icons/fa';
import './Dashboard.css';

const PlaylistsPage = () => {
  const { loading, error, data } = useQuery(GET_PLAYLISTS);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState('playlists');

  // Mock data structure from mock.ts file
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
              <div 
                key={playlist.id} 
                className={`playlist-card ${selectedPlaylist === playlist.id ? 'active' : ''}`}
                onClick={() => setSelectedPlaylist(playlist.id)}
              >
                <div className="playlist-header">
                  <h3>{playlist.name}</h3>
                  <p>{playlist.songs.length} songs</p>
                </div>
                <ul className="songs-list">
                  {playlist.songs.map((song) => (
                    <li key={song.id} className="song-item">
                      <div className="song-info">
                        <span className="song-title">{song.title}</span>
                        <span className="song-artist">{song.artist}</span>
                      </div>
                      <button 
                        className="play-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlaySong(song.link);
                        }}
                      >
                        <FaPlay />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div 
              className="create-playlist-card"
              onClick={() => setShowCreateForm(true)}
            >
              <FaPlus className="plus-icon" />
              <span>Create Playlist</span>
            </div>
          </div>
        </div>

        {showCreateForm && (
          <div className="create-playlist-modal">
            <div className="modal-content">
              <h2>Create New Playlist</h2>
              <input
                type="text"
                placeholder="Name of Playlist"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                autoFocus
              />
              <div className="modal-buttons">
                <button 
                  className="cancel-btn"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </button>
                <button 
                  className="create-btn"
                  onClick={handleCreatePlaylist}
                  disabled={!newPlaylistName.trim()}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Bar */}
      <nav className="navbar">
        <div 
          className={`nav-item ${activeNav === 'home' ? 'active' : ''}`}
          onClick={() => setActiveNav('home')}
        >
          <FaHome className="nav-icon" />
          <span className="nav-label">Home</span>
        </div>
        <div 
          className={`nav-item ${activeNav === 'playlists' ? 'active' : ''}`}
          onClick={() => setActiveNav('playlists')}
        >
          <FaMusic className="nav-icon" />
          <span className="nav-label">Playlists</span>
        </div>
        <div 
          className={`nav-item ${activeNav === 'create' ? 'active' : ''}`}
          onClick={() => {
            setActiveNav('create');
            setShowCreateForm(true);
          }}
        >
          <FaPlus className="nav-icon" />
          <span className="nav-label">Create</span>
        </div>
        <div 
          className={`nav-item ${activeNav === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveNav('profile')}
        >
          <FaUser className="nav-icon" />
          <span className="nav-label">Profile</span>
        </div>
      </nav>
    </div>
  );
};

export default PlaylistsPage;