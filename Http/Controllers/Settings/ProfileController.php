<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Determine the correct settings page component based on current route prefix.
     */
    private function getSettingsComponent(): string
    {
        $path = request()->getPathInfo();

        if (str_starts_with($path, '/admin')) {
            return 'settings/admin-settings';
        }

        if (str_starts_with($path, '/creator')) {
            return 'settings/creator-settings';
        }

        // Default for consumers or root settings
        return 'settings/profile';
    }

    /**
     * Get the correct redirect route name based on user's primary role.
     */
    private function getRedirectRouteName(): string
    {
        $user = Auth::user();

        if ($user->hasRole('admin')) {
            return 'admin.settings.edit';
        }

        if ($user->hasRole('creator')) {
            return 'creator.settings.edit';
        }

        return 'settings.profile.edit';
    }

    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render($this->getSettingsComponent(), [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return to_route($this->getRedirectRouteName());
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();
        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // After deletion, redirect to home (no role anymore)
        return redirect('/');
    }
}