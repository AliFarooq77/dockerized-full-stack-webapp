import React, { useState } from 'react';
import { Plus, Trash2, Coffee, Sun, Moon } from 'lucide-react';

const MealTracker = ({ meals, addFood, removeFood, getDailyTotals }) => {
  const [newFoods, setNewFoods] = useState({
    'breakfast': { name: "", calories: "", protein: "", carbs: "", fat: "" },
    'lunch': { name: "", calories: "", protein: "", carbs: "", fat: "" },
    'dinner': { name: "", calories: "", protein: "", carbs: "", fat: "" }
  });

  // Safety check: ensure meals is an array
  const safeMeals = Array.isArray(meals) ? meals : [];

  // Debug logging
  console.log('MealTracker received meals:', meals);
  console.log('Safe meals:', safeMeals);

  // If meals array is completely empty or null, this should not happen
  // because App.js should always provide at least emptyMeals structure
  if (safeMeals.length === 0) {
    console.warn('MealTracker received empty meals array - this should not happen');
    return (
      <div className="mt-4">
        <div className="alert alert-warning text-center">
          No meal structure available. Please refresh the page.
        </div>
      </div>
    );
  }

  const handleInputChange = (mealId, field, value) => {
    setNewFoods(prev => ({
      ...prev,
      [mealId]: {
        ...prev[mealId],
        [field]: value
      }
    }));
  };

  const handleAddFood = (mealId) => {
    const newFood = newFoods[mealId];
    if (newFood.name && newFood.calories) {
      addFood(mealId, newFood);

      // Reset the form fields
      setNewFoods(prev => ({
        ...prev,
        [mealId]: { name: "", calories: "", protein: "", carbs: "", fat: "" }
      }));
    }
  };

  const getIconComponent = (iconName) => {
    const icons = {
      'Coffee': Coffee,
      'Sun': Sun,
      'Moon': Moon
    };
    return icons[iconName] || Coffee; // Default to Coffee icon if not found
  };

  return (
    <div className="mt-4">
      {safeMeals.map(meal => {
        // Ensure meal has required properties
        if (!meal || !meal.name || !meal.id) {
          console.warn('Invalid meal structure:', meal);
          return null;
        }

        // Ensure meal.foods is an array
        const foods = Array.isArray(meal.foods) ? meal.foods : [];
        const mealWithSafeFoods = { ...meal, foods };

        const mealTotals = getDailyTotals([mealWithSafeFoods]);
        const MealIcon = getIconComponent(meal.icon);

        return (
          <div key={meal.id} className="card mb-4">
            <div className="card-header">
              <h5 className="card-title mb-0 d-flex align-items-center">
                <MealIcon className="text-primary me-2" />
                {meal.name}
                <span className="ms-2 fs-6 fw-normal text-muted">
                  ({mealTotals.calories} cal)
                </span>
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-4">
                <div className="row g-2 mb-3">
                  <div className="col-md-3">
                    <input
                      type="text"
                      placeholder="Food name"
                      className="form-control"
                      value={newFoods[meal.id]?.name || ""}
                      onChange={(e) => handleInputChange(meal.id, 'name', e.target.value)}
                    />
                  </div>
                  <div className="col-md-2">
                    <input
                      type="number"
                      placeholder="Calories"
                      className="form-control"
                      value={newFoods[meal.id]?.calories || ""}
                      onChange={(e) => handleInputChange(meal.id, 'calories', e.target.value)}
                    />
                  </div>
                  <div className="col-md-2">
                    <input
                      type="number"
                      placeholder="Protein (g)"
                      className="form-control"
                      value={newFoods[meal.id]?.protein || ""}
                      onChange={(e) => handleInputChange(meal.id, 'protein', e.target.value)}
                    />
                  </div>
                  <div className="col-md-2">
                    <input
                      type="number"
                      placeholder="Carbs (g)"
                      className="form-control"
                      value={newFoods[meal.id]?.carbs || ""}
                      onChange={(e) => handleInputChange(meal.id, 'carbs', e.target.value)}
                    />
                  </div>
                  <div className="col-md-2">
                    <input
                      type="number"
                      placeholder="Fat (g)"
                      className="form-control"
                      value={newFoods[meal.id]?.fat || ""}
                      onChange={(e) => handleInputChange(meal.id, 'fat', e.target.value)}
                    />
                  </div>
                  <div className="col-md-1">
                    <button
                      onClick={() => handleAddFood(meal.id)}
                      className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
                    >
                      <Plus size={20} className="me-1" />
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div className="vstack gap-2">
                {foods.length === 0 ? (
                  <div className="text-muted text-center p-3">
                    No foods added for this meal yet.
                  </div>
                ) : (
                  foods.map((food, index) => {
                    // Safety check for each food item
                    if (!food || typeof food !== 'object') {
                      return null;
                    }

                    return (
                      <div key={food.id || index} className="p-3 bg-light rounded d-flex align-items-center justify-content-between">
                        <div className="row flex-grow-1 align-items-center">
                          <div className="col-md-3 fw-medium">{food.name || 'Unknown Food'}</div>
                          <div className="col-md-2">{food.calories || 0} cal</div>
                          <div className="col-md-2">{food.protein || 0}g protein</div>
                          <div className="col-md-2">{food.carbs || 0}g carbs</div>
                          <div className="col-md-2">{food.fat || 0}g fat</div>
                        </div>
                        <button
                          onClick={() => removeFood(meal.id, food.id)} // Pass food.id instead of food.name
                          className="btn btn-link text-danger p-2"
                          disabled={!food.id} // Disable if no ID (shouldn't happen)
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MealTracker;