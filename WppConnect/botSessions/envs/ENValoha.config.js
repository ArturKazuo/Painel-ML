module.exports = {
    apps : [
        {
          name: "botaloha",
          script: "./botSessions/botaloha.js",
          // cron_restart: '0 3 * * *',
          env: {
            "PORT": "3279",
            "SENDERPORT": "61044",
            "APINAME" : "aloha",
          }
        },
        {
          name: "alohaSessions",
          script: "./botSessions/wppConnectSessions/alohaSessions.js",
          // cron_restart: '0 3 * * *',
          env: {
            "PORT": "3279",
            "SENDERPORT": "61044",
            "APINAME" : "aloha",
          }
        }
    ]
  }