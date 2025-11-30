import { useState, useEffect } from 'react';
import { movieAPI } from '../services/api';
import axios from 'axios';

function MovieForm({ movie, onSuccess, onCancel }) {
    const [formData, setFormData] = useState({
        name: '',
        synopsis: '',
        rating: '',
        image: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (movie) {
            setFormData({
                name: movie.name,
                synopsis: movie.synopsis,
                rating: movie.rating,
                image: movie.image || '',
            });
            if (movie.image) {
                setImagePreview(`http://localhost:5000/images/${movie.image}`);
            }
        }
    }, [movie]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const uploadImage = async () => {
        if (!imageFile) return formData.image; // Return existing image if no new file

        setUploading(true);
        const formDataUpload = new FormData();
        formDataUpload.append('image', imageFile);

        try {
            const response = await axios.post('http://localhost:5000/upload', formDataUpload, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true,
            });
            return response.data; // Returns filename
        } catch (err) {
            throw new Error('Image upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Upload image first if there's a new one
            const imageFilename = await uploadImage();

            const dataToSend = {
                ...formData,
                image: imageFilename,
            };

            if (movie) {
                // Update existing movie
                await movieAPI.update(movie.id, dataToSend);
            } else {
                // Create new movie
                await movieAPI.create(dataToSend);
            }
            onSuccess();
        } catch (err) {
            setError(err.response?.data || err.message || 'Failed to save movie. Please try again.');
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

                <div className="form-group">
                    <label htmlFor="image">Movie Poster</label>
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    {imagePreview && (
                        <div style={{ marginTop: '1rem' }}>
                            <img
                                src={imagePreview}
                                alt="Preview"
                                style={{
                                    maxWidth: '200px',
                                    maxHeight: '300px',
                                    borderRadius: '8px',
                                    objectFit: 'cover'
                                }}
                            />
                        </div>
                    )}
                </div>

                <div className="movie-form-actions">
                    <button type="submit" className="btn-primary" disabled={loading || uploading}>
                        {uploading ? 'Uploading image...' : loading ? 'Saving...' : (movie ? 'Update Movie' : 'Add Movie')}
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
