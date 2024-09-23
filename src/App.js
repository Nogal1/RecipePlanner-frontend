import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import RecipeSearch from './components/Recipes/RecipeSearch';
import SavedRecipes from './components/Recipes/SavedRecipes';
import RecipeDetails from './components/Recipes/RecipeDetails';
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);  // Authentication state

  return (
      <Router>
          <div>
              <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
              <Routes>
                  <Route path="/" element={<RecipeSearch />} />
                  <Route path="/search" element={<RecipeSearch />} />
                  <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />  {/* Pass setIsAuthenticated */}
                  <Route path="/register" element={<Register />} />
                  <Route path="/saved-recipes" element={<SavedRecipes />} />
                  <Route path="/recipe/:id" element={<RecipeDetails />} />
              </Routes>
          </div>
      </Router>
  );
}

export default App;
