import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { HomeComponent } from './pages/home/home.component';
import { EntityComponent } from './pages/entity/entity.component';
import { ItemComponent } from './pages/item/item.component';
import { NgModule } from '@angular/core';
import { OrderComponent } from './pages/order/order.component';
import { AdditionalValuesComponent } from './pages/additional-values/additional-values.component';
import { SolicitacoesDePagamentoComponent } from './pages/solicitacoes-de-pagamento/solicitacoes-de-pagamento.component';

const routes: Routes = [
  { path: '', component: LoginPageComponent },
  { path: 'home', component: HomeComponent },
  { path: 'cadastro-empresa', component: EntityComponent },
  { path: 'cadastro-item', component: ItemComponent },
  { path: 'pedido', component: OrderComponent },
  { path: 'valores-adicionais', component: AdditionalValuesComponent },
  { path: 'solicitacoes-de-pagamento', component: SolicitacoesDePagamentoComponent }
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ]
})

export class AppRoutsRoutes{}
