import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Testcase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  input: string;

  @Column({ type: 'text' })
  output: string;

  @Column()
  problemId: number;
}
