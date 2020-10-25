import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

jest.mock('../nats-wrapper');

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[];
    }
  }
}

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'asdf';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

beforeEach(async () => {
  jest.clearAllMocks();

  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

global.signin = () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const email = 'test@test.com';

  const userJwt = jwt.sign(
    {
      id,
      email
    },
    process.env.JWT_KEY!
  );

  const session = Buffer.from(
    JSON.stringify({
      jwt: userJwt
    })
  ).toString('base64');

  return [`express:sess=${session}`];
};
