import request from 'supertest';
import { app } from '../src/app';

describe('health checks', () => {
  it('returns api health', async () => {
    const response = await request(app).get('/health').expect(200);
    expect(response.body.success).toBe(true);
    expect(response.body.status).toBe('ok');
  });
});
