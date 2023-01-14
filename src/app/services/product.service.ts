import { ProductCategory } from './../common/product-category';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'http://localhost:8080/api/products';
  private categoryUrl = 'http://localhost:8080/api/product-category';
  constructor(private httpClient: HttpClient) {}

  getProductListPaginate(
    thePage: number,
    thePageSize: number,
    theCategoryId: number
  ): Observable<GetResponseProduct> {
    //  todo: need to buildURL based on category id:

    // need to build URL based on category id, page and size
    const searchUrl =
      `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}` +
      `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProduct>(searchUrl);
  }

  getProductList(theCategoryId: number): Observable<Product[]> {
    //  todo: need to buildURL based on category id:
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;
    return this.getProducts(searchUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    // throw new Error('Method not implemented.');
    return this.httpClient
      .get<GetResponseProductCategory>(this.categoryUrl)
      .pipe(map((reponse) => reponse._embedded.productCategory));
  }
  SearchProducts(theKeyWord: string): Observable<Product[]> {
    // throw new Error('Method not implemented.');
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyWord}`;
    return this.getProducts(searchUrl);
  }
  searchProductPaginate(
    thePage: number,
    thePageSize: number,
    theKeyWord: string
  ): Observable<GetResponseProduct> {
    //  todo: need to buildURL based on category id:

    // need to build URL based on category id, page and size
    const searchUrl =
      `${this.baseUrl}/search/findByNameContaining?name=${theKeyWord}` +
      `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProduct>(searchUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient
      .get<GetResponseProduct>(searchUrl)
      .pipe(map((reponse) => reponse._embedded.products));
  }
  getProduct(theProductId: number): Observable<Product> {
    // throw new Error('Method not implemented.');
    // need to build url based on product id
    const productUrl = `${this.baseUrl}/${theProductId}`;
    return this.httpClient.get<Product>(productUrl);
  }
}
interface GetResponseProduct {
  _embedded: {
    products: Product[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  };
}
