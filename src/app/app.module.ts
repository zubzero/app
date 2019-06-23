import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Home } from '../pages/home/home';
import { Address } from '../pages/account/address/address';
import { EditAddressForm } from '../pages/account/edit-address-form/edit-address-form';
import { AccountForgotten } from '../pages/account/forgotten/forgotten';
import { AccountLogin } from '../pages/account/login/login';
import { Post } from '../pages/post/post';
import { OrderDetails } from '../pages/account/order-details/order-details';
import { Orders } from '../pages/account/orders/orders';
import { AccountRegister } from '../pages/account/register/register';
import { WishlistPage } from '../pages/account/wishlist/wishlist';

import { CartPage } from '../pages/cart/cart';
import { BillingAddressForm } from '../pages/checkout/billing-address-form/billing-address-form';
import { OrderSummary } from '../pages/checkout/order-summary/order-summary';
import { TermsCondition } from '../pages/checkout/terms-condition/terms-condition';
import { ProductPage } from '../pages/product/product';
import { ProductsPage } from '../pages/products/products';
import { SearchPage } from '../pages/search/search';


/*------------------------Providers----------------------------------*/

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { NativeStorage } from '@ionic-native/native-storage';
import { BrowserModule } from '@angular/platform-browser';
import { CartService } from '../providers/service/cart-service';
import { WishlistService } from '../providers/service/wishlist-service';
import { CategoryService } from '../providers/service/category-service';
import { CheckoutService } from '../providers/service/checkout-service';
import { Config } from '../providers/service/config';
import { Functions } from '../providers/service/functions';
import { ProductService } from '../providers/service/product-service';
import { SearchService } from '../providers/service/search-service';
import { Service } from '../providers/service/service';
import { Values } from '../providers/service/values';
import { KeysPipe } from '../providers/pipe/pipe';
//import { PhotoViewer } from '@ionic-native/photo-viewer';
import { CallNumber } from '@ionic-native/call-number';
import { EmailComposer } from '@ionic-native/email-composer';
import { AppRate } from '@ionic-native/app-rate';
import { SocialSharing } from '@ionic-native/social-sharing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { OneSignal } from '@ionic-native/onesignal';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    Home,
    Address,
    EditAddressForm,
    AccountForgotten,
    AccountLogin,
    OrderDetails,
    Orders,
    Post,
    AccountRegister,
    WishlistPage,
    CartPage,
    BillingAddressForm,
    OrderSummary,
    TermsCondition,
    ProductPage,
    ProductsPage,
    SearchPage,
    KeysPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Home,
    Address,
    EditAddressForm,
    AccountForgotten,
    AccountLogin,
    OrderDetails,
    Orders,
    Post,
    AccountRegister,
    WishlistPage,
    CartPage,
    BillingAddressForm,
    OrderSummary,
    TermsCondition,
    ProductPage,
    ProductsPage,
    SearchPage,
  ],
  providers: [
  CartService,
  WishlistService,
  CategoryService,
  CheckoutService,
  Config,
  Functions,
  ProductService,
  SearchService,
  Service,
  Values,
  OneSignal,
  StatusBar,
  SplashScreen,
  InAppBrowser,
  NativeStorage,
  SocialSharing,
  AppRate,
  EmailComposer,
  CallNumber,
  {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
