const { login, setupServer } = require('../../utils');

module.exports = function(routes) {
  describe('/fields/delete', () => {
    let app;

    after(function() {
      routes.push('/fields/delete');
    });

    beforeEach(function() {
      this.timeout(10000);
      return setupServer()
        .then(_app => { app = _app; });
    });

    it('Should return 401 if not authenticated', (done) => {
      request(app)
        .post('/fields/delete')
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          done();
        });
    });

    it('Should delete a field if valid id is submitted', (done) => {
      login(app)
        .then(headers => {
          request(app)
            .get('/admin/list/User/deep')
            .set(headers)
            .then(res => {
              expect(res.statusCode).to.equal(200);
              expect(res.body.records[0])
                .to.be.an('object')
                .that.has.property('customFields')
                .that.is.an('array')
                .with.length(4);
              const customField = res.body.records[0].customFields.pop();
              return request(app)
                .post('/fields/delete')
                .set(headers)
                .send({ id: customField.id });
            })
            .then(res => {
              expect(res.statusCode).to.equal(200);
              expect(res.body).to.be.an('object').that.contains({ deleted: 1 });
              return request(app)
                .get('/admin/list/User/deep')
                .set(headers);
            })
            .then(res => {
              expect(res.statusCode).to.equal(200);
              expect(res.body.records[0])
                .to.be.an('object')
                .that.has.property('customFields')
                .that.is.an('array')
                .with.length(3);
              done();
            })
            .catch(done);
        });
    });

    it('Should not delete a field if an invalid id is submitted', (done) => {
      login(app)
        .then(headers => {
          request(app)
            .post('/fields/delete')
            .set(headers)
            .send({ id: 'BADID' })
            .then(res => {
              expect(res.statusCode).to.equal(200);
              expect(res.body).to.be.an('object').that.contains({ deleted: 0 });
              return request(app)
                .get('/admin/list/User/deep')
                .set(headers);
            })
            .then(res => {
              expect(res.statusCode).to.equal(200);
              expect(res.body.records[0]).to.be.an('object')
                .that.has.property('customFields')
                .that.is.an('array')
                .that.has.length(4);
              done();
            })
            .catch(done);
        });
    });

    it('Should return AuthLockError with code 401 when deleting Field assigned to other user if not admin', (done) => {
      login(app)
        .then(headers => {
          request(app)
            .post('/fields/delete')
            .set(headers)
            .send({ id: '60000000-0000-0000-0000-000000000004' })
            .then(res => {
              expect(res.statusCode).to.equal(401);
              expect(res.body.error).to.be.an('object').that.keys(['name', 'message', 'status']);
              expect(res.body.error.name).to.equal('AuthLockError');
              done();
            })
            .catch(done);
        });
    });

    it('Should not delete a field if an id belonging to another user is submitted with non-admin role', (done) => {
      login(app)
        .then(headers => {
          request(app)
            .post('/fields/delete')
            .set(headers)
            .send({ id: '60000000-0000-0000-0000-000000000004' })
            .then(res => (
              request(app)
                .get('/admin/list/Field')
                .set(headers)
            ))
            .then(res => {
              expect(res.body.records).to.be.an('array').that.has.length(5);
              done();
            })
            .catch(done);
        });
    });
  });
};
