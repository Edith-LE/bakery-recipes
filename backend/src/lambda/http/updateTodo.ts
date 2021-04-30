import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { updateTodo } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('update todo')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  
  const auth = event.headers.Authorization
  const split = auth.split(' ')
  const jwt = split[1]

  logger.info('update todo', updateTodo, todoId)

  const todoUpdate = {todoId, ...updatedTodo}

  const updateItem = await updateTodo(todoUpdate, jwt)
  
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
