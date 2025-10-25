<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('flats', function (Blueprint $table) {
            if (!Schema::hasColumn('flats', 'tenant_id')) {
                $table->unsignedBigInteger('tenant_id')->nullable()->after('building_id');
                $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('set null');
            }
        });

        Schema::table('rents', function (Blueprint $table) {
            if (!Schema::hasColumn('rents', 'tenant_id')) {
                $table->unsignedBigInteger('tenant_id')->nullable()->after('flat_id');
                $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('set null');
            }
        });
    }

    public function down()
    {
        Schema::table('flats', function (Blueprint $table) {
            $table->dropForeign(['tenant_id']);
            $table->dropColumn('tenant_id');
        });

        Schema::table('rents', function (Blueprint $table) {
            $table->dropForeign(['tenant_id']);
            $table->dropColumn('tenant_id');
        });
    }
};
