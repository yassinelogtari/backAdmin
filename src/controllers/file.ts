import { Request,Response,NextFunction } from "express";
import { File } from "../models/File";
import Logging from "../library/Logging";


const fetchfile= async (req: Request, res: Response, next: NextFunction) =>{
    try {
      const file = await File.find();
      return res.json(file);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to fetch file" });
    }
  }



  const deleteFiles = async (req: Request, res: Response, next: NextFunction) => {

    const {fileId}=req.params;
     try{
 
       const file = await File.findOne({ where: { file_id:fileId } });
         if (!file) {
           Logging.error("File not found")
             return res.json({
               msg: "File not found",
             });
        
       }
       file.softRemove()
       Logging.info("File deleted succefully")
 
     }catch(err){
         Logging.error("File not deleted")
     }
 
 }

  export default{
    fetchfile,deleteFiles
}