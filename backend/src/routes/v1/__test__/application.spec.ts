import request from 'supertest';
import { app } from '../../../app';

describe('Application routes', () => {
  describe('GET /v1/jobs/:id/applications', () => {
    it('Should return applications of a job when requested by employer who posted the job', async () => {
      const token = await global.signin('jobify@company.com');
      const res = await request(app).get('/v1/jobs/3/applications').set('Authorization', `Bearer ${token}`).expect(200);
      expect(res.body.pagination).toBeDefined();
      expect(Array.isArray(res.body.applications)).toBe(true);
    });

    it('Should respond with 401 if user is not logged in or not an employer', async () => {
      const token = await global.signin('bassel@test.com');
      await request(app).get('/v1/jobs/3/applications').expect(401);
      await request(app).get('/v1/jobs/3/applications').set('Authorization', `Bearer ${token}`).expect(401);
    });

    it('Should return 401 if employer is not the job poster', async () => {
      const token = await global.signin('jobify@company.com');
      await request(app).get('/v1/jobs/2/applications').set('Authorization', `Bearer ${token}`).expect(401);
    });
  });

  describe('GET /v1/users/applications', () => {
    it('Should all applications submitted by current user', async () => {
      const token = await global.signin('bassel@test.com');
      const res = await request(app).get('/v1/users/applications').set('Authorization', `Bearer ${token}`).expect(200);
      expect(res.body.pagination).toBeDefined();
      expect(Array.isArray(res.body.applications)).toBe(true);
    });

    it('Should respond with 401 if not logged in or an employer', async () => {
      const token = await global.signin('jobify@company.com');
      await request(app).get('/v1/users/applications').expect(401);
      await request(app).get('/v1/users/applications').set('Authorization', `Bearer ${token}`).expect(401);
    });
  });

  describe('GET /v1/applications/:id', () => {
    it('Should return application info, when requested by the applicatnt or job employer', async () => {
      const token = await global.signin('bassel@test.com');
      const res = await request(app).get('/v1/applications/1').set('Authorization', `Bearer ${token}`).expect(200);

      expect(res.body.status).toEqual('submitted');
      const employerToken = await global.signin('jobify@company.com');
      await request(app).get('/v1/applications/1').set('Authorization', `Bearer ${employerToken}`).expect(200);
    });

    it('Should respond with 401 if not logged in', async () => {
      await request(app).get('/v1/applications/2').expect(401);
    });

    it('Should respond with 404 if user is not the applicant or the job employer', async () => {
      const token = await global.signin('bassel@test.com');
      await request(app).get('/v1/applications/2').set('Authorization', `Bearer ${token}`).expect(404);

      const employerToken = await global.signin('jobify@company.com');
      await request(app).get('/v1/applications/2').set('Authorization', `Bearer ${employerToken}`).expect(404);
    });

    it('Should return 404 if application is not found', async () => {
      const token = await global.signin('bassel@test.com');
      await request(app).get('/v1/applications/19').set('Authorization', `Bearer ${token}`).expect(404);
    });
  });

  describe('POST /v1/applications', () => {
    it('Should submit application when given valid data', async () => {
      const token = await global.signin('bassel@test.com');
      const res = await request(app)
        .post('/v1/applications')
        .field('job_id', '1')
        .field('cv', 'Bonzo wonzo cv')
        .set('Authorization', `Bearer ${token}`)
        .expect(201);

      expect(res.body.status).toEqual('submitted');
    });

    it('Should respond with 400 when user try to apply for the same job more than once', async () => {
      const token = await global.signin('bassel@test.com');
      await request(app)
        .post('/v1/applications')
        .send({ job_id: 3, cv: 'Bonzo cv' })
        .set('Authorization', `Bearer ${token}`)
        .expect(400);
    });

    it('Should respond with 401 if not logged in or an employer', async () => {
      const token = await global.signin('jobify@company.com');
      await request(app).post('/v1/applications').expect(401);
      await request(app).post('/v1/applications').set('Authorization', `Bearer ${token}`).expect(401);
    });

    it("Should responds with 404, if the job user applying for doesn't exists", async () => {
      const token = await global.signin('bassel@test.com');
      await request(app)
        .post('/v1/applications')
        .field('job_id', '4')
        .field('cv', 'Bonzo wonzo cv')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });

    it('Should return 422, when data is missing', async () => {
      const token = await global.signin('bassel@test.com');
      await request(app)
        .post('/v1/applications')
        .field('job_id', '4')
        .set('Authorization', `Bearer ${token}`)
        .expect(422);
    });
  });

  describe('PATCH /v1/applications/:id', () => {
    it('Should submit application when given valid data', async () => {
      const token = await global.signin('bassel@test.com');
      const cv = 'Bonzo wonzo edited';
      const res = await request(app)
        .patch('/v1/applications/1')
        .field('cv', cv)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.cv).toEqual(cv);
    });

    it('Should respond with 401 if not logged in or an employer', async () => {
      const token = await global.signin('jobify@company.com');
      await request(app).patch('/v1/applications/1').expect(401);
      await request(app).patch('/v1/applications/1').set('Authorization', `Bearer ${token}`).expect(401);
    });

    it('Should return 404 if application is not found', async () => {
      const token = await global.signin('bassel@test.com');
      await request(app)
        .patch('/v1/applications/920')
        .field('cv', 'update')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });

    it('Should return 404 if user is not application owner', async () => {
      const token = await global.signin('bassel@test.com');
      await request(app)
        .patch('/v1/applications/2')
        .field('cv', 'update')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });

    it('Should return 422, when given invalid data', async () => {
      const token = await global.signin('bassel@test.com');
      await request(app)
        .patch('/v1/applications/1')
        .field('job_id', 1)
        .set('Authorization', `Bearer ${token}`)
        .expect(422);
    });
  });
});
