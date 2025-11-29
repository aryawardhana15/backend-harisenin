import { useState, useEffect } from 'react';
import { movieAPI } from '../services/api';

function MovieForm({ movie, onSuccess, onCancel }) {
    const [formData, setFormData] = useState({
        name: '',
        synopsis: '',
        rating: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (movie) {
            setFormData({
                name: movie.name,
                synopsis: movie.synopsis,
                rating: movie.rating,
            });
        }
    }, [movie]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (movie) {
                // Update existing movie
                await movieAPI.update(movie.id, formData);
            } else {
                // Create new movie
                await movieAPI.create(formData);
            }
            onSuccess();
        } catch (err) {
            setError(err.response?.data || 'Failed to save movie. Please try again.');
            console.error('Save error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="movie-form">
            <h2>{movie ? 'Edit Movie' : 'Add New Movie'}</h2>
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Movie Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter movie name"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="synopsis">Synopsis</label>
                    <textarea
                        id="synopsis"
                        name="synopsis"
                        value={formData.synopsis}
                        onChange={handleChange}
                        required
                        placeholder="Enter movie synopsis"
                        rows="4"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="rating">Rating (0-10)</label>
                    <input
                        type="number"
                        id="rating"
                        name="rating"
                        value={formData.rating}
                        onChange={handleChange}
                        required
                        min="0"
                        max="10"
                        step="0.1"
                        placeholder="Enter rating"
                    />
                </div>

                <div className="movie-form-actions">
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Saving...' : (movie ? 'Update Movie' : 'Add Movie')}
                    </button>
                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default MovieForm;
