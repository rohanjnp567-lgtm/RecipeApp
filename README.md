# 🍽️ Recipe Finder App

A **vanilla JavaScript web app** that allows users to search for recipes, view ingredients and instructions, and save their favorite meals locally.  
It uses the **[TheMealDB API](https://www.themealdb.com/api.php)** to fetch real-time meal data.

---

## 🚀 Features

### 🔍 **Search Recipes**
- Type any ingredient or meal name in the search bar.
- Get instant **auto-suggestions** as you type.
- Click a suggestion to quickly view recipe results.

### 🍛 **View Recipes**
- Displays recipes in clean **recipe cards**.
- Each card shows:
  - Meal name  
  - Area (e.g., Italian, Mexican)  
  - Category (e.g., Dessert, Seafood)  
  - Thumbnail image  

### 📜 **Detailed Recipe Popup**
- Click **“Show Ingredients”** to open a popup with:
  - Ingredients list  
  - Step-by-step instructions  
  - YouTube video link (if available)

### ❤️ **Favorites System**
- Save recipes to your favorites by clicking the **heart icon**.
- Favorites are stored in **localStorage**, so they persist even after reloading.
- Clicking again removes the meal from favorites.

### 🌗 **Dark Mode**
- Toggle between **light and dark mode** using a switch button.

### 🔢 **Pagination**
- Paginated display for recipe results.
- Each page shows **6 recipes**.
- Click page numbers to navigate through results.

---

## 🧩 Tech Stack

| Technology | Purpose |
|-------------|----------|
| **HTML5** | Structure and layout |
| **CSS3** | Styling and dark mode |
| **JavaScript (ES6)** | Functionality and API interaction |
| **TheMealDB API** | Recipe data source |
| **localStorage** | Save favorite meals |

---

## ⚙️ How It Works

### 1. **Search**
When a user types a query, the app sends a request to:
```bash
https://www.themealdb.com/api/json/v1/1/search.php?s={query}
```
### 2. **Render Recipes**
Results are displayed in paginated recipe cards.
Clicking a recipe’s Show Ingredients button opens a popup with detailed info.

### 3. **Add to Favorites**
Favorites are managed in localStorage as an array of saved meal IDs.

### 4. **Pagination**
The app slices the fetched meal array to show only a limited number of recipes per page.
