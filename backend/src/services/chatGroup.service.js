const { Campus, sequelize, ChatGroup, Class, Message, User } = require('../models')
const moment = require("moment");
const { ErrorResponse } = require('../utils/response');
const dayjs = require('dayjs');
const client = require("../../configs/DB/redis.js");
class ChatGroupService {

    async getAll(req, res) {
        const { campus_id, semester_id, class_id } = req.params;
        const user_id = req.user.id;
        try {
            const chatGroups = await ChatGroup.findAll({
                where: {
                    campus_id: campus_id,
                    semester_id: semester_id,
                    lecturer_id: user_id
                },
                include: [
                    {
                        model: Class,
                        attributes: ['name'],
                    }
                ]
            })
            return chatGroups
        } catch (error) {
            throw error;
        }
    }
    async getChat(req, res) {
        const { campus_id, semester_id, chatGroupId } = req.params;
        const user_id = req.user.id;
        try {
            const findClass = await ChatGroup.findOne({
                where: { chat_group_id: chatGroupId },
                include: [
                    {
                        model: Class,
                        attributes: ['name']
                    }
                ]
            })
            // if (!findClass) 
            const chatGroups = await Message.findAll({
                where: {
                    chat_group_id: chatGroupId
                },
                include: [
                    {
                        model: User,
                        attributes: ['email', 'code', 'avatar', 'first_name', 'last_name'],
                    }
                ]
            })
            return { 'contact': { 'name': findClass.Class.name, 'id': chatGroupId }, 'chats': chatGroups }
        } catch (error) {
            throw error;
        }
    }
    async createMessage(req, res) {
        const { chatGroupId } = req.params
        const { content } = req.body;
        const user_id = req.user.id
        try {
            const message = await Message.create({
                chat_group_id: chatGroupId,
                sender_id: user_id,
                content: content,
                timestamp: new Date(),
                status: true,
            });
            return message
        } catch (error) {
            throw error;
        }
    }
    // async createMessage(chatGroupId, user_id, content) {
    //     try {
    //         const message = await Message.create({
    //             chat_group_id: chatGroupId,
    //             sender_id: user_id,
    //             content: content,
    //             timestamp: new Date(),
    //             status: true,
    //         });
    //         return message
    //     } catch (error) {
    //         throw error;
    //     }
    // }

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
module.exports = new ChatGroupService();