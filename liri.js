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

// function concert(inputs) {

//     var bandUrl = "https://rest.bandsintown.com/artists/" + inputs + "/events?app_id=codingbootcamp"
// if (!inputs){
//     inputs = 'The Sign';
// }
// request(queryUrl, function (error, response, body) {

//     if (!error && response.statusCode === 200) {

//         var JS = JSON.parse(body);
//         for (i = 0; i < JS.length; i++) {
//             var dTime = JS[i].datetime;
//             var month = dTime.substring(5, 7);
//             var year = dTime.substring(0, 4);
//             var day = dTime.substring(8, 10);
//             var dateFormat = (month + "/" + day + "/" + year);
//             // console.log("Venue Name: " + JS[i].venue.name);
//             // console.log("Location: "JS[i].venue.city);
//             // console.log("Date: " + dateFormat);

//             // }
//         }
//     }
// })

function spotify(inputs) {

    var spotify = new Spotify(keys.spotifyKeys);
    if (!inputs) {
        inputs = 'Fractures';
    }
    spotify.search({
        type: 'track',
        query: inputs
    }, function (err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }
        console.log(data);

        // var songInfo = data.tracks.items;
        // console.log("Artist(s): " + songInfo[0].artists[0].name);
        // console.log("Song Name: " + songInfo[0].name);
        // console.log("Preview Link: " + songInfo[0].preview_url);
        // console.log("Album: " + songInfo[0].album.name);
    });
    var songInfo = data.tracks.items;
    console.log("Artist(s): " + songInfo[0].artists[0].name);
    console.log("Song Name: " + songInfo[0].name);
    console.log("Preview Link: " + songInfo[0].preview_url);
    console.log("Album: " + songInfo[0].album.name);
}
spotify();


// function movie(inputs) {

//     var queryUrl = "http://www.omdbapi.com/?t=" + inputs + "&y=&plot=short&apikey=d5be8b20";

//     request(queryUrl, function (error, response, body) {
//         if (!inputs) {
//             inputs = 'Mr Nobody';
//         }
//         if (!error && response.statusCode === 200) {

//             console.log("Title: " + JSON.parse(body).Title);
//             console.log("Release Year: " + JSON.parse(body).Year);
//             console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
//             console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
//             console.log("Country: " + JSON.parse(body).Country);
//             console.log("Language: " + JSON.parse(body).Language);
//             console.log("Plot: " + JSON.parse(body).Plot);
//             console.log("Actors: " + JSON.parse(body).Actors);
//         }
//     });
// };

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
            if (dataArr[1].charAt(1) === "'") {
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
switchCase()