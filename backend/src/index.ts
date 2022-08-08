import express from 'express';
import { SaveFileRouter } from './API/SaveFileHandler';

const app = express();
const port = process.env.PORT || 3000;

app.use(SaveFileRouter);

app.listen(port, () => {
    console.log(`API listening on port: ${port}`);
});
