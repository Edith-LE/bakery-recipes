import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {deleteTodo} from "../../businessLogic/todos"

import { createLogger } from '../../utils/logger'

const logger = createLogger('delete todo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  logger.info('start delet todo', event)

  const auth = event.headers.Authorization
  const split = auth.split(' ')
  const jwt = split[1]
  
  const deletedItem = await deleteTodo(todoId, jwt)

  logger.info('done delete todo', deletedItem)
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
