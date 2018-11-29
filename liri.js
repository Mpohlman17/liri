require("dotenv").config();
var keys = require("./keys.js");
var request = require('request');
var Spotify = require('node-spotify-api');
var fs = require('fs');
var input = process.argv;
var action = input[2];
var inputs = input[3];

function switchCase() {
    switch (action) {
        case "concert-this":
            concert(inputs);
            break;

        case "spotify-this-song":
            spotify(inputs);
            break;

        case "movie-this":
            movie(inputs);
            break;

        case "do-what-it-says":
            whatItSays();
            break;
    }
};
switchCase();
/**
 * bands in town
 * the input is manully input, so it will show you 
 * the venue for the bsnd The Sign
 */

function concert(inputs) {

    const bandUrl = "https://rest.bandsintown.com/artists/" + inputs + "/events?app_id=codingbootcamp"
    if (!inputs) {
        inputs = 'The Sign';
    }
    request(bandUrl, function (error, response, body) {

        if (!error && response.statusCode === 200) {

            var event = JSON.parse(body);
            for (i = 0; i < event.length; i++) {
                var dTime = event[i].datetime;
                var month = dTime.substring(5, 7);
                var year = dTime.substring(0, 4);
                var day = dTime.substring(8, 10);
                var dateFormat = (month + "/" + day + "/" + year);
                console.log("Venue Name: " + event[i].venue.name);
                console.log("City: " + event[i].venue.city);
                console.log("Date: " + dateFormat);

            }
        }
    })
}

/**
 * spotify
 * the input is manully input, so it will show you 
 * the song information for I Want It That Way by The Backstreet Boys
 */

function spotify(inputs) {

    const spotify = new Spotify(keys.spotify);
    if (!inputs) {
        inputs = 'I Want It That Way';
    }
    spotify.search({
        type: 'track',
        query: inputs
    }, function (err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }

        const songInfo = data.tracks.items;
        console.log("Artist(s): " + songInfo[0].artists[0].name);
        console.log("Song Name: " + songInfo[0].name);
        console.log("Preview Link: " + songInfo[0].preview_url);
        console.log("Album: " + songInfo[0].album.name);
    });
}

/**
 * ombd movie reviews
 * the input is manully input, so it will show you 
 * title, release year, ratings, country, language, plot, and actors
 */
function movie(inputs) {

    const queryUrl = "http://www.omdbapi.com/?t=" + inputs + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function (error, response, body) {
        if (!inputs) {
            inputs = 'Mr. Nobody';
        }
        if (!error && response.statusCode === 200) {

            console.log("Title: " + JSON.parse(body).Title);
            console.log("Release Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1]);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
        }
    });
};

function whatItSays() {
    fs.readFile('random.txt', "utf8", function (error, data) {

        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(",");

        if (dataArr[0] === "spotify-this-song") {
            var songcheck = dataArr[1].slice(1, -1);
            spotify(songcheck);
        } else if (dataArr[0] === "concert-this") {
            if (dataArr[1].charAt(1) === "") {
                var dLength = dataArr[1].length - 1;
                var data = dataArr[1].substring(2, dLength);
                console.log(data);
                concert(data);
            } else {
                var bandName = dataArr[1].trim();
                console.log(bandName);
                concert(bandName);
            }
        } else if (dataArr[0] === "movie-this") {
            var movie_name = dataArr[1].slice(1, -1);
            movie(movie_name);
        }
    });
}
// calling functions

// concert();
// movie();
// whatItSays();
