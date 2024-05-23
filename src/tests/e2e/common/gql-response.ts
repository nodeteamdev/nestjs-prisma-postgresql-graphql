import { Response } from 'supertest';

export default (res: Response) => {
  return res.body.data;
};
