declare namespace Express {
  interface Request {
    id: string;
    entryTime: number;
    executeStatus: 'success' | 'error' | 'noMatch';
  }
}
declare module NodeJS {
  interface Global {
    __htmlEscaper: any;
  }
}
