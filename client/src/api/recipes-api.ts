import { apiEndpoint } from '../config'
import { Todo } from '../types/Todo';
import {Recipe} from '../types/Recipe'
import { CreateTodoRequest } from '../types/CreateTodoRequest';
import { CreateRecipeRequest } from '../types/CreateRecipeRequest'
import Axios from 'axios'
import { UpdateTodoRequest } from '../types/UpdateTodoRequest';

//get all recipes

export async function getRecipes(idToken: string): Promise<Recipe[]> {
  console.log('Fetching recipes')

  const response = await Axios.get(`${apiEndpoint}/recipes`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Recipes:', response.data)
  return response.data.items
}

// create new recipe

export async function createRecipe(
  idToken: string,
  newRecipe: CreateRecipeRequest
): Promise<Recipe> {
  const response = await Axios.post(`${apiEndpoint}/recipes`,  JSON.stringify(newRecipe), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  console.log(response.data.item);
  
  return response.data.item
}

export async function patchTodo(
  idToken: string,
  todoId: string,
  updatedTodo: UpdateTodoRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/todos/${todoId}`, JSON.stringify(updatedTodo), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteRecipe(
  idToken: string,
  recipeId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/recipes/${recipeId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  todoId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/todos/${todoId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
