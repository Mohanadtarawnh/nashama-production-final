const API_BASE = 'https://v3.football.api-sports.io';
const TEAM_ID = process.env.API_FOOTBALL_TEAM_ID || '632';
const LEAGUE_ID = process.env.API_FOOTBALL_LEAGUE_ID || '1';
const SEASON = process.env.API_FOOTBALL_SEASON || '2026';
const KEY = process.env.API_FOOTBALL_KEY || process.env.APISPORTS_KEY || '';

const fixturesSeed = [
  {id:'J-M20',matchNo:20,home:'Austria',homeAr:'النمسا',away:'Jordan',awayAr:'الأردن',date:'2026-06-17T00:00:00-04:00',amman:'2026-06-17T07:00:00+03:00',venue:'San Francisco Bay Area Stadium',city:'Santa Clara',status:'NS',competition:'FIFA World Cup 2026',group:'J'},
  {id:'J-M44',matchNo:44,home:'Jordan',homeAr:'الأردن',away:'Algeria',awayAr:'الجزائر',date:'2026-06-22T23:00:00-04:00',amman:'2026-06-23T06:00:00+03:00',venue:'San Francisco Bay Area Stadium',city:'Santa Clara',status:'NS',competition:'FIFA World Cup 2026',group:'J'},
  {id:'J-M70',matchNo:70,home:'Jordan',homeAr:'الأردن',away:'Argentina',awayAr:'الأرجنتين',date:'2026-06-27T22:00:00-04:00',amman:'2026-06-28T05:00:00+03:00',venue:'Dallas Stadium',city:'Dallas',status:'NS',competition:'FIFA World Cup 2026',group:'J'}
];

async function callApi(path){
  if(!KEY) return { ok:false, missingKey:true, response:[] };
  const r = await fetch(`${API_BASE}${path}`, { headers: { 'x-apisports-key': KEY }});
  const data = await r.json();
  if(!r.ok) throw new Error(`API ${r.status}: ${JSON.stringify(data).slice(0,200)}`);
  return data;
}
function send(res, status, body){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Cache-Control','s-maxage=20, stale-while-revalidate=60');
  res.status(status).json(body);
}
module.exports = { API_BASE, TEAM_ID, LEAGUE_ID, SEASON, KEY, fixturesSeed, callApi, send };
