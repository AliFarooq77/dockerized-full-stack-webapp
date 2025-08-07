import React, { useState } from 'react';
import { Plus, Trash2, Coffee, Sun, Moon } from 'lucide-react';

const MealTracker = ({ meals, addFood, removeFood, getDailyTotals }) => {
  const [newFoods, setNewFoods] = useState({
    1: { name: "", calories: "", protein: "", carbs: "", fat: "" },
    2: { name: "", calories: "", protein: "", carbs: "", fat: "" },
    3: { name: "", calories: "", protein: "", carbs: "", fat: "" }
  });

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
    return icons[iconName];
  };

  return (
    <div className="mt-4">
      {meals.map(meal => {
        const mealTotals = getDailyTotals([meal]);
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
                      value={newFoods[meal.id].name}
                      onChange={(e) => handleInputChange(meal.id, 'name', e.target.value)}
                    />
                  </div>
                  <div className="col-md-2">
                    <input
                      type="number"
                      placeholder="Calories"
                      className="form-control"
                      value={newFoods[meal.id].calories}
                      onChange={(e) => handleInputChange(meal.id, 'calories', e.target.value)}
                    />
                  </div>
                  <div className="col-md-2">
                    <input
                      type="number"
                      placeholder="Protein (g)"
                      className="form-control"
                      value={newFoods[meal.id].protein}
                      onChange={(e) => handleInputChange(meal.id, 'protein', e.target.value)}
                    />
                  </div>
                  <div className="col-md-2">
                    <input
                      type="number"
                      placeholder="Carbs (g)"
                      className="form-control"
                      value={newFoods[meal.id].carbs}
                      onChange={(e) => handleInputChange(meal.id, 'carbs', e.target.value)}
                    />
                  </div>
                  <div className="col-md-2">
                    <input
                      type="number"
                      placeholder="Fat (g)"
                      className="form-control"
                      value={newFoods[meal.id].fat}
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
                {meal.foods.map((food, index) => (
                  <div key={index} className="p-3 bg-light rounded d-flex align-items-center justify-content-between">
                    <div className="row flex-grow-1 align-items-center">
                      <div className="col-md-3 fw-medium">{food.name}</div>
                      <div className="col-md-2">{food.calories} cal</div>
                      <div className="col-md-2">{food.protein}g protein</div>
                      <div className="col-md-2">{food.carbs}g carbs</div>
                      <div className="col-md-2">{food.fat}g fat</div>
                    </div>
                    <button
                      onClick={() => removeFood(meal.id, food.name)}
                      className="btn btn-link text-danger p-2"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MealTracker;
