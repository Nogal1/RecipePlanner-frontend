import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [ingredients, setIngredients] = useState('');
    const [recipes, setRecipes] = useState([]);

    const searchRecipes = async () => {
        try {
            const response = await axios.get(`/search/${ingredients}`);
            setRecipes(response.data);
        } catch (error) {
            console.error("Error fetching recipes", error);
        }
    };

    return (
        <div>
            <h1>RecipePlanner</h1>
            <input
                type="text"
                placeholder="Enter ingredients"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
            />
            <button onClick={searchRecipes}>Search Recipes</button>

            <div>
                {recipes.length > 0 && recipes.map((recipe) => (
                    <div key={recipe.id}>
                        <h3>{recipe.title}</h3>
                        <img src={recipe.image} alt={recipe.title} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
