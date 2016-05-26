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

    dialogFreeMode.on('considerActor', [
        function (session, args, next) {
            var firstName = builder.EntityRecognizer.findEntity(args.entities, 'Actor::Firstname');
            var lastName = builder.EntityRecognizer.findEntity(args.entities, 'Actor::Lastname');
            var videoType = builder.EntityRecognizer.findEntity(args.entities, 'VideoType');

            if (!firstName && !lastName && !videoType) {
                session.send("Sorry I didn't understand your request");

            } else {
                searchForActor(session, firstName, lastName, videoType);
            }
        }
    ]);

    dialogFreeMode.on('considerGenreActor', function(session, args, next) {
        var firstName = builder.EntityRecognizer.findEntity(args.entities, 'Actor::Firstname');
        var lastName = builder.EntityRecognizer.findEntity(args.entities, 'Actor::Lastname');
        var videoType = builder.EntityRecognizer.findEntity(args.entities, 'VideoType');
        var genre = builder.EntityRecognizer.findEntity(args.entities, 'Genre');

        if (!firstName && !lastName && !videoType) {
            session.send("Sorry I didn't understand your request");
        }

        if(!genre && (firstName && lastName && videoType)) //No genre found -> Only search for the actor :)
            searchForActor(session, firstName, lastName, videoType);
        else
        {
            session.send("")
        }
    });

    dialogFreeMode.on('considerReleaseYearActor', function(session, args, next){
        session.send('considerReleaseYearActor');
    });

    dialogFreeMode.on('showCurrentCinemaMovies', function(session, args, next){
        session.send('Loading the current movies in cinema. Please wait a second.');
        movieDatabase.moviesInTheatre(function(response){
            session.send('Here is your result:');
            for(var index = 0; index < response.length; ++index) {
                var counter = index + 1;
                session.send("(" + counter + ") " + response[index].title + ' (Popularity: '+ response[index].popularity + ')');
            }
        });
    });

    //Call the MovieDB and search for the 3 best movies of the actor
    function searchForActor(session, firstName, lastName, videoType) {
        session.send("Looking for " + videoType.entity + " with " + firstName.entity + " " + lastName.entity);
        movieDatabase.searchActor(firstName, lastName, videoType, function(response) {
            if(response.length > 0) { //Output result
                session.send("We have found some awesome movies or series for you: ");
                for(var index = 0; index < response.length; ++index) {
                    var counter = index + 1;
                    session.send("(" + counter + ") " + response[index].title + ' (Popularity: '+ response[index].popularity + ')');
                }
            }
            else {
                session.send("Sorry :-(. We haven't found any movies with "  + firstName.entity + " " + lastName.entity);
            }

            session.send("Do you have any other questions?");
        });
    }

    //dialogFreeMode.onDefault(builder.DialogAction.send("Default response free mode"));
    return dialogFreeMode;
}
