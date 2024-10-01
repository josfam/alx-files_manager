import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  /**
   * Creates a redis instance
   */
  constructor() {
    this.client = createClient();
    this.client.on('error', (err) => console.log(err));
    // create a promise that waits for the connection to resolve
    this.connectionPromise = new Promise((resolve) => {
      this.client.on('connect', () => {
        resolve();
      });
    });
    // promisify the get and set methods in order to use async/await
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.set).bind(this.client);
    this.delAsync = promisify(this.client.del).bind(this.client);
  }

  /**
   * Returns true when the connection to Redis is a success. Otherwise, returns False
   */
  isAlive() {
    return this.client.connected;
  }

  /**
   * Takes a key, and returns the Redis value stored for this key
   */
  async get(key) {
    await this.connectionPromise;
    const val = await this.getAsync(key);
    return val;
  }

  /**
   * Takes a string key, value, and duration (in seconds) as arguments to store in
   * Redis(with an expiration set by the duration argument)
   */
  async set(key, value, duration) {
    await this.connectionPromise;
    await this.setAsync(key, value);
    this.client.expire(key, duration);
    // console.log('client connected:', this.client.connected); // debug
  }

  /**
   * Takes a string key as an argument and removes the associated value in Redis
   * for this key
   */
  async del(key) {
    await this.delAsync(key);
  }
}

const redisClient = new RedisClient();
export default redisClient;
