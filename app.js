var restify = require('restify');
var builder = require('botbuilder');

// Create bot and add dialogs
var movieBot = new builder.BotConnectorBot({ appId: 'YourAppId', appSecret: 'YourAppSecret' });

var movieBot = new builder.BotConnectorBot();
movieBot.add('/', new builder.CommandDialog()
    .matches('^set name', builder.DialogAction.beginDialog('/profile'))
    .matches('^quit', builder.DialogAction.endDialog())
    .onDefault(function (session) {
        if (!session.userData.name) {
            session.beginDialog('/profile');
        } else {
            session.send('Hello %s!', session.userData.name);
        }
    }));
movieBot.add('/profile',  [
    function (session) {
        if (session.userData.name) {
            builder.Prompts.text(session, 'What would you like to change it to?');
        } else {
            builder.Prompts.text(session, 'Hi! What is your name?');
        }
    },
    function (session, results) {
        session.userData.name = results.response;
        session.endDialog();
    }
]);

// Setup Restify Server
var server = restify.createServer();
server.post('/api/messages', movieBot.verifyBotFramework(), movieBot.listen());
server.listen(process.env.port || 3978, function () {
    console.log('%s listening to %s', server.name, server.url); 
});