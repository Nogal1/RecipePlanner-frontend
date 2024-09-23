import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Layout/Navbar'; // Import the Navbar
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import RecipeSearch from './components/Recipes/RecipeSearch';
import SavedRecipes from './components/Recipes/SavedRecipes';
import "./App.css";

function App() {
    return (
        <Router>
            <div>
                <Navbar />  {/* Add Navbar here */}
                <Routes>
                    <Route path="/" element={<RecipeSearch />} />
                    <Route path="/search" element={<RecipeSearch />} />  {/* Add this route */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/saved-recipes" element={<SavedRecipes />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
