import { History } from 'history'
import * as React from 'react'
import {
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
      <div className='recipe-title'>
        <h1 style={{fontSize:'54px', color:'#b34f4b', fontWeight:'bold', margin:'20px 0'}}>Recipes</h1>
        <p style={{fontSize:'20px', lineHeight: '18px', maxWidth:'270px', color:'#b34f4b', textAlign:'center'}}>It's time to create and store your own recipes!</p>

        {this.renderCreateRecipe()}
        {this.renderRecipes()}
      </div>
    )
  }

  

  renderCreateRecipe(){
    return(
      <div className="create-recipe">
        <label style={{margin:'15px'}}>Recipe Name</label>
        <input style={{height:'30px', border:'none', borderRadius:'8px'}} type="text" value={this.state.recipeName} onChange={this.handleNameChange}/>
        <label style={{margin:'15px'}}>Ingredients and steps to follow</label>
        <textarea style={{height:'80px', border:'none', borderRadius:'8px'}}  value={this.state.recipeIngredients} onChange={this.handleIngredientsChange}/>
        <label style={{margin:'15px'}}>Time (write on letters)</label>
        <input style={{height:'30px', border:'none', borderRadius:'8px'}}  type="text" value={this.state.recipeTime} onChange={this.handleTimeChange}/>
        <label style={{margin:'15px'}}>Portions</label>
        <input style={{height:'30px', border:'none', borderRadius:'8px'}}  type="number" value={this.state.recipePortions} onChange={this.handlePortionsChange}/>
        <button style={{width:'200px', height:'40px', borderRadius:'8px', background:'#CE864D', color:'#fff', border:'none', fontSize:'16px', fontWeight:'bold', margin:'20px 0', cursor:'pointer'}} onClick={this.onRecipeCreate}>Create Recipe</button>
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
      <div>
        <Loader indeterminate active inline="centered">
          Loading Recipes
        </Loader>
      </div>
    )
  }

  renderRecipesList() {
    return (
      <div className='recipes' >
        {this.state.recipes.map((recipe) => {
          return(
            <div 
              className='recipe-header' 
              key={recipe.recipeId}
            >
              <h1>{recipe.name}</h1>
              <p>ingredients:{recipe.ingredients}</p>
              <p>portions:{recipe.portions}</p>
              <p>time:{recipe.time}</p>
              <img src={recipe.attachmentUrl} alt="recipe-image"  style={{maxWidth:'280px'}}/>
              <div>
                <button onClick={() => this.onRecipeDelete(recipe.recipeId)} > Delete </button>
                <button onClick={() => this.onEditButtonClick(recipe)} > Edit </button>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}
