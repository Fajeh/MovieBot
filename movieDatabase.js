/**
 * Created by torbenindorf on 17.05.16.
 */

var movieDB = require('moviedb')('89298244cdf30c4264e81888dc561a61');

module.exports = new function(){

    /* private fields*/
    function _suggestMovie(movieEntity){
        _filterActor(movieEntity.results);
    }

    function _filterActor(dbResult, callback) {
        var bestActor, index;

        for(index = 0; index < dbResult.length; ++index) {
            var actor = dbResult[index];
            if(!bestActor)
                bestActor = actor;
            else {
                if(bestActor.popularity < actor.popularity)
                    bestActor = entry;
            }
        }

        if(bestActor) {
            var result = [];

            for(var index = 0; index < bestActor.known_for.length; ++index) {
                result.push(bestActor.known_for[index].title);
            }
            return callback(result);
        }
        else
            console.log('Error');
    }

    return{

        searchActor: function (firstName, lastName, videoType, callback) {

            movieDB.searchPerson({query: firstName.entity + ' ' + lastName.entity}, function (err, res) {
                _filterActor(res.results, callback);
            });
            // whatever
        }
    }

}