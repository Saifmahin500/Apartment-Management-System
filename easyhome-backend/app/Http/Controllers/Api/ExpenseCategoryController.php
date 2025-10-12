<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ExpenseCategory;

class ExpenseCategoryController extends Controller
{
    public function index()
    {
        return response()->json(ExpenseCategory::all());
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string|max:255']);
        $category = ExpenseCategory::create($request->all());
        return response()->json(['message' => 'Category added successfully', 'category' => $category]);
    }

    public function update(Request $request, $id)
    {
        $category = ExpenseCategory::findOrFail($id);
        $request->validate(['name' => 'required|string|max:255']);
        $category->update($request->all());
        return response()->json(['message' => 'Category updated successfully']);
    }

    public function destroy($id)
    {
        $category = ExpenseCategory::findOrFail($id);
        $category->delete();
        return response()->json(['message' => 'Category deleted successfully']);
    }
}
