<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SettingsController extends Controller
{
    // ✅ 1. Get Settings
    public function getSettings()
    {
        $user = Auth::user();

        return response()->json([
            'status' => true,
            'message' => 'Settings fetched successfully.',
            'data' => [
                'language' => $user->language,
                'notification_enabled' => $user->notification_enabled,
                'timezone' => $user->timezone,
            ]
        ]);
    }

    // ✅ 2. Update Settings
    public function updateSettings(Request $request)
    {
        $request->validate([
            'language' => 'nullable|in:en,bn',
            'notification_enabled' => 'nullable|boolean',
            'timezone' => 'nullable|string',
        ]);

        $user = Auth::user();

        $user->language = $request->language ?? $user->language;
        $user->notification_enabled = $request->notification_enabled ?? $user->notification_enabled;
        $user->timezone = $request->timezone ?? $user->timezone;
        $user->save();

        return response()->json([
            'status' => true,
            'message' => 'Settings updated successfully.',
            'data' => $user
        ]);
    }
}
