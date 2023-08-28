const fetch = require('node-fetch');


async function sendMessage(activities, port = 60056) {
    console.log("\n\nenviar: ", JSON.stringify(activities))
    try {
        //const msg = await client.sendText(phone, text, qrcode);
        const phone = (activities?.to).replace('@c.us', '');
        const text = encodeURI(activities.body);
        const urlApi = `http://localhost:${port}/send?phone=${phone}&text=${text}`;
        const response = await fetch(urlApi);
        const msg = await response.json();
        // return msg;
        return {
            id: 'edadwa',
            ...msg
        }
        // console.log('MSG', msg);
    } catch (error) {
        throw error;
    }
}

async function sendCallback(responses, context, data) {
    console.log("\n\ncallback: ", JSON.stringify(responses), JSON.stringify(data))

    let body = data;

    if (!body?.callback_url) return;
    
    const bodyResposta = {
        respostas: {
            ...responses,
            dataConfirmation: (new Date()).toISOString()
        },
        ...data
    }

    console.log('\n\n\n\nBody Resposta', JSON.stringify(bodyResposta))

    try {
        const response = await fetch(`${body.callback_url}`, {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
                "Accept": "*/*"
            },
            body: JSON.stringify(bodyResposta)
        });

        //const data = await response.json();
    } catch (err) {
        console.log("Erro", err)
    }
}

function sendText(phone, text, qrcode, port = 60056) {
    if ((!text) || (!phone)) return;

    return new Promise(async (resolve, reject) => {
        try {
            //const msg = await client.sendText(phone, text, qrcode);
            const urlApi = `http://localhost:${port}/send?phone=${phone}&text=${text}&qrcode=${qrcode}`;
            const response = await fetch(urlApi);
            const msg = await response.json();
            // return msg;
            resolve(msg);
            // console.log('MSG', msg);
        } catch (error) {
            reject(error);
        }

    });
}

function getPhoneNumber(phone, port = 60056) {
    if (!phone) return;

    return new Promise(async (resolve, reject) => {
        try {
            //const msg = await client.sendText(phone, text, qrcode);
            const urlApi = `http://localhost:${port}/getNumber?phone=${phone}`;
            const response = await fetch(urlApi);
            const msg = await response.json();
            // return msg;
            resolve(msg?.phone);
            // console.log('MSG', msg);
        } catch (error) {
            reject(error);
        }

    });
}


async function getWhatsappRequest(req, text, port = 60056) {

    let body = req.body
    body.startRequest = true;

    // let empresa = body.empresa.nome
    // let lockers = body.lockers
    let nome = body.cliente.nome
    let celular = body.cliente.celular.replace('@c.us', '')
    // let celularId = await getPhoneNumber(body?.cliente?.celular) //body.cliente.celular + "@c.us"
    let celularId = body.cliente.celular
    // let callback_url = body.callback_url
    let senderCelularId = "553172283951@c.us";
    const senderCelularName = "cadastro";
    const currentDate = new Date();
    const timestamp = currentDate.getTime();

    const reqBody = {
        id: `false_${celularId}_3A98C020754${timestamp}`,
        body: text,
        data: body,
        type: "chat",
        t: timestamp,
        notifyName: nome,
        from: celularId,
        to: senderCelularId,
        self: "in",
        ack: 1,
        isNewMsg: true,
        star: false,
        kicNotified: false,
        recvFresh: true,
        isFromTemplate: false,
        pollInvalidated: false,
        isSentCagPollCreation: false,
        latestEditMsgKey: null,
        latestEditSenderTimestampMs: null,
        broadcast: false,
        mentionedJidList: [],
        groupMentions: [],
        isVcardOverMmsDocument: false,
        isForwarded: false,
        labels: [],
        hasReaction: false,
        productHeaderImageRejected: false,
        lastPlaybackProgress: 0,
        isDynamicReplyButtonsMsg: false,
        isMdHistoryMsg: false,
        stickerSentTs: 0,
        isAvatar: false,
        requiresDirectConnection: false,
        pttForwardedFeaturesEnabled: true,
        chatId: celularId,
        fromMe: false,
        sender: {
          id: celularId,
          name: nome,
          shortName: nome,
          pushname: nome,
          type: "in",
          isBusiness: false,
          isEnterprise: false,
          isSmb: false,
          labels: [],
          isContactSyncCompleted: 1,
          formattedName: nome,
          isMe: false,
          isMyContact: true,
          isPSA: false,
          isUser: true,
          isWAContact: true,
          profilePicThumbObj: {
            id: celularId,
          },
          msgs: null,
        },
        timestamp: timestamp,
        content: text,
        isGroupMsg: false,
        isMedia: false,
        isNotification: false,
        isPSA: false,
        mediaData: {},
      }

      return reqBody;
}

function checkSim(text){

    if(text.match(new RegExp(/sim/i)) || text.match(new RegExp(/correto/i)) || text.match(new RegExp(/confirmo/i)) || text.match(new RegExp(/confirma/i))){
        return true;
    }

    return false

} 

function checkNao(text){

    if(text.match(new RegExp(/nao/i)) || text.match(new RegExp(/não/i)) || text.match(new RegExp(/incorreto/i)) || text.match(new RegExp(/errado/i))){
        return true;
    }

    return false

} 

function checkPare(text){

    if(text.match(new RegExp(/pare/i)) || text.match(new RegExp(/cancelar/i)) || text.match(new RegExp(/parar/i)) || text.match(new RegExp(/cancela/i)) || text.match(new RegExp(/cancele/i)) || text.match(new RegExp(/interromper/i))){
        return true;
    }

    return false

}

function checkTicketRequestTime(userProfile){

    let dateNow = new Date();
    
    let sub = Date.parse(dateNow) - Date.parse(userProfile.ticketRequestTime)

    let hours = Math.floor(((sub/1000)/60)/60)

    console.log(hours)

    if(hours >= 24){
        return true;
    }
    else{
        return false;
    }

}


module.exports.sendMessage = sendMessage;
module.exports.sendCallback = sendCallback;
module.exports.sendText = sendText;
module.exports.getWhatsappRequest = getWhatsappRequest;
module.exports.getPhoneNumber = getPhoneNumber;
module.exports.checkSim = checkSim;
module.exports.checkNao = checkNao;
module.exports.checkPare = checkPare;
module.exports.checkTicketRequestTime = checkTicketRequestTime;
