import { MongoClient } from 'mongodb';

class DBClient {
  /**
   * Creates a mongodb client
   */
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const url = `mongodb://${host}:${port}`;
    // create client
    this.client = new MongoClient(url, { useUnifiedTopology: true });
    // make the database connection
    this.client.connect()
      .then(() => {
        this.db = this.client.db(database);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  /**
   * Returns true when the connection to MongoDB is a success otherwise returns False
   */
  isAlive() {
    return this.client.isConnected();
  }

  /**
   * Returns the number of documents in the collection `users`
   */
  async nbUsers() {
    return this.db.collection('users').countDocuments();
  }

  /**
   * Returns the number of documents in the collection `files`
   */
  async nbFiles() {
    return this.db.collection('files').countDocuments();
  }
}

const dbClient = new DBClient();
export default dbClient;
