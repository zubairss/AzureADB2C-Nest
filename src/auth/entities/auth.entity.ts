import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('user')
export class Auth {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;
}
