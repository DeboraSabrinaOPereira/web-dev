# COMPIA - Loja Virtual

Front-end acadêmico para venda de livros físicos, e-books e kits da Editora
COMPIA. O projeto segue a organização do template `compia-web-react-main` e
adapta o visual do `bookstore-master` ao domínio da editora.

Não há back-end. Catálogo editado, carrinho, sessão, pedidos, notificações e logs
são persistidos no `localStorage` do navegador. Frete, pagamentos e envio de
e-mails são simulações identificadas na interface.

## Executar

Requisitos: Node.js 22.

```bash
npm install
npm run dev
```

Para verificar o projeto:

```bash
npm run lint
npm run typecheck
npm run build
```

## Publicar na Vercel

1. Envie esta pasta para um repositório no GitHub.
2. Importe o repositório em `https://vercel.com/new`.
3. Mantenha o preset `Next.js`, o diretório raiz `./` e os comandos
   detectados automaticamente.
4. Não é necessário cadastrar variáveis de ambiente.
5. Clique em `Deploy`.

## Contas de demonstração

| Perfil | E-mail | Senha |
| --- | --- | --- |
| Cliente | `cliente@exemplo.com` | `cliente123` |
| Administrador | `admin@compia.com.br` | `admin123` |
| Editor | `editor@compia.com.br` | `editor123` |
| Vendedor | `vendedor@compia.com.br` | `vendedor123` |

## Fluxos implementados

- Catálogo com busca, filtros, categorias, tags e detalhes.
- CRUD de produtos com imagem, descrição, preço, estoque, categoria e status.
- Carrinho, impostos simulados, Correios, transportadora e retirada local.
- Checkout responsivo com cartão e PIX simulados.
- Gestão de pedidos, notificações automáticas simuladas e logs.
- Área do cliente com histórico e downloads de e-books pagos.
- Acesso por perfis de administrador, editor e vendedor.

## Organização principal

```text
src/
├── components/   Cabeçalho, rodapé, cards e elementos compartilhados
├── contexts/     Navegação, autenticação, catálogo/pedidos e carrinho
├── data/         Catálogo inicial
├── lib/          Formatação, armazenamento, impostos, frete e pagamento
└── screens/      Loja, checkout, conta e painel administrativo
```

A lista de tarefas pronta para o GitHub está em `ISSUES.md`.
