import * as joi  from "joi"
import {ObjectSchema} from "joi"
import {NextFunction,Request,Response} from "express"
import Logging from "../library/Logging"
import { User } from "../models/User"
import { Employe } from "../models/Employe"


export const ValidateSchema =(schema:ObjectSchema) => {
    return async (req:Request ,res:Response,next :NextFunction) =>{

        try{
            await schema.validateAsync(req.body);
            next()
        }catch(error){
            Logging.error(error)
            res.send(error)
            
            
            
        }

    }
}

//username funciton 
export const validateUsername = async (value, helpers) => {
    
    const existUsername = await User.findOne({ where: { username: value } });
    console.log(existUsername);
    if (existUsername) {
      return helpers.error('any.invalid');
    }
    return value;
  };
//email function (user)
export const validateEmail = async (value, helpers) => {
    const existEmail = await User.findOne({ where: { email: value } });
    console.log(existEmail);
    if (existEmail) {
      return helpers.error('any.invalid');
    }
    return value;
  }; 
//email function (employe)
  export const validateEmailemploye= async (value, helpers) => {
    const existEmail = await Employe.findOne({ where: { email: value } });
    console.log(existEmail);
    if (existEmail) {
      return helpers.error('any.invalid');
    }
    return value;
  }; 

  //email function (employe)
  export const validateCnprsemploye= async (value, helpers) => {
    const existCnprs = await Employe.findOne({ where: { cnprs: value } });
    console.log(existCnprs);
    if (existCnprs) {
      return helpers.error('any.invalid');
    }
    return value;
  }; 

export const Schemas = {
//user validation
        user: {
            create :joi.object<User>({
                username: joi.string().external(validateUsername).required(),
                firstname:joi.string().required(),
                lastname:joi.string().required(),
                email:joi.string().external(validateEmail).required(),
                password:joi.string().required()

                 
                
            })  
        },
//employe validation
        employe : {
            create:joi.object<Employe>({
                
                firstname:joi.string().required(),
                lastname:joi.string().required(),
                id_ident:joi.string().regex(/^\d{4}[a-zA-Z]$/).length(5).required(),
                email:joi.string().external(validateEmailemploye).required(),
                cnprs:joi.string().external(validateCnprsemploye).length(10).required()
            }),
            update:joi.object<Employe>({

                firstname:joi.string().required(),
                lastname:joi.string().required(),
                id_ident:joi.string().regex(/^\d{4}[a-zA-Z]$/).length(5).required(),
                email:joi.string().external(validateEmailemploye).required(),

            })
            
        }
}