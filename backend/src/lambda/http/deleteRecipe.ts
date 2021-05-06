import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {deleteRecipe} from "../../businessLogic/recipes"

import { createLogger } from '../../utils/logger'

const logger = createLogger('delete recipe')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const recipeId = event.pathParameters.recipeId

  logger.info('start delet recipe', event)

  const auth = event.headers.Authorization
  const split = auth.split(' ')
  const jwt = split[1]
  
  const deletedItem = await deleteRecipe(recipeId, jwt)

  logger.info('done delete recipe', deletedItem)
  // TODO: Remove a TODO item by id
  return {
    statusCode: 201, 
    headers:{
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: deletedItem
    })
  }
}
