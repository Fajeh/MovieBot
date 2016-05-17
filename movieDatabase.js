/**
 * Created by torbenindorf on 17.05.16.
 */

var movieDB = require('moviedb')('89298244cdf30c4264e81888dc561a61');

module.exports = {
    searchActor: function (firstName, lastName, videoType) {

        movieDB.searchPerson({query: firstName.entity + ' ' + lastName.entity }, function(err, res){
            console.log(res);
        });
        // whatever
    }
};