import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { MyOrdersComponent } from './pages/my-orders/my-orders.component';
import { SearchResultsComponent } from './pages/search-results/search-results.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { CartComponent } from './pages/cart/cart.component';
import { AdminOrdersComponent } from './pages/admin-orders/admin-orders.component';
import { AdminProductsComponent } from './pages/admin-products/admin-products.component';
import { ProductFormComponent } from './pages/product-form/product-form.component';
import { SellerCenterComponent } from './pages/seller-center/seller-center.component';
import { FinanceComponent } from './pages/finance/finance.component';
import { MarketingComponent } from './pages/marketing/marketing.component';
import { SellerOrdersComponent } from './pages/seller-orders/seller-orders.component';
import { authGuard } from './guards/auth.guard';
import { StoreProfileComponent } from './pages/store-profile/store-profile.component';

export const routes: Routes = [
    { path: '', component: ProductListComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    // Área do Comprador
    { path: 'my-orders', component: MyOrdersComponent, canActivate: [authGuard] }, // Protegido também
    { path: 'search', component: SearchResultsComponent },
    { path: 'product/:id', component: ProductDetailsComponent },
    { path: 'shop/:id', component: StoreProfileComponent },
    { path: 'cart', component: CartComponent },

    // Área Admin
    { path: 'admin/orders', component: AdminOrdersComponent, canActivate: [authGuard] },
    { path: 'admin/products', component: AdminProductsComponent, canActivate: [authGuard] },
    { path: 'admin/products/new', component: ProductFormComponent, canActivate: [authGuard] },
    { path: 'admin/products/:id', component: ProductFormComponent, canActivate: [authGuard] },

    // Área do Vendedor (Seller Center)
    { path: 'seller-center', component: SellerCenterComponent, canActivate: [authGuard] },

    // CORREÇÃO AQUI: Removemos a duplicata e deixamos apenas o componente correto
    { path: 'seller/orders', component: SellerOrdersComponent, canActivate: [authGuard] },

    { path: 'seller/finance', component: FinanceComponent, canActivate: [authGuard] },
    { path: 'seller/marketing', component: MarketingComponent, canActivate: [authGuard] },

    // Formulário de Produto (Edição/Criação)
    { path: 'product-form', component: ProductFormComponent, canActivate: [authGuard] },
    { path: 'product-form/:id', component: ProductFormComponent, canActivate: [authGuard] },
];
