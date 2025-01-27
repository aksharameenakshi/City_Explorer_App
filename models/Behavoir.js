import mongoose from 'mongoose';
import Joi from 'joi'



const userSchema = new mongoose.Schema({
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  username: { type: String, required: true, trim: true },
  password: { type: String, trim: true },
  email: { type: String, trim: true },
  phoneNumber: { type: String, trim: true },
  resetPasswordOTP: { type: String },
  resetPasswordExpires: { type: Date }, 
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  group: [{ type: mongoose.Schema.Types.ObjectId, ref: 'groups' }],
  notification: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }],
  role: { type: String, enum: ['USER', 'EVENT_ORGANIZER', 'ADMIN'], default: 'USER' },
  createdAt: { type: Date, default: Date.now },
  settings: {
  theme: { type: String, default: 'light' },
  fontSize: { type: String, default: 'medium' },
  color: { type: String, default: '#000000' },
  fontStyle: { type: String, default: 'Arial' },
 
}
});

const eventSchema = new mongoose.Schema({
  title: { type: String, trim: true },
  description: { type: String, trim: true },
  date: { type: Date }, 
  time: { type: String },
  location: { type: String },
  category: { type: String },
  organizer: {type: String},
  isApproved: { type: Boolean, default: false, index: true }

});

  const AdminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' }, // Add roles if applicable
  });


  export const User = mongoose.model('User', userSchema);
  export const Event = mongoose.model('Event',eventSchema);
  export const Admin = mongoose.model('Admin', AdminSchema);

// profile setting model
 const ProfileSettingsSchema = new mongoose.Schema({
  firstName:String,
  lastName:String,
  email:String,
  phn_number:Number,
})
export const ProfileSettingsModel = mongoose.model("profile_settings", ProfileSettingsSchema);
// group model
const GroupSchema = new mongoose.Schema({
  groupName:String,
  description:String,
  users:[{userId:String}]

})
export const GroupModel = mongoose.model("groups", GroupSchema);

const notification = new mongoose.Schema({
  username: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  message: String,
  read: Boolean
});

export const Notification = mongoose.model('Notification', notification);


const feedback = new mongoose.Schema({
  username: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  feedbackText: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Feedback = mongoose.model('Feedback', feedback);

const report = new mongoose.Schema({
  username: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  reply: { type: String }, 
  repliedAt: { type: Date },
});

export const Report = mongoose.model('Report', report);


  // Signup validation schema
  export const signupSchema = Joi.object({
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
    phoneNumber: Joi.string().pattern(/^[0-9]{10,15}$/).required(), 
    username: Joi.string().alphanum().min(4).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).pattern(/^\S+$/).required(),
    role: Joi.string().valid('USER', 'EVENT_ORGANIZER', 'ADMIN').required()
 
  });
  

  // Validation function for signup data
  export function validateSignUpData(data) {
    const { error } = signupSchema.validate(data); 
  
    if (error) {
      return {
        valid: false,
        message: error.details[0].message 
      };
    }
  
    return { valid: true }; 
  }
  
  // Login validation schema
  export const loginSchema = Joi.object({
    userName: Joi.string().required(),
    password: Joi.string().required(),
  });
  
  // Validation function for login credentials
  export function validateLoginCredentials(data) {
    const { error } = loginSchema.validate(data); 
  
    if (error) {
      return {
        valid: false,
        message: error.details[0].message 
      };
    }
  
    return { valid: true }; 
  }
  
 
  export function validateData(data, schema) {
    const { error } = schema.validate(data); 
  
    if (error) {
      return {
        valid: false,
        message: error.details[0].message 
      };
    }
  
    return { valid: true }; 
  }

  const AboutUsSchema = new mongoose.Schema({
    body:String,
  })
  export const AboutUsModel = mongoose.model("aboutus", AboutUsSchema);

  const TermsAndConditionSchema = new mongoose.Schema({
    body:String,
  })
  export const TermsAndConditionModel = mongoose.model("termsandcondition", TermsAndConditionSchema);
  

  const PrivacyPolicySchema = new mongoose.Schema({
    body:String,
  })
  export const PrivacyPolicyModel = mongoose.model("privacypolicy", PrivacyPolicySchema);
  
  const newMessage = new mongoose.Schema({
    content: String,
    group:String,  // Reference to Group
    author: String,  // Reference to User (ObjectId)
  });

  export const Messages = mongoose.model('messages', newMessage);
