import mongoose from 'mongoose';
import Joi from 'joi'
const currentDate = new Date(); 

export const User = mongoose.model('User', new mongoose.Schema({

    firstName: { type: String,  trim: true }, 
    lastName: { type: String, trim: true },  
    userName: { type: String,  trim: true },
    password: { type: String,  trim: true }, 
    email: { type: String, trim: true },
    phoneNumber: {type: String, trim: true },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }]
}));

export const Event = mongoose.model('Event', new mongoose.Schema({

    title: { type: String, trim: true },
    description: { type: String, trim: true },
    //date: { type: Date }, 
    //time: { type: String },
    //location: { type: String }

  }));

  // Signup validation schema
  export const signupSchema = Joi.object({
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
    phoneNumber: Joi.string().pattern(/^[0-9]{10,15}$/).required(), 
    username: Joi.string().alphanum().min(4).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(), // Ensure password is at least 8 characters
  });
  
  // Validation function for signup data
  export function validateSignUpData(data) {
    const { error } = signupSchema.validate(data); // Validate the data against the schema
  
    if (error) {
      return {
        valid: false,
        message: error.details[0].message // Return the validation error message
      };
    }
  
    return { valid: true }; // Return a valid result if no error
  }
  
  // Login validation schema
  export const loginSchema = Joi.object({
    userName: Joi.string().required(),
    password: Joi.string().required(),
  });
  
  // Validation function for login credentials
  export function validateLoginCredentials(data) {
    const { error } = loginSchema.validate(data); // Validate the data against the schema
  
    if (error) {
      return {
        valid: false,
        message: error.details[0].message // Return the validation error message
      };
    }
  
    return { valid: true }; // Return a valid result if no error
  }
  
  // General purpose validation function (if needed)
  export function validateData(data, schema) {
    const { error } = schema.validate(data); // Validate the data against the schema
  
    if (error) {
      return {
        valid: false,
        message: error.details[0].message // Return the validation error message
      };
    }
  
    return { valid: true }; // Return a valid result if no error
  }
  