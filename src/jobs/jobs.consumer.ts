import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { JOBS_QUEUE } from 'src/constants/constant';
import { JobsService } from './jobs.service';
import { Job as JobEntity } from './entities/job.entity';
@Processor(JOBS_QUEUE)
export class JobConsumer {
  constructor(private readonly jobService: JobsService) {}
  private readonly logger = new Logger(JobConsumer.name);
  @Process()
  async processJob(job: Job<unknown>) {
    this.logger.log(`Processing Job no # ${job.id}`);
    const jobData = job.data;
    this.logger.log(`Updating Job status # ${job.id}`);
    await this.jobService.updateStatus('pending', (jobData as JobEntity).id);
    await this.jobService.updateStatus('done', (jobData as JobEntity).id);
    this.logger.log(`Job Status Updated # ${job.id}`);
    this.logger.log(`Processing Completed of job # ${job.id}`);
  }
}
