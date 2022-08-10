"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveFileRouter = void 0;
const Character_1 = require("../Character/Character");
const express_1 = __importDefault(require("express"));
exports.SaveFileRouter = express_1.default.Router();
exports.SaveFileRouter.post('/savefile/parse', express_1.default.raw({ limit: '300kb' }), (req, res) => {
    const buff = req.body;
    const parsedCharacter = new Character_1.Character(buff);
    res.send(parsedCharacter.toJson());
});
exports.SaveFileRouter.post('/savefile/modify', express_1.default.json({ limit: '300kb' }), (req, res) => {
    const body = req.body;
    const buff = Buffer.from(body.buffer, 'base64');
    const character = new Character_1.Character(buff);
    character.update(body); // compatible :D
    res.send(character.getNewBuffer());
});
