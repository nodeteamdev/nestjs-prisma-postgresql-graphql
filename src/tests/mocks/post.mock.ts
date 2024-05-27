import { faker } from '@faker-js/faker';
import { Post } from '@post/models/post.model';
import { User } from '@user/models/user.model';
import { defaultUser } from './user.mock';

const getMockedPost = (author: User = defaultUser): Post => ({
  id: 1,
  title: faker.word.noun(),
  content: faker.string.alphanumeric({ length: { min: 20, max: 100 } }),
  dateCreated: new Date(),
  published: false,
  dateModified: new Date(),
  authorId: author.id,
  author,
});

const defaultPost = getMockedPost();

export { defaultPost, getMockedPost };
