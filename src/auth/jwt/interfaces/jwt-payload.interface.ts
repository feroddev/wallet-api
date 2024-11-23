export interface JwtPayload {
  sub: string
  iat: number
  exp: number
  userId: string
  user: {
    email: string
    name: string
    plan: string
  }
}
