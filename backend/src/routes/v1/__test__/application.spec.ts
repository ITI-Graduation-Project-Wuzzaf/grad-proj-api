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
    // it('Should',async()=>{})
  });
});
