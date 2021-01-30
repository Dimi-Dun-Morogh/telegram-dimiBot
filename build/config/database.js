"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
exports.default = {
    url: process.env.DATABASE_URL,
};
