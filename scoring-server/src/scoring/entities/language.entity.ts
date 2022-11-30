import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'language', synchronize: false })
export class Language {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  language: string;
}
