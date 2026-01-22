# 🅰️ Backlog Front-end (Angular)

## 🚀 0. Prioridade Imediata (Próximo Sprint)
- [ ] **🔍 Busca e Filtros (Search)**
  - [ ] Implementar barra de pesquisa funcional na Navbar.
  - [ ] Criar página de `SearchResultsComponent`.
  - [ ] Adicionar filtros laterais (Categorias, Faixa de Preço).
- [ ] **🛒 UX do Carrinho**
  - [ ] **Limpeza Automática:** Limpar `localStorage` e estado do carrinho após sucesso (201 Created) do pedido.
- [ ] **🛡️ Segurança Técnica**
  - [ ] Blindar `AuthInterceptor`: Não enviar Token JWT para APIs externas (ViaCEP, Correios).

---

## 🚨 1. Integração & Core (Fixes)
- [x] **Atualizar Modelos (Interfaces)**
  - [x] Ajustar `Store.ts`: Remover `creationDate`, adicionar `ownerName`.
  - [x] Ajustar `Product.ts`: Adicionar campos fiscais e objetos resumidos (`store`, `category`).
  - [x] Criar `Order.ts` e `Page.ts` (Genérico).
- [x] **Tratamento de Erros Visual**
  - [x] Atualizar `AuthInterceptor` e criar `ErrorInterceptor`.
  - [x] Exibir alertas (`alert` provisório) com mensagem do Backend.

## 🛒 2. Experiência de Compra
- [ ] **Detalhes do Produto (Variações)**
  - [ ] Componente visual para selecionar Variação (Botões: "Azul", "Vermelho") em vez de dropdown nativo.
  - [ ] Bloquear botão "Comprar" se a variação estiver sem estoque.
  - [ ] Exibir fotos da variação selecionada (trocar a foto principal ao clicar na cor).
- [ ] **Checkout e Pagamento**
  - [ ] Tela de escolha de Endereço (Listar endereços da API + Botão "Novo Endereço").
  - [ ] Exibir resumo do pedido com Frete calculado.
  - [ ] Tela de "Aguardando Pagamento" exibindo QR Code do PIX.

## 🏪 3. Portal do Vendedor
- [ ] **Dashboard da Loja**
  - [ ] Gráfico simples de vendas diárias.
  - [x] Lista de pedidos recebidos (`seller-orders`).
  - [ ] Botões de ação na lista ("Confirmar Envio", "Cancelar").
- [ ] **Cadastro de Produto Otimizado**
  - [ ] Melhorar UI de cadastro de Variações (tabela para editar preços/estoque de várias cores de uma vez).
  - [ ] Componente de Upload de imagem (Preview antes de enviar).

## 👤 4. Área do Usuário
- [x] **Meus Pedidos**
  - [x] Listagem dos pedidos do cliente (`my-orders`).
  - [ ] Abas de status: "A Pagar", "Enviados", "Concluídos".
  - [ ] Botão "Confirmar Recebimento" (Libera o dinheiro para o vendedor).
  - [ ] Botão "Avaliar Produto" (Abre modal com estrelas e texto).

  

  # 🅰️ Backlog Front-end (Angular)

## 🚀 0. Prioridade Imediata (Próximo Sprint)
- [ ] **🔍 Busca e Filtros (Global)**
  - [ ] *Objetivo: Permitir comparar preços de todas as lojas num só lugar.*
  - [ ] Implementar barra de pesquisa funcional na Navbar.
  - [ ] Criar página de `SearchResultsComponent`.
  - [ ] Adicionar filtros laterais (Categorias, Faixa de Preço, Menor Preço).
- [ ] **🛒 UX do Carrinho**
  - [ ] **Limpeza Automática:** Limpar `localStorage` e estado do carrinho após sucesso (201 Created) do pedido.

---

## 🏬 5. Vitrine Pública & Lojas (NOVO)
*Para o vendedor compartilhar o link e o cliente comprar especificamente dele.*

- [ ] **Página Pública da Loja (`/shop/:id`)**
  - [ ] Criar componente `StoreProfileComponent` (Visão do Comprador).
  - [ ] Exibir cabeçalho da loja (Nome, Descrição, Logo/Avatar).
  - [ ] Listagem de produtos filtrada **apenas** pelos itens daquela loja.
  - [ ] URL amigável para compartilhamento (Ex: `localhost:4200/shop/tech-store-oficial`).

- [ ] **Melhorias na Home (Landing Page)**
  - [ ] Criar seção "Lojas em Destaque" ou carrossel de lojas.
  - [ ] Botão "Ver todas as lojas" que leva para uma lista de vendedores.

---

## 🚨 1. Integração & Core (Fixes)
- [x] **Atualizar Modelos (Interfaces)**
  - [x] Ajustar `Store.ts` e `Product.ts`.
  - [x] Criar `Order.ts` e `Page.ts`.
- [x] **Tratamento de Erros Visual**
  - [x] Atualizar `AuthInterceptor`.
  - [x] Exibir alertas (`alert` provisório) com mensagem do Backend.

## 🛒 2. Experiência de Compra
- [ ] **Detalhes do Produto (Variações)**
  - [ ] Componente visual para selecionar Variação (Botões Interativos).
  - [ ] Bloquear botão "Comprar" se a variação estiver sem estoque.
- [ ] **Checkout e Pagamento**
  - [ ] Tela de escolha de Endereço.
  - [ ] Exibir resumo do pedido com Frete.

## 🏪 3. Portal do Vendedor (Privado)
- [ ] **Dashboard da Loja**
  - [x] Lista de pedidos (`seller-orders`).
  - [ ] Gráficos de vendas.
- [ ] **Cadastro de Produto Otimizado**
  - [ ] Upload de imagens real.

## 👤 4. Área do Usuário (Privado)
- [x] **Meus Pedidos**
  - [x] Listagem visual (`my-orders`).
  - [ ] Ações: Confirmar Recebimento / Avaliar.
