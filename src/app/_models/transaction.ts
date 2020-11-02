import { Category } from './category';
import { Transport } from './transport';
import { User } from './user';
import { Order } from './order';
import { TransactionType } from './transactionType';

export class Transaction {
    transaction_id: number;
    order_id: number;
    amount: number;
    host_id: number;
    transaction_number: string;
    transaction_type_id: number;
    note: string;
    available_balance: number;
    unavailable_balance: number;
    order: Order = new Order();
    host: User = new User();
    transactionType: TransactionType = new TransactionType();
    transaction_fee: number;
    createdAt?: string;
    updatedAt?: string;
}
  