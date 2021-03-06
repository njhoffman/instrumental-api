const { login, setupServer } = require('../../utils');

module.exports = function UsersMeE2E(routes) {
  describe('/users/me', () => {
    let app;

    after(function() {
      routes.push('/users/me');
    });

    beforeEach(function() {
      this.timeout(10000);
      return setupServer()
        .then(_app => { app = _app; });
    });

    it('Should return 401 if not authenticated', (done) => {
      request(app)
        .get('/users/me')
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          done();
        });
    });

    it('Should return user information', (done) => {
      login(app)
        .then(headers => {
          request(app)
            .get('/users/me')
            .set(headers)
            .end((err, res) => {
              expect(res.statusCode).to.equal(200);
              expect(res.body.records).to.be.an('array').with.length(1);
              expect(res.body.records[0]).to.be.an('object').that.contains({ email: 'testuser@example.com' });
              done();
            });
        });
    });
  });
};
