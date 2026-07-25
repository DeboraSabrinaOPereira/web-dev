# Issues - Loja Virtual COMPIA

Escopo fechado pela especificação do projeto. As integrações externas devem ser
simuladas no front-end, sem back-end.

## Issue 01 - Preparar arquitetura e identidade visual responsiva

**Responsável sugerido:** Pessoa 1  
**Estimativa:** 0,5 dia  
**Dependências:** nenhuma  
**Labels:** `estrutura`, `frontend`, `design`

### Descrição

Organizar o projeto em componentes, contextos, dados, bibliotecas e páginas,
seguindo o padrão do `compia-web-react-main`, e aplicar o visual do
`bookstore-master` ao domínio da COMPIA.

### Checklist

- [ ] Criar as pastas `components`, `contexts`, `data`, `lib` e `pages`.
- [ ] Aplicar a paleta verde, tipografia, cabeçalho, navegação, botões, cards e
      rodapé do Bookstore.
- [ ] Reutilizar as imagens de livros, estante e fundo do Bookstore.
- [ ] Garantir adaptação para desktop, tablet e celular.

### Critérios de aceite

- A aplicação abre sem erros e possui navegação clara.
- O visual é reconhecível como o Bookstore, adaptado para a COMPIA.
- Não há seção de blog, avaliações ou outra funcionalidade fora da especificação.

## Issue 02 - Implementar catálogo, busca, filtros e detalhes

**Responsável sugerido:** Pessoa 1  
**Estimativa:** 1 dia  
**Dependências:** Issue 01  
**Labels:** `catálogo`, `frontend`

### Descrição

Criar a vitrine de livros físicos, e-books e kits, com busca, organização por
categorias e tags, filtros e página de detalhes.

### Checklist

- [ ] Exibir imagem, título, autor, formato, preço e disponibilidade.
- [ ] Implementar busca por título, autor, categoria e tag.
- [ ] Filtrar por formato, categoria e tag.
- [ ] Exibir descrição, estoque e informações do produto.
- [ ] Permitir adicionar o produto ao carrinho.

### Critérios de aceite

- Produtos inativos não aparecem na vitrine.
- Os filtros podem ser combinados e atualizam o resultado.
- Produtos físicos sem estoque não podem ser adicionados.

## Issue 03 - Implementar gestão de produtos e categorias

**Responsável sugerido:** Pessoa 1  
**Estimativa:** 1,5 dia  
**Dependências:** Issues 01 e 02  
**Labels:** `admin`, `catálogo`, `crud`

### Descrição

Criar o CRUD de produtos no painel, incluindo dados exigidos pela especificação
e inclusão de novas categorias sem alteração no código.

### Checklist

- [ ] Cadastrar, editar e excluir livros físicos, e-books e kits.
- [ ] Editar título, autor, descrição, formato, preço, estoque e status.
- [ ] Inserir imagem por upload com pré-visualização.
- [ ] Informar categoria e tags livremente.
- [ ] Persistir alterações no `localStorage`.

### Critérios de aceite

- Um produto cadastrado como ativo aparece no catálogo.
- Uma nova categoria aparece automaticamente nos filtros.
- Alterações e exclusões são refletidas sem recarregar o código.

## Issue 04 - Implementar carrinho e cálculo de impostos

**Responsável sugerido:** Pessoa 2  
**Estimativa:** 1 dia  
**Dependências:** Issue 02  
**Labels:** `carrinho`, `checkout`

### Descrição

Criar o carrinho com atualização de quantidades, remoção e cálculo automático
de subtotal e impostos simulados.

### Checklist

- [ ] Adicionar produtos ao carrinho.
- [ ] Aumentar, diminuir e remover itens.
- [ ] Calcular subtotal automaticamente.
- [ ] Calcular imposto simulado para itens físicos e digitais.
- [ ] Persistir o carrinho no `localStorage`.

### Critérios de aceite

- Totais mudam imediatamente ao alterar quantidades.
- Remover a última unidade remove o item.
- O carrinho continua disponível após atualizar a página.

## Issue 05 - Simular frete, transportadora e retirada local

**Responsável sugerido:** Pessoa 2  
**Estimativa:** 0,5 dia  
**Dependências:** Issue 04  
**Labels:** `frete`, `integração-mock`

### Descrição

Implementar cotação simples de entrega para produtos físicos, simulando
Correios e transportadora, além da retirada na editora.

### Checklist

- [ ] Validar CEP com 8 dígitos.
- [ ] Gerar opções simuladas PAC e SEDEX.
- [ ] Gerar opção de transportadora parceira.
- [ ] Disponibilizar retirada local gratuita.
- [ ] Tratar carrinho somente digital como entrega gratuita.

### Critérios de aceite

- O checkout só é liberado após selecionar a entrega de itens físicos.
- Cada opção mostra transportador, preço e prazo.
- Retirada local e entrega digital têm frete zero.

