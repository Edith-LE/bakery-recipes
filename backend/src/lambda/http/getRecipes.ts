import 'source-map-support/register'

import {getRecipes} from '../../businessLogic/recipes'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { createLogger } from '../../utils/logger'

const logger = createLogger('get recipe')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  logger.info('start get recipes', event)

  const auth = event.headers.Authorization
  const split = auth.split(' ')
  const jwt = split[1]

  const recipes = await getRecipes(jwt)

  logger.info('done get recipes', recipes)

  return{
    statusCode: 201,
    headers:{
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items: recipes
    })
  } 
}

