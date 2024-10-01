import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const url = `mongodb://${host}:${port}`;
    // create client
    this.client = new MongoClient(url);
    // make the database connection
    this.client.connect()
      .then(() => {
        this.db = this.client.db(database);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    return this.db.users.countDocuments();
  }

  async nbFiles() {
    return this.db.files.countDocuments();
  }
}

const dbClient = new DBClient();
export default dbClient;
