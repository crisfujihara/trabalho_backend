import { ObjectId } from 'mongodb';

export class Post {
  constructor(db) {
    this.collection = db.collection('posts');
  }

  // criar post
  async createPost({ username, content }) {
    if (!username || !content) {
      throw new Error('username e content sao obrigatorios');
    }
    const datePublished = new Date().toISOString();
    const result = await this.collection.insertOne({
      username,
      content,
      datePublished,
      comments: []
    });
    return {
      id: result.insertedId,
      username,
      content,
      datePublished,
      comments: []
    };
  }

    // atualizar post (apenas content)
  async updatePost({ postId, content }) {
    if (!postId || !content) {
      throw new Error('postId e content sao obrigatorios');
    }
    const _id = typeof postId === 'string' ? new ObjectId(postId) : postId;
    try {
      const res = await this.coll.updateOne(
        { _id },
        { $set: { content } }
      );
      if (res.matchedCount === 0) {
        throw new Error('post nao encontrado');
      }
      return true;
    } catch (err) {
      throw new Error('erro atualizar post: ' + err.message);
    }
  }

  // deletar post
  async deletePost(postId) {
    if (!postId) {
      throw new Error('postId obrigatorio');
    }
    const _id = typeof postId === 'string' ? new ObjectId(postId) : postId;
    try {
      const res = await this.coll.deleteOne({ _id });
      if (res.deletedCount === 0) {
        throw new Error('post nao encontrado');
      }
      return true;
    } catch (err) {
      throw new Error('erro deletar post: ' + err.message);
    }
  }

  // adicionar comentario
  async addComment({ postId, username, content }) {
    if (!postId || !username || !content) {
      throw new Error('postId, username e content sao obrigatorios');
    }
    const _postId = typeof postId === 'string' ? new ObjectId(postId) : postId;
    const comment = {
      id: new ObjectId(),
      username,
      content,
      datePublished: new Date().toISOString()
    };

    const updateResult = await this.collection.updateOne(
      { _id: _postId },
      { $push: { comments: comment } }
    );
    if (updateResult.matchedCount === 0) {
      throw new Error('post nao encontrado');
    }
    return comment;
  }

  // listar todos os posts
  async listAllPosts() {
    return await this.collection
      .find()
      .sort({ datePublished: -1 })
      .toArray();
  }

  // buscar post por id
  async findPostById(postId) {
    const _postId = typeof postId === 'string' ? new ObjectId(postId) : postId;
    const post = await this.collection.findOne({ _id: _postId });
    if (!post) throw new Error('post nao encontrado');
    return post;
  }
}
