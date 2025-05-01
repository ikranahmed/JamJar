// import { useState } from 'react';
// import { getPredefinedArtistTracks, ARTIST_IDS } from '../utils/apiReccomendations';
// import './CreatePlaylist.css';

// const CreatePlaylist = () => {
//   const [playlistName, setPlaylistName] = useState('');
//   const [selectedArtist, setSelectedArtist] = useState<keyof typeof ARTIST_IDS | null>(null);
//   const [tracks, setTracks] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleArtistSelect = async (artist: keyof typeof ARTIST_IDS) => {
//     setSelectedArtist(artist);
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       const { data, error } = await getPredefinedArtistTracks(artist);
//       if (error) {
//         setError(error);
//       } else {
//         setTracks(data);
//       }
//     } catch (err) {
//       setError('Failed to fetch tracks');
//       console.error(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCreatePlaylist = () => {
//     if (!playlistName.trim()) {
//       setError('Please enter a playlist name');
//       return;
//     }
    
//     if (!selectedArtist) {
//       setError('Please select an artist');
//       return;
//     }
    
//     // Here you would typically send the data to your backend
//     console.log('Creating playlist:', {
//       name: playlistName,
//       artist: selectedArtist,
//       tracks: tracks
//     });
    
//     // Reset form
//     setPlaylistName('');
//     setSelectedArtist(null);
//     setTracks([]);
//     setError(null);
    
//     alert('Playlist created successfully!');
//   };

//   return (
//     <div className="create-playlist-container">
//       <h2>Create New Playlist</h2>
      
//       <div className="form-group">
//         <label>Name of Playlist</label>
//         <input
//           type="text"
//           value={playlistName}
//           onChange={(e) => setPlaylistName(e.target.value)}
//           placeholder="Enter playlist name"
//         />
//       </div>
      
//       <div className="artist-selection">
//         <h3>Select an Artist</h3>
//         <div className="artist-buttons">
//           <button
//             className={selectedArtist === 'BRUNO_MARS' ? 'active' : ''}
//             onClick={() => handleArtistSelect('BRUNO_MARS')}
//           >
//             Bruno Mars
//           </button>
//           <button
//             className={selectedArtist === 'GREEN_DAY' ? 'active' : ''}
//             onClick={() => handleArtistSelect('GREEN_DAY')}
//           >
//             Green Day
//           </button>
//           <button
//             className={selectedArtist === 'TAYLOR_SWIFT' ? 'active' : ''}
//             onClick={() => handleArtistSelect('TAYLOR_SWIFT')}
//           >
//             Taylor Swift
//           </button>
//         </div>
//       </div>
      
//       {isLoading && <div className="loading">Loading tracks...</div>}
//       {error && <div className="error">{error}</div>}
      
//       {tracks.length > 0 && (
//         <div className="track-list">
//           <h3>Selected Tracks</h3>
//           <ul>
//             {tracks.map((track, index) => (
//               <li key={index}>
//                 {track.title} - {track.artist}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
      
//       <div className="action-buttons">
//         <button className="cancel-button">Cancel</button>
//         <button className="create-button" onClick={handleCreatePlaylist}>
//           Create
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CreatePlaylist;