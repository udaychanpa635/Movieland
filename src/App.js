import React, { useEffect, useState } from "react";
import './App.css';
import searchIcon from './search.svg';

const API_URL = 'http://www.omdbapi.com/?apikey=c716f016';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('Spiderman');
  const [movies, setMovies] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const searchMovies = async (title, pageNumber = 1) => {
    setLoading(true);
    const response = await fetch(`${API_URL}&s=${title}&page=${pageNumber}`);
    const data = await response.json();

    if (data.Search) {
      if (pageNumber === 1) {
        setMovies(data.Search);
      } else {
        setMovies((prev) => [...prev, ...data.Search]);
      }
      setHasMore(data.Search.length > 0);
    } else {
      if (pageNumber === 1) setMovies([]);
      setHasMore(false);
    }

    setLoading(false);
  };

  // Search initially or when searchTerm changes
  useEffect(() => {
    searchMovies(searchTerm, 1);
  }, [searchTerm]);

  // Infinite Scroll Logic
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = window.innerHeight;

      if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore && !loading) {
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading]);

  // Load more when page increases
  useEffect(() => {
  searchMovies(searchTerm, 1);
}, [searchTerm]);


  return (
    <div className="app" >
      <h1>MovieLand</h1>

      <div className="search">
        <input
          placeholder="Search for movies"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <img
          src={searchIcon}
          alt="search"
          onClick={() => {
            searchMovies(searchTerm, 1);
          }}
          style={{ cursor: 'pointer' }}
        />
      </div>

      <div className="container">
  {movies.length > 0 ? (
    movies
      .filter((movie) => movie.Poster !== 'N/A')
      .map((movie) => (
        <div className="movie" key={movie.imdbID}>
          <div>
            <p>{movie.Year}</p>
          </div>
          <div>
            <img
              src={movie.Poster}
              alt={movie.Title}
            />
          </div>
          <div>
            <h3>{movie.Title}</h3>
          </div>
        </div>
      ))
  ) : (
    <h2>No movies found</h2>
  )}
</div>


      {loading && <h3 style={{ textAlign: 'center' }}>Loading more movies...</h3>}
    </div>
  );
};

export default App;
