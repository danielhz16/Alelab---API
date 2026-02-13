import { Injectable, Logger } from '@nestjs/common';
import * as Minio from 'minio';
import { handleError } from '../error/handle-errors';
import { ERRORS } from '../constant/errors'
import type { Lang } from '../ts/types/index'

@Injectable()
export class MinioService {
    private readonly logger = new Logger(MinioService.name);
    private minioClient: Minio.Client;
    private bucketName: string;

    constructor() {
        const endpoint = process.env.MINIO_ENDPOINT || 'localhost';
        const port = parseInt(process.env.MINIO_PORT || '9000', 10);
        const useSSL = process.env.MINIO_USE_SSL === 'true';
        const accessKey = process.env.MINIO_ACCESS_KEY || 'minioadmin';
        const secretKey = process.env.MINIO_SECRET_KEY || 'minioadmin';
        this.bucketName = process.env.MINIO_BUCKET || 'notes-images';

        this.minioClient = new Minio.Client({
            endPoint: endpoint,
            port: port,
            useSSL: useSSL,
            accessKey: accessKey,
            secretKey: secretKey,
        });

        this.ensureBucket();
    }

    private async ensureBucket() {
        try {
            const exists = await this.minioClient.bucketExists(this.bucketName);
            if (!exists) {
                await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
                this.logger.log(`Bucket "${this.bucketName}" created successfully`);

                const policy = {
                    Version: '2012-10-17',
                    Statement: [
                        {
                            Effect: 'Allow',
                            Principal: { AWS: ['*'] },
                            Action: ['s3:GetObject'],
                            Resource: [`arn:aws:s3:::${this.bucketName}/*`],
                        },
                    ],
                };
                await this.minioClient.setBucketPolicy(
                    this.bucketName,
                    JSON.stringify(policy),
                );
                this.logger.log(`Bucket "${this.bucketName}" policy set to public read`);
            }
        } catch (error: any) {
            const alreadyOwned = error.code === 'BucketAlreadyOwnedByYou' ||
                error.code === 'BucketAlreadyExists' ||
                error.message?.includes('already own it');

            if (alreadyOwned) {
                this.logger.log(`Bucket "${this.bucketName}" already exists`);
            } else {
                this.logger.error(`Error ensuring bucket: ${error.message}`);
            }
        }
    }

    async uploadFile(
        file: Express.Multer.File,
        folder: string = '',
        lang: Lang
    ): Promise<string | undefined> {
        const fileName = folder ? `${folder}/${Date.now()}-${file.originalname}` : `${Date.now()}-${file.originalname}`;
        const metaData = {
            'Content-Type': file.mimetype,
        };

        try {
            await this.minioClient.putObject(
                this.bucketName,
                fileName,
                file.buffer,
                file.size,
                metaData,
            );

            return fileName;
        } catch (error: any) {
            handleError({
                code: ERRORS.ERROR_UPLOAD_FILE,
                lang: lang
            })
        }
    }

    async uploadBase64Image(base64Data: string, lang: Lang): Promise<string | undefined> {
        try {

            const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            if (!matches || matches.length !== 3) {
                throw new Error('Invalid base64 string');
            }

            const mimeType = matches[1];
            const base64Content = matches[2];
            const buffer = Buffer.from(base64Content, 'base64');


            const extension = mimeType.split('/')[1] || 'png';
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`;

            const metaData = {
                'Content-Type': mimeType,
            };

            await this.minioClient.putObject(
                this.bucketName,
                fileName,
                buffer,
                buffer.length,
                metaData,
            );
            const url = fileName;
            return url;
        } catch (error) {
            handleError({
                code: ERRORS.ERROR_UPLOAD_FILE,
                lang: lang
            })
        }
    }

    async getFile(filename: string, lang: Lang) {
        const file = await this.minioClient.getObject(this.bucketName, filename);
        if (!file) {
            handleError({
                code: ERRORS.ERROR_GET_FILE,
                lang: lang
            })
        }
        return file;
    }

}
