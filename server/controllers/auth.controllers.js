import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';

const collection = await db.collection('users');

export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Cek apakah email atau username sudah terdaftar
    const query = { $or: [{ email }, { username }] };
    const existingUser = await collection.findOne(query);

    if (existingUser) {
      return next({
        status: 422,
        message: 'Email or Username is already registered.',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat objek user baru
    const user = {
      username,
      email,
      password: hashedPassword,
      avatar: 'https://g.codewithnathan.com/default-user.png',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Simpan user ke database
    const { insertedId } = await collection.insertOne(user);

    // Generate token JWT
    const token = jwt.sign({ id: insertedId }, process.env.AUTH_SECRET);

    // Tambahkan ID ke user
    user._id = insertedId;

    // Hilangkan informasi sensitif sebelum mengirim response
    const { password: pass, updatedAt, createdAt, ...rest } = user;

    // Set cookie dengan token
    res
      .cookie('taskly_token', token, { httpOnly: true })
      .status(201)
      .json({
        message: 'User successfully registered.',
        user: rest,
      });
  } catch (error) {
    next({ status: 500, message: 'Internal Server Error', error });
  }
};
