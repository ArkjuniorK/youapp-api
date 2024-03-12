import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Socket, io } from 'socket.io-client';
import { ChatGateway } from './chat.gateway';

async function createNestApp(...gateways: any): Promise<INestApplication> {
  const testingModule = await Test.createTestingModule({
    providers: gateways,
  }).compile();

  return testingModule.createNestApplication();
}

describe('ChatGateway', () => {
  let app: INestApplication;
  let client: Socket;
  let gateway: ChatGateway;

  beforeAll(async () => {
    // Instantiate the app
    app = await createNestApp(ChatGateway);
    // Get the gateway instance from the app instance
    gateway = app.get<ChatGateway>(ChatGateway);
    // Create a new client that will interact with the gateway
    client = io('http://localhost:8080', {
      autoConnect: false,
      transports: ['websocket', 'polling'],
    });

    app.listen(8080);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('should emit "pong" on "ping"', async () => {
    client.connect();
    client.emit('ping', 'Hello world!');
    await new Promise<void>((resolve) => {
      client.on('connect', () => {
        console.log('connected');
      });
      client.on('pong', (data) => {
        expect(data).toBe('Hello world!');
        resolve();
      });
    });
    client.disconnect();
  });
});
