import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Job } from 'src/jobs/entities/job.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field(() => String)
  username: string;

  @Column()
  @Field(() => String)
  email: string;

  @Column()
  @Field(() => String)
  password: string;

  @OneToMany(() => Job, (job) => job.user)
  @Field(() => [Job])
  jobs: Job[];
}
