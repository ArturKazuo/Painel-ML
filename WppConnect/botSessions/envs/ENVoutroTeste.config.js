module.exports = {
    apps : [
        {
          name: "botoutroTeste",
          script: "./botSessions/botoutroTeste.js",
          // cron_restart: '0 3 * * *',
          env: {
            "PORT": "3247",
            "SENDERPORT": "61600",
            "APINAME" : "outroTeste",
          }
        },
        {
          name: "outroTesteSessions",
          script: "./botSessions/wppConnectSessions/outroTesteSessions.js",
          // cron_restart: '0 3 * * *',
          env: {
            "PORT": "3247",
            "SENDERPORT": "61600",
            "APINAME" : "outroTeste",
          }
        }
    ]
  }