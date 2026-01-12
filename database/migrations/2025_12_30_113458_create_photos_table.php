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
        Schema::create('photos', function (Blueprint $table) {
           $table->id();
            $table->foreignId('creator_id')->constrained('users')->onDelete('cascade'); // Links to creator
            $table->string('storage_path'); // Path to file in storage (e.g., 'photos/uuid.jpg')
            $table->string('title');
            $table->text('caption')->nullable();
            $table->string('location')->nullable();
            $table->json('tags')->nullable(); // Array of tags, e.g., ["nature", "sunset"]
            $table->unsignedBigInteger('views')->default(0);
            $table->unsignedBigInteger('likes_count')->default(0); // Denormalized for performance
            $table->unsignedBigInteger('comments_count')->default(0); // Denormalized for performance
            $table->boolean('flagged')->default(false); // For admin moderation
            $table->timestamps();
            $table->softDeletes(); // Soft delete for recovery

            // Indexes for optimizations
            $table->index('creator_id');
            $table->index('flagged');
            $table->index('created_at');  
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('photos');
    }
};
