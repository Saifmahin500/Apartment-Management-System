<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('apartment_id');
            $table->unsignedBigInteger('category_id');
            $table->decimal('amount', 10, 2);
            $table->text('note')->nullable();
            $table->date('expense_date');
            $table->unsignedBigInteger('created_by');
            $table->timestamps();

            $table->foreign('apartment_id')->references('id')->on('buildings')->onDelete('cascade');
            $table->foreign('category_id')->references('id')->on('expense_categories')->onDelete('cascade');
            $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};
