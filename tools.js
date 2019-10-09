var fs = require('fs');
const axios = require('axios');
var mysql = require('mysql');
var pool  = mysql.createConnection({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : 'root',
    database        : 'hockey'
  });
  
  var teamsId = [1,2,3,4,5,6,7,8,9,10,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,28,29,30,52,53,54];

  var teams = ['New_Jersey', 'New_York_Islanders', 'New_York_Rangers', 'Philadelphia', 'Pittsburgh', 'Boston', 'Buffalo', 'Montreal', 'Ottawa', 'Toronto', 'Carolina', 'Florida', 'Tampa_Bay', 'Washington', 'Chicago', 'Detroit', 'Nashville', 'St_Louis', 'Calgary', 'Colorado', 'Edmonton', 'Vancouver', 'Anaheim', 'Dallas', 'Los_Angeles', 'San_Jose', 'Colombus', 'Minnesota', 'Winnipeg', 'Arizona', 'Vegas'];



module.exports = {
    dbQuery: function() {

        pool.query('SELECT * FROM players;', function (error, results, fields) {
          if (error) throw error;
          console.log(results);
        });
        
    }, deleteData: function() {
        
        fs.unlink('data.txt', function (err) {
            if (err) throw err;
            console.log('File deleted!');
        });
    }, updateFile: function(teamId) {
        
        
        link = `https://statsapi.web.nhl.com/api/v1/teams/${teamId}/roster`;
        
        axios.get(link)
        .then((response) => {

        for (i = 0; i < 24; i++) {
            fs.appendFile('data.txt', `${response.data.roster[i].person.id} - ${response.data.roster[i].person.fullName}\n`, function (err) {
                if (err) throw err;
            });

        }
        console.log("Data updated");
        });
    }, updateTeamDb: function(i) {

        link = `https://statsapi.web.nhl.com/api/v1/teams/${teamsId[i]}/roster`;

        axios.get(link)
        .then((response) => {
          
          
          pool.query(`CREATE TABLE IF NOT EXISTS ${teams[i]}(id int, name varchar(100));`, function (error, results, fields) {
            if (error) throw error;
            console.log(results);
          });

        nbPlayers = response.data.roster.length;

        for (j=0; j<nbPlayers; j++) {

            if (response.data.roster[9].person.fullName == "Ryan O'Reilly") {
              response.data.roster[9].person.fullName = "Ryan O''Reilly";  
           }

           if (response.data.roster[response.data.roster.length-1].person.fullName == "Joel L'Esperance") {
            response.data.roster[response.data.roster.length-1].person.fullName = "Joel L''Esperance"
          } 
              pool.query(`INSERT INTO ${teams[i]} VALUES('${response.data.roster[j].person.id}', '${response.data.roster[j].person.fullName}');`, function (error, results, fields) {
                if (error) throw error;
                //console.log(results);
              });

          }

        });
      
    }, deleteDb: function() {

      teams = ['New_Jersey', 'New_York_Islanders', 'New_York_Rangers', 'Philadelphia', 'Pittsburgh', 'Boston', 'Buffalo', 'Montreal', 'Ottawa', 'Toronto', 'Carolina', 'Florida', 'Tampa_Bay', 'Washington', 'Chicago', 'Detroit', 'Nashville', 'St_Louis', 'Calgary', 'Colorado', 'Edmonton', 'Vancouver', 'Anaheim', 'Dallas', 'Los_Angeles', 'San_Jose', 'Colombus', 'Minnesota', 'Winnipeg', 'Arizona', 'Vegas'];

      for (i = 0; i<31; i++) {

      pool.query(`DROP TABLE IF EXISTS ${teams[i]};`, function (error, results, fields) {
        if (error) throw error;
        console.log(results);
      });

      }
      
    }, getPlayerStats: function(id) {
      link = `https://statsapi.web.nhl.com/api/v1/people/${id}/stats?stats=statsSingleSeason&season=20192020`;

      games = 0;
      goals = 0;
      assists = 0;

      axios.get(link)
        .then((response) => {


          if(typeof response.data.stats[0].splits[0] == "undefined") {
            console.log("UNDEFINED");
          } else {

          games = response.data.stats[0].splits[0].stat.games;
          goals = response.data.stats[0].splits[0].stat.goals;
          assists = response.data.stats[0].splits[0].stat.assists;

          }

          console.log("Games Played: " + games)
          console.log("GOALS: " + goals);
          console.log("Assists: " + assists);

        });

    }, playerSkeleton: function() {
       /*
        playerLink = `https://statsapi.web.nhl.com/api/v1/people/${response.data.roster[j].person.id}/stats?stats=statsSingleSeason&season=20192020`;

        axios.get(playerLink)
        .then((response) => {
         
        }); 

        */

        /*
         if(typeof response.data.stats[0].splits[0] != "undefined") {
           
          console.log("Games Played: " + response.data.stats[0].splits[0].stat.games)
          console.log("GOALS: " + response.data.stats[0].splits[0].stat.goals);
          console.log("Assists: " + response.data.stats[0].splits[0].stat.assists);
        }
        */

        
    }, /*playersInDb: function() {

      var arr = [];

      pool.query(`SELECT NAME FROM Montreal;`, function (error, results, fields) {
        if (error) throw error;
        //console.log(results);
        var js = JSON.stringify(results);
        console.log(js);

        fs.appendFile('playersDB.json',js, function(err) {
          if (err) throw err;
        });

      }); 
      }*/
};