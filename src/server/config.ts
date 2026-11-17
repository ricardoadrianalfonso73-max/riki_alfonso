import path from 'node:path';

export const serverConfig = {
  port: Number(process.env.PORT || 3000),
  dataStorePath: path.resolve(
    process.cwd(),
    process.env.DATA_STORE_PATH || 'data/electrotecno.db.json'
  ),
  freeShippingThreshold: 120000,
  flatShippingCost: 6500,
  sessionTtlMs: 1000 * 60 * 60 * 24 * 7,
};
