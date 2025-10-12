<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Expense;
use App\Models\ExpenseCategory;

class ExpenseController extends Controller
{
    public function index()
    {
        $expenses = Expense::with('category')->orderBy('date', 'desc')->get();
        return response()->json($expenses);
    }

    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:expense_categories,id',
            'title' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'date' => 'required|date',
            'description' => 'nullable|string',
        ]);

        $expense = Expense::create($request->all());

        return response()->json(['message' => 'Expense added successfully', 'expense' => $expense]);
    }

    public function update(Request $request, $id)
    {
        $expense = Expense::findOrFail($id);
        $request->validate([
            'category_id' => 'required|exists:expense_categories,id',
            'title' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'date' => 'required|date',
            'description' => 'nullable|string',
        ]);

        $expense->update($request->all());
        return response()->json(['message' => 'Expense updated successfully', 'expense' => $expense]);
    }

    public function destroy($id)
    {
        $expense = Expense::findOrFail($id);
        $expense->delete();
        return response()->json(['message' => 'Expense deleted successfully']);
    }
}
