import { Request, Response, NextFunction } from 'express';

export const logger = (req: Request, res: Response, next: NextFunction) => {
    //How to format a UTC date as a `YYYY-MM-DD hh:mm:ss` string using NodeJS?
    //https://stackoverflow.com/questions/10645994/how-to-format-a-utc-date-as-a-yyyy-mm-dd-hhmmss-string-using-nodejs
    const reqTime = new Date().toISOString().
        replace(/T/, ' ').      // replace T with a space
        replace(/\..+/, '');     // delete the dot and everything after

    console.log(`[${reqTime}] ${req.method}: ${req.path}`);
    next();
}