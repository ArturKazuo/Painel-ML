//  __   __  ___        ___
// |__) /  \  |  |__/ |  |  
// |__) \__/  |  |  \ |  |  

const Client = require('../components/wppConnectClient');
var express = require('express');
const fetch = require('node-fetch');

const SESSION_NAME = process.env.APINAME || 'FlashSessions1';
const API_PORT = process.env.APIPORT || 60051;
const CHATBOT_PORT = process.env.CHATBOT_PORT || 3979;
const CALLBACK_RECEIVE = process.env.CALLBACK_RECEIVE || 'http://localhost';
const CALLBACK_ROUTE = process.env.CALLBACK_RECEIVE || 'api/whatsapp/messages';


// Load process.env values from .env file
require('dotenv').config();

const use_sockets = false;

//WhatsApp Server
const client = new Client(SESSION_NAME, receiveMessage);


function convertToCharArray(word) {
  return Array.prototype.map.call(word, eachLetter => eachLetter.charCodeAt(0));
}

async function receiveMessage(text, contact, channelData, msg) {
  console.log('REC:', JSON.stringify(msg));

  if (!text) {
    return
  } else {

    const message = {
      type: 'message',
      text: text,
      user: contact,
      channel: use_sockets ? 'websocket' : 'webhook',
      port: API_PORT,
      channelData: {
        // data: contact,
        ...channelData
      }
    }

    const resposta = await callbackReceive(msg);
    return false;
  }
};

async function callbackReceive(mensagem) {
  if (CALLBACK_RECEIVE) {
    try {
      const urlApi = `${CALLBACK_RECEIVE}:${CHATBOT_PORT}/${CALLBACK_ROUTE}`;
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

}



function sendText(phone, text, qrcode) {
  if (!text) return;
  

  return new Promise((resolve, reject) => {

    if (!client) reject(new Error(`No Client`));

    console.log(`>> Enviando ${phone} ${text}`);
    client.sendTextNew(phone, text, qrcode).then((res) => {
      resolve(res);
    }).catch((error) => {
      console.log(`[ERROR] ${JSON.stringify(error)}`);
      reject(error)
    })

  });
}



var app = express();

app.listen(API_PORT, function () {
  console.log(`Example app listening on port ${API_PORT}!`);
  // console.log(convertToCharArray(`Example app listening on port ${API_PORT}!`));

});


app.get('/send', async function (req, res) {
  function formatPhoneNumber(phoneNumberString) {
    var numberPattern = /\d+/g;
    var match = phoneNumberString.match(numberPattern);
    return `${match}`;
  }

  //req.query.phone = `5531991100584`;

  const telefone = formatPhoneNumber(req.query.phone).replace(/\,/g, '');

  let phone = null;
  phone = `${telefone}@c.us`;

  res.header('Content-Type', 'application/json');
  if (phone) {
    let text = req.query.text;
    let qrcode = req.query.qrcode;

    try {
      await sendText(phone, text, qrcode);
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

app.get('/getNumber', async function (req, res) {
  function formatPhoneNumber(phoneNumberString) {
    var numberPattern = /\d+/g;
    var match = phoneNumberString.match(numberPattern);
    return `${match}`;
  }

  const telefone = formatPhoneNumber(req.query.phone).replace(/\,/g, '');

  let phone = null;
  phone = `${telefone}@c.us`;

  res.header('Content-Type', 'application/json');
  if (phone) {
    try {
      const resposta = await client.getPhoneNumber(phone);
      res.send(resposta);
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


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

