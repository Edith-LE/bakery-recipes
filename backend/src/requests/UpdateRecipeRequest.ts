
export interface UpdateRecipeRequest {
  name: string
  ingredients: string
  portions: number
  time: string
  
}
export interface UpdateRecipe {
  recipeId: string
  name: string
  ingredients: string
  portions: number
  time: string
  
}