<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureRole
{
    public function handle(Request $request, Closure $next, string $role)
    {
        if (! $request->user()?->hasRole($role)) {
            abort(403, 'Access denied.');
        }

        return $next($request);
    }
}