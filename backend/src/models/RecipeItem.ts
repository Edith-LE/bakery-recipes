export interface RecipeItem {
  userId: string
  recipeId: string
  ingredients:string,
  createdAt: string
  time: string,
  portions: number
  name: string
  attachmentUrl?: string
}