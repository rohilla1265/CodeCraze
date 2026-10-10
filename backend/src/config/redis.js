import { createClient } from 'redis';

const redisClient = createClient({
    username: 'default',
    password: '14d8rkrYldmNBCP3R8xN9Gez2JGW8bMH',
    socket: {
        host: 'redis-10632.crce292.ap-south-1-2.ec2.cloud.redislabs.com',
        port: 10632
    }
});
export default redisClient;