import * as React from 'react'
import { Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { History } from 'history'
import { getUploadUrl, uploadFile, patchRecipe } from '../api/recipes-api'


enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile,
}

interface EditRecipesProps {
  match: {
    params: {
      recipeId: string
    }
  }
  auth: Auth
  location: any,
  history: History
}

interface EditRecipeState {
  file: any
  uploadState: UploadState
  name: string
  ingredients: string
  time: string
  portions: number,
  attachmentUrl?: string
}

export class EditRecipe extends React.PureComponent<
  EditRecipesProps,
  EditRecipeState
> {
  state: EditRecipeState = {
    file: undefined,
    uploadState: UploadState.NoUpload,
    name: '',
    ingredients: '',
    time: '',
    portions: 0,
    attachmentUrl: ''
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.file) {
        alert('File should be selected')
        return
      }

      this.setUploadState(UploadState.FetchingPresignedUrl)
      const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), this.props.match.params.recipeId)

      this.setUploadState(UploadState.UploadingFile)
      await uploadFile(uploadUrl, this.state.file)

      alert('File was uploaded!')
      
    } catch (e) {
      alert('Could not upload a file: ' + e.message)
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }
  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: event.target.value })
  }

  handleIngredientsChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ ingredients: event.target.value })
  }

  handlePortionsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ portions: Number(event.target.value) })
  }

  handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ time: event.target.value })
  }

  onRecipeUpdate = async () =>{
    await patchRecipe(this.props.auth.getIdToken(), this.props.match.params.recipeId, {
      name: this.state.name,
      ingredients: this.state.ingredients,
      portions: this.state.portions,
      time: this.state.time,
    } )
    this.props.history.push("/")
  }

  componentDidMount() {
    const { name, ingredients, portions, time, attachmentUrl } = this.props.location.state
    this.setState({
      name,
      ingredients,
      portions,
      time,
      attachmentUrl
    })
  }



  render() {
    return (
      <div style={{padding: '30px', background:'#EBE9DE', width:'100vw', height:'100vh',}}>
        <h1 style={{fontSize:'54px', color:'#b34f4b', fontWeight:'bold', margin:'20px 0'}}>{this.state.name}</h1>

        <div className='edit-form'>
          <label style={{margin:'15px 0', fontSize: '18px'}}>Recipe Name</label>
          <input 
            style={{height:'30px', border:'none', borderRadius:'8px', padding: '6px'}}
            type="text" 
            value={this.state.name} 
            onChange={this.handleNameChange}
          />
          <label style={{margin:'15px 0', fontSize: '18px'}}>Ingredients and steps to follow</label>
          <textarea 
            style={{height:'100px', border:'none', borderRadius:'8px', padding: '6px'}}  
            value={this.state.ingredients} 
            onChange={this.handleIngredientsChange}
          />
          <label style={{margin:'15px 0', fontSize: '18px'}}>Time (write on letters)</label>
          <input 
            style={{height:'30px', border:'none', borderRadius:'8px', padding: '6px'}} 
            type="text" value={this.state.time} 
            onChange={this.handleTimeChange}
          />
          <label style={{margin:'15px 0', fontSize: '18px'}}>Portions</label>
          <input 
            type="number" 
            value={this.state.portions} 
            onChange={this.handlePortionsChange}
          />
          
        </div>
        <form onSubmit={this.handleSubmit} style={{display:'flex', flexDirection: 'column'}}>
          <label style={{fontSize:'24px', color:'#b34f4b', fontWeight:'bold', margin:'20px 0', lineHeight: '32px'}}>Do you have an image of your recipe? <br/> Upload one!</label>
          <input
            type="file"
            accept="image/*"
            placeholder="Image to upload"
            onChange={this.handleFileChange}
          />
          {this.renderButton()}
        </form>
        <div style={{display:'flex', width:'100%', justifyContent: 'flex-end'}}>
          <button style={{width:'200px', height:'40px', borderRadius:'8px', background:'#CE864D', color:'#fff', border:'none', fontSize:'16px', fontWeight:'bold', margin:'20px 0', cursor:'pointer'}} onClick={this.onRecipeUpdate}>Update Recipe</button>
        </div>
      </div>
    )
  }

  renderButton() {

    return (
      <div>
        {this.state.uploadState === UploadState.FetchingPresignedUrl && <p>Uploading image metadata</p>}
        {this.state.uploadState === UploadState.UploadingFile && <p>Uploading file</p>}
        <Button
          loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit"
        >
          Upload
        </Button>
      </div>
    )
  }
}
