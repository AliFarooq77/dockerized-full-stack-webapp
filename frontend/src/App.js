import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'react-calendar/dist/Calendar.css';
import NavBar from './NavBar';
import MealTracker from './MealTracker';
import DailySummary from './DailySummary';
import 'bootstrap/dist/css/bootstrap.min.css';

// Empty meals structure (used when no data exists for a date)
export const emptyMeals = [
  {
    id: 'breakfast',
    databaseId: 1, // Set to match your database IDs
    name: "Breakfast",
    icon: 'Coffee',
    foods: []
  },
  {
    id: 'lunch',
    databaseId: 2, // Set to match your database IDs
    name: "Lunch",
    icon: 'Sun',
    foods: []
  },
  {
    id: 'dinner',
    databaseId: 3, // Set to match your database IDs
    name: "Dinner",
    icon: 'Moon',
    foods: []
  }
];

const App = () => {
  const [activeTab, setActiveTab] = useState('meals');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [nutritionData, setNutritionData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create consistent date key function
  const createDateKey = (date) => {
    // Use local date components to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const dateKey = createDateKey(selectedDate);
  const mealsForSelectedDate = nutritionData[dateKey];
  
  // Ensure mealsForSelectedDate is always an array with valid structure
  const safeMealsData = (mealsForSelectedDate && Array.isArray(mealsForSelectedDate)) 
    ? mealsForSelectedDate 
    : emptyMeals;
    
  console.log('App.js - dateKey:', dateKey);
  console.log('App.js - mealsForSelectedDate:', mealsForSelectedDate);
  console.log('App.js - safeMealsData:', safeMealsData);

  // Format date for API call (YYYY-MM-DD) - consistent with dateKey
  const formatDateForAPI = (date) => {
    return createDateKey(date);
  };

  // Fetch meals data from API
  const fetchMealsData = async (date) => {
    const formattedDate = formatDateForAPI(date);
    const currentDateKey = createDateKey(date);
    
    // Don't fetch if we already have data for this date
    if (nutritionData[currentDateKey]) {
      console.log(`Data already exists for ${currentDateKey}`);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    console.log(`Fetching data for: ${formattedDate}`);
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/meals/${formattedDate}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          // No data for this date is normal, use empty meals
          console.log(`No data found for ${formattedDate}, using empty meals`);
          setNutritionData(prevData => ({
            ...prevData,
            [currentDateKey]: emptyMeals
          }));
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Received data for ${formattedDate}:`, data);
      
      // Check if data exists and is not empty
      if (!data || (Array.isArray(data) && data.length === 0) || Object.keys(data).length === 0) {
        // No data for this date, use empty meals
        setNutritionData(prevData => ({
          ...prevData,
          [currentDateKey]: emptyMeals
        }));
      } else {
        // Transform API data to match your component structure
        const transformedData = transformAPIData(data);
        
        setNutritionData(prevData => ({
          ...prevData,
          [currentDateKey]: transformedData
        }));
      }
    } catch (error) {
      console.error('Error fetching meals data:', error);
      setError('Failed to load meals data');
      // Use empty meals as fallback
      setNutritionData(prevData => ({
        ...prevData,
        [currentDateKey]: emptyMeals
      }));
    } finally {
      setLoading(false);
    }
  };

  // Transform API data to match component structure
  const transformAPIData = (apiData) => {
    console.log('Transforming API data:', apiData);
    
    if (!Array.isArray(apiData)) {
      return emptyMeals;
    }
    
    // Group meals by name to handle multiple foods per meal
    const mealGroups = {};
    
    apiData.forEach(meal => {
      const mealName = meal.name?.toLowerCase();
      if (!mealGroups[mealName]) {
        mealGroups[mealName] = {
          id: mealName,
          databaseId: meal.id, // Store the database ID
          name: meal.name,
          icon: meal.icon,
          foods: []
        };
      }
      
      // Add all foods from this meal (with their IDs)
      if (Array.isArray(meal.foods)) {
        mealGroups[mealName].foods.push(...meal.foods);
      }
    });
    
    // Convert to array and ensure we have all three meals
    const transformedMeals = [];
    
    // Add breakfast
    transformedMeals.push(mealGroups['breakfast'] || {
      id: 'breakfast',
      databaseId: 1, // Default database ID for breakfast
      name: 'Breakfast',
      icon: 'Coffee',
      foods: []
    });
    
    // Add lunch
    transformedMeals.push(mealGroups['lunch'] || {
      id: 'lunch',
      databaseId: 2, // Default database ID for lunch
      name: 'Lunch',
      icon: 'Sun',
      foods: []
    });
    
    // Add dinner
    transformedMeals.push(mealGroups['dinner'] || {
      id: 'dinner',
      databaseId: 3, // Default database ID for dinner
      name: 'Dinner',
      icon: 'Moon',
      foods: []
    });
    
    console.log('Transformed meals:', transformedMeals);
    return transformedMeals;
  };

  // Single useEffect to handle date changes
  useEffect(() => {
    console.log(`Selected date changed to: ${createDateKey(selectedDate)}`);
    fetchMealsData(selectedDate);
  }, [selectedDate]); // Only depend on selectedDate

  // Calculate daily totals
  const getDailyTotals = (mealData) => {
    if (!Array.isArray(mealData)) {
      return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    }

    return mealData.reduce((acc, meal) => {
      if (!meal || !Array.isArray(meal.foods)) {
        return acc;
      }

      const mealTotals = meal.foods.reduce((foodAcc, food) => ({
        calories: Number(foodAcc.calories) + Number(food.calories || 0),
        protein: Number(foodAcc.protein) + Number(food.protein || 0),
        carbs: Number(foodAcc.carbs) + Number(food.carbs || 0),
        fat: Number(foodAcc.fat) + Number(food.fat || 0)
      }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

      return {
        calories: acc.calories + mealTotals.calories,
        protein: acc.protein + mealTotals.protein,
        carbs: acc.carbs + mealTotals.carbs,
        fat: acc.fat + mealTotals.fat
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const addFood = async (mealId, newFood) => {
    const currentDateKey = createDateKey(selectedDate);
    const formattedDate = formatDateForAPI(selectedDate);
    
    console.log('=== ADD FOOD DEBUG ===');
    console.log('Selected Date:', selectedDate);
    console.log('Current Date Key:', currentDateKey);
    console.log('Formatted Date for API:', formattedDate);
    console.log('Meal ID:', mealId);
    console.log('New Food:', newFood);
    
    // Find the meal by ID (now using string IDs like 'breakfast', 'lunch', 'dinner')
    const targetMeal = safeMealsData.find(meal => meal.id === mealId);
    if (!targetMeal) {
      console.error('Meal not found:', mealId);
      setError('Meal not found');
      return;
    }
    
    // POST to Laravel API
    let responseData = null; // Declare responseData outside try block
    try {
      const requestBody = {
        meal_id: targetMeal.databaseId, // Use the database ID instead of meal_name
        date: formattedDate,
        ...newFood
      };
      
      console.log('Request body:', requestBody);
      
      const response = await fetch('http://localhost:8000/api/meals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      responseData = await response.json(); // Assign to the declared variable
      console.log('Backend response:', responseData);
      console.log('Food added successfully to backend');
      
    } catch (error) {
      console.error("Error adding food:", error);
      setError('Failed to add food');
      return;
    }

    // Update frontend state - add the food with the ID from the response
    const updatedMeals = safeMealsData.map(meal => {
      if (meal.id === mealId) {
        return {
          ...meal,
          foods: [...meal.foods, {
            id: responseData?.food?.id, // Use optional chaining for safety
            ...newFood,
            calories: Number(newFood.calories || 0),
            protein: Number(newFood.protein || 0),
            carbs: Number(newFood.carbs || 0),
            fat: Number(newFood.fat || 0)
          }]
        };
      }
      return meal;
    });

    console.log('Updated meals for date key:', currentDateKey);
    console.log('Updated meals:', updatedMeals);

    setNutritionData(prevData => {
      const newData = {
        ...prevData,
        [currentDateKey]: updatedMeals
      };
      console.log('New nutrition data state:', newData);
      return newData;
    });
    
    console.log('=== END ADD FOOD DEBUG ===');
  };

  const removeFood = async (mealId, foodId) => {
    const currentDateKey = createDateKey(selectedDate);
    
    console.log(`Removing food with ID "${foodId}" from meal ${mealId} for date ${currentDateKey}`);
    
    // DELETE request to backend using the food ID
    try {
      const response = await fetch(`http://localhost:8000/api/foods/${foodId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('Food removed successfully from backend');
    } catch (error) {
      console.error("Error deleting food:", error);
      setError('Failed to remove food');
      return;
    }

    // Update frontend state
    const updatedMeals = safeMealsData.map(meal => {
      if (meal.id === mealId) {
        return {
          ...meal,
          foods: meal.foods.filter(food => food.id !== foodId)
        };
      }
      return meal;
    });

    setNutritionData(prevData => ({
      ...prevData,
      [currentDateKey]: updatedMeals
    }));
  };

  return (
    <Router>
      <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="d-flex justify-content-center mb-4">
        <Calendar
          value={selectedDate}
          onChange={setSelectedDate}
        />
      </div>
      
      {/* Debug Info */}
      <div className="container mb-3">
        <div className="alert alert-light">
          <small>
            Selected Date: {selectedDate.toLocaleDateString()} | 
            Date Key: {dateKey} | 
            Has Data: {nutritionData[dateKey] ? 'Yes' : 'No'}
          </small>
        </div>
      </div>
      
      {/* Loading and Error States */}
      {loading && (
        <div className="container">
          <div className="alert alert-info text-center">
            Loading meals data...
          </div>
        </div>
      )}
      
      {error && (
        <div className="container">
          <div className="alert alert-warning text-center">
            {error}
            <button 
              className="btn btn-sm btn-outline-primary ms-2" 
              onClick={() => {
                setError(null);
                fetchMealsData(selectedDate);
              }}
            >
              Retry
            </button>
          </div>
        </div>
      )}
      
      <div className="container">
        {!loading && (
          <Routes>
            <Route 
              path="/" 
              element={
                <MealTracker 
                  meals={safeMealsData} 
                  addFood={addFood} 
                  removeFood={removeFood} 
                  getDailyTotals={getDailyTotals} 
                />
              } 
            />
            <Route 
              path="/summary" 
              element={
                <DailySummary 
                  nutritionData={nutritionData} 
                  selectedDate={selectedDate}
                  getDailyTotals={getDailyTotals} 
                />
              } 
            />
          </Routes>
        )}
      </div>
    </Router>
  );
};

export default App;