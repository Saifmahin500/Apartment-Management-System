<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ExpenseCategory;
use Illuminate\Http\Request;

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
        return response()->json(['message' => 'Category created', 'data' => $category]);
    }

    public function show($id)
    {
        return response()->json(ExpenseCategory::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $category = ExpenseCategory::findOrFail($id);
        $category->update($request->all());
        return response()->json(['message' => 'Category updated', 'data' => $category]);
    }

    public function destroy($id)
    {
        $category = ExpenseCategory::findOrFail($id);
        $category->delete();
        return response()->json(['message' => 'Category deleted']);
    }
}
