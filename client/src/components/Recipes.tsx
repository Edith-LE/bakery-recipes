import { History } from 'history'
import * as React from 'react'
import {
  Grid,
  Header,
  Loader
} from 'semantic-ui-react'
import { getRecipes, createRecipe, deleteRecipe } from '../api/recipes-api'
import Auth from '../auth/Auth'
import {Recipe} from '../types/Recipe'

interface TRecipesProps {
  auth: Auth
  history: History
}

interface RecipesState {
  recipeName: string
  recipeIngredients: string
  recipeTime: string
  recipePortions: number
  recipes: Recipe[]
  loadingRecipes: boolean
}

export class Recipes extends React.PureComponent<TRecipesProps, RecipesState> {
  state: RecipesState = {
    recipeName: '',
    recipeIngredients: '',
    recipeTime: '',
    recipePortions: 0,
    recipes:[],
    loadingRecipes: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ recipeName: event.target.value })
  }

  handleIngredientsChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ recipeIngredients: event.target.value })
  }

  handlePortionsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ recipePortions: Number(event.target.value) })
  }

  handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ recipeTime: event.target.value })
  }

  onEditButtonClick = (recipe: Recipe) => {
    this.props.history.push({
      pathname:`/recipes/${recipe.recipeId}/edit`,
      state: {
        ...recipe
      }
    })
  }

  onRecipeCreate = async () => {
    try {
      const newRecipe = await createRecipe(this.props.auth.getIdToken(), {
        name: this.state.recipeName,
        ingredients: this.state.recipeIngredients,
        time: this.state.recipeTime,
        portions: this.state.recipePortions
      })
      this.setState({
        recipes: [newRecipe,...this.state.recipes],
        recipeName: '',
        recipeIngredients: '',
        recipeTime:'',
        recipePortions: 0
      })
    } catch {
      alert('Recipe creation failed')
    }
  }

  onRecipeDelete = async (recipeId: string) => {
    try {
      await deleteRecipe(this.props.auth.getIdToken(), recipeId)
      this.setState({
        recipes: this.state.recipes.filter(recipe => recipe.recipeId != recipeId)
      })
    } catch {
      alert('Recipe deletion failed')
    }
  }

  


  async componentDidMount() {
    try {
      const recipes = await getRecipes(this.props.auth.getIdToken())
      this.setState({
        recipes,
        loadingRecipes: false
      })
    } catch (e) {
      alert(`Failed to fetch recipes: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Recipes</Header>

        {this.renderCreateRecipe()}
        {this.renderRecipes()}
      </div>
    )
  }

  

  renderCreateRecipe(){
    return(
      <div>
        <input type="text" value={this.state.recipeName} onChange={this.handleNameChange}/>
        <textarea value={this.state.recipeIngredients} onChange={this.handleIngredientsChange}/>
        <input type="text" value={this.state.recipeTime} onChange={this.handleTimeChange}/>
        <input type="number" value={this.state.recipePortions} onChange={this.handlePortionsChange}/>
        <button onClick={this.onRecipeCreate}>Create Recipe</button>
      </div>

    )
  }

  renderRecipes() {
    if (this.state.loadingRecipes) {
      return this.renderLoading()
    }

    return this.renderRecipesList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Recipes
        </Loader>
      </Grid.Row>
    )
  }

  renderRecipesList() {
    return (
      <Grid padded>
        {this.state.recipes.map((recipe) => {
          return(
            <div key={recipe.recipeId}>
              <h1>{recipe.name}</h1>
              <p>ingredients:{recipe.ingredients}</p>
              <p>portions:{recipe.portions}</p>
              <p>time:{recipe.time}</p>
              <img src={recipe.attachmentUrl} alt="recipe-image" />
              <div>
                <button onClick={() => this.onRecipeDelete(recipe.recipeId)} > Delete </button>
                <button onClick={() => this.onEditButtonClick(recipe)} > Edit </button>
              </div>
            </div>
          )
        })}
      </Grid>
    )
  }
}
