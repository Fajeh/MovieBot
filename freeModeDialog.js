/**
 * Created by Fabian on 25.05.2016.
 */

module.exports = function FreeModeDialog(builder, movieDatabase){

    var model = 'https://api.projectoxford.ai/luis/v1/application?id=85c6e28d-607b-4a71-87e6-c694f038eb6e&subscription-key=a0163ecd7c864fd290eef12ce9269e70';


    var dialogFreeMode = new builder.LuisDialog(model);

    dialogFreeMode.setThreshold(CONFIG.THRESHOLD); // the default value is 0.1! - this is too damn low!

    dialogFreeMode.onBegin(function(session, args, next){
        session.send("You choose the free mode.");
        session.send("You can tell me statements about movies like \" show me an action movie with Will Smith\" and I will show you action movies with Will Smith."); // should ne imporved
        session.send("I will return the "+ CONFIG.NUMBER_OF_RETURN +" best movies that I find.");
    });

    dialogFreeMode.on('userNeedsHelp', function(session, args, next){
        session.send('This is the free mode help');
    });

    return dialogFreeMode;
}
