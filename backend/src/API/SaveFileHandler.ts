import { Character } from '../Character/Character';
import express from 'express';
import { IUpdateParams } from '../Character/IUpdateParams';
import fs from 'fs/promises';
import { GameVersion } from '../Character/GameVersion';

const VersionMap: { [key: string]: GameVersion } = {
    "original": GameVersion.FATE,
    "traitorsoul": GameVersion.FATE_TRAITOR_SOUL
}

export const SaveFileRouter = express.Router();

SaveFileRouter.post('/savefile/:game/parse', express.raw({ limit: '2mb' }),
    (req: express.Request, res: express.Response) => {
        const version = VersionMap[req.params.game];
        // fell victim to one of the classic javascript blunders
        if (version === undefined) {
            return res.sendStatus(404);
        }

        const buff = req.body as Buffer;
        const parsedCharacter = new Character(buff, version);

        res.send(parsedCharacter.toJson());
    });


interface SaveFileModifyRequest extends IUpdateParams {
    buffer: string;
}

SaveFileRouter.post('/savefile/:game/modify', express.json({ limit: '2mb' }),
    (req: express.Request, res: express.Response) => {
        const version = VersionMap[req.params.game];
        if (version === undefined) {
            return res.send(404);
        }

        const body = req.body as SaveFileModifyRequest;

        const buff = Buffer.from(body.buffer, 'base64');
        const character = new Character(buff, version);

        character.update(body); // compatible :D

        res.send(character.getNewBuffer());
    });

SaveFileRouter.get('/savefile/demo', express.json({ limit: '500kb' }),
    async (req: express.Request, res: express.Response) => {
        const buff = await fs.readFile('./assets/demo.FFD');
        const parsedCharacter = new Character(buff, GameVersion.FATE);

        res.send(parsedCharacter.toJson());
    });
