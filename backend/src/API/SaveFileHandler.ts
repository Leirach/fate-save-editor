import { Character } from '../Character/Character';
import express from 'express';
import { IUpdateParams } from '../Character/IUpdateParams';
import fs from 'fs/promises';

export const SaveFileRouter = express.Router();

SaveFileRouter.post('/savefile/parse', express.raw({ limit: '500kb' }),
    (req: express.Request, res: express.Response) => {
        const buff = req.body as Buffer;
        const parsedCharacter = new Character(buff);

        res.send(parsedCharacter.toJson());
    });

interface SaveFileModify extends IUpdateParams {
    buffer: string;
}

SaveFileRouter.post('/savefile/modify', express.json({ limit: '500kb' }),
    (req: express.Request, res: express.Response) => {
        const body = req.body as SaveFileModify;

        const buff = Buffer.from(body.buffer, 'base64');
        const character = new Character(buff);

        character.update(body); // compatible :D

        res.send(character.getNewBuffer());
    });

SaveFileRouter.get('/savefile/demo', express.json({ limit: '500kb' }),
    async (req: express.Request, res: express.Response) => {
        const buff = await fs.readFile('./assets/demo.FFD');
        const parsedCharacter = new Character(buff);

        res.send(parsedCharacter.toJson());
    });
