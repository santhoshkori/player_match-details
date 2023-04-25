const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const app = express();
app.use(express.json());
const main_path = path.join(__dirname, "cricketMatchDetails.db");
let cricketdbserver = null;
const connect_cricketMatchDetailsDB = async () => {
  try {
    cricketdbserver = await open({
      filename: main_path,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server running at 3000");
    });
  } catch (e) {
    console.log(`error ${e.message}`);
    process.exit(1);
  }
};
connect_cricketMatchDetailsDB();
//1-->Returns a list of all the players in the player table
const change_player_lab = (every_player) => {
  return {
    playerId: every_player.player_id,
    playerName: every_player.player_name,
  };
};
app.get("/players/", async (request, response) => {
  const get_players_query = `
  SELECT
  *
  FROM
  player_details;
  `;
  const get_players = await cricketdbserver.all(get_players_query);
  response.send(
    get_players.map((eve_play) => {
      return change_player_lab(eve_play);
    })
  );
});

//2-->Returns a specific player based on the player ID
app.get("/players/:playerId/", async (request, response) => {
  let { playerId } = request.params;
  //console.log(playerId);
  const unq_query_ply = `
  SELECT
  *
  FROM
  player_details
  WHERE
  player_id=${playerId};
  `;
  const unq_player = await cricketdbserver.all(unq_query_ply);
  const output1 = unq_player.map((unqply) => {
    return change_player_lab(unqply);
  });
  response.send(output1[0]);
});

//3-->Updates the details of a specific player based on the player ID/players/:playerId/
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  //console.log(playerId);
  const { playerName } = request.body;
  //console.log(playerName);
  let put_query = `
  UPDATE
  player_details 
  SET
  player_name='${playerName}'
  WHERE
  player_id=${playerId};
  `;
  let put_player_name = await cricketdbserver.run(put_query);
  let last = put_player_name.lastID;
  response.send("Player Details Updated");
});

//4-->Returns the match details of a specific match
let change_match_label = (everymath) => {
  return {
    matchId: everymath.match_id,
    match: everymath.match,
    year: everymath.year,
  };
};
app.get("/matches/:matchId/", async (request, response) => {
  let { matchId } = request.params;
  console.log(matchId);
  let unq_mt_query = `
  SELECT
  *
  FROM
  match_details
  WHERE
  match_id=${matchId};
  `;
  const unq_match = await cricketdbserver.all(unq_mt_query);
  const output2 = unq_match.map((everymth) => {
    return change_match_label(everymth);
  });
  response.send(output2[0]);
});

//5-->/players/:playerId/matches

app.get("/players/:playerId/matches", (request, response) => {
  let { playerId } = request.params;
  console.log(playerId);
});
