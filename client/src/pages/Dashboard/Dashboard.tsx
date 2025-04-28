import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_MY_PLAYLISTS } from '../../utils/queries';
import { FaPlay, FaPlus, FaEllipsisH, FaSearch } from 'react-icons/fa';
// import { FaPlus, FaSearch } from 'react-icons/fa';
import '<div className="" />
<Dashboard></Dashboard>.css';

const PlaylistsPage = () => {
  const { loading, error, data } = useQuery(GET_MY_PLAYLISTS);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreatePlaylist = () => {
    // this will be where i add mutations
    setShowCreateForm(false);
    setNewPlaylistName('');
  };

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
        {data?.me?.playlists?.map((playlist: any) => (
          <div key={playlist._id} className="playlist-card">
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
              <p>{playlist.songs.length} songs</p>
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