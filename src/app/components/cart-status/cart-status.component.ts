import { CartService } from './../../services/cart.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css'],
})
export class CartStatusComponent implements OnInit {
  totalPrice: number = 0;
  totalQuantity: number = 0;
  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.updateCartStatus();
  }
  updateCartStatus() {
    // throw new Error('Method not implemented.');
    // subscribe to totalPrice
    this.cartService.totalPrice.subscribe((data) => (this.totalPrice = data));
    // subscribe to  totalQuantity
    this.cartService.totalQuantity.subscribe(
      (data) => (this.totalQuantity = data)
    );
    console.log(`total price !!!!!!${this.totalPrice} ${this.totalQuantity}`);
  }
}
