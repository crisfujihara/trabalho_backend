export class User {
  constructor(db) {
    this.collection = db.collection('users');
  }

  // Criar usuário
  async createUser({ username, email, password }) {
    if (!username || !email || !password) {
      throw new Error('Todos os campos são obrigatórios para criar usuario');
    }
    try {
      const result = await this.collection.insertOne({ username, email, password });
      console.log('Usuário inserido:', result.insertedId);
      return result;
    } catch (err) {
      throw new Error('Erro ao inserir usuário: ' + err.message);
    }
  }

  // Buscar usuário por email
  async findUserByEmail(email) {
    if (!email) {
      throw new Error('O e-mail é obrigatório');
    }

    try {
      const user = await this.collection.findOne({ email });
      console.log('Usuário encontrado:', user);
      return user;
    } catch (err) {
      throw new Error('Erro ao buscar usuario: ' + err.message);
    }
  }

  // Listar todos os usuários
  async listAllUsers() {
    try {
      const users = await this.collection.find().toArray();
      return users;
    } catch (err) {
      throw new Error('Erro ao listar usuarios: ' + err.message);
    }
  }
}
