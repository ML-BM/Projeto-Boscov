# Projeto-Boscov

## Como rodar o projeto

1. **Instale as dependências do backend:**
   ```bash
   cd backend
   npm install
   ```

2. **Inicie o backend:**
   ```bash
   node src/index.js
   ```
   O backend rodará em `http://localhost:3000`

3. **Abra um novo terminal e instale as dependências do frontend:**
   ```bash
   cd frontend/boscov
   npm install
   ```

4. **Inicie o frontend:**
   ```bash
   npm run dev
   ```
   O frontend rodará em `http://localhost:5173` (ou a porta exibida no terminal).

---

## Como acessar a documentação Swagger

1. Certifique-se de que o backend está rodando.
2. No navegador, acesse:
   ```
   http://localhost:3000/api-docs
   ```
3. Você verá a interface do Swagger com todas as rotas da API documentadas.