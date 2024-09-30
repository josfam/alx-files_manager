import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = createClient({
      url: 'redis://localhost:6379',
    });
    this.client.on('error', (err) => console.log(err));

    // promisify the get and set methods in order to use async/await
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.set).bind(this.client);
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    const val = await this.getAsync(key);
    return val;
  }

  async set(key, value, duration) {
    await this.setAsync(key, value);
    this.client.expire(key, duration);
  }
}

const redisClient = new RedisClient();
export default redisClient;
