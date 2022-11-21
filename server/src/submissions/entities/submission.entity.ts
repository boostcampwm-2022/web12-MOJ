import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Submission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  languageId: number;

  @Column()
  problemId: number;

  @Column()
  userId: number;
}