## Issue 06 - Implementar checkout e pagamentos simulados

**Responsável sugerido:** Pessoa 2  
**Estimativa:** 1,5 dia  
**Dependências:** Issues 04 e 05  
**Labels:** `checkout`, `pagamento`, `integração-mock`

### Descrição

Criar checkout responsivo com dados do comprador, endereço quando necessário e
pagamento mockado por cartão ou PIX.

### Checklist

- [ ] Validar dados do comprador e endereço.
- [ ] Aceitar e identificar Visa, Mastercard, Elo e American Express.
- [ ] Validar número, nome, validade e CVV do cartão.
- [ ] Aprovar o cartão em modo simulado.
- [ ] Gerar chave aleatória e QR Code de demonstração para PIX.
- [ ] Criar pedido pago para cartão e pendente para PIX.

### Critérios de aceite

- Dados inválidos impedem a finalização e exibem mensagens objetivas.
- Nenhuma credencial ou cobrança real é necessária.
- A confirmação mostra protocolo, pagamento, entrega e total.

## Issue 07 - Implementar autenticação e acesso por perfis

**Responsável sugerido:** Pessoa 3  
**Estimativa:** 1 dia  
**Dependências:** Issue 01  
**Labels:** `acesso`, `segurança`, `frontend`

### Descrição

Criar login demonstrativo e aplicar permissões para cliente, administrador,
editor e vendedor.

### Checklist

- [ ] Criar contas demonstrativas para os quatro perfis.
- [ ] Restringir a área do cliente ao perfil cliente.
- [ ] Permitir ao editor somente a gestão de produtos.
- [ ] Permitir ao vendedor pedidos e notificações.
- [ ] Permitir ao administrador todas as áreas e logs.
- [ ] Persistir a sessão no `localStorage`.

### Critérios de aceite

- Perfis não autorizados não acessam áreas administrativas indevidas.
- A navegação mostra apenas as opções compatíveis com o perfil atual.
- Sair encerra a sessão e retorna ao catálogo.

## Issue 08 - Implementar gestão de pedidos e e-mails simulados

**Responsável sugerido:** Pessoa 3  
**Estimativa:** 1 dia  
**Dependências:** Issues 06 e 07  
**Labels:** `pedidos`, `admin`, `notificações`

### Descrição

Criar acompanhamento administrativo dos pedidos e uma caixa de saída para as
notificações automáticas simuladas.

### Checklist

- [ ] Listar pedido, cliente, itens, entrega, pagamento e total.
- [ ] Alterar status entre pendente, pago, separação, enviado, entregue e cancelado.
- [ ] Registrar e-mail de recebimento do pedido.
- [ ] Registrar e-mails de pagamento e mudança de status.
- [ ] Liberar e notificar e-books quando o pagamento for aprovado.

### Critérios de aceite

- Alterar o status atualiza imediatamente o pedido.
- Toda notificação fica visível na caixa de saída.
- Aprovar um PIX pendente libera os materiais digitais.

## Issue 09 - Implementar área do cliente e entrega de e-books

**Responsável sugerido:** Pessoa 3  
**Estimativa:** 1 dia  
**Dependências:** Issues 07 e 08  
**Labels:** `cliente`, `pedidos`, `ebook`

### Descrição

Criar área restrita com histórico de compras e links de download dos e-books
pagos.

### Checklist

- [ ] Mostrar dados da conta de cliente.
- [ ] Filtrar pedidos pelo e-mail da conta.
- [ ] Exibir itens, data, entrega, total e status.
- [ ] Mostrar links de download somente para pedidos pagos.
- [ ] Manter os downloads também na confirmação do cartão.

### Critérios de aceite

- O cliente visualiza somente pedidos associados ao seu e-mail.
- PIX pendente não libera download.
- O link baixa um arquivo demonstrativo funcional.

## Issue 10 - Integrar fluxos e validar a entrega

**Responsável sugerido:** Pessoas 1, 2 e 3  
**Estimativa:** 1 dia  
**Dependências:** Issues 01 a 09  
**Labels:** `integração`, `responsividade`, `qa`

### Descrição

Revisar em conjunto os fluxos exigidos, a responsividade e a ausência de erros
antes da entrega.

### Checklist

- [ ] Testar compra física com frete e cartão.
- [ ] Testar compra de e-book com PIX, aprovação e download.
- [ ] Testar CRUD e criação de nova categoria.
- [ ] Testar permissões de admin, editor e vendedor.
- [ ] Testar registro de e-mails e logs.
- [ ] Testar desktop, tablet e celular.
- [ ] Executar lint e build de produção sem erros.

### Critérios de aceite

- Todos os fluxos da especificação funcionam no mesmo navegador.
- A interface não apresenta conteúdo cortado ou navegação quebrada.
- O projeto pode ser iniciado seguindo o README.
