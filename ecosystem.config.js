/** @type {import("pm2").Config} */
module.exports = {
  apps: [
    {
      name: "remix-app",
      script: "node_modules/.bin/remix-serve",
      args: "./build/server/index.js",
      env: {
        PORT: 4000,
      },
    },
  ],
};
