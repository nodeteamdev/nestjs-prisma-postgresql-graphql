import { randomUUID } from 'crypto';
import { mockedUser } from './user.mock';

const mockedPost = {
  id: 1,
  title: 'Mocked Post',
  content: randomUUID(),
  published: false,
  authorId: mockedUser.id,
  dateCreated: new Date(),
  dateModified: new Date(),
};

export { mockedPost };
