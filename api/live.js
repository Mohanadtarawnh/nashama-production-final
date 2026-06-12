const { TEAM_ID, SEASON, LEAGUE_ID, callApi, send } = require('./_shared');
module.exports = async (req,res)=>{
  try{
    const data = await callApi(`/fixtures?team=${TEAM_ID}&league=${LEAGUE_ID}&season=${SEASON}&live=all`);
    if(data.missingKey) return send(res,200,{ok:true,liveSource:'not-configured',data:[]});
    send(res,200,{ok:true,liveSource:'api-football',data:data.response||[]});
  }catch(error){ send(res,500,{ok:false,message:'Live API request failed',error:error.message}); }
};
