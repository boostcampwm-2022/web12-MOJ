import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Result {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  time: number;

  @Column()
  memory: number;

  @Column()
  stateId: number;

  @Column()
  submissionId: number;
}
