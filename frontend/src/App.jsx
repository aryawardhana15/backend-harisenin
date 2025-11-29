import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import MovieList from './components/MovieList';
import './App.css';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <BrowserRouter>
            <div className="App">
                <header>
                    <h1>🎬 Movies App</h1>
                    {isAuthenticated && (
                        <button
                            onClick={() => setIsAuthenticated(false)}
                            style={{ background: '#ff4757', color: '#fff' }}
                        >
                            Logout
                        </button>
                    )}
                </header>

                <Routes>
                    <Route
                        path="/login"
                        element={
                            isAuthenticated ?
                                <Navigate to="/movies" /> :
                                <Login onLogin={() => setIsAuthenticated(true)} />
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            isAuthenticated ?
                                <Navigate to="/movies" /> :
                                <Register />
                        }
                    />
                    <Route
                        path="/movies"
                        element={
                            isAuthenticated ?
                                <MovieList /> :
                                <Navigate to="/login" />
                        }
                    />
                    <Route path="/" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
