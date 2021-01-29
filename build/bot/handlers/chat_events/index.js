"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { getChatByChatId } = require('../../../controllers/chats');
const logger = require('../../../helpers/loggers');
const NAMESPACE = 'chat_events';
const handleLeave = (context) => {
    const { username, first_name, last_name } = context.update.message.left_chat_participant;
    context.reply(`${first_name === undefined ? username : first_name} ${last_name === undefined ? '' : last_name} ...A! Ну давай`);
};
const handleJoin = (context) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger.info(NAMESPACE, 'new chat member');
        const { username, first_name, last_name } = context.update.message.new_chat_participant;
        context.reply(`Приветствую ${first_name === undefined ? username : first_name} ${last_name === undefined ? '' : last_name}, проходи, присаживайся`);
        const remoteChat = yield getChatByChatId(context.message.chat.id);
        if (!remoteChat)
            return null;
        const { rules } = remoteChat;
        if (rules.length)
            context.reply(rules);
    }
    catch (error) {
        logger.info(NAMESPACE, `error handleJoin: ${error.message}`);
    }
});
module.exports = {
    handleLeave,
    handleJoin,
};
