import { useState, useEffect } from 'react';
import { movieAPI } from '../services/api';
import MovieForm from './MovieForm';

function MovieList() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [editingMovie, setEditingMovie] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [minRating, setMinRating] = useState('');
    const [sortBy, setSortBy] = useState('');

    useEffect(() => {
        fetchMovies();
    }, [searchTerm, minRating, sortBy]);

    const fetchMovies = async () => {
        setLoading(true);
        setError('');

        try {
            const params = {};
            if (searchTerm) params.search = searchTerm;
            if (minRating) params.rating = minRating;
            if (sortBy) params.sort = sortBy;

            const response = await movieAPI.getAll(params);
            setMovies(response.data);
        } catch (err) {
            setError('Failed to fetch movies. Please try again.');
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this movie?')) return;

        try {
            await movieAPI.delete(id);
            setMovies(movies.filter(movie => movie.id !== id));
        } catch (err) {
            setError('Failed to delete movie. Please try again.');
            console.error('Delete error:', err);
        }
    };

    const handleEdit = (movie) => {
        setEditingMovie(movie);
        setShowForm(true);
    };

    const handleFormSuccess = () => {
        setShowForm(false);
        setEditingMovie(null);
        fetchMovies();
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingMovie(null);
    };

    return (
        <div className="movies-container">
            <div className="movie-controls">
                <input
                    type="text"
                    placeholder="Search movies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Min rating"
                    value={minRating}
                    onChange={(e) => setMinRating(e.target.value)}
                    min="0"
                    max="10"
                    step="0.1"
                />

                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="">Sort by...</option>
                    <option value="name_asc">Name (A-Z)</option>
                    <option value="name_desc">Name (Z-A)</option>
                    <option value="rating_asc">Rating (Low to High)</option>
                    <option value="rating_desc">Rating (High to Low)</option>
                </select>

                <button
                    className="btn-primary"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Cancel' : '+ Add Movie'}
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {showForm && (
                <MovieForm
                    movie={editingMovie}
                    onSuccess={handleFormSuccess}
                    onCancel={handleFormCancel}
                />
            )}

            {loading ? (
                <p>Loading movies...</p>
            ) : (
                <div className="movies-grid">
                    {movies.length === 0 ? (
                        <p>No movies found. Add your first movie!</p>
                    ) : (
                        movies.map((movie) => (
                            <div key={movie.id} className="movie-card">
                                {movie.image && (
                                    <img
                                        src={`http://localhost:5000/images/${movie.image}`}
                                        alt={movie.name}
                                        className="movie-poster"
                                    />
                                )}
                                <div className="movie-card-content">
                                    <h3>{movie.name}</h3>
                                    <div className="movie-rating">⭐ {movie.rating}</div>
                                    <p className="movie-synopsis">{movie.synopsis}</p>
                                    <div className="movie-actions">
                                        <button
                                            className="btn-edit"
                                            onClick={() => handleEdit(movie)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn-delete"
                                            onClick={() => handleDelete(movie.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default MovieList;
