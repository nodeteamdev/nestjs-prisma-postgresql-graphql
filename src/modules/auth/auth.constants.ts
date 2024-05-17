export const authConstants = Object.freeze({
  // TTL in seconds
  // https://github.com/auth0/node-jsonwebtoken?tab=readme-ov-file#jwtsignpayload-secretorprivatekey-options-callback
  jwt: {
    accessTtl: 60 * 5,
    refreshTtl: 60 * 60 * 24 * 3,
  },
  // jwt TTL, but in milliseconds
  whitelist: {
    accessTtl: 60 * 5 * 1000,
    refreshTtl: 60 * 60 * 24 * 3 * 1000,
  },
});
