import express, { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import http from 'node:http';
import { Server } from 'socket.io';

import { globalVariables } from '..';
import { apiData } from './appData';

const app = express();
const httpServer = http.createServer(app);

export const io = new Server(httpServer);

export const appRun = () => {
    const limit = rateLimit({
        windowMs: 10 * 1000,
        max: 45,
        message: 'Too many requests sent. Slowdown',
    });

    app.use(limit);

    app.get(
        globalVariables.callRoute,
        (request: Request, response: Response) => {
            response.json(apiData);
        }
    );

    httpServer.listen(globalVariables.port, () => {
        console.log(`API Service is running on port ${globalVariables.port}`);
    });

    io.on('connection', (socket) => {
        socket.emit('presence', apiData);
    });
};
