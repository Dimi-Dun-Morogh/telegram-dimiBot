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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const loggers_1 = __importDefault(require("./loggers"));
const NAMESPACE = 'utils.js';
function syncTimeout(time) {
    return __awaiter(this, void 0, void 0, function* () {
        yield new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, time);
        });
    });
}
const validChats = (chatIds, bot) => __awaiter(void 0, void 0, void 0, function* () {
    const promises = chatIds.map((chatId) => bot.telegram
        .getChat(chatId)
        .then((res) => res.id)
        .catch((error) => loggers_1.default.info(NAMESPACE, `seems like chat is not valid id: ${chatId}`, error.message)));
    const res = yield Promise.all(promises);
    return res.filter((item) => item !== undefined);
});
module.exports = {
    syncTimeout,
    validChats,
};
