const inputBox = document.querySelector('.input-box');
const searchBtn = document.querySelector('.search-btn');
const container = document.querySelector('.recipe-container');
const popUp = document.querySelector('.popup-container');
const suggestionBox = document.querySelector('.suggestions-list');
const toggleBtn = document.getElementById('toggle-theme');
const pagination = document.getElementById('pagination');
const notification = document.getElementById('toast-notification');

let currentPage = 1;
let itemPerPage = 6;
let allMeals = [];

const renderPaginatedMeals = () => {
    container.innerHTML = '';
    const start = (currentPage - 1) * itemPerPage;
    const end = start + itemPerPage;
    const paginatedMeals = allMeals.slice(start, end);
    renderRecipe({ meals: paginatedMeals });
}

const renderPagination = () => {
    pagination.innerHTML = '';

    const totalPages = Math.ceil(allMeals.length / itemPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.classList.add('page-btn');
        if (i === currentPage){
          btn.style.fontWeight = 'bold';
          btn.style.backgroundColor = 'var(--accent-color)';
        }

        btn.addEventListener('click', () => {
            currentPage = i;
            renderPaginatedMeals();
            renderPagination();
        });

        pagination.appendChild(btn);
    }
}

inputBox.addEventListener('input', async () => {
    const query = inputBox.value.trim();
    if(query.length <= 0) {
        suggestionBox.innerHTML = '';
        return;
    }

    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const data = await res.json();

    suggestionBox.innerHTML = '';

    if (data.meals) {
        const suggestions = data.meals.map(meal => meal.strMeal);
        suggestions.forEach(meal => {
            const li = document.createElement('li');
            li.textContent = meal;

            li.addEventListener('click', () => {
                inputBox.value = meal;
                suggestionBox.innerHTML = '';
                fetchData(meal);
            });

            suggestionBox.appendChild(li);
        });
    }
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.suggestion-list')) {
        suggestionBox.innerHTML = '';
    }
});

document.addEventListener('click', (e) => {
    const isInsidePopup = e.target.closest('.popup-container');
    const isPopupButton = e.target.closest('.popUp-btn'); // to avoid closing when opening

    if (!isInsidePopup && !isPopupButton) {
        popUp.style.opacity = '0';
        popUp.style.left = '-100%';
    }
});

searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    fetchData(inputBox.value.trim());   
})

const addFavoriteMeal = (meal, addToFav) => {
    let saveMeals = JSON.parse(localStorage.getItem('meals')) || [];

    const mealIndex = saveMeals.findIndex(saved => saved.id === meal.idMeal);

    if (mealIndex === -1) {
        // Meal not saved yet – add to localStorage
        saveMeals.push({ id: meal.idMeal });
        addToFav.classList.add('active'); // toggle heart color
        // console.log('Saved to local storage');
    } else {
        // Meal is already saved – remove it
        saveMeals.splice(mealIndex, 1);
        addToFav.classList.remove('active');
        // console.log('Removed from local storage');
    }

    localStorage.setItem('meals', JSON.stringify(saveMeals));
};


const renderRecipe = (response) => {
    response.meals.forEach((meal,index) => {
        const recipeDiv = document.createElement('div');
        recipeDiv.classList.add('recipe-card');
        recipeDiv.innerHTML = 
        ` 
            <img src="${meal.strMealThumb}">
            <div class="card-desc">  
                <h3>${meal.strMeal}</h3>
                <p>${meal.strArea}</p>
                <p>${meal.strCategory}</p>
            </div>
            `      
        container.appendChild(recipeDiv);

        const popUpBtn = document.createElement('button');
        popUpBtn.classList.add('popUp-btn');
        popUpBtn.textContent = 'Show Ingredients';
        recipeDiv.appendChild(popUpBtn);

        const addToFav = document.createElement('button')
        addToFav.classList.add('add-to-fav');
        recipeDiv.appendChild(addToFav);

        const savedMeals = JSON.parse(localStorage.getItem('meals')) || [];
        const isSaved = savedMeals.some(saved => saved.id === meal.idMeal);
        if (isSaved) {
            addToFav.classList.add('active');
        }

        addToFav.addEventListener('click', (e) => {
            addFavoriteMeal(meal,addToFav);
        });

        popUpBtn.addEventListener('click', () => {
            showPopUp(meal);
        });
    });   
}

const getIngredients = (meal) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim()) {
            ingredients.push(`${ingredient} - ${measure}`);
        }
    }
    return ingredients;
};

const showPopUp = (meal) => {  
    popUp.innerHTML = '';
    popUp.innerHTML = 
    `
        <div class="cross-btn">
            <h4>❌</h4>
        </div>
        <div style="padding: 1rem;">
            <h2>${meal.strMeal}</h2>
            <img style="height: 10rem;" src="${meal.strMealThumb}" style="width:100%; border-radius:10px;" />
            <h3 style="margin-block: 1rem; font-size: 1.6rem;">Ingredients:</h3>
            <ul style="font-size: 1rem;">
                ${getIngredients(meal).map(ing => `<li>${ing}</li>`).join('')}
            </ul>
            <h3 style="margin-block: 1rem; font-size: 1.6rem;">Instructions:</h3>
            <p style="font-size: 1rem;">${meal.strInstructions}</p>
            <a href="${meal.strYoutube}" target="_blank">Watch on YouTube</a>
        </div>
    `

    const closePopup = popUp.querySelector('.cross-btn');
    closePopup.addEventListener('click', () => {
        popUp.style.opacity = '0';
        popUp.style.left = '-100%';

    });  

    popUp.style.opacity = '1';
    popUp.style.left = '50%';
}

toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

const fetchData = async(query) => {
    if(query.length <= 0){
        alert('You must write something .....');
        return ;
    }
    try {
        container.innerHTML = 'Fetching data ...'; 
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const response = await data.json();
        console.log(response)
        container.innerHTML = ""
        
        if(response.meals) {
            allMeals = response.meals;
            renderPaginatedMeals();
            renderPagination();
            // renderRecipe(response);
        } 
        else {
            container.innerHTML = `<p style="color:white; font-size:1.5rem;">No recipes found. Try something else.</p>`;
        }
    } 
    catch (error) {
        container.innerHTML = `<p style="color:red; font-size:1.5rem;">Something went wrong. Please try again later.</p>`;
    }
}
