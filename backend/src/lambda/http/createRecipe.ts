import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateRecipeRequest } from '../../requests/CreateRecipeRequest'

import {createRecipe} from '../../businessLogic/recipes'

import { createLogger } from '../../utils/logger'

const logger = createLogger('create recipe')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info('start create recipe', event)
  

  const newRecipe: CreateRecipeRequest = JSON.parse(event.body)
  
  const auth = event.headers.Authorization
  const split = auth.split(' ')
  const jwt = split[1]

  // TODO: Implement creating a new TODO item
  try{
    const newItem = await createRecipe(newRecipe, jwt)

    logger.info('done create recipe', newItem)

    return{
      statusCode: 201,
      headers:{
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item: newItem
      })
    }
  }catch (error){
    logger.info('fail create recipe', error)
    return {
      statusCode: 500,
      headers:{
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        message: 'Error on creating'
      }) 
    }
  }
  
  
}
