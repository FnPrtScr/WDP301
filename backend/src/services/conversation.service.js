const { Campus, sequelize } = require('../models')
const moment = require("moment");
const { ErrorResponse } = require('../utils/response');
const dayjs = require('dayjs');
const client = require("../../configs/DB/redis.js");
class ConversationService {

    async createRoomChat(req) {//chat group
        const { campus_id, semester_id, class_id } = req.params;
        const name = req.body.name;
        const lecturerId = req.user.id;

        const key = `${campus_id}:${semester_id}:chats:group-chat:${class_id}:inforClass`;


        const createdAt = dayjs().format('YYYY-MM-DD HH:mm:ss');

        try {
            const result = await client.HSET(key, 'name', name, 'lecturerId', lecturerId, 'createdAt', createdAt);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async createPrivateChat(req) {//one-one
        const { campus_id, semester_id, class_id } = req.params;
        const user1_id = req.user.id;
        const { user2_id } = req.body
        const key = `${campus_id}:${semester_id}:chats:private_chat:${class_id}:${user1_id}:${user2_id}`;

        try {
            const existingChat = await client.EXISTS(key);
            if (existingChat === 1) {
                return key;
            }
            const createdAt = dayjs().format('YYYY-MM-DD HH:mm:ss');
            await client.HSET(chatKey, 'user1_id', user1_id, 'user2_id', user2_id, 'createdAt', createdAt);
            return key;
        } catch (error) {
            throw error;
        }
    }

    async addChatMessage(req) {
        const { campus_id, semester_id, class_id } = req.params;
        const user_id = req.user.id
        const email = 'tn4490523@gmail.com'
        const first_name = 'John'
        const last_name = 'John'
        const content = "hello galol"
        const imageURL = "http://fae.google.com"

        const sender = {
            user_id,
            email,
            first_name,
            last_name,
        }
        const message = {
            content,
            imageURL
        }
        const fields = {
            sender,
            message,
            createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
        }
        const timestamp = dayjs().valueOf();
        try {
            const result = await client.ZADD(
                `${campus_id}:${semester_id}:chats:group-chat:${class_id}:messages`,
                timestamp,
                JSON.stringify(fields)
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    async getChatMessageById(req) {

    }




}
module.exports = new ConversationService();