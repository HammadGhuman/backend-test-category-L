import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Queue } from 'bull';
import { JOBS_QUEUE } from 'src/constants/constant';
import { CreateJobInput } from './dto/create-job.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class JobsService {
  constructor(
    @InjectQueue(JOBS_QUEUE) private readonly jobsQueue: Queue,
    @InjectRepository(Job) private readonly jobRepository: Repository<Job>,
  ) {}

  async createJob(createJobInput: CreateJobInput, user: User): Promise<Job> {
    const job = this.jobRepository.create({
      job_name: createJobInput.job_name,
      user: user,
      status: 'pending',
    });
    const jobCreated = await this.jobRepository.save(job);
    await this.addJobToQueue(jobCreated);
    return jobCreated;
  }

  async updateStatus(status: string, id: number) {
    return await this.jobRepository.update(
      { id: id },
      {
        status,
      },
    );
  }

  async getJob(): Promise<Job[]> {
    const data = await this.jobRepository.find();
    console.log(data);
    return data;
  }

  getJobById(id: number): Promise<Job> {
    const job = this.jobRepository.findOneBy({ id });
    if (!job) {
      throw new NotFoundException('job not found');
    }
    return job;
  }

  async addJobToQueue(jobCreated: Job) {
    const data = await this.jobsQueue.add(jobCreated);
  }
}
