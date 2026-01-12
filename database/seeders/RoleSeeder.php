<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
  public function run(): void
{
    $roles = ['consumer', 'creator', 'admin'];

    foreach ($roles as $role) {
        Role::firstOrCreate(
            ['name' => $role],
            ['description' => ucfirst($role) . ' role']
        );
    }
}
}
