// Global app controller

//http://food2fork.com/api/search
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Like from './models/Like';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likeView from './views/likeView';


import { elements, renderLoader, clearLoader } from './views/base';




//global state
// - Search object
// - Current recipe object
// - Shopping list object
// - Favorite recipes
const state = {};

//testing

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
      // Prepare UI for changes
      recipeView.clearRecipe();
      renderLoader(elements.recipe);

      // Highlight selected recipe
      if (state.search) {
        searchView.highlightSelected(id);
      }

      // Create new recipe object
      state.recipe = new Recipe(id);

      try {
        // Get recipe data and parse ingredients
        await state.recipe.getRecipe();
        state.recipe.parseIngredients();

        // calculate
        state.recipe.calcTime();
        state.recipe.calcServings();

        // render recipe
        clearLoader();
        recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
        );
      }
        catch (err) {
          console.log(err);
            alert('Error processing recipe!');
        }
      }
};


// LIST CONTROLLER
const controlList = () => {
  // Create a new list if there is none
  if (!state.list) state.list = new List();

  // Add ingredients to the list and UI
  state.recipe.ingredients.forEach( item => {
    const newItem = state.list.add(item.count, item.unit, item.ingredient);
    listView.renderItem(newItem);
  })
}

// Handle delete and update list item event
elements.shopping.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;

  // Handle the delete button
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    // Delete from state
    state.list.delete(id);

    // Delete from UI
    listView.deleteItem(id);

  // handle the count update
  } else if (e.target.matches('.shopping__count-value')) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
})

state.likes = new Like();
// LIKE CONTROLLER
const controlLike = () => {
  if (!state.likes) state.likes = new Like();
  const id = state.recipe.id;

  if (!state.likes.isLiked(id)) { // if not liked yet
    // Add like to the state
    const newLike = state.likes.add(
      id,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );

    // Toggle the like button
    likeView.toggleLikeBtn(true);
    // Add like to UI list
    console.log(state.likes);

  } else { // already liked
    // Remove like from the state
    state.likes.delete(id)
    // Toggle the like button
    likeView.toggleLikeBtn(false);

    //

  }
};




// handling recipe button clicks
elements.recipe.addEventListener('click', e => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) { // decrease
    if (state.recipe.servings > 1) { // servings must be positive number
      state.recipe.updateServings('des');
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) { // increase
    state.recipe.updateServings('ins');
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) { // add item to shopping cart
    // Add ingredients to shopping List
    controlList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    // Like controller
    controlLike();
  }
});

['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipe));
window.state = state;
