const express = require("express");
const router = express.Router();
const path = require("path");

const {
    getLogin,
    getRegister,
    postLogin,
    postRegister, 
    getResetPassword,
    postResetPassword,
    getProfileInfos,
    deleteProfile,
    getHomePage,
    } = require("../controllers/auth.controllers");

router.get("/login", getLogin); 
router.post("/login", postLogin);
router.get("/register", getRegister);
router.post("/register", postRegister);
router.get("/homePage", getHomePage);
 
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      res.json({ error: err });
    } else res.redirect("/login");
  });
});

router.get("/profiles", getProfileInfos);
router.get("/reset-password", getResetPassword);
router.post("/reset-password",  postResetPassword);
router.get("/delete-profile", deleteProfile);
router.delete("/delete-profile", deleteProfile);
 
// upload images
const {uploadProfileImage, uploadAudioFile} = require("../middlewares/image.middleware")
const {
  getMediaPage,
  postProfileImage,postMultipleImages, getMultipleImages,
  postAudioFile,
  } = require("../controllers/auth.controllers");
  
// router.get('/media-pages', getMediaPage)
router.post('/upload/single_image', uploadProfileImage.single('image'), postProfileImage);
router.post('/upload/multiple_image', uploadProfileImage.array('images', 5), postMultipleImages);
router.get('/multiple_image', getMultipleImages)

router.post('/upload/audio', uploadAudioFile.single('audio'), postAudioFile);

module.exports = router;