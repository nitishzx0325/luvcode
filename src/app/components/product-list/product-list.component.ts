import { CartItem } from './../../common/cart-item';
import { CartService } from './../../services/cart.service';
import { SearchComponent } from './../search/search.component';
import { Product } from './../../common/product';
import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-grid.component.html',
  // templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  // new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElement: number = 0;
  previousKeyWord: string = '';

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => this.listProducts());
  }
  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProduct();
    }
  }
  handleSearchProducts() {
    // throw new Error('Method not implemented.');
    const theKeyWord: string = this.route.snapshot.paramMap.get('keyword')!;
    // if we have differentkeyword than previous
    // then set thePageNumber to 1
    if (this.previousKeyWord != theKeyWord) {
      this.thePageNumber = 1;
    }
    this.previousKeyWord = theKeyWord;
    console.log(`keyword=${theKeyWord}, thePageNumber=${this.thePageNumber}`);
    this.productService
      .searchProductPaginate(
        this.thePageNumber - 1,
        this.thePageSize,
        theKeyWord
      )
      .subscribe(this.processResult());
  }
  handleListProduct() {
    //check if "Id" parameter isa vaialable
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if (hasCategoryId) {
      // get the id Param Strin. convertSring to a anumber by "+"
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    } else {
      // default category to be set 1
      this.currentCategoryId = 1;
    }
    // check current pagination with product categoies
    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId;
    console.log(
      `currentCategoryId=${this.currentCategoryId}.thePageNumer=${this.thePageNumber}`
    );
    this.productService
      .getProductListPaginate(
        this.thePageNumber - 1,
        this.thePageSize,
        this.currentCategoryId
      )
      .subscribe((data) => {
        this.products = data._embedded.products;
        this.thePageNumber = data.page.number + 1;
        this.thePageSize = data.page.size;
        this.theTotalElement = data.page.totalElements;
      });
  }
  updatePageSize(pageSize: string) {
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }
  processResult() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageNumber = data.page.size;
      this.theTotalElement = data.page.totalElement;
    };
  }
  addToCart(theProduct: Product) {
    console.log(`Adding To cart: ${theProduct.name},${theProduct.unitPrice}`);
    const cartItem = new CartItem(theProduct);
    this.cartService.addToCart(cartItem);
  }
}
