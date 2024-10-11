import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io'


/**
 * NOTES 
 *  RIDER ID is represented as UserId
 *  RESTAURANT ID is represented as UserId
 */
@WebSocketGateway()
export class OrderGatewayGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger(OrderGatewayGateway.name);
  public userSocketMap: Record<string, string> = {};

  @WebSocketServer() io: Server;
  afterInit() {
    this.logger.log('Gateawy initialized');
  } 

  //for accessing userSocketMap
  public getUserId(socketId: string) {
    return this.userSocketMap[socketId];
  }

  public getSocketId(userId: string) {
    return this.userSocketMap[userId];
  }

  // for handling connection and disconnection
  handleConnection(client: any, ...args: any[]) {
    // this could be restaurant id for restaurants or userId for user
    const userId = client.handshake.query.userId;
    const socketId = client.id;
    if(userId) {
      // register user id to socket id // so that we know who is the onwer of the web socket
      this.userSocketMap[userId] = socketId; 
    }

    this.logger.log(`Client connected: ${userId}`);
  }

  handleDisconnect(client: any) {
    const socketId = client.id;

    if(socketId) {
      // remove user id using socketId // so that we know who is the onwer of the web socket
      delete this.userSocketMap[socketId]; // just deleting if he disconnected
    }
    this.logger.log(`Client disconnected: ${socketId}`);
  }


  // listening to event
  @SubscribeMessage('message')
  handleMessage(client: any, data: any): string {
    return 'Hello world!';
  }

}
