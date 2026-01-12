<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::where('name', 'admin')->firstOrFail();

        $admin = User::updateOrCreate(
            ['email' => 'admin@pixora.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('admin123'), // Change this immediately!
                'email_verified_at' => now(),
                'status' => 'active',
            ]
        );

        $admin->roles()->sync([$adminRole->id]);
    }
}