module.exports = {
  apps: [
    {
      name: "remix-app",
      script: "remix-serve",
      args: "./build/server/index.js",
      env: {
        PORT: 4000,
      },
    },
  ],
};
