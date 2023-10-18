module.exports = {
    apps : [
        {
          name: "botaaa",
          script: "./botSessions/botaaa.js",
          // cron_restart: '0 3 * * *',
          env: {
            "PORT": "3026",
            "SENDERPORT": "61946",
            "APINAME" : "aaa",
          }
        },
        {
          name: "aaaSessions",
          script: "./botSessions/wppConnectSessions/aaaSessions.js",
          // cron_restart: '0 3 * * *',
          env: {
            "PORT": "3026",
            "SENDERPORT": "61946",
            "APINAME" : "aaa",
          }
        }
    ]
  }