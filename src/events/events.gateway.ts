import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
    ConnectedSocket
  } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Server } from 'socket.io';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
  
  @WebSocketGateway({
    cors: {
      origin: '*',
    },
  })
  export class EventsGateway {
    constructor(private readonly redisService: RedisService) {}
    @WebSocketServer()
    server: Server;
   
    @SubscribeMessage('join')
  async join(@ConnectedSocket() client: Socket,@MessageBody() payload: string)  {
    try {
     console.log(payload)
     const controller = this.redisService.getClient()
     const data = await controller.get(payload)
     const result = JSON.parse(data)
     client.join(payload)
    } catch(e){
      console.log(e)
    }
   }

    @SubscribeMessage('message')
  async handleMessage(@ConnectedSocket() client: Socket,@MessageBody() payload: string)  {
    try {
      const controller = this.redisService.getClient()
      const result = await controller.get('a')
      console.log(result)
      if(result){
        const data = JSON.parse(result)
        data.messages.push({sender: client.id, message: payload, time: new Date()})
        await controller.set('a', JSON.stringify(data))
      } else {
        const object = {
          messages: [{sender: client.id, message: payload, time: new Date()}]
         }
         await controller.set('a', JSON.stringify(object))
      }
     client.nsp.to(payload).emit('replyMessage', 'halo');
     const halo = 2*2
     console.log(halo)
    } catch(e){
      console.log(e)
    }
   }
  }
