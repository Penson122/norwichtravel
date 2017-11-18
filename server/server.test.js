process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./server');
const app = server.app;
const should = chai.should();

chai.use(chaiHttp);

describe('Utils', () => {
  it('Current date and time', () => {
    const getCurrentDateTime = server.getCurrentDateTime;
    const dateTime = getCurrentDateTime();
    dateTime.should.be.an('array');
    dateTime.should.have.length(2);
  });
});

describe('Train', () => {
  it('Should be able to get timetable for a station', (done) => {
    chai.request(app).get('/train/NRW').end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.an('object');
      res.body.should.have.all.keys(['date','time_of_day','request_time','station_name','station_code','departures']);
      done();
    });
  });
  it('Should be able to request with current date', (done) => {
    const dateTime = server.getCurrentDateTime();
    chai.request(app).get('/train/NRW/' + dateTime[0]).end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.an('object');
      res.body.should.have.all.keys(['date','time_of_day','request_time','station_name','station_code','departures']);
      res.body.date.should.equal(dateTime[0]);
      done();
    });
  });
  it('Should be able to request with date and time', (done) => {
    const dateTime = server.getCurrentDateTime();
    chai.request(app).get('/train/NRW/' + dateTime[0] + '/' + dateTime[1]).end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.an('object');
      res.body.should.have.all.keys(['date','time_of_day','request_time','station_name','station_code','departures']);
      res.body.date.should.equal(dateTime[0]);
      res.body.time_of_day.should.equal(dateTime[1]);
      done();
    });
  });
});

describe('Bus', () => {
  it('Should be able to get timetable for a station', (done) => {
    chai.request(app).get('/bus/490000077E').end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.an('object');
      res.body.should.have.all.keys(['atcocode','smscode','request_time','bearing','indicator','name','locality','stop_name','departures']);
      done();
    });
  });
  it('Should be able to request with current date', (done) => {
    const dateTime = server.getCurrentDateTime();
    chai.request(app).get('/bus/490000077E/' + dateTime[0]).end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.an('object');
      res.body.should.have.all.keys(['atcocode','smscode','request_time','bearing','indicator','name','locality','stop_name','departures']);
      done();
    });
  });
  it('Should be able to request with date and time', (done) => {
    const dateTime = server.getCurrentDateTime();
    chai.request(app).get('/bus/490000077E/' + dateTime[0] + '/' + dateTime[1]).end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.an('object');
      res.body.should.have.all.keys(['atcocode','smscode','request_time','bearing','indicator','name','locality','stop_name','departures']);
      done();
    });
  });
  it('Should be able to get live departures', () => {
    chai.request(app).get('/bus/live/490000077E').end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.an('object');
      res.body.should.have.all.keys(['atcocode','smscode','request_time','bearing','indicator','name','locality','stop_name','departures']);
      done();
    });
  });
});
