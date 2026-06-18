import { sigil, optional, oneOf } from '../src/index.js';

const Config = sigil.exact({
  port: Number,
  host: String,
  mode: oneOf('development', 'test', 'production'),
  debug: optional(Boolean),
});

const rawConfig = JSON.parse(
  '{"port":3000,"host":"localhost","mode":"development"}',
);

const config = Config.assert(rawConfig);

console.log(`Config accepted: http://${config.host}:${config.port}`);
