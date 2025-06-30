import User from '../models/UserModel.js';

export const crearUsuario = async (req, res) => {
  try {
    const user = new User(req.body);
    const nuevoUsuario = await user.save();
    res.status(201).json(nuevoUsuario);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
