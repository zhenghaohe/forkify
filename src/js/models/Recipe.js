import axios from 'axios';
import { key, proxy } from '../config';

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios(`${proxy}http://food2fork.com/api/get?key=${key}&rId=${this.id}`);
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;

    } catch(error){
      alert('wrong recipe!');
    }
  }

  calcTime() {
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 5;
  }

  calcServings() {
    this.servings = 4;
  }

  parseIntgredients() {
    const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
    const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];

    const newIngredients = this.ingredients.map(ing => {
      // 1) uniform units
      ing = ing.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ing = ing.replace(unit, unitsShort[i]);
      });

      // 2) clean format
      ing = ing.replace(/ *\([^)]*\) */g, ' '); //remove everything inside parentheses

      // 3) parse ingredients into count, unit and description
      const arrIng = ing.split(' ');
      const unitIndex = arrIng.findIndex(unit => unitsShort.includes(unit)); //loop through unitsShort to see if the unit exists
      let objIng;

      if (unitIndex !== -1) { //there is a unit
        const arrCount = arrIng.slice(0, unitIndex);
        let count;
        if (arrCount.length === 1) {
            count = eval(arrIng[0].replace('-', '+'));
        } else {
            count = eval(arrIng.slice(0, unitIndex).join('+'));
        }
        objIng = {
            count,
            unit: arrIng[unitIndex],
            ing: arrIng.slice(unitIndex + 1).join(' ')
        };
      } else if (parseInt(arrIng[0])) { // there is no unit but a number
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: '',
          ing: arrIng.slice(1).join(' ')
        }
      } else if (unitIndex === -1) { // there is no unit and no number
        objIng = {
          count: 1,
          unit: '',
          ing
        }
      }
      return objIng;
    })
    this.ingredients = newIngredients;
  }
}
