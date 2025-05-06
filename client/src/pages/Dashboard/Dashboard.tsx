import { useEffect, useState} from 'react';
import { FaPlus, FaSearch, FaShareAlt } from 'react-icons/fa';
import { getArtistsTrack, ARTIST_IDS } from '../../utils/apiReccomendations';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_PLAYLIST, REMOVE_PLAYLIST, REMOVE_SONG} from '../../utils/mutations';
import { GET_PLAYLISTS } from '../../utils/queries';
import './Dashboard.css';
import type { Track } from '../../utils/apiReccomendations';
import PlaylistCard from '../../components/Playlist Card/PlaylistCard';
import TrackCard from '../../components/TrackCard/TrackCard';
import auth from '../../utils/auth';
import { useNavigate } from 'react-router-dom';
// You'll need to read the playlists with the useQuery
// import { useQuery } from '@apollo/client';
// import { GET_PLAYLISTS } from '../../utils/queries';
// You'll need to import the mutation for creating and deleting playlists

interface Playlist {
  id: string;
  name: string;
  songs: Track[];
}

const Dashboard = () => {
  // useEffect to validate that the user is logged in, if not navigate them to the login page
  const navigate = useNavigate();
  useEffect(() => {
    if (!auth.loggedIn()) {
      navigate('/login');
    }
  }
  , []);
  // State management
  // const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<keyof typeof ARTIST_IDS | null>(null);
  const [tracks, setTracks] = useState<(Track & { selected: boolean })[]>([]);
  const [isLoadingTracks, setIsLoadingTracks] = useState(false);
  const [trackError, setTrackError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data, refetch} = useQuery(GET_PLAYLISTS);
  const playlists: Playlist[] = data?.playlists || [];

  const [addPlaylist] = useMutation(CREATE_PLAYLIST)
  const [removePlaylist] = useMutation(REMOVE_PLAYLIST);
  const [removeSong] = useMutation(REMOVE_SONG);
  const toggleTrackSelection = ( _playlistId:string, trackId: string) => {
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
      const response = await getArtistsTrack(ARTIST_IDS[artist]);
      if (!response.data) {
        throw new Error('No tracks received from API');
      }
      const tracksData = response.data.map((track: Track) => ({ ...track, selected: false }));
      console.log('Fetched tracks:', tracksData);
      setTracks(tracksData);
    } catch (err) {
      setTrackError(err instanceof Error ? err.message : 'Failed to load tracks');
      setTracks([]);
    } finally {
      setIsLoadingTracks(false);
    }
  };

  // Playlist creation
  const handleCreatePlaylist = async () => {
    let selectedTracks = tracks.filter(track => track.selected);
    

    if (!newPlaylistName.trim()) {
      setTrackError('Please enter a playlist name');
      return;
    }

    if (selectedTracks.length === 0) {
      setTrackError('Please select at least one track');
      return;
    }

    const songs = selectedTracks.map(track => ({
      title: track.title,
      artist: track.artist,
      duration: track.duration,
      link: track.link
    }));
    try {
     await addPlaylist({
        variables: { input: { name: newPlaylistName, songs: songs } }
      });
      // You'll need to call the mutation to save the playlist to the server here
     refetch(); // Refetch playlists after creation
      setShowCreateForm(false);
      resetCreateForm();
    } catch (error) {
      console.error('Error creating playlist:', error);
      setTrackError('Failed to create playlist. Please try again.');
      return;
      
    }
  };

  const resetCreateForm = () => {
    setNewPlaylistName('');
    setSelectedArtist(null);
    setTracks([]);
    setTrackError(null);
  };

  // Playlist management
  const deletePlaylist = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // setPlaylists(playlists.filter(playlist => playlist.id !== id));
    try {
      const {data} = await removePlaylist({
        variables: { removePlaylistId: id }
      });
      refetch(); // Refetch playlists after deletion
      console.log(data.removePlaylist);
    } catch (error) {
      console.error('Error deleting playlist:', error);
    }
  };

  // Filter playlists based on search query
  const filteredPlaylists = playlists.filter(playlist =>
    playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    playlist.songs.some(track =>
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
 
  function playTrack(link: string) {
    console.log('Playing track:', link);
    if (!link) {
      console.error('No link provided for the track');
      return;
    }
    window.open(link, '_blank');
    // const audio = new Audio(link);
    // audio.play().catch(error => {
    //   console.error('Error playing track:', error); 
    // });
  }

 async function deleteSong(playlistId: string, songId: string) {
    try {
      await removeSong({
        variables: { playlistId, songId }
      });
      refetch(); // Refetch playlists after deletion
    } catch (error) {
      console.error('Error deleting song:', error);
    }
  
 }
 const handleShareButton = () => {
  // Implement share functionality
  navigator.clipboard.writeText(window.location.href);
  console.log('Playlist link copied to clipboard!');
}

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome to JamJar</h1>
        <button onClick={handleShareButton}
          className="share-btn">
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
                <PlaylistCard
                  key={playlist.id}
                  playlist={playlist}
                  deletePlaylist={deletePlaylist}
                  playTrack={playTrack}
                  deleteSong={deleteSong}
                />

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
                      <TrackCard
                        key={track.id}
                        track={track}
                        playTrack={playTrack}
                        deleteSong={toggleTrackSelection}
                        playlistId={""} 
                        ID="id" 
                      />
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