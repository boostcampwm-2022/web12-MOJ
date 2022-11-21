import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
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
}
