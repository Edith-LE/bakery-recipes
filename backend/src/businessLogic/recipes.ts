import * as uuid from 'uuid'

// import {TodoItem} from '../models/TodoItem'
import {RecipeItem} from '../models/RecipeItem'
import {RecipeAccess} from '../dataLayer/recipesAccess'
import {CreateRecipeRequest} from '../requests/CreateRecipeRequest'
import {UpdateRecipe} from '../requests/UpdateRecipeRequest'
import {parseUserId} from '../auth/utils'

const recipeAccess = new RecipeAccess() 



export async function createRecipe(
  createRecipeRequest: CreateRecipeRequest,
  jwt: string

  ):Promise<RecipeItem>{
    
  const itemId = uuid.v4()
  const userId = parseUserId(jwt)
  
  return await recipeAccess.createRecipe({
    recipeId: itemId,
    userId: userId,
    createdAt: new Date().toISOString(),
    ...createRecipeRequest
  })
}

export async function updateRecipe(
  updateRecipe: UpdateRecipe,
  jwt: string
): Promise<RecipeItem> {

  const userId = parseUserId(jwt)
  return await recipeAccess.updateRecipe({userId, ...updateRecipe})
  
}

export async function getRecipes(
  jwt: string
  ):Promise <RecipeItem[]>{
  const userId = parseUserId(jwt)
  return await recipeAccess.getRecipes({userId})
}

export async function deleteRecipe(
  recipeId: string,
  jwt: string
):Promise<RecipeItem>{
  const userId = parseUserId(jwt)
  return await recipeAccess.deleteRecipe({userId, recipeId})
}

export async function updateAttachmentUrl(
  recipeId: string,
  imageUrl: string,
  jwt:string
):Promise <RecipeItem>{
  const userId = parseUserId(jwt)
  return await recipeAccess.updateAttachmentUrl({userId, recipeId, imageUrl})
}