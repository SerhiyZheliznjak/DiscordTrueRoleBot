'use strict';

// Never more than 1 request running at a time.
// Wait at least 1000ms between each request.
const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1000
});

const limitedGet = limiter.wrap(axios.get);

async function request(url) {
  try {
    const response = await limitedGet(url);
    return response.data;
  } catch (error) {
    console.log(error.message);
  }
}

let getPlayer = async function(id) {
  return await request(util.format('https://api.opendota.com/api/players/%s/', id));
};

let getLastMatchForPlayer = async function(playerId) {
  return await request(util.format('https://api.opendota.com/api/players/%s/matches?limit=1', playerId));
};

let getFullMatchDetails = async function(matchId) {
  return await request(util.format('https://api.opendota.com/api/matches/%s', matchId));
};

module.exports = {
  getPlayer: getPlayer,
  getLastMatchForPlayer: getLastMatchForPlayer,
  getFullMatchDetails: getFullMatchDetails
};