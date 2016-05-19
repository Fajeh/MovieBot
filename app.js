/**
 * Created by torbenindorf on 12.05.16.
 */
/* dependencies*/
var restify = require('restify');
var builder = require('botbuilder');
var movieDatabase = require('./movieDatabase.js');

/* creates a Luis Dialog*/
var model = 'https://api.projectoxford.ai/luis/v1/application?id=85c6e28d-607b-4a71-87e6-c694f038eb6e&subscription-key=a0163ecd7c864fd290eef12ce9269e70';
var dialog = new builder.LuisDialog(model);

/* LUIS adjustments*/
dialog.setThreshold(0.4); // the default value is 0.1! - this is too damn low!

/* available modes*/
var MODE = {
    FREE : 1,
    GUIDED : 2
}
/* creates the bot */
// Create bot and add dialogs
var bot = new builder.BotConnectorBot({ appId: 'MovieBot', appSecret: 'MovieBotSecret' });
bot.add("/",dialog);
/* creates the dialogs */
/* on default dialog*/
dialog.onDefault(builder.DialogAction.send("I am sorry. I don´t know what do you mean. Ask for help if you want more information."));
/* on begin dialog*/
dialog.onBegin(builder.DialogAction.send('Hi! I am the awesome Moviebot. If you want to see a movie but aren´t sure which movie. You should simply aks me. I offer two ways of helping, a guided mode and free mode. Its your choice which mode do you want!'))
/* this is the help dialog*/
dialog.on('userNeedsHelp', builder.DialogAction.send("This is the help dialog"));
/* mode dialogs */
dialog.on('userChoosesGuidedMode',function(session, args, next){
    builder.DialogAction.send("You choose the guided mode");
    session.botMode = MODE.FREE; // sets the current mode
   // session.replaceDialog('/freeMode'); // starts the free mode
});
dialog.on('userChoosesFreeMode', function(session, args, next){
    builder.DialogAction.send("You choose the free mode")
    session.botMode = MODE.GUIDED; // sets the current mode
  //  session.replaceDialog('/guidedMode'); // starts the guided mode
});



dialog.on('considerGenreActor', builder.DialogAction.send('Consider Genre and Actor'));


dialog.on('considerActor', [
    function (session, args, next) {
        var firstName = builder.EntityRecognizer.findEntity(args.entities, 'Actor::Firstname');
        var lastName = builder.EntityRecognizer.findEntity(args.entities, 'Actor::Lastname');
        var videoType = builder.EntityRecognizer.findEntity(args.entities, 'VideoType');

        if (!firstName && !lastName && !videoType) {
            session.send("Sorry I didn't understand your request");

        } else {
            session.send("Looking for " + videoType.entity + " with " + firstName.entity + " " + lastName.entity);
            movieDatabase.searchActor(firstName, lastName, videoType);
        }
    }
]);
/*
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

        if(results.response == 'Free mode' || results.response == 'Free Mode')
            session.botMode = 'Free'
        else if(results.response == 'Guided mode' || results.response == 'Guide Mode')
            session.botMode = 'Guided'

        session.send("You have choosen the %s Mode", session.botMode);

        if(session.botMode == 'Guided') {
            session.replaceDialog('/guidedMode');
        }
        else if(session.botMode == 'Free') {
            session.replaceDialog('/freeMode');
        }
    }
]);

bot.add('/guidedMode', [
    function (session) {
        builder.Prompts.text(session, "How can I help you?");

    },
    function (session, results) {

        session.replaceDialog('/');
    }
]);

bot.add('/freeMode', dialog, [
]);
*/
/*
bot.add('/', [
    function (session) {

    },
    function (session, results) {

        session.replaceDialog('/');
    }
]);
);
*/

// Setup Restify Server
var server = restify.createServer();
server.post('/api/messages', bot.verifyBotFramework(), bot.listen());
server.listen(process.env.port || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});