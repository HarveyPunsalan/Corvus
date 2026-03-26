import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
    constructor(
        public statusCode: number,
        public message: string
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export function errorHandler(
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: err.message });
    }

    if (err instanceof Error && err.name === 'ZodError') {
        return res.status(422).json({ error: 'Validation failed', details: (err as any).errors });
    }

    if ((err as any)?.code === 'P2002') {
        return res.status(409).json({ error: 'A record with that value already exists' });
    }

    console.error('Unhandled error:', err);
    return res.status(500).json({ error: 'Internal server error' });
}