const Express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const app = Express();
const PORT = process.env.PORT || 3000;

require('dotenv').config();

const clients = require('restify-clients');
const taxis = require('./taxis.json');

const TRNSPRT_API = 'https://transportapi.com/';
const GOOGLE_API = 'https://maps.googleapis.com/';
const TRNSPRT_PARAMS = `?app_id=${process.env.TRANSPORT_API_ID}&app_key=${process.env.TRANSPORT_API_KEY}`;

const GEOCODING_PARAMS = `/maps/api/geocode/json?key=${process.env.GOOGLE_MAPS_KEY}&address=`;

const TransportClient = clients.createJsonClient({
  url: TRNSPRT_API
});

const GoogleClient = clients.createJsonClient({
  url: GOOGLE_API
});

const getPlacesParam = (type, query) => (
  // eslint-disable-next-line
  `/maps/api/place/autocomplete/json?key=${process.env.GOOGLE_MAPS_KEY}&types=${type}&input=${type === 'address' ? 'uk, norwich ' : 'uk, '}${query}`
);

app.use(helmet());
app.use(morgan('combined'));

app.get('/autocomplete/:type/:searchTerms', (req, res, next) => {
  const type = req.params.type === 'bus' ? 'address' : '(cities)';
  const url = encodeURI(getPlacesParam(type, req.params.searchTerms));
  GoogleClient.get(url, (err, req, resp, obj) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: err });
    } else {
      res.json(obj);
    }
  });
});

app.get('/geocode/:address', (req, res, next) => {
  const address = req.params.address;
  const url = encodeURI(GEOCODING_PARAMS + address);
  GoogleClient.get(url, (err, req, resp, obj) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: err });
    } else {
      const results = obj.results.map(e => e.geometry.location).shift();
      res.json(results);
    }
  });
});

app.get('/bus/near/:lat/:lng', (req, res, next) => {
  const callback = (results) => {
    res.json(results);
  };
  nearBus(callback, req.params.lat, req.params.lng);
});

app.get('/train/near/:lat/:lng', (req, res, next) => {
  const callback = (results) => {
    res.json(results);
  };
  nearTrain(callback, req.params.lat, req.params.lng);
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
    res.json(results);
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

app.get('/taxis/', (req, res, next) => {
  res.json(taxis);
});

const getTrain = (cb, station, date, time) => {
  const dateTime = getCurrentDateTime();
  if (date === undefined) {
    date = dateTime[0];
  }
  if (time === undefined) {
    time = dateTime[1];
  }

  const url = `/v3/uk/train/station/${station}/${date}/${time}/timetable.json${TRNSPRT_PARAMS}`;
  TransportClient.get(url, (err, req, res, obj) => {
    if (err) {
      console.log(err);
    }
    const results = flatMapTransportResults(obj);
    cb(results);
  });
};

const nearBus = (cb, lat, lon) => {
  const url = '/v3/uk/bus/stops/near.json' + TRNSPRT_PARAMS + '&lat=' + lat + '&lon=' + lon + '&rpp=10';
  console.log(url);
  TransportClient.get(url, (err, req, res, obj) => {
    if (err) {
      console.log(err);
    }
    cb(obj);
  });
};

const nearTrain = (cb, lat, lon) => {
  const url = '/v3/uk/train/stations/near.json' + TRNSPRT_PARAMS + '&lat=' + lat + '&lon=' + lon + '&rpp=25';
  console.log(url);
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
    const results = flatMapTransportResults(obj);
    cb(results);
  });
};

const getLiveBus = (cb, station) => {
  const url = '/v3/uk/bus/stop/' + station + '/live.json' + TRNSPRT_PARAMS;
  TransportClient.get(url, (err, req, res, obj) => {
    if (err) {
      console.log(err);
    }
    const results = flatMapTransportResults(obj);
    cb(results);
  });
};

const getCurrentDateTime = () => {
  const dateTime = new Date().toISOString().split('T');
  dateTime[1] = dateTime[1].substring(0, 5);
  return dateTime;
};

const flatMapTransportResults = (results) => {
  if (results.departures) {
    const list = Object.entries(results.departures)
      .map(([key, value]) => value)
      .reduce((acc, cur) => acc.concat(cur), []);
    list.sort((a, b) => {
      return a.aimed_departure_time.localeCompare(b.aimed_departure_time);
    });
    return list;
  } else {
    return [];
  }
};

console.log('listening on port : ', PORT);
app.listen(PORT);

module.exports = { app, getTrain, getBus, getLiveBus, getCurrentDateTime };
