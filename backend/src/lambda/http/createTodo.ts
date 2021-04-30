import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

import {createTodo} from '../../businessLogic/todos'

import { createLogger } from '../../utils/logger'

const logger = createLogger('create todo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info('start create todo', event)
  

  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  
  const auth = event.headers.Authorization
  const split = auth.split(' ')
  const jwt = split[1]

  // TODO: Implement creating a new TODO item
  try{
    const newItem = await createTodo(newTodo, jwt)

    logger.info('done create todo', newItem)

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
    logger.info('fail create todo', error)
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
