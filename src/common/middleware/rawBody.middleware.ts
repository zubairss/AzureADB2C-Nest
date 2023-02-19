import { Response } from 'express';
import { json } from 'body-parser';
import RequestWithRawBody from '../interface/requestWithRawBody.interface';

function rawBodyMiddleware() {
    return json({
        verify: (
            request: RequestWithRawBody,
            response: Response,
            buffer: Buffer,
        ) => {
            if (
                request.url.includes('/api/stripe/webhook') &&
                Buffer.isBuffer(buffer)
            ) {
                request.rawBody = Buffer.from(buffer);
            }
            return true;
        },
    });
}

export default rawBodyMiddleware;