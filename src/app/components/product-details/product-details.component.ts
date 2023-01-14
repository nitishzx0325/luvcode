import { CartItem } from './../../common/cart-item';
import { CartService } from './../../services/cart.service';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from './../../services/product.service';
import { Product } from './../../common/product';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  product!: Product;
  constructor(
    private productservice: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => this.handleProductDetails());
  }
  handleProductDetails(): void {
    // throw new Error('Method not implemented.');
    // get the "id" param String. convert String to a number by + sign
    const theProductId: number = +this.route.snapshot.paramMap.get('id')!;
    this.productservice.getProduct(theProductId).subscribe((data) => {
      this.product = data;
    });
  }
  AddToCart() {
    const theCartItem = new CartItem(this.product);
    this.cartService.addToCart(theCartItem);
  }
}
