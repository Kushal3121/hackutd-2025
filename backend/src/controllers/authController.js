import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import {
  getUser,
  getAllUsers,
  addUser,
  updateUser,
  sanitizeUser,
} from '../models/userModel.js';

export async function signup(req, res) {
  const { username, name, password } = req.body ?? {};
  if (!username || !name || !password)
    return res
      .status(400)
      .json({ error: 'username, name, and password required' });

  if (getUser(username))
    return res.status(409).json({ error: 'username exists' });

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = {
    id: uuid(),
    username,
    name,
    passwordHash,
    createdAt: Date.now(),
  };

  await addUser(newUser);
  const token = jwt.sign(
    { id: newUser.id, username: newUser.username, name: newUser.name },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: '7d' }
  );
  res.status(201).json({
    message: 'user created',
    user: sanitizeUser(newUser),
    token,
  });
}

export async function login(req, res) {
  const { username, password } = req.body ?? {};
  if (!username || !password)
    return res.status(400).json({ error: 'username and password required' });

  const user = getUser(username);
  if (!user) return res.status(401).json({ error: 'invalid credentials' });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: 'invalid credentials' });

  const token = jwt.sign(
    { id: user.id, username: user.username, name: user.name },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: '7d' }
  );
  res.json({ message: 'login successful', user: sanitizeUser(user), token });
}

export async function resetPassword(req, res) {
  const { username, currentPassword, newPassword } = req.body ?? {};
  if (!username || !currentPassword || !newPassword)
    return res.status(400).json({ error: 'missing fields' });

  const user = getUser(username);
  if (!user) return res.status(404).json({ error: 'user not found' });

  const match = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!match)
    return res.status(401).json({ error: 'current password is incorrect' });

  const newPasswordHash = await bcrypt.hash(newPassword, 10);
  await updateUser(username, { passwordHash: newPasswordHash });

  res.json({ message: 'password updated' });
}

export function listUsers(req, res) {
  const users = getAllUsers().sort((a, b) => b.createdAt - a.createdAt);
  res.json({ users: users.map(sanitizeUser) });
}
