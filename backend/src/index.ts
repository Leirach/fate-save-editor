import express from 'express';
import { SaveFileRouter } from './API/SaveFileHandler';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors())

app.use(SaveFileRouter);
app.use(express.static('../frontend/dist'));

app.listen(port, () => {
    console.log(`API listening on port: ${port}`);
});

