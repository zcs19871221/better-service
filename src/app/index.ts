/// <reference path="../index.d.ts" /> #
import express from 'express';
import router from '../router';
import heartBeat from './heartbeat_api';
import initRequest from './initrequest';
import setResponseHooks from './setresponsehook';
import errorHandler from './errorhandler';
import noMatchHandler from './notfound';

const app = express();
app.set('x-powered-by', false);
app.use(heartBeat);
app.use(initRequest);
app.use(setResponseHooks);
app.use(router);
app.use(errorHandler);
app.use(noMatchHandler);

export default app;
