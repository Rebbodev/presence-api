import express, { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';

import { globalVariables } from '..';
import { apiData } from './appData';
import { decryptToken } from './decryptToken';

export const appRun = () => {
    const app = express();
    const limit = rateLimit({
        windowMs: 10 * 1000,
        max: 45,
        message: 'Too many requests sent. Slowdown',
    });

    const authToken = (
        request: Request,
        response: Response,
        next: express.NextFunction
    ) => {
        const token = request.headers.authorization;

        if (!token) {
            return response
                .status(401)
                .send(
                    'Access Denied. Authorization header is missing an access token.'
                );
        }

        const validToken = decryptToken(token);

        if (validToken === process.env.VALID_TOKEN) {
            next();
        }
    };

    app.use(limit);

    app.get(
        globalVariables.callRoute,
        authToken,
        (request: Request, response: Response) => {
            response.json(apiData);
        }
    );

    app.listen(globalVariables.port, () => {
        console.log(`API Service is running on port ${globalVariables.port}`);
    });
};
