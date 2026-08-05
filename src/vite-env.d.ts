/// <reference types="vite/client" />

/**
 * `vite.config.ts` replaces `process.env.API_KEY` at build time through the
 * `define` option, so the reference exists in the bundle without Node types
 * being installed. This declaration tells TypeScript about that substitution
 * and nothing else: it does not make the Node runtime available.
 */
declare const process: {
  env: {
    API_KEY?: string;
  };
};
