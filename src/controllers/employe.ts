
import { Request,Response,NextFunction } from "express";
import { User } from "../models/User"
import { FindOneOptions } from 'typeorm';
import { Employe } from "../models/Employe";
import Logging from "../library/Logging";



const createmploye=async(req:Request,res:Response,next :NextFunction)=>{

    const {userId}=req.params;
    const {
        
        firstname,
        lastname,
        id_ident,
        email,
        cnprs
    }=req.body
    
    const user = await User.findOne({ where: { user_id: parseInt(userId, 10) } } as FindOneOptions<User>);
  

    if(!user){
      
      Logging.error("Employe not found")
        return res.json(
            {
                msg:"user not found "
            }
        )
    
    }

    try{
        const employe = Employe.create({
            firstname,
            lastname,
            id_ident,
            email,
            cnprs,
            user
        })

       await employe.save()
       await user.save()
       Logging.info("Employe created succefully")
       return res.json({
        msg :"employe added"
       })

   
    } catch(err){
        Logging.error(err)
    }
        
            

}

const deletemploye = async (req: Request, res: Response, next: NextFunction) => {

   const {employeId}=req.params;
    try{

      const employe = await Employe.findOne({ where: { employe_id:employeId } });
        if (!employe) {
          Logging.error("Employe not found")
            return res.json({
              msg: "Employee not found",
            });
       
      }
      employe.softRemove()
      Logging.info("Employe deleted succefully")

    }catch(err){
        Logging.error("Employe not deleted")
    }

}
const updatemploye = async (req: Request, res: Response, next: NextFunction) => {
  const { employeId } = req.params;
  const {
    firstname,
    lastname,
    id_ident,
    email,
  } = req.body;
console.log(employeId)
  try {
    const employe = await Employe.findOne({ where: { employe_id:employeId } });

    if (!employe) {
      return res.status(404).json({
        msg: "Employee not found"
      });
    }

    employe.firstname = firstname;
    employe.lastname = lastname;
    employe.id_ident = id_ident;
    employe.email = email;

    await employe.save();

    console.log("Employee updated successfully");
    return res.json({
      msg: "Employee updated"
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Failed to update employee"
    });
  }
};

  
const fetchemploye= async (req: Request, res: Response, next: NextFunction) =>{
      try {
        const employe = await Employe.find();
        return res.json(employe);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to fetch employe data" });
      }
    }



export default{createmploye,deletemploye,updatemploye,fetchemploye}