import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AppController {
  /**
   * Returns the status of the db and redis clients
   */
  static getStatus(req, res) {
    const dbStatus = dbClient.isAlive();
    const redisStatus = redisClient.isAlive();
    return res.status(200).json({ redis: redisStatus, db: dbStatus });
  }

  /**
   * Returns information about the number of user and file documents stored in the database
   */
  static async getStats(req, res) {
    const fileCount = await dbClient.nbFiles();
    const userCount = await dbClient.nbUsers();
    return res.status(200).json({ users: userCount, files: fileCount });
  }
}

export default AppController;
