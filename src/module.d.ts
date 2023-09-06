import { Env } from './types';

declare global {
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    interface ProcessEnv extends Env {}
  }
}
