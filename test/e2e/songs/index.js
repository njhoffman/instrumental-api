const { login, setupServer } = require('../../utils');

module.exports = function SongsIndexE2E(routes) {
  describe('/songs', () => {
    let app;

    after(function() {
      routes.push('/songs');
    });

    beforeEach(function() {
      this.timeout(10000);
      return setupServer()
        .then(_app => { app = _app; });
    });

    it('Should return 401 if not authenticated', (done) => {
      request(app)
        .get('/songs')
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          done();
        });
    });

    it('Should return songs if authenticated', (done) => {
      login(app)
        .then(headers => {
          request(app)
            .get('/songs')
            .set(headers)
            .then(res => {
              expect(res.statusCode).to.equal(200);
              expect(res.body).to.be.an('object')
                .that.has.property('data')
                .that.is.an('object')
                .that.is.an('object');
              expect(res.body.data)
                .to.have.property('songs')
                .that.is.an('array')
                .that.has.length(16);
              done();
            })
            .catch(done);
        });
    });

    it('Should return records from linked foreign tables', (done) => {
      login(app)
        .then(headers => {
          request(app)
            .get('/songs')
            .set(headers)
            .then(res => {
              // TODO: write utility functions to get seed data for assertions
              expect(res.statusCode).to.equal(200);
              expect(res.body.data)
                .to.have.property('fields')
                .that.is.an('array')
                .that.has.length(4);
              expect(res.body.data)
                .to.have.property('instruments')
                .that.is.an('array')
                .that.has.length(4);
              expect(res.body.data)
                .to.have.property('genres')
                .that.is.an('array')
                .that.has.length(4);
              expect(res.body.data)
                .to.have.property('artists')
                .that.is.an('array')
                .that.has.length(29);
              done();
            })
            .catch(done);
        });
    });
  });
};
