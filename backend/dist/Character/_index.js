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
const promises_1 = __importDefault(require("fs/promises"));
const Character_1 = require("./Character");
function readData(path) {
    return __awaiter(this, void 0, void 0, function* () {
        const buff = yield promises_1.default.readFile(path);
        const character = new Character_1.Character(buff);
        console.log(character);
        // character.updateSkills({skillCriticalStrike: 64});
        // character.updateName("Guille");
        // character.updateStats({strength: 99, dexterity: 99})
        // character.update({
        //     name: "Guille2",
        //     skills: { skillCriticalStrike: 80 },
        //     stats: { strength: 80, dexterity: 110 },
        //     basic: { gold: 100000000 }
        // })
        // console.log(character)
        yield promises_1.default.writeFile('modified.FFD', character.getNewBuffer());
        const newchar = new Character_1.Character(yield promises_1.default.readFile('modified.FFD'));
        console.log("new", newchar);
    });
}
readData('../../2.FFD');
