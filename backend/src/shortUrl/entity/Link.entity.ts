import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import {Redirection} from "./Redirection.entity";
import {nanoid} from "nanoid";

@Entity()
export class Link {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: false, type: 'varchar'})
    originalUrl: string;

    @Column({ type: 'int', nullable: true })
    expiresAt: number;

    @Column({ type: 'int', default: 0 })
    clickCount: number;

    @Column({ type: 'varchar', unique: true, nullable: false, default: nanoid(6) })
    alias: string;

    @OneToMany(() => Redirection, (redirection) => redirection.link)
    redirections: Redirection[];
}
