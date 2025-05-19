// import { MongoClient } from 'mongodb';

// async function main() {
//   const url = 'mongodb://127.0.0.1:27017/micro-blogging';
//   const client = new MongoClient(url);

//   try {
//     await client.connect();
//     console.log('Conectado ao Mongo!');
//     const db = client.db();
//   } catch (err) {
//     console.error('Erro ao conectar:', err);
//   } finally {
//     await client.close();
//     console.log('Conexão encerrada.');
//   }
// }

// main();

import { MongoClient } from 'mongodb';
import { User } from './model/User.js';

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'micro-blogging';

async function main() {
  const client = new MongoClient(url);
  
  try {
    await client.connect();
    console.log('Conectado ao MongoDB');

    const db = client.db(dbName);
    const userController = new User(db);

    // Criar um novo usuário
    await userController.createUser({
      username: 'joao123',
      email: '',
      password: 'senha123'
    });

    // Buscar por e-mail
    const encontrado = await userController.findUserByEmail('joao@example.com');
    console.log('Retornado:', encontrado);

    // Listar todos os usuários
    const todos = await userController.listAllUsers();
    console.log('Usuários:', todos);

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

main();
