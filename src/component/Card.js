import { data } from './Data';

 // Showing Full Price
 export const ShowTotalPrice = () => {
    const totalPrice = data.reduce((item) => {
    return `${item.price * item.quantity}`;
  }) 
  console.log(totalPrice)
}