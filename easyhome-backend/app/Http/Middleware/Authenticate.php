<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo($request)
    {
        // 🧠 API হলে redirect না করে JSON রেসপন্স পাঠাও
        if (! $request->expectsJson()) {
            abort(response()->json([
                'message' => 'Unauthenticated.'
            ], 401));
        }
    }
}
