import * as express from "express"
import controller from "../controllers/user"
import { Schemas,ValidateSchema } from "../middleware/ValidateSchema"


const router = express.Router()







router.post('/api/user',ValidateSchema((Schemas.user.create)),controller.createuser)
router.patch("/api/user/:userId",controller.updateuser)
router.post('/api/login',controller.userlogin)


export {
    router as createUserRouter
}

