import React from 'react';
import {initialMeals} from './App.js'
import { UtensilsCrossed } from 'lucide-react';

const DailySummary = ({ nutritionData, selectedDate, getDailyTotals }) => {
  const selectedDayData = nutritionData[selectedDate.toDateString()] || initialMeals;
  const dailyTotals = getDailyTotals(selectedDayData);
  
  return (
    <div className="card mt-4">
      <div className="card-header">
        <h5 className="card-title mb-0 d-flex align-items-center">
          <UtensilsCrossed className="text-primary me-2" />
          Daily Summary
        </h5>
      </div>
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-6">
            <div className="p-3 bg-primary bg-opacity-10 rounded">
              <div className="h3 text-primary mb-1">{dailyTotals.calories}</div>
              <div className="small text-muted">Calories</div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="p-3 bg-success bg-opacity-10 rounded">
              <div className="h3 text-success mb-1">{dailyTotals.protein}g</div>
              <div className="small text-muted">Protein</div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="p-3 bg-warning bg-opacity-10 rounded">
              <div className="h3 text-warning mb-1">{dailyTotals.carbs}g</div>
              <div className="small text-muted">Carbs</div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="p-3 bg-danger bg-opacity-10 rounded">
              <div className="h3 text-danger mb-1">{dailyTotals.fat}g</div>
              <div className="small text-muted">Fat</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailySummary;