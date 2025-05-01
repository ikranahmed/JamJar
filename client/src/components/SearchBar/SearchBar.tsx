// import { useState, useEffect, useRef } from 'react';
// import { FaSearch, FaTimes } from 'react-icons/fa';
// import { searchArtists, getArtistsTrack, Artist, Track } from '../../utils/apiReccomendations';
// import './SearchBar.css';

// interface SearchBarProps {
//   onArtistSelect?: (artist: Artist) => void;
//   onTrackSelect?: (track: Track) => void;
//   placeholder?: string;
// }

// const SearchBar = ({ onArtistSelect, onTrackSelect, placeholder = "Search for artists or songs..." }: SearchBarProps) => {
//   const [query, setQuery] = useState('');
//   const [results, setResults] = useState<(Artist | Track)[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [activeTab, setActiveTab] = useState<'artists' | 'tracks'>('tracks');
//   const searchRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
//         setResults([]);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   useEffect(() => {
//     if (!query.trim()) {
//       setResults([]);
//       return;
//     }

//     const searchDelay = setTimeout(async () => {
//       try {
//         setIsLoading(true);
//         setError(null);
        
//         let data;
//         if (activeTab === 'artists') {
//           data = await searchArtists(query);
//         } else {
//           data = await getArtistsTrack(query);
//         }
        
//         setResults(data.slice(0, 8)); // Limit to 8 results
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Failed to fetch results');
//         setResults([]);
//       } finally {
//         setIsLoading(false);
//       }
//     }, 500); // Debounce for 500ms

//     return () => clearTimeout(searchDelay);
//   }, [query, activeTab]);

//   const handleClear = () => {
//     setQuery('');
//     setResults([]);
//   };

//   const handleSelect = (item: Artist | Track) => {
//     if ('title' in item && onTrackSelect) {
//       onTrackSelect(item);
//     } else if ('name' in item && onArtistSelect) {
//       onArtistSelect(item);
//     }
//     setQuery('');
//     setResults([]);
//   };

//   return (
//     <div className="search-container" ref={searchRef}>
//       <div className="search-bar">
//         <FaSearch className="search-icon" />
//         <input
//           type="text"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder={placeholder}
//           aria-label="Search"
//         />
//         {query && (
//           <button className="clear-btn" onClick={handleClear} aria-label="Clear search">
//             <FaTimes />
//           </button>
//         )}
//       </div>

//       <div className="search-tabs">
//         <button
//           className={`tab-btn ${activeTab === 'tracks' ? 'active' : ''}`}
//           onClick={() => setActiveTab('tracks')}
//         >
//           Tracks
//         </button>
//         <button
//           className={`tab-btn ${activeTab === 'artists' ? 'active' : ''}`}
//           onClick={() => setActiveTab('artists')}
//         >
//           Artists
//         </button>
//       </div>

//       {isLoading && <div className="search-loading">Searching...</div>}
//       {error && <div className="search-error">{error}</div>}

//       {results.length > 0 && (
//         <div className="search-results">
//           {results.map((item) => (
//             <div
//               key={'id' in item ? item.id : Math.random()}
//               className="search-result-item"
//               onClick={() => handleSelect(item)}
//             >
//               {'title' in item ? (
//                 <>
//                   <div className="track-info">
//                     <div className="track-title">{item.title}</div>
//                     <div className="track-artist">{item.artist}</div>
//                   </div>
//                   {item.preview_url && (
//                     <button className="play-preview-btn">
//                       <FaPlay />
//                     </button>
//                   )}
//                 </>
//               ) : (
//                 <>
//                   {item.image && (
//                     <img src={item.image} alt={item.name} className="artist-image" />
//                   )}
//                   <div className="artist-info">
//                     <div className="artist-name">{item.name}</div>
//                     {item.genres && item.genres.length > 0 && (
//                       <div className="artist-genres">
//                         {item.genres.slice(0, 2).join(', ')}
//                       </div>
//                     )}
//                   </div>
//                 </>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SearchBar;