<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('profile_photo')->nullable()->after('phone');
            $table->string('address')->nullable()->after('profile_photo');
            $table->enum('language', ['en', 'bn'])->default('en')->after('address');
            $table->boolean('notification_enabled')->default(true)->after('language');
            $table->string('timezone')->default('Asia/Dhaka')->after('notification_enabled');
            $table->text('about')->nullable()->after('timezone');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'profile_photo',
                'address',
                'language',
                'notification_enabled',
                'timezone',
                'about',
            ]);
        });
    }
};

