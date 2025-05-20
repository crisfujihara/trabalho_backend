import { MongoClient } from 'mongodb';
import readline from 'readline';
import { User }   from './model/User.js';
import { Post }   from './model/Post.js';
import { Follow } from './model/Follow.js';

async function main() {
  // conectar ao MongoDB
  const client = new MongoClient('mongodb://127.0.0.1:27017');
  await client.connect();
  const db = client.db('micro-blogging');

  // inicializar modelos
  const userModel   = new User(db);
  const postModel   = new Post(db);
  const followModel = new Follow(db);

  // configurar CLI
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  const question = q => new Promise(res => rl.question(q, ans => res(ans.trim())));

  // pausar ate o enter
  async function pause() {
    await question('\nPressione Enter para continuar...');
  }

  // exibir menu
  async function showMenu() {
    console.log(`
1  criar usuario
2  listar usuarios
3  buscar usuario por email
4  atualizar usuario
5  deletar usuario

6  criar post
7  listar posts
8  buscar post por id
9  filtrar posts por username

10 atualizar post
11 deletar post

12 adicionar comentario

13 seguir usuario
14 desseguir usuario
15 listar quem segue o usuario
16 listar quem o usuario segue

0  sair
`);
  }

  let running = true;
  while (running) {
    console.clear();
    await showMenu();
    const opt = await question('escolha: ');

    try {
      switch (opt) {
        case '1': {
          // criar usuario
          const u = await userModel.createUser({
            username: await question('username: '),
            email:    await question('email: '),
            password: await question('password: ')
          });
          console.log('\nusuario criado:', u);
          break;
        }
        case '2': {
          // listar usuarios
          const list = await userModel.listAllUsers();
          console.log('\n', list);
          break;
        }
        case '3': {
          // buscar usuario
          const email = await question('email: ');
          const u = await userModel.findUserByEmail(email);
          console.log('\n', u);
          break;
        }
        case '4': {
          // atualizar usuario
          const username = await question('username: ');
          const email    = await question('novo email (ou vazio): ');
          const pass     = await question('nova password (ou vazio): ');
          const ok = await userModel.updateUser({
            username,
            email:    email || undefined,
            password: pass  || undefined
          });
          console.log('\nusuario atualizado:', ok);
          break;
        }
        case '5': {
          // deletar usuario
          const username = await question('username: ');
          const ok = await userModel.deleteUser(username);
          console.log('\nusuario removido:', ok);
          break;
        }
        case '6': {
          // criar post
          const post = await postModel.createPost({
            username: await question('username: '),
            content:  await question('content: ')
          });
          console.log('\npost criado:', post);
          break;
        }
        case '7': {
          // listar posts
          const all = await postModel.listAllPosts();
          console.log('\n', JSON.stringify(all, null, 2));
          break;
        }
        case '8': {
          // buscar post por id
          const id = await question('postId: ');
          const p = await postModel.findPostById(id);
          console.log('\n', JSON.stringify(p, null, 2));
          break;
        }
        case '9': {
          // filtrar posts por usuario
          const name = await question('username: ');
          const all  = await postModel.listAllPosts();
          const filtered = all.filter(p => p.username === name);
          console.log('\n', JSON.stringify(filtered, null, 2));
          break;
        }
        case '10': {
          // atualizar post
          const id      = await question('postId: ');
          const content = await question('novo content: ');
          const ok = await postModel.updatePost({ postId: id, content });
          console.log('\npost atualizado:', ok);
          break;
        }
        case '11': {
          // deletar post
          const id = await question('postId: ');
          const ok = await postModel.deletePost(id);
          console.log('\npost deletado:', ok);
          break;
        }
        case '12': {
          // adicionar comentario
          const postId   = await question('postId: ');
          const username = await question('username: ');
          const content  = await question('content: ');
          const c = await postModel.addComment({ postId, username, content });
          console.log('\ncomentario adicionado:', c);
          break;
        }
        case '13': {
          // follow usuario
          const follower = await question('follower: ');
          const followee = await question('followee: ');
          const f = await followModel.followUser({ follower, followee });
          console.log('\nfollow criado:', f);
          break;
        }
        case '14': {
          // unfollow usuario
          const follower = await question('follower: ');
          const followee = await question('followee: ');
          const ok = await followModel.unfollowUser({ follower, followee });
          console.log('\nunfollow ok:', ok);
          break;
        }
        case '15': {
          // listar quem segue
          const name = await question('username: ');
          const list = await followModel.getFollowing(name);
          console.log('\nsegue:', list);
          break;
        }
        case '16': {
          // listar seguidores
          const name = await question('username: ');
          const list = await followModel.getFollowers(name);
          console.log('\nseguidores:', list);
          break;
        }
        case '0':
          // sair
          running = false;
          break;
        default:
          console.log('\nopcao invalida');
      }
    } catch (err) {
      console.error('\nerro:', err.message);
    }

    if (running) await pause();
  }

  rl.close();
  await client.close();
}

main().catch(err => console.error(err));
