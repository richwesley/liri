//Javascript File

// == Required Packages and Modules ==

const fs = require ('fs');
const keys = require('./keys.js');

const Twitter = require ('twitter');
const Spotify = require ('node-spotify-api');
const request = require ('request');

//==Global Variables ==

var  byYourCommand = process.argv[2];
var paramater = process.argv[3];

//== switch statement ==

switch (byYourCommand) {
    case "my-tweets":
   tweetCmd();
    break;

    case "spotify-this-song":
    musicCmd();
    break;

    case "movie-this":
    movieCmd();
    break;

    case "do-what-it-says":
    doitCmd();
    break;

    default:
    console.log(byYourCommand + " Is not a valid command");
};

// == Twitter function ==

function tweetCmd () {
  console.log ('under construction');
  var twitter = new Twitter (keys.twitterKeys);
  var twittName = {screen_name: "OreoCookieJar"};

  twitter.get('statuses/user_timeline', twittName, function(error, tweets, response) {
		if (!error) {
			for (i = 0; i < tweets.length; i++) {            //modified for loop from 20 to length of my 
				console.log(tweets[i].text);                   // Twitter timeline so app doesn't crash !!!
				console.log(tweets[i].user.created_at);
				console.log(" ");
			}
		} else {console.log(error)}
	})
}

//==OMDB function ==

function movieCmd () {

  if (paramater === undefined) {
    paramater = 'Honky+Tonk+Freeway'   //Couldn't deal with Mr. Nobody, so subed this great classic!
  }
    console.log(paramater);
  var queryURL = "http://www.omdbapi.com/?t=" + paramater + "&y=&plot=short&apikey=40e9cece"
  request(queryURL, function(error, response, body) {
  
    if (!error && response.statusCode === 200) {
      var movieJSON = JSON.parse(body);
      console.log ('Title: ' + movieJSON.Title + '\n' + 'Year: ' + movieJSON.Year + '\n' + 'Rating: ' + movieJSON.imdbRating);
    } else {
      console.log("Something has gone terriblyy wrong  "+ err)
    }
  });
};

//== Spotify function


function musicCmd () {

  if (paramater === undefined) {
      paramater = " Ace of Base The Sign"
  }

  var spotify = new Spotify (keys.spotifykeys);
   
  spotify.search({ type: 'track', query: paramater }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }  else  {
        var songPick = data.tracks.items[0];
      
      console.log(songPick.album.artists[0].name + '\n' + songPick.name + '\n' + songPick.external_urls.spotify);
      }
  })
}

//== Random Text function ==

function doitCmd (){
  fs.readFile('random.txt', 'utf8', function (error, data) {
    let doit = [];
    doit = data.split(',');
    byYourCommand = (doit[0]);
    paramater = (doit[1]);
     
    musicCmd();
  })
}