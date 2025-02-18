import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import {Link} from "./Link.entity";

@Entity()
export class Redirection {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    ip: string;

    @Column({ type: 'bigint' })
    date: number;

    @ManyToOne(() => Link, (link) => link.redirections, { onDelete: 'CASCADE' })
    link: Link;
}
