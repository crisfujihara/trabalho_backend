export class Follow {
  constructor(db) {
    this.collection = db.collection('follows');
  }

  // follower comeca a seguir followee
  async followUser({ follower, followee }) {
    if (!follower || !followee) {
      throw new Error('follower e followee sao obrigatorios');
    }

    if (follower === followee) {
      throw new Error('nao e possivel seguir a si mesmo');
    }

    try {
      // cria indice unico para evitar duplicatas
      await this.collection.createIndex(
        { follower: 1, followee: 1 },
        { unique: true }
      );
      const date = new Date().toISOString();
      const result = await this.collection.insertOne({
        follower,
        followee,
        dateFollowed: date
      });
      return { id: result.insertedId, follower, followee, dateFollowed: date };
    } catch (err) {
      if (err.code === 11000) {
        throw new Error(`${follower} ja segue ${followee}`);
      }
      throw new Error('Erro ao criar follow: ' + err.message);
    }
  }

  // parar de seguir
  async unfollowUser({ follower, followee }) {
    if (!follower || !followee) {
      throw new Error('follower e followee sao obrigatorios');
    }
    const result = await this.collection.deleteOne({ follower, followee });
    if (result.deletedCount === 0) {
      throw new Error(`${follower} nao estava seguindo ${followee}`);
    }
    return true;
  }

  // retorna quem o usuario segue
  async getFollowing(username) {
    if (!username) {
      throw new Error('username obrigatorio');
    }
    const docs = await this.collection
      .find({ follower: username })
      .sort({ dateFollowed: -1 })
      .toArray();
    return docs.map(d => ({ followee: d.followee, dateFollowed: d.dateFollowed }));
  }

  // retorna quem segue o usuario
  async getFollowers(username) {
    if (!username) {
      throw new Error('username obrigatorio');
    }
    const docs = await this.collection
      .find({ followee: username })
      .sort({ dateFollowed: -1 })
      .toArray();
    return docs.map(d => ({ follower: d.follower, dateFollowed: d.dateFollowed }));
  }
}
