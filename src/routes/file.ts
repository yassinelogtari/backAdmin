import * as express from "express"
import controller from "../controllers/file"



const router = express.Router()



router.get("/api/files",controller.fetchfile)
router.delete("/api/file/:fileId",controller.deleteFiles)




export {
    router as file
}
