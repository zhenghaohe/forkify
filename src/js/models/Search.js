import axios from 'axios';

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults() {
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    const key = '0d2f14ad5fa3fdaa2547a936a2647828';
    try{
      const res = await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`);
      this.result = res.data.recipes; //
    } catch(error) {
      alert(error)
    }
  }
}
