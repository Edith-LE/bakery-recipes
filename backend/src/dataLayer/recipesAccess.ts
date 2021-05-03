import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

// import {TodoItem} from '../models/TodoItem'
import {RecipeItem} from '../models/RecipeItem'
// import { TodoUpdate } from '../models/TodoUpdate'
// import {User} from '../models/User'
//import {TodoUpdate} from '../models/TodoUpdate'


export class RecipeAccess{

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly recipesTable = process.env.RECIPES_TABLE,){
  }

  async createRecipe(recipe: RecipeItem): Promise<RecipeItem>{
    await this.docClient.put({
      TableName: this.recipesTable,
      Item: recipe
    }).promise()
    return recipe
  }

  // async updateTodo(recipe:recipeUpdate): Promise<RecipeItem>{
  //   await this.docClient.update({
  //     TableName: this.recipesTable,
  //     Key:{
  //       userId: recipe.userId,
  //       recipeId: recipe.recipeId
  //     },
  //     ExpressionAttributeNames:{"#N": "name"},
  //     UpdateExpression:"set #N = :todoName, dueDate = :dueDate, done = :done",
  //     ConditionExpression: "userId = :userId",
  //     ExpressionAttributeValues:{
  //       ":todoName": todo.name,
  //       ":dueDate": todo.dueDate,
  //       ":done": todo.done,
  //       ":userId": todo.userId
  //     },
  //     ReturnValues: "UPDATED_NEW"
  //   }).promise()

  //   return todo as TodoItem
  // }

  // async getTodos(user: User):Promise<TodoItem[]>{
  //   const result = await this.docClient.query({
  //     TableName: this.todosTable,
  //     IndexName: this.userIdIndex,
  //     KeyConditionExpression: "userId = :userId",
  //     ExpressionAttributeValues:{
  //       ":userId": user.userId        
  //     }
  //   }).promise()
  //   const todos = result.Items ? result.Items : []
  //   return todos as TodoItem[] 
  // }

  // async deleteTodo(todo):Promise<TodoItem>{
  //   await this.docClient.delete({
  //     TableName: this.todosTable,
  //     Key:{
  //       userId: todo.userId,
  //       todoId: todo.todoId
  //     },
  //     ConditionExpression: "userId = :userId",
  //     ExpressionAttributeValues:{
  //       ":userId": todo.userId
  //     }
  //   }).promise()
  //   return todo
  // }

  // async updateAttachmentUrl(todo): Promise <TodoItem>{
  //   await this.docClient.update({
  //     TableName: this.todosTable,
  //     Key:{
  //       userId: todo.userId,
  //       todoId: todo.todoId
  //     },
  //     UpdateExpression: "set attachmentUrl = :attachmentUrl",
  //     ConditionExpression: "userId = :userId",
  //     ExpressionAttributeValues:{
  //       ":attachmentUrl": todo.imageUrl,
  //       ":userId": todo.userId
  //     },
  //     ReturnValues:"UPDATED_NEW"
  //   }).promise()
  //   return todo
  // }

}



function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}