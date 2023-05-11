import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Account {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    balance: number;

    @Column()
    balance_in_fiat: string;

    @Column()
    crypto_currency: string;

    @Column()
    fiat_currency: string;
}
