// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler, TurnContext } = require('botbuilder');

const fetch = require('node-fetch');
const { MainDialog } = require('../dialogs/mainDialogkazuoTeste')

// The accessor names for the conversation data and user profile state property accessors.
const CONVERSATION_DATA_PROPERTY = 'conversationData';
const USER_PROFILE_PROPERTY = 'userProfile';

class LockerCadastroManagementBot extends ActivityHandler {
    constructor(conversationState, userState) {
        super();
        // Create the state property accessors for the conversation data and user profile.
        this.conversationDataAccessor = conversationState.createProperty(CONVERSATION_DATA_PROPERTY);
        this.userProfileAccessor = userState.createProperty(USER_PROFILE_PROPERTY);

        this.dialog = new MainDialog(conversationState, userState);

        // The state management objects for the conversation and user state.
        this.conversationState = conversationState;
        this.userState = userState;

        this.regexResult;

        this.onMessage(async (turnContext, next) => {
            // Get the state properties from the turn context.
            const userProfile = await this.userProfileAccessor.get(turnContext, {});
            const conversationData = await this.conversationDataAccessor.get(
                turnContext, { promptedForUserName: false });

            const channelDataRequest = turnContext?._activity?.channelData?.data;
            let texto;
            let regexResult;

            await this.dialog.run(turnContext, this.conversationDataAccessor, conversationData.data, conversationData)


            await next();
        });

    }

    /**
     * Override the ActivityHandler.run() method to save state changes after the bot logic completes.
     */
    async run(context) {
        await super.run(context);

        // Save any state changes. The load happened during the execution of the Dialog.
        await this.conversationState.saveChanges(context, false);
        await this.userState.saveChanges(context, false);
    }
}


function getEnderecos(lockers) {
    let text = ''

    let i = 1

    lockers.forEach(locker => {
        text += ` ${i++} - ${locker.endereco}\n\n`
    })

    return text
}

module.exports.LockerCadastroManagementBot = LockerCadastroManagementBot;
