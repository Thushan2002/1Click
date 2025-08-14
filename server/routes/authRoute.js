import express from 'express'
import { authUser, login, signUp } from '../controllers/authController.js'
import { protectedRoute } from '../middleware/protectedRoutes.js'

const authRouter = express.Router()

authRouter.post('/signup', signUp)
authRouter.post('/login', login)
authRouter.get('/auth-me', protectedRoute, authUser)


export default authRouter;