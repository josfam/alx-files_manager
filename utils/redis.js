import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
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

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    await this.connectionPromise;
    const val = await this.getAsync(key);
    return val;
  }

  async set(key, value, duration) {
    await this.connectionPromise;
    await this.setAsync(key, value);
    this.client.expire(key, duration);
    // console.log('client connected:', this.client.connected); // debug
  }

  async del(key) {
    await this.delAsync(key);
  }
}

const redisClient = new RedisClient();
export default redisClient;
