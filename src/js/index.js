// Global app controller

//http://food2fork.com/api/search
import Search from './models/Search';

const search = new Search('pizza');
search.getResults();
console.log(search);
