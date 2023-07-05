export default () => ({
  PORT: parseInt(process.env.PORT) || 3000,
  NONCE: {
    SECRET: process.env.NONCE_SECRET,
    EXPIRES_IN: process.env.NONCE_EXPIRES_IN,
  },
});
