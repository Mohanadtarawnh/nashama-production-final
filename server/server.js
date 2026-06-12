const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, '..')));

function wrap(handler){
  return (req,res)=>handler(req,res);
}
app.get('/api/health', wrap(require('../api/health')));
app.get('/api/fixtures', wrap(require('../api/fixtures')));
app.get('/api/live', wrap(require('../api/live')));
app.get('/api/standings', wrap(require('../api/standings')));
app.get('/api/events', wrap(require('../api/events')));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Nashama production server running on http://localhost:${port}`));
