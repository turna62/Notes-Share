const User = require("../dataModels/User.model");
const path = require("path");
const bcrypt = require("bcrypt");
const passport = require("passport"); 


const getLogin = async (req, res) => {
  const filePath = path.join(__dirname, "..", "views", "login.html");
  res.sendFile(filePath);
};

const postLogin = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/homePage",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
};


const getRegister = async (req, res) => {
  const filePath = path.join(__dirname, "..", "views", "register.html");
  res.sendFile(filePath);
};

const postRegister = async (req, res, next) => {
const { email, password } = req.body;
const name= req.body.name

  console.log(name)
  console.log(email) 
  console.log(password)

const errors=[]
if (!name || !email || !password ) {
  errors.push("All fields are required!");
}

if (errors.length > 0) {
  res.status(400).json({ error: errors });
} else {
  //Create New User
  User.findOne({ email: email }).then((user) => {
    if (user) {
      errors.push("User already exists with this email!");
      res.status(400).json({ error: errors });
    } else {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          errors.push(err);
          res.status(400).json({ error: errors });
        } else {
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) {
              errors.push(err);
              res.status(400).json({ error: errors });
            } else {
              const newUser = new User({
                name,
                email,
                password: hash,
              });
              newUser
                .save()
                .then(() => {
                  res.redirect("/login");
                })
                .catch(() => {
                  errors.push("Please try again");
                  res.status(400).json({ error: errors });
                });
            }
          });
        }
      });
    }
  });
}
};

const getProfileInfos = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getResetPassword = async (req, res) => {
  const filePath = path.join(__dirname, "..", "views", "resetPassword.html");
  res.sendFile(filePath);
};

const postResetPassword = async (req, res) => {
  try {
    const { name, currentPassword, newPassword, email  } = req.body;
    console.log(newPassword)
    
    const userId = req.user.id
    const user = await User.findById(userId);
    console.log(user)


    if (newPassword) {
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

      if (!isPasswordValid) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    }


    if (email) {
      user.email = email
    }

    await user.save();

    res.redirect("/homePage");
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const deleteProfile = async (req, res) => {
  try {
    const profileID = req.params.id;
    const profileInfo = await User.findById(profileID);

    if (!profileInfo) {
      return res.status(404).json({ error: "Profile information not found" });
    }

    await profileInfo.deleteOne({ _id: profileID });

    res.json({ message: "Profile information deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getHomePage = async (req, res) => {
const filePath = path.join(__dirname, "..", "views", "homePage.html");
res.sendFile(filePath);
};

const postProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }
    const photo = req.file.filename
    
    const userId = req.user.id
    const user = await User.findById(userId);
    console.log(user)


    if (photo) { 
      user.profile_image = photo
    }
    await user.save();

    res.json({ message: 'Profile image updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const postMultipleImages = async (req, res) => {
  try {
    if (!req.files) {
      return res.status(400).json({ message: 'No file provided' });
    }

    const photo = req.files.map((file) => file.filename);

    const userId = req.user.id
    const user = await User.findById(userId);
   
    if (photo) {
      user.images = photo
    }
    await user.save();

    res.json({ message: 'Multiple images updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMultipleImages = async (req, res) => {
  try {
    const userId = req.user.id
    const user = await User.findById(userId);
    const images= user.images

    res.json({ images });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const postAudioFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    const audio = req.file.filename
    const userId = req.user.id
    const user = await User.findById(userId);
    console.log(user)


    if (audio) {
      user.audio = audio
    }
    await user.save();

    res.json({ message: 'Audio updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getLogin,
  getRegister,
  postLogin,
  postRegister,
  getProfileInfos,
  deleteProfile,
  postProfileImage,
  postMultipleImages,
  getMultipleImages,
  postAudioFile,
  getHomePage,
  getResetPassword,
  postResetPassword
};

