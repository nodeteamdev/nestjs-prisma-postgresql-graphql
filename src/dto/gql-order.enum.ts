import { registerEnumType } from '@nestjs/graphql';
import OrderType from '../types/order-direction.type';

enum Order {
  asc = 'asc',
  desc = 'desc',
}

const GqlOrder: { asc: OrderType; desc: OrderType } = {
  asc: 'asc',
  desc: 'desc',
};

registerEnumType(GqlOrder, {
  name: 'Order',
  description: 'Pagination order',
});

export default Order;

export { Order, GqlOrder };
