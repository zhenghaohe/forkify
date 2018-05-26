// Global app controller

//http://food2fork.com/api/search
import Search from './models/Search';

//global state
// - Search object
// - Current recipe object
// - Shopping list object
// - Favorite recipes
const state = {};

const controlSearch = async () => {
  // 1) Get query from view
  const query = 'pizza'; // testing
  if (query) {
    // 2) new search object added to state
    state.search = new Search(query);
    // 3) Prepare UI for results

    // 4) Seach for recipes
    await state.search.getResults();

    // 5) render results on UI after await
    console.log(state.search.result);
  }
}

document.querySelector('.search').addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
})
const search = new Search('pizza');
search.getResults();
