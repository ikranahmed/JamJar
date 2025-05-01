import React, { useState, useEffect } from 'react';
import { searchArtists, Artist } from '../../utils/apiReccomendations';
import './SearchBar.css';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timerId = setTimeout(() => {
      if (searchTerm.trim()) {
        performSearch(searchTerm);
      } else {
        setSearchResults([]);
      }
    }, 500); // 500ms debounce delay

    return () => clearTimeout(timerId);
  }, [searchTerm]);

  const performSearch = async (term: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await searchArtists(term);
      if (error) {
        setError(error);
      } else {
        setSearchResults(data);
      }
    } catch (err) {
      setError('Failed to fetch search results');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder="Search for artists..."
        value={searchTerm}
        onChange={handleInputChange}
        className="search-input"
      />
      
      {isLoading && <div className="loading-indicator">Searching...</div>}
      {error && <div className="error-message">{error}</div>}
      
      {searchResults.length > 0 && (
        <ul className="search-results">
          {searchResults.map((artist) => (
            <li key={artist.id} className="search-result-item">
              {artist.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;