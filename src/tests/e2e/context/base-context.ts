import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { Server } from 'http';
import { IMakeRequest } from '@tests/e2e/interfaces/make-request.interface';
import makeRequest from '@tests/e2e/common/make-request';
import { AppModule } from '@app/app.module';

class BaseContext {
  private _app!: INestApplication;

  private _module!: TestingModule;

  private _server!: Server;

  private _connection!: PrismaClient;

  public request!: IMakeRequest;

  async init() {
    this._module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this._app = this._module.createNestApplication();

    this._connection = new PrismaClient();

    this._app.enableShutdownHooks();

    await this._app.init();

    this._server = this._app.getHttpServer();

    this.request = makeRequest(this._server);
  }

  async end() {
    const deleteUsers = this._connection.user.deleteMany();
    const deletePosts = this._connection.post.deleteMany();

    await this._connection.$transaction([deleteUsers, deletePosts]);

    await this._connection.$disconnect();

    await this._app
      .close()
      .then(() => setTimeout(() => process.kill(process.pid, 'SIGHUP'), 1000));
  }
}

export default BaseContext;
