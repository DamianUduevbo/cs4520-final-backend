const express = require('express');
const app = express();

app.use(express.json()); 

/*
type Recipe = {
    id: string;
    name: string;
    authors: string[];
    ingredients: string;
    steps: string
}

type ClientRecipe = {
    name: string;
    authors: string[];
    ingredients: string;
    steps: string
}

type User = {
    id: string;
    name: string;
    numberOfRecipes: number;
}

type ClientUser = {
    name: string;
    numberOfRecipes: number;
}
*/

const RecipesDatabase = [
    {
        id: '1',
        name: 'Chicken Curry',
        authors: ['Alice', 'Bob'],
        ingredients: 'Chicken, Curry',
        steps: '1. Cook chicken 2. Add curry'
    },
    {
        id: '2',
        name: 'Pasta',
        authors: ['Alice'],
        ingredients: 'Pasta',
        steps: '1. Boil pasta'
    }
];

const UsersDatabase = [];

// get all recipes
app.get('/recipes', (req, res) => {
    const { search } = req.query;

    // split the search query into individual words by spaces or commas and filter the recipes
    const regex = /(\w+)/gm;
    const searchWords = search?.match(regex);
    
    console.log(`Searching for ${searchWords}`);

    if (searchWords) {
        // return recipes whose name contains some or all of the words in searchWords
        const filteredRecipes = RecipesDatabase.filter((recipe) => {
            return searchWords.every((word) => recipe.name.includes(word));
        });

        res.json(filteredRecipes);
        return;
    }

    res.json(RecipesDatabase);
});

// get all users
app.get('/users', (req, res) => {
    res.json(UsersDatabase);
});

// create a recipe
app.post('/recipes', (req, res) => {
    const clientRecipe = req.body;
    const recipe = {
        id: Math.random().toString(36).substring(7),
        name: clientRecipe.name,
        authors: clientRecipe.authors,
        ingredients: clientRecipe.ingredients,
        steps: clientRecipe.steps
    };

    // for each author, increment their number of recipes
    for (let i = 0; i < recipe.authors.length; i++) {
        const author = recipe.authors[i];
        const user = UsersDatabase.find((user) => user.name === author);
        
        if (user) {
            user.numberOfRecipes++;
        }
    }

    RecipesDatabase.push(recipe);
    res.json(recipe);
});

// create a user
app.post('/users', (req, res) => {
    const clientUser = req.body;
    console.log(`USER ${JSON.stringify(clientUser)}`)
    console.log(`Creating user ${clientUser.name} with ${clientUser.numberOfRecipes} recipes`);

    const recipeCount = RecipesDatabase.filter(
        (recipe) => recipe.authors.includes(clientUser.name)).length;

    console.log(`User ${clientUser.name} has ${recipeCount} recipes`);

    const user = {
        id: Math.random().toString(36).substring(7),
        name: clientUser.name,
        numberOfRecipes: recipeCount
    };

    console.log(`User ${user.name} with ${user.numberOfRecipes} recipes added to database`);
    UsersDatabase.push(user);
    res.json(user);
});

// listen on port 3000
app.listen(3000, () => {
    console.log('server started');
});