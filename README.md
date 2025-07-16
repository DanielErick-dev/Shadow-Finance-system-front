# Shadow Finance System- Assistente Financeiro

![Imagem do WhatsApp de 2025-06-30 à(s) 18 48 29_6f1ce7f1](https://github.com/user-attachments/assets/eac28cd8-9f51-4c68-9b37-25802b44af69)

## 🚀 Sobre o Projeto

**Shadow Finance** é um assistente financeiro completo, projetado para oferecer uma visão clara e controle total sobre a vida financeira do usuário, com foco em investimentos, dividendos e despesas.

Este repositório contém o código do **Front-End**, desenvolvido com **Next.js**, que consome uma API RESTful construída separadamente com Django REST Framework.

**🔗 Link para o repositório do Back-End:** `disponivel ainda essa semana`

---

## 🌟 Principais Funcionalidades (Implementadas)

- **🔐 Autenticação Segura:** Tela de login com uma interface moderna e segura para acesso ao sistema.
- **📈 Painel de Controle:** Uma central de navegação intuitiva para acesso a todas as funcionalidades do sistema.
- **💰 Gestão de Dividendos:**
    - CRUD completo para registro de proventos recebidos.
    - Filtros dinâmicos por ano e mês.
    - Paginação para lidar com grandes volumes de dados.
    - Componentes reutilizáveis (modais, cards) para uma experiência de usuário consistente.
    - Sincronização automática do estado da UI com a API após cada operação.
- **📱 Design 100% Responsivo:** Interface totalmente adaptada para uma experiência perfeita em desktops e dispositivos móveis.

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Propósito |
|---|---|
| **React & Next.js** | Framework principal para construção da interface e renderização. |
| **Tailwind CSS** | Framework CSS para estilização rápida e consistente. |
| **Axios** | Cliente HTTP para consumo da API back-end. |
| **Zustand** | Gerenciamento de estado global da aplicação. |
| **ShadcnUI** | biblioteca de componentes UI moderna baseada em Tailwind. |

---

## ⚙️ Como Rodar o Projeto (Front-End)

**Pré-requisitos:**
- Node.js e npm/yarn instalados.
- Uma instância do back-end (API) rodando.

**Passos:**
1.  Clone o repositório: `git clone https://github.com/DanielErick-dev/Shadow-Finance-system.git`
2.  Navegue até o diretório do projeto: `cd Shadow-Finance-system`
3.  Instale as dependências: `npm install`
4.  Crie um arquivo `.env.local` baseado no `.env.example`.
5.  Configure a variável de ambiente para apontar para a sua API: `NEXT_PUBLIC_API_URL=http://localhost:8000/api`
6.  Execute o servidor de desenvolvimento: `npm run dev`
7.  Acesse `http://localhost:3000` no seu navegador.

---

## 📝 Roadmap e Próximos Passos

- [ ] Desenvolvimento do **Dashboard** com gráficos e estatísticas.
- [ ] Implementação do módulo de **Controle de Despesas**.
- [ ] terminar desenvolvimento da **Tela de Investimentos**
