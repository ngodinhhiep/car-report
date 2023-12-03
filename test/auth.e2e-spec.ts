import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication system', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {

    const mail = 'abcxyzmhfdfdc@gmail.com';

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({email: mail, password: 'abcxyz'}) // send out the body content
      .expect(201)
      .then((respond) => {   // 'then' means get back the response from the server
        const { id, email } = respond.body; // get back the body property (password was hidden)
        expect(id).toBeDefined();
        expect(email).toEqual(mail);
      })
  });
});
