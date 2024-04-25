import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Job } from './entities/job.entity';
import { JobsService } from './jobs.service';
import { CreateJobInput } from './dto/create-job.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorator/user.decorator.graphql';
import { User } from 'src/users/entities/user.entity';

@Resolver(() => Job)
export class JobsResolver {
  constructor(private readonly jobService: JobsService) {}

  @Mutation(() => Job)
  @UseGuards(JwtAuthGuard)
  createJob(
    @Args('createJobInput') createJobInput: CreateJobInput,
    @CurrentUser() user: User,
  ) {
    return this.jobService.createJob(createJobInput, user);
  }

  @Query(() => [Job], { name: 'jobs' })
  getJobs() {
    return this.jobService.getJob();
  }

  @Query(() => Job, { name: 'job' })
  getJobDetail(@Args('id', { type: () => Int }) id: number) {}
}
