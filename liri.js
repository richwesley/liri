//Javascript File

// == Required Packages and Modules ==

const fs = require ('fs');
const keys = require('./keys.js');

const Twitter = require ('twitter');
const Spotify = require ('node-spotify-api');
const request = require ('request');
const inquirer = require ('inquirer');

//Input function

inquirer.prompt([
  {
    type: "list",
    name: "userChoice",
    message: "What would you like to do?",
    choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"]
  },
  {
    type: "input",
    name: "media",
    message: "Input your song or movie choice (or <enter>)",
    default: "default"
  }

]).then(function(response) {
 
  var command = response.userChoice;
  var media = response.media;
  console.log (command, media);

switch (command) {
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
    console.log(command + " Is not a valid command");    
};

})

// == Twitter function ==

function tweetCmd () {
  
  var twitter = new Twitter (keys.twitterKeys);
  var twittName = {screen_name: "OreoCookieJar"};

  twitter.get('statuses/user_timeline', twittName, function(error, tweets, response) {
		if (!error) {
			for (i = 0; i < tweets.length; i++) {

        console.log('\n');                             //modified for loop from 20 to length of my 
				console.log(tweets[i].text);                   // Twitter timeline so app doesn't crash !!!
				console.log(tweets[i].user.created_at);

        fs.appendFile("logFile", '\n' + tweets[i].text), function (err) {
          if (err) {
            return console.log (err)
          };
        };		
			}
		} else {console.log(error)}
	})
}

//==OMDB function ==

function movieCmd () {

  if (media  === "default") {
    media = 'Honky+Tonk+Freeway'   //Couldn't deal with Mr. Nobody, so subed this great classic!
  }
   
  var queryURL = "http://www.omdbapi.com/?t=" + media + "&y=&plot=short&apikey=40e9cece"
  request(queryURL, function(error, response, body) {
  
    if (!error && response.statusCode === 200) {
      var movieJSON = JSON.parse(body);
      console.log ('\n' + 'Title: ' + movieJSON.Title + '\n' + 'Year: ' + movieJSON.Year + '\n' + 'Rating: ' + movieJSON.imdbRating);
      fs.appendFile('logFile', '\n' + movieJSON.Title  + ' ' + movieJSON.Year), function (err) {
        if (err) {
            return console.log (err)
          }
      }
    } else {
      console.log("Something has gone terribly wrong  "+ err)
    }
  });
};


//== Spotify function

function musicCmd () {

  if (media === "default") {
      media = " Ace of Base The Sign"
  }

  var spotify = new Spotify (keys.spotifykeys);
   
  spotify.search({ type: 'track', query: media }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }  else  {
        var songPick = data.tracks.items[0];
      
      console.log( '\n' + songPick.album.artists[0].name + '\n' + songPick.name + '\n' + songPick.external_urls.spotify);
      fs.appendFile('logFile', '\n' +  songPick.album.artists[0].name + ' ' + songPick.name), function (err) {
        if (err) {
            return console.log (err)
        }
      }
    }
  })
}


//== Random Text function ==

function doitCmd (){
  fs.readFile('random.txt', 'utf8', function (error, data) {
    let doit = [];
    doit = data.split(',');
    command = (doit[0]);
    media = (doit[1]);
     
    musicCmd();
  })
}