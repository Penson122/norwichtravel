const Express = require('express');
const app = Express();
const PORT = process.env.PORT || 3000;

require('dotenv').config();

const clients = require('restify-clients');

const TRNSPRT_API = 'https://transportapi.com/';
const GOOGLE_API = 'https://maps.googleapis.com/';
const TRNSPRT_PARAMS = '?app_id=' +
  process.env.TRANSPORT_API_ID + '&app_key=' + process.env.TRANSPORT_API_KEY + '&train_status=passenger';

const PLACES_PARAMS = '/maps/api/place/autocomplete/json?key=' +
  process.env.GOOGLE_MAPS_KEY + '&types=geocode&input=norwich ,';

const TransportClient = clients.createJsonClient({
  url: TRNSPRT_API
});

const GoogleClient = clients.createJsonClient({
  url: GOOGLE_API
});

app.get('/autocomplete/:searchTerms', (req, res, next) => {
  const url = encodeURI(PLACES_PARAMS + req.params.searchTerms);
  console.log(url);
  GoogleClient.get(url, (err, req, resp, obj) => {
    if (err) {
      console.error(err);
    }
    res.json(obj);
  });
});

app.get('/train/:station', (req, res, next) => {
  const callback = (results) => {
    res.json(results);
  };
  getTrain(callback, req.params.station);
});

app.get('/train/:station/:date', (req, res, next) => {
  const callback = (results) => {
    res.json(results);
  };
  getTrain(callback, req.params.station, req.params.date);
});

app.get('/train/:station/:date/:time', (req, res, next) => {
  const callback = (results) => {
    res.json(results);
  };
  getTrain(callback, req.params.station, req.params.date, req.params.time);
});

app.get('/bus/live/:station', (req, res, next) => {
  const callback = (results) => {
    res.json({ results: results });
  };
  getLiveBus(callback, req.params.station);
});

app.get('/bus/:station', (req, res, next) => {
  const callback = (results) => {
    res.json(results);
  };
  getBus(callback, req.params.station);
});

app.get('/bus/:station/:date', (req, res, next) => {
  const callback = (results) => {
    res.json(results);
  };
  getBus(callback, req.params.station, req.params.date);
});

app.get('/bus/:station/:date/:time', (req, res, next) => {
  const callback = (results) => {
    res.json(results);
  };
  getBus(callback, req.params.station, req.params.date, req.params.time);
});

const getTrain = (cb, station, date, time) => {
  const dateTime = getCurrentDateTime();
  if (date === undefined) {
    date = dateTime[0];
  }
  if (time === undefined) {
    time = dateTime[1];
  }

  const url = '/v3/uk/train/station/' + station + '/' + date + '/' + time + '/timetable.json' + TRNSPRT_PARAMS;
  TransportClient.get(url, (err, req, res, obj) => {
    if (err) {
      console.log(err);
    }
    cb(obj);
  });
};

const getBus = (cb, station, date, time) => {
  const dateTime = getCurrentDateTime();
  if (date === undefined) {
    date = dateTime[0];
  }
  if (time === undefined) {
    time = dateTime[1];
  }

  const url = '/v3/uk/bus/stop/' + station + '/' + date + '/' + time + '/timetable.json' + TRNSPRT_PARAMS;
  TransportClient.get(url, (err, req, res, obj) => {
    if (err) {
      console.log(err);
    }
    cb(obj);
  });
};

const getLiveBus = (cb, station) => {
  const url = '/v3/uk/bus/stop/' + station + '/live.json' + TRNSPRT_PARAMS;
  TransportClient.get(url, (err, req, res, obj) => {
    if (err) {
      console.log(err);
    }
    cb(obj);
  });
};

const getCurrentDateTime = () => {
  const dateTime = new Date().toISOString().split('T');
  dateTime[1] = dateTime[1].substring(0, 5);
  return dateTime;
};

console.log('listening on port : ', PORT);
app.listen(PORT);

module.exports = { app, getTrain, getBus, getLiveBus, getCurrentDateTime };
