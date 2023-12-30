const express = require("express");
const router = express.Router();
const {
    createtodo,
    updatetodo,
    postProfileImage,
    postMultipleImages,
    postAudioFile,
    deletetodo,
    } = require("../controllers/todo.controllers");

const todoMiddleware = require('../middlewares/image.middleware');

const upload = todoMiddleware.uploadFiles;

router.post("/createtodo", createtodo);

router.put("/todo/:id", updatetodo);

router.delete("/todo/:id", deletetodo);

router.post('/todo/:todoId/icon', upload.single('icon'), postProfileImage);

router.post('/todo/:todoId/images', upload.array('images', 5), postMultipleImages); 

router.post('/todo/:todoId/audios', upload.array('audios', 2), postAudioFile);


module.exports = router;
