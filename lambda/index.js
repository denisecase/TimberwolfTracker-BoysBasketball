/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');

// import custom games.json information
const games = require('./games');

// import custom config.json information
const config = require('./config');

// set up local variables
const home = "home"
const away = "away"
const skillName = config.skillName;
const gender = config.gender;
const sport = config.sport;
const homecity = config.homecity;
const intentText1 = config.intentText1;
const intentText2 = config.intentText2; 
const helpText = config.helpText
const doneText = config.doneText;
const errorText = config.errorText;
const victoryText = config.victoryText;

// helper function - get next 
function getNext(now, location) {
    console.log('Entering getNext: ' + now + ' ' + location);
    const ls = (location === null) ? "" : location;
    let ans = 'There are no more ' + gender + ' ' + sport + ' games in the current schedule. ' + victoryText;
    for (let j = 0; j < games.length; j++) {
        const item = games[j];
        const p = item.gamelocation;
        const i = item.gamedate;
        const d = new Date(i.year, i.month - 1, i.day, i.hour, i.minute, 0);
        const t = (0 === i.hour) ? "a time to be determined" : d.toLocaleTimeString('en-US');
        if (d > now) {
            if (location === null) {
                ans = 'The next ' + gender + ' ' + sport + ' game is ' + d.toDateString() + ' at ' + t + ' in ' + p + ".";
                return ans;
            }
            else if (location === home && (p === home || p === homecity)) {
                ans = 'The next ' + gender + ' ' + ls + ' ' + sport + ' game is ' + d.toDateString() + ' at ' + t + ' in ' + homecity + ".";
                return ans;
            }
            else if (location !== home && p !== home && p !== homecity) {
                ans = 'The next ' + gender + ' ' + sport + ' away game is ' + d.toDateString() + ' at ' + t + ' in ' + p + ".";
                return ans;
            }
        }
    }
    return ans;
}

// helper function - get remaining
function getRemaining(now, location) {
    console.log('Entering getRemaining: ' + now + ' ' + games.length + ' ' + location);
    const ls = (location === null) ? "" : location;
    let ctRemaining = 0;
    let ctHomes = 0;
    let ctAways = 0;
    let ans = 'There are ' + ctAways + ' ' + gender + ' ' + ls + ' ' + sport + ' games remaining.';
    for (let j = 0; j < games.length; j++) {
        const item = games[j];
        const p = item.gamelocation;
        const i = item.gamedate;
        const d = new Date(i.year, i.month - 1, i.day, i.hour, i.minute, 0);
        if (d > now && (p === home || p === homecity)) {
            ctRemaining += 1;
            ctHomes += 1;
            console.log('ctRemaining=' + ctRemaining + ' ctHomes=' + ctHomes);
        }
        else if (d > now && p !== home && p !== homecity) {
            ctRemaining += 1;
            ctAways += 1;
            console.log('ctRemaining=' + ctRemaining + ' ctAways=' + ctAways);
        }
    }
    if (ctRemaining === 0) { ans = 'There are no ' + gender + ' ' + sport + ' games remaining.'; }
    else if (location === null) { ans = 'There are ' + ctRemaining + ' ' + gender + ' ' + sport + ' games remaining.'; }
    else if (location === home) { ans = 'There are ' + ctHomes + ' ' + gender + ' ' + ls + ' ' + sport + ' games remaining.'; }
    else if (location === away) { ans = 'There are ' + ctAways + ' ' + gender + ' ' + ls + ' ' + sport + ' games remaining.'; }
    return ans;
}

// HANDLERS .........................................................................

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = `Welcome from ${skillName}. Say ${intentText1} or ${intentText2}`;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// ********************************* NEXT ************************************

const NextIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'NextIntent';
    },
    handle(handlerInput) {
        const s = handlerInput.requestEnvelope.request.intent.slots;
        const location = (s.Location) ? s.Location.value : null;
        console.log('next location = ' + location);
        const now = new Date();
        console.log('next now = ' + now.toDateString());
        let speechText = '';
        speechText = speechText + ' ' + getNext(now, location);
        if (speechText === '') { 
            speechText = `Hmm...I can't help with that one. Try asking ${intentText1} or ${intentText2}`;
        }
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('Ask how many games remaining or say stop or cancel to exit.')
            .getResponse();
    }
};

// ********************************* REMAINING ****************************

const RemainingIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RemainingIntent';
    },
     handle(handlerInput) {
        const s = handlerInput.requestEnvelope.request.intent.slots;
        const location = (s.Location.value) ? s.Location.value : null;
        console.log('remaining location = ' + location);
        const now = new Date();
        console.log('remaining now = ' + now.toDateString());
        let speechText = '';
        speechText = speechText + ' ' + getRemaining(now, location);
         if (speechText === '') { 
            speechText = `Hmm...I can't help with that one. Try asking ${intentText1} or ${intentText2}`;
        }
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('Ask when is the next game or say stop or cancel to exit.')
            .getResponse();
    }
};

// ********************************* BUILT-IN ****************************

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
         // const speakOutput = 'You can say hello to me! How can I help?';
        const speakOutput = helpText;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        // const speakOutput = 'Goodbye!';
        const speakOutput = doneText;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
             // const speakOutput = 'Sorry, I don\'t know about that. Please try again.';
        const speakOutput = helpText;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        // const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;
        const speakOutput = errorText;
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        NextIntentHandler,  //  add custom intents and remove any unnecessary ones (e.g. hello world)
        RemainingIntentHandler, //  add custom intents and remove any unnecessary ones (e.g. hello world)
        // HelloWorldIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();
    
    