// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// const { TimexProperty } = require('@microsoft/recognizers-text-data-types-timex-expression');
const { MessageFactory, InputHints } = require('botbuilder');
const { ComponentDialog, DialogSet, DialogTurnStatus, TextPrompt, WaterfallDialog } = require('botbuilder-dialogs');
// const moment = require('moment-timezone');
const fetch = require('node-fetch');
const { sendCallback, checkSim, checkNao, checkPare } = require('../functions/whatsAppSender')
// const { CancelAndHelpDialog } = require('./cancelAndHelpDialog');

const { getCondominio, sendCadastro } = require('../apis/apiMeuLocker')


const MAIN_WATERFALL_DIALOG = 'mainDialogWaterfall';
const CONVERSATION_DATA_PROPERTY = 'conversationData';
const USER_PROFILE_PROPERTY = 'userProfile';

class MainDialog extends ComponentDialog {

    constructor(conversationState, userState) {
        super('MainDialog');

        // if (!mainDialog) throw new Error('[MainDialog]: Missing parameter \'mainDialog\' is required'); 

        // Define the main dialog and its related components.
        this.addDialog(new TextPrompt('TextPrompt'))
            // .addDialog(mainDialog)
            .addDialog(new WaterfallDialog(MAIN_WATERFALL_DIALOG, [
                this.stepCelular.bind(this),
                
                // this.enderecoAsk.bind(this),
                // this.confirmationReceive.bind(this),
                // this.agradecimento.bind(this)
            ]))

        this.initialDialogId = MAIN_WATERFALL_DIALOG;

        this.responses = {};


        // this.timeoutRequest;

    }

    /**
     * The run method handles the incoming activity (in the form of a TurnContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {*} turnContext
     * @param {*} accessor
     */
    async run(turnContext, accessor, data, conversationData) {

        if (checkPare(turnContext._activity.text)) {

            return await this.stopStep(turnContext);

        } else {

            this.conversationData = conversationData;


            const dialogSet = new DialogSet(accessor);
            dialogSet.add(this);

            const dialogContext = await dialogSet.createContext(turnContext);
            const results = await dialogContext.continueDialog();

            //console.log("RRRRRR:", JSON.stringify(conversationData))

            // if(turnContext._activity?.channelData?.data?.timeoutRequest){
            //     this.timeoutRequest = true
            // }
            if (results?.status === DialogTurnStatus.empty) {
                await dialogContext.beginDialog(this.id);
            }

        }

    }

    /**
     * First step in the waterfall dialog. Prompts the user for a command.
     * Currently, this expects a booking request, like "book me a flight from Paris to Berlin on march 22"
     * Note that the sample LUIS model will only recognize Paris, Berlin, New York and London as airport cities.
     */


    async stepCelular(stepContext) {

        const mainDetails = stepContext.options;

        stepContext.context.sendActivity('Olá! Sou o Bot de WhatsApp do Painel Meu Locker. ')

        return await stepContext.next(mainDetails.stepCelular);
    }

    async finalStep(stepContext){
        console.log("foi")
        // this.conversationData.finished = true;
        // this.conversationData.responses = {}
        // this.conversationData.locker = undefined
        // this.conversationData.lockerID = null
        // this.conversationData.start = null;
        return await stepContext.endDialog()
    }

    async stopStep(stepContext) {
        await stepContext.sendActivity(`Obrigado ${stepContext._activity.from.name}.\nA atualização ou inserção de cadastro foi interrompida.\nVocê pode reiniciá-la enviando a mensagem para cadastro ou atualização.`)
        return await this.finalStep(stepContext);
    }

}

module.exports.MainDialog = MainDialog;
