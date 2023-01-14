import { CartItem } from './../common/cart-item';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItem: CartItem[] = [];
  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();
  constructor() {}

  addToCart(theCartItem: CartItem) {
    // check if we alreday have item in cart
    let alredyExistingInCart: boolean = false;
    let existingCartItem: CartItem = undefined;
    if (this.cartItem.length > 0) {
      // find the item in the cart based on the Item id
      // for (let tempCartItem of this.cartItem) {
      //   if (tempCartItem.id === theCartItem.id) {
      //     existingCartItem = tempCartItem;
      //     break;
      //   }
      // }
      // refactor abouve loop
      existingCartItem = this.cartItem.find(
        (tempCartItem) => tempCartItem.id === theCartItem.id
      );
    }
    // check if we find it
    alredyExistingInCart = existingCartItem != undefined;
    if (alredyExistingInCart) {
      // exist the incemenet the quantity
      existingCartItem.quantity++;
    } else {
      //just add the item to the array
      this.cartItem.push(theCartItem);
      // compute cart total price and total quantity
      this.computeCartTotals();
    }
  }
  computeCartTotals() {
    // throw new Error('Method not implemented.');
    let totalQuantityvalue: number = 0;
    let totalPriceValue: number = 0;
    for (let currentCartItem of this.cartItem) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityvalue += currentCartItem.quantity;
    }
    // publish the new value... all subsciber will recive new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityvalue);
    // loging just for debugging p
    this.logCartData(totalPriceValue, totalQuantityvalue);
  }
  logCartData(totalPriceValue: number, totalQuantityvalue: number) {
    // throw new Error('Method not implemented.');
    console.log(`contents of cart`);
    for (let temp of this.cartItem) {
      const subTotalPrice = temp.quantity * temp.unitPrice;
      console.log(
        `name ${temp.name},quantity= ${temp.quantity}, subPrice=${subTotalPrice}`
      );
    }
    console.log(
      `totalPrice: ${totalPriceValue.toFixed(
        2
      )}, total quantity: ${totalQuantityvalue}`
    );
    console.log('------------------');
  }
  decrementQuantity(theCartItem: CartItem) {
    // throw new Error('Method not implemented.');
    theCartItem.quantity--;
    if (theCartItem.quantity == 0) {
      this.remove(theCartItem);
    } else {
      this.computeCartTotals();
    }
  }
  remove(theCartItem: CartItem) {
    // throw new Error('Method not implemented.');
    // get index of the item if found then remove the item
    const itemIndex = this.cartItem.findIndex(
      (tempCartItem) => tempCartItem.id === theCartItem.id
    );
    if (itemIndex > -1) {
      this.cartItem.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }
}
