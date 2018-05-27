export default class Like {
  constructor() {
    this.likes = [];
  }

  add(id, title, author, img) {
    const like = { id, title, author, img};
    this.likes.push(like);
    // Persist data using localStorage
    this.persistData();

    return like;
  }

  delete(id) {
    const index = this.likes.findIndex(like => like.id === id);
    this.likes.splice(index, 1);
    // Persist data using localStorage
    this.persistData();
  }

  isLiked(id) {
    return this.likes.findIndex(like => like.id === id) !== -1;
  }

  getNumLikes() {
    return this.likes.length;
  }

  persistData() {
    localStorage.setItem('likes', JSON.stringify(this.likes));
  }

  readStorage() {
    // restore data
    const storage = JSON.parse(localStorage.getItem('likes'));
    if (storage) this.likes = storage;
  }
}
