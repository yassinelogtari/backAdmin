import * as express from "express"
import controller from "../controllers/employe"
import { Schemas,ValidateSchema } from "../middleware/ValidateSchema"


const router = express.Router()


router.get("/api/employes",controller.fetchemploye)
router.post("/api/user/:userId/employe",ValidateSchema((Schemas.employe.create)),controller.createmploye)
router.patch("/api/employe/:employeId",ValidateSchema((Schemas.employe.update)),controller.updatemploye)
router.delete("/api/employe/:employeId",controller.deletemploye)




export {
    router as createEmployeRouter
}

