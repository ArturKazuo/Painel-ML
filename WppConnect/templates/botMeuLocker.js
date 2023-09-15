// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const dotenv = require('dotenv');
const path = require('path');
const restify = require('restify');
const fetch = require('node-fetch');

const { BotFrameworkAdapter,
    ConversationState,
    InputHints,
    MemoryStorage,
    MiddlewareSet,
    UserState,
    CloudAdapter,
    ConfigurationBotFrameworkAuthentication } = require('botbuilder');
const { QiraWhatsAppAdapter } = require('./adapters/QiraWhatsAppAdapter');
const { LockerCadastroManagementBot } = require('./bots/lockerCadastroManagementBot');
// This bot's main dialog.
const { sendText, getWhatsappRequest } = require('./functions/whatsAppSender')

// Import required bot configuration.
const ENV_FILE = path.join(__dirname, '.env');
dotenv.config({ path: ENV_FILE });

const chatbotPORT = process.env.port || process.env.PORT || 3979;               //favor não editar aqui, edite as portas no arquivo de portas
const senderPORT = process.env.senderport ||process.env.SENDERPORT || 60008;    //favor não editar aqui, edite as portas no arquivo de portas

// Create HTTP servers
const server = restify.createServer();
server.use(restify.plugins.bodyParser())

server.listen(chatbotPORT, () => {
    console.log(`\n${server.name} listening to ${server.url}`);
    console.log(`\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator`);
    console.log(`\nTo talk to your bot, open the emulator select "Open Bot"`);
});

// const botFrameworkAuthentication = new ConfigurationBotFrameworkAuthentication(process.env);

// const whatsAppAdapter = new QiraWhatsAppAdapter(botFrameworkAuthentication);
const whatsAppAdapter = new QiraWhatsAppAdapter({
    port: senderPORT
});

const memoryStorage = new MemoryStorage()
const userState = new UserState(memoryStorage)
const conversationState = new ConversationState(memoryStorage)
const bot = new LockerCadastroManagementBot(conversationState, userState);

whatsAppAdapter.onTurnError = async (context, error) => {
    console.error(`\n [onTurnError] unhandled error: ${ error }`);
    await conversationState.delete(context);
};

server.post('/api/whatsapp/messages',async (req, res) => {
    // console.log('API', JSON.stringify(req.body))
    // console.log('API Headers', JSON.stringify(req.headers))

    whatsAppAdapter.processActivity(req, res, async (context) => {
        // Route to main dialog.
        await bot.run(context);
    });
});

server.post('/api/notify', async (req, res) => {

    try {
        //console.log('NOTIFY', JSON.stringify(req.body))
        //console.log('NOTIFY HEADERS', JSON.stringify(req.headers))

        const reqActivity = await getWhatsappRequest(req, "Request", senderPORT);

        const resp = await callbackReceive(reqActivity);
        res.send(
            {
                result: "ok",
                error: null
            }
        )
        res.end()
    } catch (error) {
        res.statusCode = 403;
        res.send(
            {
                result: "error",
                error: error
            }
        )
    }

})

server.post('/send', async function (req, res) {

    console.log('Send', JSON.stringify(req.body))

    let phone = req.body.phone;

    res.header('Content-Type', 'application/json');
    if (phone) {
        let text = req.body.text;
        let qrcode = req.body.qrcode;

        try {
            await sendText(phone, text, qrcode, senderPORT);
            res.send({ status: 'ok', code: 0 });
        } catch (error) {
            res.statusCode = 403;
            res.send({ ...error, code: 1 });
        }

    } else {
        res.statusCode = 403;
        res.send({
            "numberExists": false,
            "connection": "CONNECTED",
            "code": 1
        });
    }

});

async function callbackReceive(mensagem) {
      try {
        const urlApi = `http://localhost:${chatbotPORT}/api/whatsapp/messages`;
        console.log('urlApi:', JSON.stringify(urlApi));
        const response = await fetch(urlApi, {
          method: 'post',
          body: JSON.stringify(mensagem),
          headers: {'Content-Type': 'application/json'}
        });
        const data = await response.json();
        //console.log(data);
        return data;
        
      } catch (error) {
        return {error: error}
        
      }
  
  }