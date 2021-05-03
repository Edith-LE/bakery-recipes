import * as uuid from 'uuid'

// import {TodoItem} from '../models/TodoItem'
import {RecipeItem} from '../models/RecipeItem'
import {RecipeAccess} from '../dataLayer/recipesAccess'
import {CreateRecipeRequest} from '../requests/CreateRecipeRequest'
// import {UpdateTodoRequest} from '../requests/UpdateTodoRequest'
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

// export async function updateTodo(
//   updateTodoRequest: UpdateTodoRequest,
//   jwt: string
// ): Promise<TodoItem> {

//   const userId = parseUserId(jwt)
//   return await recipeAccess.updateTodo({userId, ...updateTodoRequest})
  
// }

// export async function getTodos(
//   jwt: string
//   ):Promise <TodoItem[]>{
//   const userId = parseUserId(jwt)
//   return await recipeAccess.getTodos({userId})
// }

// export async function deleteTodo(
//   todoId: string,
//   jwt: string
// ):Promise<TodoItem>{
//   const userId = parseUserId(jwt)
//   return await recipeAccess.deleteTodo({userId, todoId})
// }

// export async function updateAttachmentUrl(
//   todoId: string,
//   imageUrl: string,
//   jwt:string
// ):Promise <TodoItem>{
//   const userId = parseUserId(jwt)
//   return await recipeAccess.updateAttachmentUrl({userId, todoId, imageUrl})
// }