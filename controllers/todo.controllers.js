const User = require("../dataModels/User.model");
const path = require("path");
const ToDo = require("../dataModels/ToDo.models");

const createtodo = async (req, res, next) => {
    const { title, description } = req.body;

    const user_id = req.user._id;

    const errors = [];
    if (!title || !description) {
        errors.push("All fields are required!");
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    try {
        const newTodo = new ToDo({ title, description, user_id});
        await newTodo.save();
        res.json({ message: "Task created successfully", todo: newTodo });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
 

const postProfileImage = async (req, res) => {
    try {
        const todoId = req.params.todoId;
        const todo = await ToDo.findById(todoId);

        if (!todo) {
            return res.status(404).json({ message: "Not found" });
        }

        if (req.file) {
            todo.icon = req.file.filename;
        }

        await todo.save();
        res.json({ message: 'Icon added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const postMultipleImages = async (req, res) => {
    try {
        const todoId = req.params.todoId;
        const todo = await ToDo.findById(todoId);

        if (!todo) {
            return res.status(404).json({ message: "Not found" });
        }

        if (req.files) {
            todo.images = [...todo.images, ...req.files.map(file => file.filename)];
        }

        await todo.save();
        res.json({ message: 'Images added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const postAudioFile = async (req, res) => {
    try {
        const todoId = req.params.todoId;
        const todo = await ToDo.findById(todoId);

        if (!todo) {
            return res.status(404).json({ message: "Not found" });
        }

        if (req.files) {
            todo.audios = [...todo.audios, ...req.files.map(file => file.filename)];
        }

        await todo.save();
        res.json({ message: 'Audios added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const updatetodo = async (req, res) => {
    try {
      const updatedtodo = await ToDo.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedtodo) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json({ message: "Task updated successfully", task: updatedtodo });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  
  const deletetodo = async (req, res) => {
    try {
      const todo = await ToDo.findById(req.params.id);
      if (!todo) {
        return res.status(404).json({ error: "Task not found" });
      }
      await todo.remove();
      res.json({ message: "Task deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  
  module.exports = {
    createtodo,
    postProfileImage,
    postMultipleImages,
    postAudioFile,
    deletetodo,
    updatetodo
  };