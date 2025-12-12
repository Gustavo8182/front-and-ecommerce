import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { MyOrdersComponent } from './pages/my-orders/my-orders.component';
import { SearchResultsComponent } from './pages/search-results/search-results.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { CartComponent } from './pages/cart/cart.component';
import { AdminOrdersComponent } from './pages/admin-orders/admin-orders.component';

export const routes: Routes = [
    { path: '', component: ProductListComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'my-orders', component: MyOrdersComponent },
    { path: 'search', component: SearchResultsComponent },
    { path: 'product/:id', component: ProductDetailsComponent },
    { path: 'cart', component: CartComponent },
    { path: 'admin/orders', component: AdminOrdersComponent }
];
