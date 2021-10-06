const {model, Schema} = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const UserSchema = new Schema(
  {
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true
  },
  email:{
    type: String, 
    required: true,
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ], 
  }, 
  password:{
    type: String, 
    required: true,
    match: [
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      "Please provide a strong password (minimum eight characters, at least one uppercase letter, one lowercase letter and one number)",
    ]
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
 }
)

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.getSignedJwtToken = function() {
  const uid = this._id
  return jwt.sign({id: this._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE});
}



module.exports = model('User', UserSchema)