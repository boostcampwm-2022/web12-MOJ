import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'problem', synchronize: false })
export class Problem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column()
  timeLimit: number;

  @Column({ default: 512 })
  memoryLimit: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text' })
  input: string;

  @Column({ type: 'text' })
  output: string;

  @Column({ type: 'text' })
  explanation: string;

  @Column({ default: false })
  visible: boolean;

  @Column()
  userId: number;

  @Column({ type: 'text' })
  limitExplanation: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
