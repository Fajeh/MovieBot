/**
 * Created by torbenindorf on 17.05.16.
 */

var movieDB = require('moviedb')('89298244cdf30c4264e81888dc561a61');

module.exports = new function(){

    /* private fields*/
    function _suggestMovie(movieEntity){
        console.log(movieEntity);
    }


    return{

        searchActor: function (firstName, lastName, videoType) {

            movieDB.searchPerson({query: firstName.entity + ' ' + lastName.entity}, function (err, res) {
                _suggestMovie(res);
            });
            // whatever
        }
    }
};