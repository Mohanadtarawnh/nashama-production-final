const { LEAGUE_ID, SEASON, callApi, send } = require('./_shared');
module.exports = async (req,res)=>{
  try{
    const data = await callApi(`/standings?league=${LEAGUE_ID}&season=${SEASON}`);
    if(data.missingKey) return send(res,200,{ok:true,liveSource:'not-configured',data:[]});
    send(res,200,{ok:true,liveSource:'api-football',data:data.response||[]});
  }catch(error){ send(res,500,{ok:false,message:'Standings API request failed',error:error.message}); }
};
