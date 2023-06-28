import { Request,Response,NextFunction } from "express";
import { User } from "../models/User";
import { FindOneOptions } from 'typeorm';
import Logging from "../library/Logging";

const   bcrypt =require('bcrypt')


const createuser=async(req:Request,res:Response,next :NextFunction)=>{
    const{
            username,
            firstname,
            lastname,
            email,
    }=req.body

    try{
        const salt =await bcrypt.genSalt()
        const hashPassword= await bcrypt.hash(req.body.password,salt)
        const user=User.create({
            username:username,
            firstname:firstname,
            lastname:lastname,
            email:email,
            password:hashPassword
        })
    
        await user.save();
        Logging.info("User created successfully")
        return res.json(user);
    } catch(err){
        Logging.error("Error creating user")
    }
   
};


const userlogin=async(req:Request,res:Response,next :NextFunction)=>{

    const {username}=req.body;
    const user = await User.findOne({ where: { username: username } });
    res.send(user)
    if (user == null) {
        return res.status(400).send('Cannot find user')
    }
    try{
        if(await bcrypt.compare(req.body.password,user.password)){
            
            res.send (user)
            
        }else{
            res.send ('Not Allowed')
        }
       
    } catch (err){
            console.log(err)
    }
}


const updateuser = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const {
      username,
      firstname,
      lastname,
      email,
    } = req.body;
    try {
        const user = await User.findOne({ where: { user_id: parseInt(userId, 10) } } as FindOneOptions<User>);
      if (!user) {
        return res.status(404).json({
          msg: "user not found"
        });
      }
      
      user.username=username
      user.firstname = firstname;
      user.lastname = lastname;
      user.email = email;
  
      await user.save();
  
      console.log("User updated successfully");
      return res.json({
        msg: "User updated"
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        error: "Failed to update User"
      });
    }
  };


export default{
    createuser,userlogin,updateuser
}