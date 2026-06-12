const { callApi, send } = require('./_shared');
module.exports = async (req,res)=>{
  const fixture = req.query.fixture;
  if(!fixture) return send(res,400,{ok:false,message:'fixture query parameter is required'});
  try{
    const data = await callApi(`/fixtures/events?fixture=${fixture}`);
    if(data.missingKey) return send(res,200,{ok:true,liveSource:'not-configured',data:[]});
    send(res,200,{ok:true,liveSource:'api-football',data:data.response||[]});
  }catch(error){ send(res,500,{ok:false,message:'Events API request failed',error:error.message}); }
};
