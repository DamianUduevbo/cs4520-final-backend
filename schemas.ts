export type Recipe = {
    id: string;
    name: string;
    authors: string[];
    ingredients: string;
    steps: string
}

export type User = {
    id: string;
    name: string;
    numberOfRecipes: number;
}