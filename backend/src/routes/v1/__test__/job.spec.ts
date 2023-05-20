import request from 'supertest';

import { app } from '../../../app';

describe('Job routes', () => {
  describe('GET /v1/jobs', () => {
    it('Should retrive paginated jobs and pagination info', async () => {
      const res = await request(app).get('/v1/jobs').expect(200);
      expect(res.body.pagination).toBeDefined();
      expect(Array.isArray(res.body.jobs)).toBe(true);
    });
  });

  describe('POST /v1/jobs', () => {
    it('Should post a job when given valid data', async () => {
      const token = await global.signin('jobify@company.com');
      const title = 'React developer';
      const res = await request(app)
        .post('/v1/jobs')
        .send({
          title,
          description: 'We need an experienced react developer asap',
          type: 'Full-time',
          location: 'Remote',
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(201);

      expect(res.body.title).toEqual(title);
      expect(res.body.location).toEqual('Remote');
    });

    it('Should return 401 if user is not logged in', async () => {
      const title = 'React developer';
      await request(app)
        .post('/v1/jobs')
        .send({
          title,
        })
        .expect(401);
    });

    it('Should return 401 if user is not an employer', async () => {
      const token = await global.signin('bassel@test.com');
      const title = 'React developer';
      await request(app)
        .post('/v1/jobs')
        .send({
          title,
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(401);
    });

    it('Should return 422 with missing data', async () => {
      const token = await global.signin('jobify@company.com');
      const title = 'React developer';
      await request(app)
        .post('/v1/jobs')
        .send({
          title,
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(422);
    });
  });

  describe('GET /v1/jobs/:id', () => {
    it('Should retrive job data', async () => {
      await request(app).get('/v1/jobs/1').expect(200);
    });

    it("Should return 404 when job isn't found", async () => {
      await request(app).get('/v1/jobs/0951').expect(404);
    });
  });

  describe('PATCH /v1/jobs/:id', () => {
    it('Should update job data', async () => {
      const token = await global.signin('jobify@company.com');
      const res = await request(app)
        .patch('/v1/jobs/1')
        .send({ title: 'Cloud Architect' })
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.title).toEqual('Cloud Architect');
    });

    it('Should return 401 if user is not logged in', async () => {
      await request(app).patch('/v1/jobs/1').expect(401);
    });

    it('Should return 401 if user is not an employer', async () => {
      const token = await global.signin('bassel@test.com');
      await request(app).patch('/v1/jobs/1').set('Authorization', `Bearer ${token}`).expect(401);
    });

    it("Should return 404 when job isn't found", async () => {
      const token = await global.signin('jobify@company.com');
      await request(app)
        .patch('/v1/jobs/0951')
        .send({ title: 'Cloud Architect' })
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });

    it('Should return 422 when given no parameters', async () => {
      const token = await global.signin('jobify@company.com');
      await request(app).patch('/v1/jobs/1').set('Authorization', `Bearer ${token}`).expect(422);
    });
  });

  describe('DELETE /v1/jobs/:id', () => {
    it('Should delete a job post', async () => {
      const token = await global.signin('jobify@company.com');
      await request(app).delete('/v1/jobs/1').set('Authorization', `Bearer ${token}`).expect(200);
    });

    it('Should return 401 if user is not logged in', async () => {
      await request(app).delete('/v1/jobs/1').expect(401);
    });

    it('Should return 401 if user is not an employer', async () => {
      const token = await global.signin('bassel@test.com');
      await request(app).delete('/v1/jobs/1').set('Authorization', `Bearer ${token}`).expect(401);
    });

    it("Should return 404 when job isn't found", async () => {
      const token = await global.signin('jobify@company.com');
      await request(app).delete('/v1/jobs/0951').set('Authorization', `Bearer ${token}`).expect(404);
    });
  });
});
