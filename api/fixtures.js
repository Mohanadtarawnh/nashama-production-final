const { TEAM_ID, SEASON, LEAGUE_ID, fixturesSeed, callApi, send } = require('./_shared');
module.exports = async (req,res)=>{
  try{
    const data = await callApi(`/fixtures?team=${TEAM_ID}&league=${LEAGUE_ID}&season=${SEASON}`);
    if(data.missingKey) return send(res,200,{ok:true,liveSource:'seed',data:fixturesSeed});
    send(res,200,{ok:true,liveSource:'api-football',data:data.response||[]});
  }catch(error){ send(res,200,{ok:true,liveSource:'seed',warning:error.message,data:fixturesSeed}); }
};
