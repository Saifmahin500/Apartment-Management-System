<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    public function index()
    {
        return response()->json(Expense::with(['category', 'apartment', 'creator'])->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'apartment_id' => 'required|exists:buildings,id',
            'category_id' => 'required|exists:expense_categories,id',
            'amount' => 'required|numeric',
            'expense_date' => 'required|date'
        ]);

        $expense = Expense::create([
            'apartment_id' => $request->apartment_id,
            'category_id' => $request->category_id,
            'amount' => $request->amount,
            'note' => $request->note,
            'expense_date' => $request->expense_date,
            'created_by' => $request->user()->id,
        ]);

        return response()->json(['message' => 'Expense added successfully', 'data' => $expense]);
    }

    public function show($id)
    {
        return response()->json(Expense::with(['category', 'apartment'])->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $expense = Expense::findOrFail($id);
        $expense->update($request->all());
        return response()->json(['message' => 'Expense updated', 'data' => $expense]);
    }

    public function destroy($id)
    {
        $expense = Expense::findOrFail($id);
        $expense->delete();
        return response()->json(['message' => 'Expense deleted']);
    }
}
