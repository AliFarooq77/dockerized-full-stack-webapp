<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Meal;
use App\Models\Food;

class MealController extends Controller
{
    public function index($date)
    {
        // Get all meals and their foods for the specified date
        $meals = Meal::with(['foods' => function ($query) use ($date) {
            $query->where('date', $date);
        }])->get();

        // Filter out meals that have no foods for this date
        $mealsWithFoods = $meals->filter(function ($meal) {
            return $meal->foods->isNotEmpty();
        });

        // Check if no meals found for the date
        if ($mealsWithFoods->isEmpty()) {
            return response()->json([
                'message' => 'No meals found for the specified date',
                'date' => $date
            ], 404);
        }

        $formattedMeals = $mealsWithFoods->map(function ($meal) {
            return [
                'id' => $meal->id,
                'name' => $meal->name,
                'icon' => $meal->icon,
                'foods' => $meal->foods->map(function ($food) {
                    return [
                        'id' => $food->id,
                        'name' => $food->name,
                        'calories' => $food->calories,
                        'protein' => $food->protein,
                        'carbs' => $food->carbs,
                        'fat' => $food->fat,
                        'date' => $food->date,
                    ];
                }),
            ];
        })->values(); // Reset array keys after filtering

        return response()->json($formattedMeals);
    }

    public function store(Request $request)
    {
        // Validate incoming request
        $validated = $request->validate([
            'meal_id' => 'required|exists:meals,id', // Use meal_id instead of meal_name
            'date' => 'required|date',
            'name' => 'required|string', // food name
            'calories' => 'required|numeric',
            'protein' => 'required|numeric',
            'carbs' => 'required|numeric',
            'fat' => 'required|numeric',
        ]);

        // Find the meal
        $meal = Meal::findOrFail($validated['meal_id']);

        // Create food entry and associate with meal
        $food = $meal->foods()->create([
            'name' => $validated['name'],
            'calories' => $validated['calories'],
            'protein' => $validated['protein'],
            'carbs' => $validated['carbs'],
            'fat' => $validated['fat'],
            'date' => $validated['date'],
        ]);

        return response()->json([
            'message' => 'Food item added successfully',
            'food' => [
                'id' => $food->id,
                'name' => $food->name,
                'calories' => $food->calories,
                'protein' => $food->protein,
                'carbs' => $food->carbs,
                'fat' => $food->fat,
                'date' => $food->date,
                'meal_id' => $food->meal_id,
            ]
        ], 201);
    }

public function deleteFood($foodId)
{
    // Try to find the food item by ID
    $food = Food::find($foodId);

    // If not found, return 404
    if (!$food) {
        return response()->json([
            'message' => 'Food item not found'
        ], 404);
    }

    // Delete the food item
    $food->delete();

    return response()->json([
        'message' => 'Food item deleted successfully'
    ]);
}

}