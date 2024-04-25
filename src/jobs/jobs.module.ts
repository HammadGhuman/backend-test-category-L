import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { BullModule } from '@nestjs/bull';
import { JOBS_QUEUE } from 'src/constants/constant';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { JobsResolver } from './jobs.resolver';
import { JobConsumer } from './jobs.consumer';

@Module({
  imports: [
    TypeOrmModule.forFeature([Job]),
    BullModule.registerQueue({
      name: JOBS_QUEUE,
    }),
  ],
  providers: [JobsService, JobsResolver, JobConsumer],
})
export class JobsModule {}
