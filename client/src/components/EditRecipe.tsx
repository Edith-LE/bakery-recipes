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
      <div>
        <h1>Upload new image</h1>

        <div>
          <input 
            type="text" 
            value={this.state.name} 
            onChange={this.handleNameChange}
          />
          <textarea 
            value={this.state.ingredients} 
            onChange={this.handleIngredientsChange}
          />
          <input 
            type="text" value={this.state.time} 
            onChange={this.handleTimeChange}
          />
          <input 
            type="number" 
            value={this.state.portions} 
            onChange={this.handlePortionsChange}
          />
          
        </div>
        <form onSubmit={this.handleSubmit}>
          <label>File</label>
          <input
            type="file"
            accept="image/*"
            placeholder="Image to upload"
            onChange={this.handleFileChange}
          />
          {this.renderButton()}
        </form>
        <button onClick={this.onRecipeUpdate}>Update Recipe</button>
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
