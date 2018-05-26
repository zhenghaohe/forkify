// Global app controller

//http://food2fork.com/api/search
import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';



//global state
// - Search object
// - Current recipe object
// - Shopping list object
// - Favorite recipes
const state = {};


// SEARCH CONTROLLER
const controlSearch = async () => {
  // 1) Get query from view
  const query = searchView.getInput(); // testing

  if (query) {
    // 2) new search object added to state
    state.search = new Search(query);
    // 3) Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);
    try {
      // 4) Seach for recipes
      await state.search.getResults();
      // 5) render results on UI after await
      clearLoader();
      searchView.renderResults(state.search.result)
    } catch (e) {
      alert('wrong search');
    }
  }
}

document.querySelector('.search').addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});

// RECIPE CONTROLLER
const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');
    if (id) {
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        state.recipe = new Recipe(id);

        await state.recipe.getRecipe();
        state.recipe.parseIngredients();
        state.recipe.calcTime();
        state.recipe.calcServings();
        clearLoader();
        recipeView.renderRecipe(
                state.recipe,
                0
            );
        // clearLoader();
        // try {
        //     await state.recipe.getRecipe();
        //     state.recipe.parseIngredients();
        //     state.recipe.calcTime();
        //     state.recipe.calcServings();
        // } catch (err) {
        //     console.log(err);
        //     alert('Error processing recipe!');
        // }
    }
};

['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipe));
