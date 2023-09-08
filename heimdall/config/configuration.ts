export default () => {
  // console.log(process.env);
  return {
    POSTGRES_HOST: process.env.POSTGRES_HOST,
    POSTGRES_PORT: parseInt(process.env.POSTGRES_PORT),
    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    POSTGRES_DB: process.env.POSTGRES_DB,
    PORT: parseInt(process.env.PORT) || 3000,
    NONCE: {
      SECRET: process.env.NONCE_SECRET,
      EXPIRES_IN: process.env.NONCE_EXPIRES_IN,
    },
    ACCESS_TOKEN: {
      SECRET: process.env.ACCESS_TOKEN_SECRET,
      EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
    },
    REFRESH_TOKEN: {
      SECRET: process.env.REFRESH_TOKEN_SECRET,
      EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
    },
  };
};
