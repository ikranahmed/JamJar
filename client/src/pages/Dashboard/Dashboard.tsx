import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PLAYLISTS } from '../../utils/queries';
import { FaPlay, FaPlus, FaEllipsisH, FaSearch } from 'react-icons/fa';
import './Dashboard.css';

const PlaylistsPage = () => {
  const { loading, error, data } = useQuery(GET_PLAYLISTS);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Mock data for our playlists
  const mockPlaylists = [
    {
      id: '1',
      name: 'Workout Mix',
      songs: [
        { 
          id: '1', 
          title: 'Pump It Up', 
          artist: 'Energy Master',
          duration: 180000,
          link: 'https://example.com/track1'
        },
        { 
          id: '2', 
          title: 'Run Faster', 
          artist: 'Cardio King',
          duration: 210000,
          link: 'https://example.com/track2'
        }
      ]
    },
    {
      id: '2',
      name: 'Chill Vibes',
      songs: [
        { 
          id: '3', 
          title: 'Relaxation', 
          artist: 'Calm Artist',
          duration: 240000,
          link: 'https://example.com/track3'
        },
        { 
          id: '4', 
          title: 'Peaceful', 
          artist: 'Serenity Singer',
          duration: 195000,
          link: 'https://example.com/track4'
        }
      ]
    }
  ];

  const handleCreatePlaylist = () => {

    setShowCreateForm(false);
    setNewPlaylistName('');
  };

  
  const playlists = data?.playlists || mockPlaylists;

  if (loading) return <div className="loading">Loading your playlists...</div>;
  if (error) return <div className="error">Error loading playlists</div>;

  return (
    <div className="playlists-container">
      <div className="playlists-header">
        <h1>My Playlists</h1>
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search playlists..." />
        </div>
      </div>

      <div className="playlists-grid">
        {playlists.map((playlist: any) => (
          <div key={playlist.id} className="playlist-card">
            <div className="playlist-image">
              <div className="play-button">
                <FaPlay />
              </div>
              <div className="playlist-options">
                <FaEllipsisH />
              </div>
            </div>
            <div className="playlist-info">
              <h3>{playlist.name}</h3>
              <p>{playlist.songs?.length || 0} songs</p>
            </div>
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

      {showCreateForm && (
        <div className="create-playlist-modal">
          <div className="modal-content">
            <h2>Create New Playlist</h2>
            <input
              type="text"
              placeholder="Name of Playlist"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
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
  );
};

export default PlaylistsPage;