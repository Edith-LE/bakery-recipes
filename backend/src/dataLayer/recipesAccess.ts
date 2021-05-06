import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)


import {RecipeItem} from '../models/RecipeItem'
import {RecipeUpdate} from '../models/RecipeUpdate'
import {User} from '../models/User'
//import {TodoUpdate} from '../models/TodoUpdate'


export class RecipeAccess{

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly recipesTable = process.env.RECIPES_TABLE,
    private readonly userIdIndex = process.env.USER_ID_INDEX){
  }

  async createRecipe(recipe: RecipeItem): Promise<RecipeItem>{
    await this.docClient.put({
      TableName: this.recipesTable,
      Item: recipe
    }).promise()
    return recipe
  }

  async updateRecipe(recipe:RecipeUpdate): Promise<RecipeItem>{
    console.log(recipe,"recipe");
    
    await this.docClient.update({
      TableName: this.recipesTable,
      Key:{
        recipeId: recipe.recipeId
      },
      ExpressionAttributeNames:{"#N": "name", "#T": "time"},
      UpdateExpression:"set #N = :recipeName, ingredients = :ingredients, portions = :portions, #T = :recipeTime",
      ConditionExpression: "userId = :userId",
      ExpressionAttributeValues:{
        ":recipeName": recipe.name,
        ":userId": recipe.userId,
        ":ingredients": recipe.ingredients,
        ":portions": recipe.portions,
        ":recipeTime": recipe.time
      },
      ReturnValues: "UPDATED_NEW"
    }).promise()

    return recipe as RecipeItem
  }

  async getRecipes(user: User):Promise<RecipeItem[]>{
    const result = await this.docClient.query({
      TableName: this.recipesTable,
      IndexName: this.userIdIndex,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues:{
        ":userId": user.userId        
      }
    }).promise()
    const recipes = result.Items ? result.Items : []
    return recipes as RecipeItem[] 
  }

  async deleteRecipe(recipe):Promise<RecipeItem>{
    await this.docClient.delete({
      TableName: this.recipesTable,
      Key:{
        recipeId: recipe.recipeId
      },
      ConditionExpression: "userId = :userId",
      ExpressionAttributeValues:{
        ":userId": recipe.userId
      }
    }).promise()
    return recipe
  }

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