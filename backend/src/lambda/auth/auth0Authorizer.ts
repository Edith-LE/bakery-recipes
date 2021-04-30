import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
// import Axios from 'axios'

import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

const cert =`
-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJbw7gpd33zdE+MA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi1lZGl0aC1sZS51cy5hdXRoMC5jb20wHhcNMjEwNDIyMDIzOTMxWhcN
MzQxMjMwMDIzOTMxWjAkMSIwIAYDVQQDExlkZXYtZWRpdGgtbGUudXMuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmnsOGk6t1vMiWqxO
zYSvJ/gV5knm9xLbhoF9IH9JhelUkmaPfpqYAiwhJsV55fgF1AsT8zaZ2tLM9CQn
z79Y2rOj3Av4FDYj5vmYKCBe9TnuOYRmqC6egB93kc7E3GDl55mSxgV37dSP4ysU
ERuOglXbwGF69N00xJCYLK+ccXeP85UVD6BxW04tkWkALwZ0YLzv7gGhAuc0Rpjl
T3FVc+laHQJMKxpjIctEegaY1cRiXv54zrV94NpWvi8fiyFzHZNp8FE3C+/eYAFJ
slyb99qi4nswO65bWn0vvFpTAo7FIinmOnKL9QW44iWibEliqtzmv0+surNKb86O
H+6zdwIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBQMv6N+dL+1
/HBrTaeOcgPoPAgnnjAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
AC2vLfmwTRDjnIwjvol1BXuWxep8nvZ/lmrfBQnh6L9hWB5+KvQl6J659iUFheeo
oeDenBXqpNn08nnIfmg0+hKN/bfBQcGiNmtshaa5u/BaXQMTCuSdA7ZNUkCRedp5
XgTQy/vzjZOFggDEtsy9TGCrH2EiuB8+T9dYTidY+99ykOtOAcWalL3CBkR+jfZz
Jg6MCswLvtsFqQNDwgm+hHcLh93PEOCCNCcl544q7Jv5Al9ui2f/Z9BQ9uu17lUH
S4AR+sJ+X7CJeWZDpX2RWvDtEbdu2xYlAxgEVJL3nzZW+xBJSP/Xjlpct5S/iiUj
f8EsvcY2eABTZsdXmDVTsVA=
-----END CERTIFICATE-----
`

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
// const jwksUrl = '...'

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)

  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  const jwt: Jwt = decode(token, { complete: true }) as Jwt
  console.log(jwt);
  
  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
