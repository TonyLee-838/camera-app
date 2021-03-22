import { consoleLog } from '../api/log.dev';

declare global {
  consoleLog: consoleLog;
}

export * from './pose';
export * from './camera';
export * from './predict';
export * from './box';
