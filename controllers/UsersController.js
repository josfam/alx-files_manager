import sha1 from 'sha1';
import dbClient from '../utils/db';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }
    const userExists = await dbClient.db.collection('users').findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'Already exist' });
    }
    // hash the password
    const hashedPassword = sha1(password);
    // store the user
    const insertedUser = await dbClient.db.collection('user').insertOne({
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      id: insertedUser.insertedId,
      email,
    });
  }
}

export default UsersController;
