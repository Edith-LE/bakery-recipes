import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import {UpdateRecipeRequest} from '../../requests/UpdateRecipeRequest'
import { updateRecipe } from '../../businessLogic/recipes'
import { createLogger } from '../../utils/logger'

const logger = createLogger('update recipe')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const recipeId = event.pathParameters.recipeId
  const updatedRecipe: UpdateRecipeRequest = JSON.parse(event.body)
  
  const auth = event.headers.Authorization
  const split = auth.split(' ')
  const jwt = split[1]

  logger.info('update recipe', updateRecipe, recipeId)

  const recipeUpdate = {recipeId, ...updatedRecipe}

  const updateItem = await updateRecipe(recipeUpdate, jwt)
  
  logger.info('done updated item', updateItem)

  return{
    statusCode:201,
    headers:{
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      updateItem
    })
  }
  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  
}
