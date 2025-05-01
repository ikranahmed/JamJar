
//import { useState } from 'react';
// import { useQuery } from '@apollo/client';
// import { GET_PLAYLISTS } from '../../utils/queries';
// import { FaPlay, FaPlus, FaSearch, FaShareAlt } from 'react-icons/fa';
// import { getPredefinedArtistTracks, ARTIST_IDS, Track } from '../../utils/apiReccomendations';
// import './Dashboard.css';

import { useState, useEffect } from 'react';
import { FaPlay, FaPlus, FaMinus, FaSearch, FaShareAlt, FaTrash } from 'react-icons/fa';
import { getArtistTracks, ARTIST_IDS } from '../../utils/apiReccomendations';
import './Dashboard.css';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration?: number;
  link?: string;
}

interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
}

const Dashboard = () => {
  // State management
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<keyof typeof ARTIST_IDS | null>(null);
  const [tracks, setTracks] = useState<(Track & { selected: boolean })[]>([]);
  const [isLoadingTracks, setIsLoadingTracks] = useState(false);
  const [trackError, setTrackError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load playlists from localStorage on component mount
  useEffect(() => {
    const savedPlaylists = localStorage.getItem('playlists');
    if (savedPlaylists) {
      setPlaylists(JSON.parse(savedPlaylists));
    }
  }, []);

  // Save playlists to localStorage when they change
  useEffect(() => {
    localStorage.setItem('playlists', JSON.stringify(playlists));
  }, [playlists]);

  // Track selection handlers
  const toggleTrackSelection = (trackId: string) => {
    setTracks(prevTracks =>
      prevTracks.map(track =>
        track.id === trackId ? { ...track, selected: !track.selected } : track
      )
    );
  };

  const selectAllTracks = (select: boolean) => {
    setTracks(prevTracks => prevTracks.map(track => ({ ...track, selected: select })));
  };

  // API call to fetch tracks
  const handleArtistSelect = async (artist: keyof typeof ARTIST_IDS) => {
    setSelectedArtist(artist);
    setIsLoadingTracks(true);
    setTrackError(null);
    
    try {
      const response = await getArtistTracks(ARTIST_IDS[artist]);
      
      if (response.error || !response.data) {
        throw new Error(response.error || 'No tracks received from API');
      }

      setTracks(response.data.map(track => ({ ...track, selected: false })));
    } catch (err) {
      setTrackError(err instanceof Error ? err.message : 'Failed to load tracks');
      setTracks([]);
    } finally {
      setIsLoadingTracks(false);
    }
  };

  // Playlist creation
  const handleCreatePlaylist = () => {
    const selectedTracks = tracks.filter(track => track.selected);
    
    if (!newPlaylistName.trim()) {
      setTrackError('Please enter a playlist name');
      return;
    }
    
    if (selectedTracks.length === 0) {
      setTrackError('Please select at least one track');
      return;
    }
    
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name: newPlaylistName,
      tracks: selectedTracks.map(({ selected, ...rest }) => rest)
    };
    
    setPlaylists([...playlists, newPlaylist]);
    setShowCreateForm(false);
    resetCreateForm();
  };

  const resetCreateForm = () => {
    setNewPlaylistName('');
    setSelectedArtist(null);
    setTracks([]);
    setTrackError(null);
  };

  // Playlist management
  const deletePlaylist = (id: string) => {
    setPlaylists(playlists.filter(playlist => playlist.id !== id));
  };

  const playTrack = (link?: string) => {
    if (link?.startsWith('http')) {
      window.open(link, '_blank');
    }
  };

  // Filter playlists based on search query
  const filteredPlaylists = playlists.filter(playlist =>
    playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    playlist.tracks.some(track =>
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome to JamJar</h1>
        <button className="share-btn">
          <FaShareAlt />
        </button>
      </header>

      <div className="dashboard-content">
        <div className="search-section">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search playlists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="playlists-section">
          <h2>My Playlists</h2>
          <div className="playlists-grid">
            {filteredPlaylists.length > 0 ? (
              filteredPlaylists.map((playlist) => (
                <div key={playlist.id} className="playlist-card">
                  <div className="playlist-header">
                    <h3>{playlist.name}</h3>
                    <div className="playlist-meta">
                      <span>{playlist.tracks.length} songs</span>
                      <button
                        className="delete-btn"
                        onClick={() => deletePlaylist(playlist.id)}
                        aria-label="Delete playlist"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  <ul className="songs-list">
                    {playlist.tracks.map((track) => (
                      <li key={track.id} className="song-item">
                        <div className="song-info">
                          <span className="song-title">{track.title}</span>
                          <span className="song-artist">{track.artist}</span>
                          {track.duration && (
                            <span className="song-duration">
                              {new Date(track.duration).toISOString().substr(14, 5)}
                            </span>
                          )}
                        </div>
                        <button
                          className="play-btn"
                          onClick={() => playTrack(track.link)}
                          aria-label={`Play ${track.title}`}
                        >
                          <FaPlay />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <div className="empty-state">
                {searchQuery ? 'No matching playlists found' : 'You have no playlists yet'}
              </div>
            )}

            <div
              className="create-playlist-card"
              onClick={() => setShowCreateForm(true)}
              aria-label="Create new playlist"
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
              
              <div className="artist-selection">
                <h3>Select an Artist</h3>
                <div className="artist-buttons">
                  {Object.keys(ARTIST_IDS).map((artist) => (
                    <button
                      key={artist}
                      className={selectedArtist === artist ? 'active' : ''}
                      onClick={() => handleArtistSelect(artist as keyof typeof ARTIST_IDS)}
                      disabled={isLoadingTracks}
                    >
                      {artist.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
              
              {isLoadingTracks && (
                <div className="loading">
                  <div className="spinner"></div>
                  Loading tracks...
                </div>
              )}

              {trackError && (
                <div className="error">
                  {trackError}
                  <button
                    onClick={() => selectedArtist && handleArtistSelect(selectedArtist)}
                    className="retry-btn"
                  >
                    Retry
                  </button>
                </div>
              )}

              {tracks.length > 0 && (
                <div className="track-preview">
                  <div className="track-actions">
                    <button onClick={() => selectAllTracks(true)}>Select All</button>
                    <button onClick={() => selectAllTracks(false)}>Deselect All</button>
                    <span>{tracks.filter(t => t.selected).length} selected</span>
                  </div>
                  <ul className="songs-list">
                    {tracks.map((track) => (
                      <li key={track.id} className={`song-item ${track.selected ? 'selected' : ''}`}>
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
                            onClick={() => playTrack(track.link)}
                            aria-label={`Play ${track.title}`}
                          >
                            <FaPlay />
                          </button>
                          <button
                            className="select-btn"
                            onClick={() => toggleTrackSelection(track.id)}
                            aria-label={track.selected ? 'Remove from playlist' : 'Add to playlist'}
                          >
                            {track.selected ? <FaMinus /> : <FaPlus />}
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="modal-buttons">
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setShowCreateForm(false);
                    resetCreateForm();
                  }}
                >
                  Cancel
                </button>
                <button
                  className="create-btn"
                  onClick={handleCreatePlaylist}
                  disabled={!newPlaylistName.trim() || tracks.filter(t => t.selected).length === 0}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;