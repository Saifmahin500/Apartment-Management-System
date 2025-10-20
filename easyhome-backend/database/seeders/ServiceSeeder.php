<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Service;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        Service::create(['name' => 'Plumbing', 'description' => 'Fix water issues', 'base_charge' => 200]);
        Service::create(['name' => 'Cleaning', 'description' => 'Room and floor cleaning', 'base_charge' => 150]);
        Service::create(['name' => 'Electrical', 'description' => 'Wiring and light fixing', 'base_charge' => 250]);
    }
}
