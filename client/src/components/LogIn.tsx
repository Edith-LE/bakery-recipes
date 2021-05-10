import * as React from 'react'
import Auth from '../auth/Auth'
// import { Button } from 'semantic-ui-react'

interface LogInProps {
  auth: Auth
}

interface LogInState {}

export class LogIn extends React.PureComponent<LogInProps, LogInState> {
  onLogin = () => {
    this.props.auth.login()
  }

  render() {
    return (
      <div className='login-screen'>
        <div style={{backgroundColor: '#BD837C', width:'310px', height:'310px', display:'flex', alignItems:'center', color:'#fff', borderRadius:'50%'}}>
          <h1 className='login-title'>Create and Store your own <br /> <i>Bakery Recipes</i></h1>
        </div>
        <button style={{margin:'30px 0', background:'#CE864D', color:'#fff', border:'none', width:'170px', height:'50px', fontSize:'20px', fontWeight:'bold', borderRadius:'8px'}} onClick={this.onLogin} >
          Log in
        </button>
      </div>
    )
  }
}
