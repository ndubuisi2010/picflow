<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CreatorSampleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Find the creator role
        $creatorRole = Role::where('name', 'creator')->firstOrFail();

        // Create or update the creator user
        $creator = User::updateOrCreate(
            ['email' => 'kenechukwuisiah184521@gmail.com'],
            [
                'name' => 'Kenechukwu Isiah',
                'password' => Hash::make('password'), // Change this in production!
                'email_verified_at' => now(),
                'status' => 'active',
                'creator_status' => 'active', // or 'pending' if you want admin approval first
            ]
        );

        // Assign the creator role (sync to avoid duplicates)
        $creator->roles()->syncWithoutDetaching([$creatorRole->id]);

        $this->command->info('Creator user created/updated: kenechukwuisiah184521@gmail.com');
        $this->command->info('Role: creator');
        $this->command->info('Login password: password (please change immediately)');
    }
}