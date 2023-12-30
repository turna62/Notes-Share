const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require("./../dataModels/User.model");

function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {

       //Match User
       User.findOne({ email: email })
       .then((user) => {
         if (!user) {
           return done(null, false, {
             message: "This email is not registered!",
           });
         } else {
           //Match Password
           bcrypt.compare(password, user.password, (err, isMatch) => {
             if (err) throw err;
             if (isMatch) {
               return done(null, user);
             } else {
               return done(null, false, { message: "Password Incorrect!" });
             }
           });
         }
       })
       .catch((err) => {
         console.log(err);
       });
  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser)) 
  passport.serializeUser((user, done) =>{
  done(null, user.id)}) 

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      if (!user) {
        return done(null, false, { message: 'User not found' });
      }
      console.log(user);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });  
}

module.exports = initialize