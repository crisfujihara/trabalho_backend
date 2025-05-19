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

  // atualizar por username
  async updateUser({ username, email, password }) {
    if (!username) {
      throw new Error('username obrigatorio');
    }
    const update = {};
    if (email) update.email = email;
    if (password) update.password = password;
    if (Object.keys(update).length === 0) {
      throw new Error('nenhum campo para atualizar');
    }
    try {
      const result = await this.coll.updateOne(
        { username },
        { $set: update }
      );
      if (result.matchedCount === 0) {
        throw new Error('usuario nao encontrado');
      }
      console.log('usuario atualizado:', username);
      return true;
    } catch (err) {
      throw new Error('erro atualizar usuario: ' + err.message);
    }
  }

  // remover por username
  async deleteUser(username) {
    if (!username) {
      throw new Error('username obrigatorio');
    }
    try {
      const result = await this.coll.deleteOne({ username });
      if (result.deletedCount === 0) {
        throw new Error('usuario nao encontrado');
      }
      console.log('usuario removido:', username);
      return true;
    } catch (err) {
      throw new Error('erro remover usuario: ' + err.message);
    }
  }
}


