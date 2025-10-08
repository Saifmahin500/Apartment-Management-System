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
        Schema::create('rents', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('flat_id');
            $table->string('month');
            $table->year('year');
            $table->decimal('rent_amount', 10, 2);
            $table->decimal('utility_amount', 10, 2)->default(0);
            $table->decimal('maintenance_charge', 10, 2)->default(0);
            $table->decimal('total_amount', 10, 2);
            $table->decimal('due_amount', 10, 2)->default(0);
            $table->enum('status', ['Paid', 'Due'])->default('Due');
            $table->timestamps();

            $table->foreign('flat_id')->references('id')->on('flats')->onDelete('cascade');
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rents');
    }
};
