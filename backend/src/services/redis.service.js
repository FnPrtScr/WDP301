const redis = require('redis');
const client = require("../../configs/DB/redis.js");
const { ErrorResponse } = require('../utils/response');
class RedisService {
    async get(req) {
        const { key } = req.body;
        try {
            client.get(key, (err, data) => {
                if (err) return err;
                return data || [];
            });
        } catch (error) {
            throw error;
        }
    }
    async hgetall(req) {
        const { key } = req.body;
        return new Promise((resolve, reject) => {
            client.hgetall(key, (err, data) => {
                if (err) reject(err);
                if(data){
                    resolve(data);
                }else{
                    resolve({});
                }
            });
        });
    }
    async subscribe(channel) {
        return new Promise((resolve, reject) => {
            // Đăng ký sự kiện
            client.subscribe(channel, (err) => {
                if (err) {
                    reject(err); // Xảy ra lỗi khi đăng ký
                } else {
                    resolve(); // Đăng ký thành công
                }
            });

            // Xử lý các sự kiện được gửi đến kênh đăng ký
            client.on('message', (channel, message) => {
                console.log(`Received message from channel ${channel}: ${message}`);
                // Xử lý các message nhận được từ Redis ở đây
            });
        });
    }
    async publish(channel, message) {
        try {
            const publisher = redis.createClient(); // Tạo một client mới
            const result = await new Promise((resolve, reject) => {
                // Gửi thông điệp tới kênh trong Redis
                publisher.publish(channel, message, (err, data) => {
                    if (err) reject(err);
                    resolve(data);
                });
            });
            publisher.quit(); // Đóng client sau khi hoàn thành
            return result;
        } catch (error) {
            throw error;
        }
    }
    async set(req) {
        const { key, value, ttl } = req.body;
        try {
            const a = await client.set(key, value, 'EX', ttl); // Sử dụng 'EX' để thiết lập thời gian tồn tại
            return a;
        } catch (error) {
            throw error;
        }
    }
    async hmset(req) {
        const { key, fields } = req.body;
        try {
            await client.hmset(key, fields);
            return true;
        } catch (error) {
            throw error;
        }
    }
    async del(req, res) {
        const { key } = req.body;
        if (!key) {
            throw new Error("Key is required");
        }
        try {
            const result = await new Promise((resolve, reject) => {
                client.del(key, (err) => {
                    if (err) reject(err);
                    resolve(true);
                });
            });
            return result;
        } catch (error) {
            throw error;
        }
    }
    async hdel(req) {
        const { key } = req.body;
        if (!key) {
            throw new Error("Key is required");
        }
        try {
            return await new Promise((resolve, reject) => {
                client.hdel(String(key), (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(true);
                    }
                });
            });
        } catch (error) {
            throw error;
        }
    }
    async keys(req) {
        const { pattern } = req.body;
        if (!pattern) {
            throw new Error("Pattern is required");
        }
        try {
            const keys = await new Promise((resolve, reject) => {
                client.keys(pattern, (err, keys) => {
                    if (err) reject(err);
                    resolve(keys);
                });
            });
            return keys;
        } catch (error) {
            throw error;
        }
    }
}
module.exports = new RedisService();