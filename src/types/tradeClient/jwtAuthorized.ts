type JWTAuthorized<Payload> = {
  jwt: string
} & Payload

export default JWTAuthorized
