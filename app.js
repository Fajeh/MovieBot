/**
 * Created by torbenindorf on 12.05.16.
 */

var restify = require('restify');
var builder = require('botbuilder');

// Create bot and add dialogs
var bot = new builder.BotConnectorBot({ appId: 'MovieBot', appSecret: 'MovieBotSecret' });

bot.add('/', function (session) {
    session.send("You have choosen the %s Mode", session.botMode);
});

bot.use(function (session, next) {
    if (!session.userData.yourName) {
        session.userData.yourName = true;
        session.beginDialog('/yourName');
    } else {
        next();
    }
});

bot.add('/yourName', [
    function (session) {
        builder.Prompts.text(session, "Hello... What's your name?");
    },
    function (session, results) {
        session.userData.name = results.response;
        session.replaceDialog('/selectMode');
    }
]);

bot.add('/selectMode', [
    function (session) {
        session.send("Hi %s. Nice to meet you.", session.userData.name);
        builder.Prompts.text(session, "Which mode do you want to use?");
    },
    function (session, results) {

        if(results.response == 'Free mode')
            session.botMode = 'Free'
        else if(results.response == 'Guided Mode')
            session.botMode = 'Guided'

        session.replaceDialog('/');
    }
]);

// Setup Restify Server
var server = restify.createServer();
server.post('/api/messages', bot.verifyBotFramework(), bot.listen());
server.listen(process.env.port || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});