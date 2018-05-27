// represent the shopping list of ingredients through an object
import uniqid from 'uniqid'; // unique identifier for each item


export default class List {
  constructor() {
    this.items = [];
  }

  add(count, unit, ingredient) {
    const item = {
      id: uniqid(),
      count,
      unit,
      ingredient
    }
    this.items.push(item);
    return item;
  }

  delete(id) {
    const index = this.items.findIndex(item => item.id === id);
    this.items.splice(index, 1);
  }

  updateCount(id, newCount) {
    this.items.find(item => item.id === id).count = newCount;
  }
}
