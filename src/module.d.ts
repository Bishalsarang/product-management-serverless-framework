import { Env } from './types';

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}
