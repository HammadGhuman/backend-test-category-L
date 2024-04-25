import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum JobStatus {
  DONE = 'done',
  PENDING = 'pending',
  PROCESSING = 'processing',
}

@ObjectType()
@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Field(() => String)
  status: string;

  @Column()
  @Field(() => String)
  job_name: string;

  @ManyToOne(() => User, (user) => user.jobs)
  @Field(() => User)
  user: User;
}
