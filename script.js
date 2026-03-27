/*
Mapping from MealDB Categories to TheCocktailDB drink ingredient
You can customize or expand this object to suit your needs.
*/
const mealCategoryToCocktailIngredient = {
  Beef: "whiskey",
  Chicken: "gin",
  Dessert: "amaretto",
  Lamb: "vodka",
  Miscellaneous: "vodka",
  Pasta: "tequila",
  Pork: "tequila",
  Seafood: "rum",
  Side: "brandy",
  Starter: "rum",
  Vegetarian: "gin",
  Breakfast: "vodka",
  Goat: "whiskey",
  Vegan: "rum",
  default: "cola"
  // Add more if needed; otherwise default to something like 'cola'
};

/*
    2) Main Initialization Function
       Called on page load to start all the requests:
       - Fetch random meal
       - Display meal
       - Map meal category to spirit
       - Fetch matching (or random) cocktail
       - Display cocktail
*/
function init() {
  fetchRandomMeal()
    .then((meal) => {
      displayMealData(meal);
      const spirit = mapMealCategoryToDrinkIngredient(meal.strCategory);
      return fetchCocktailByDrinkIngredient(spirit);
    })
    .then((cocktail) => {
      displayCocktailData(cocktail);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

/*
 Fetch a Random Meal from TheMealDB
 Returns a Promise that resolves with the meal object
 */
async function fetchRandomMeal() {
  const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
  const data = await response.json();
  
  console.log(data);

  return data.meals[0];
}

/*
Display Meal Data in the DOM
Receives a meal object with fields like:
  strMeal, strMealThumb, strCategory, strInstructions,
  strIngredientX, strMeasureX, etc.
*/
function displayMealData(meal) {
    document.getElementById("mealName").textContent = meal.strMeal;
    document.getElementById("mealImage").src = meal.strMealThumb;
    document.getElementById("mealCategory").textContent = meal.strCategory;
    const ingredientList = document.getElementById("mealIngredients");
    ingredientList.innerHTML = "";
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        if (ingredient && ingredient.trim() !== "") {
            const list = document.createElement("li");
            list.textContent = `${measure} ${ingredient}`;
            ingredientList.appendChild(list);
        }
    }
    document.getElementById("mealInstructions").innerHTML = meal.strInstructions.replace(/\r?\n/g, "<br><br>");
}

/*
Convert MealDB Category to a TheCocktailDB Spirit
Looks up category in our map, or defaults to 'cola'
*/
function mapMealCategoryToDrinkIngredient(category) {
  if (!category) return "cola";
  return mealCategoryToCocktailIngredient[category] || mealCategoryToCocktailIngredient.default;
}

/*
Fetch a Cocktail Using a Spirit from TheCocktailDB
Returns Promise that resolves to cocktail object
We call https://www.thecocktaildb.com/api/json/v1/1/search.php?s=DRINK_INGREDIENT to get a list of cocktails
Don't forget encodeURIComponent()
If no cocktails found, fetch random
*/
async function fetchCocktailByDrinkIngredient(drinkIngredient) {
  const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(drinkIngredient)}`)
  const data = await response.json();
  console.log(data);
  
  if (data.drinks && data.drinks.length > 0) {
    return data.drinks[0]; 
  } else {
    return await fetchRandomCocktail(); 
  }
}

/*
Fetch a Random Cocktail (backup in case nothing is found by the search)
Returns a Promise that resolves to cocktail object
*/
async function fetchRandomCocktail() {
    const response = await fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php");
    const data = await response.json();
    console.log(data);
    return data.drinks[0];
}

/*
Display Cocktail Data in the DOM
*/
function displayCocktailData(cocktail) {
    const coctailContainer = document.getElementById("cocktail-container");
    coctailContainer.innerHTML = ""; 
    
    const title = document.createElement("h2");
    title.textContent = cocktail.strDrink;
    
    const image = document.createElement("img");
    image.src = cocktail.strDrinkThumb;
    image.alt = cocktail.strDrink;
    
    const category = document.createElement("p");
    category.textContent = `Category: ${cocktail.strCategory}`;
    
    const instructions = document.createElement("p");
    instructions.innerHTML = cocktail.strInstructions.replace(/\r?\n/g, "<br><br>");
    
    const ingredientList = document.createElement("ul");
    for (let i = 1; i <= 15; i++) {
        const ingredient = cocktail[`strIngredient${i}`];
        const measure = cocktail[`strMeasure${i}`];
        
        if (ingredient && ingredient.trim() !== "") {
            const listItem = document.createElement("li");
            listItem.textContent = `${measure || ""} ${ingredient}`;
            ingredientList.appendChild(listItem);
        }
    }
    
    coctailContainer.appendChild(title);
    coctailContainer.appendChild(image);
    coctailContainer.appendChild(category);
    coctailContainer.appendChild(instructions);
    coctailContainer.appendChild(ingredientList);
}


/*
Call init() when the page loads
*/
window.onload = init;
