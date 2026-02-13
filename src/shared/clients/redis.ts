import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisClient implements OnModuleInit, OnModuleDestroy {
    client: RedisClientType = createClient();
    private readonly logger = new Logger(RedisClient.name);

    async onModuleInit() {
        await this.connect();
    }

    async onModuleDestroy() {
        await this.disconnect();
    }

    async connect() {
        this.logger.log('Connecting to Redis...');
        await this.client.connect();
        this.logger.log('Connected to Redis');
    }

    async disconnect() {
        this.logger.log('Disconnecting from Redis...');
        await this.client.disconnect();
        this.logger.log('Disconnected from Redis');
    }

    async del(key: string) {
        await this.client.del(key);
    }

    async get(key: string) {
        const v = await this.client.get(key);
        return v ? JSON.parse(v) : null;
    }

    async set(key: string, value: any) {
        await this.client.set(key, JSON.stringify(value));
    }

    async setEx(key: string, value: any, ttl: number) {
        await this.client.setEx(key, ttl, JSON.stringify(value));
    }
}
