import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { LoadingController } from 'ionic-angular';
import { Config } from './config';
import { Values } from './values';
import { URLSearchParams } from '@angular/http';
import { NativeStorage } from '@ionic-native/native-storage';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';

@Injectable()
export class Service {
    data: any;
    categories: any;
    banners: any;
    orders: any;
    order: any;
    isloggedIn: any;
    status: any;
    address: any;
    products: any;
    product: any;
    cart: any;
    configuration: any;
    loader: any;
    loginStatus: any;
    mainCategories: any;
    country: any;
    user: any;
    login_nonce: any;
    dir: any = 'left';
    filter: any = {};
    has_more_items: boolean = true;
    constructor(private http: Http, private config: Config, private values: Values, public loadingCtrl: LoadingController, private nativeStorage: NativeStorage) {
        this.mainCategories = [];
        this.filter.page = 1;
    }
    load() {
        return new Promise(resolve => {
            this.http.get(this.config.url + '/wp-login.php/admin-ajax.php?action=mstoreapp-keys', this.config.options).map(res => res.json())
                .subscribe(data => {
                   this.config.consumerKey = data.keys.consumerKey;
                   this.config.consumerSecret = data.keys.consumerSecret;
                    this.values.data = data;
                    this.values.currency = data.currency;
                    this.login_nonce = data.login_nonce;
                    this.banners = data.banners;
                    this.banners = data.banners;
                    if (data.user.data != undefined) {
                        this.values.isLoggedIn = data.user.data.status;
                        this.values.customerId = data.user.data.ID;
                        this.values.customerName = data.user.data.user_nicename;
                        this.values.logoutUrl = this.encodeUrl(data.user.data.url);
                    }
                    this.http.get(this.config.setUrl('GET', '/wc-api/v3/products/categories?', false), this.config.options).map(res => res.json())
                        .subscribe(data => {
                            this.categories = data;
                            for (var i = 0; i < this.categories.product_categories.length; i++) {
                                if (this.categories.product_categories[i].parent == '0') {
                                    this.mainCategories.push(this.categories.product_categories[i]);
                                }
                            }
                            this.nativeStorage.getItem('loginData')
                                .then(
                                    data => this.login(data, this.login_nonce),
                                    error => console.error(error)
                                );
                            this.http.get(this.config.url + '/wp-login.php/admin-ajax.php?action=mstoreapp-cart', this.config.options).map(res => res.json())
                                .subscribe(data => {
                                    this.cart = data;
                                    this.values.updateCart(this.cart);
                                });
                            resolve(this.categories);
                        });
                });
        });
    }
    getNonce() {
        return new Promise(resolve => {
            this.http.get(this.config.url + '/wp-login.php/admin-ajax.php?action=mstoreapp-nonce', this.config.options).map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                });
        });
    }
    login(a, nonce) {
        var params = new URLSearchParams();
        params.append("username", a.username);
        params.append("password", a.password);
        params.append("_wpnonce", nonce);
        params.append("login", 'Login');
        params.append("redirect", this.config.url + '/wp-login.php/admin-ajax.php?action=mstoreapp-userdata');
        return new Promise(resolve => {
            this.http.post(this.config.url + '/wp-login.php/admin-ajax.php?action=mstoreapp-login', params, this.config.options).map(res => res.json())
                .subscribe(data => {
                    if (!data.errors) {
                        this.values.isLoggedIn = data.data.status;
                        this.values.customerName = data.data.display_name;
                        this.values.customerId = data.data.ID;
                        this.values.logoutUrl = this.encodeUrl(data.data.url);
                        params = new URLSearchParams();
                        params.append("customer_id", this.values.customerId.toString());
                        this.http.post(this.config.url + '/wp-login.php/admin-ajax.php?action=mstoreapp-get_wishlist', params, this.config.options).map(res => res.json())
                            .subscribe(data => {
                                for (let item in data) {
                                    this.values.wishlistId[data[item].id] = data[item].id;
                                }
                        });
            params = new URLSearchParams();
            params.append("customer_id", this.values.customerId.toString());
            this.http.post(this.config.url + '/wp-login.php/admin-ajax.php?action=mstoreapp-get_wishlist', params, this.config.options).map(res => res.json())
                .subscribe(data => {
                    
                    console.log(data);
            });
                        this.nativeStorage.setItem('loginData', {
                                username: a.username,
                                password: a.password
                            })
                            .then(
                                data => console.log('Login Details Stored'),
                                error => console.error(error)
                            );
                    }
                    resolve(data);
                }, err => {resolve(JSON.parse(err._body));console.log(err._body)});
        });
    }
    encodeUrl(href) {
        return href.replace(/&amp;/g, '&')
    }
    logout() {
        return new Promise(resolve => {
            this.http.get(this.encodeUrl(this.values.logoutUrl))
                .subscribe(data => {
                    this.values.isLoggedIn = false;
                    this.values.customerName = "";
                    this.http.get(this.config.url + '/wp-login.php/admin-ajax.php?action=mstoreapp-cart', this.config.options).map(res => res.json())
                        .subscribe(data => {
                            this.cart = data;
                            this.values.updateCart(this.cart);
                        });
                    resolve(this.cart);
                });
        });
    }
    passwordreset(email, nonce, url) {
        var params = new URLSearchParams();
        params.append("user_login", email);
        params.append("wc_reset_password", "true");
        params.append("_wpnonce", nonce);
        params.append("_wp_http_referer", '/my-account/lost-password/');
        return new Promise(resolve => {
            this.http.post(this.config.url + '/my-account/lost-password/', params)
                .subscribe(status => {
                    resolve(status);
                });
        });
    }
    passwordResetNonce() {
        return new Promise(resolve => {
            this.http.get(this.config.url + '/wp-admin/admin-ajax.php?action=mstoreapp-passwordreset', this.config.options).map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                });
        });
    }
    getAddress() {
        return new Promise(resolve => {
            this.http.get(this.config.setUrl('GET', '/wc-api/v3/customers/' + this.values.customerId + '?', false), this.config.options).map(res => res.json())
                .subscribe(data => {
                    this.address = data;
                    resolve(this.address);
                });
        });
    }
    saveAddress(address) {
        var params = {
            customer: address
        };
        return new Promise(resolve => {
            this.http.put(this.config.setUrl('PUT', '/wc-api/v3/customers/' + this.values.customerId + '?', false), params, this.config.options).map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                });
        });
    }
    pushNotification(notification){
        var params = new URLSearchParams();
        params.append("device_id", notification.device_id);
        params.append("platform", notification.platform);
        params.append("email", notification.email);
        params.append("city", notification.city);
        params.append("state", notification.state);
        params.append("country", notification.country);
        params.append("pincode", notification.pincode);

        return new Promise(resolve => {
            this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=mstoreapp-user-subcribe-notify', params, this.config.options).map(res => res.json())
                .subscribe(data => {
                    this.status = data;
                    resolve(this.status);
                });
        });

    }
    pushNotify(deviceId, platform){
        var params = new URLSearchParams();
            params.append("device_id", deviceId);
            params.append("platform", platform);

            return new Promise(resolve => {
                this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=mstoreapp-user-subcribe-notify', params, this.config.options).map(res => res.json())
                    .subscribe(data => {
                        this.status = data;
                        resolve(this.status);
                    });
            });

    }
    getOrder(id) {
        return new Promise(resolve => {
            this.http.get(this.config.setUrl('GET', '/wc-api/v3/orders/' + id + '?', false), this.config.options).map(res => res.json())
                .subscribe(data => {
                    this.order = data;
                    resolve(this.order);
                });
        });
    }
    getCountry() {
        return new Promise(resolve => {
            this.http.get(this.config.url + '/wp-admin/admin-ajax.php?action=mstoreapp-get_country', this.config.options).map(res => res.json())
                .subscribe(data => {
                    this.country = data;
                    resolve(this.country);
                });
        });
    }
    registerCustomer(customer) {
        var params = {
            customer: customer
        };
        return new Promise(resolve => {
            this.http.post(this.config.setUrl('POST', '/wc-api/v3/customers?', false), params, this.config.options).map(res => res.json())
                .subscribe(data => {
                    this.user = data;
                    resolve(this.user);
                }, err => {resolve(JSON.parse(err._body));console.log(err._body)});
        });
    }
    getOrders(filter) {
        return new Promise(resolve => {
            this.http.get(this.config.setUrl('GET', '/wc-api/v3/orders?', filter), this.config.options).map(res => res.json())
                .subscribe(data => {
                    this.orders = data;
                    resolve(this.orders);
                });
        });
    }
    updateOrder(data, id) {
        return new Promise(resolve => {
            this.http.put(this.config.setUrl('PUT', '/wc-api/v3/orders/' + id + '?', false), data, this.config.options).map(res => res.json())
                .subscribe(data => {
                    this.status = data;
                    resolve(this.status);
                });
        });
    }
    presentLoading(text) {
        this.loader = this.loadingCtrl.create({
            content: text,
        });
        this.loader.present();
    }
    dismissLoading() {
        this.loader.dismiss();
    }
    getPage(id: any) {
       var params = new URLSearchParams();
       params.append("page_id", id);
       return new Promise(resolve => {
           this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=mstoreapp-page_content', params, this.config.options).map(res => res.json()).subscribe(data => {
               resolve(data);
           });
       });
   }
   getProducts() {
       this.http.get(this.config.setUrl('GET', '/wc-api/v3/products?', false), this.config.options).map(res => res.json()).subscribe(data => {
           this.products = data;
       });
   }
   loadMore() {
       this.filter.page += 1;
       return new Promise(resolve => {
           this.http.get(this.config.setUrl('GET', '/wc-api/v3/products?', this.filter), this.config.options).map(res => res.json()).subscribe(data => {
               this.handleMore(data);
               resolve(true);
           });
       });
   }
   handleMore(results) {
       if (results != undefined) {
           for (var i = 0; i < results.products.length; i++) {
               this.products.products.push(results.products[i]);
           };
       }
       if (results.length == 0) {
           this.has_more_items = false;
       }
   }
}