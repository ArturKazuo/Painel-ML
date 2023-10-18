// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { MessageFactory, InputHints } = require('botbuilder');
const { ComponentDialog, DialogSet, DialogTurnStatus, TextPrompt, WaterfallDialog } = require('botbuilder-dialogs');
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

        // Define the main dialog and its related components.
        this.addDialog(new TextPrompt('TextPrompt'))
            // .addDialog(mainDialog)
            .addDialog(new WaterfallDialog(MAIN_WATERFALL_DIALOG, [
                this.stepFirst.bind(this),
                this.stepSecond.bind(this),                
            ]))

        this.initialDialogId = MAIN_WATERFALL_DIALOG;

        this.responses = {};

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

            if (results?.status === DialogTurnStatus.empty) {
                await dialogContext.beginDialog(this.id);
            }

        }

    }

    async stepFirst(stepContext) {

        const mainDetails = stepContext.options;

        stepContext.context.sendActivity('Olá! Sou o Bot de WhatsApp do Painel Meu Locker. ')

        return await stepContext.next();
    }

    async stepSecond(stepContext) {

        const mainDetails = stepContext.options;

        stepContext.context.sendActivity('No momento, só posso enviar estas mensagens. Caso desejar modificar minhas mensagens, edite o arquivo de diálogo na página principal do painel.')
        
        return await stepContext.next();
    }

    async finalStep(stepContext){
        console.log("foi")
        return await stepContext.endDialog()
    }

    async stopStep(stepContext) {
        await stepContext.sendActivity(`Obrigado ${stepContext._activity.from.name}.\nA atualização ou inserção de cadastro foi interrompida.\nVocê pode reiniciá-la enviando a mensagem para cadastro ou atualização.`)
        return await this.finalStep(stepContext);
    }

}

module.exports.MainDialog = MainDialog;
