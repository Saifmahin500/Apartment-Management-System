<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Setting;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class SettingController extends Controller
{
    /**
     * Show current system settings.
     */
    public function index()
    {
        $setting = Setting::first();

        if (!$setting) {
            return response()->json(['message' => 'No settings found'], 404);
        }

        return response()->json($setting);
    }

    /**
     * Update or create system settings.
     */
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'site_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string',
            'currency' => 'nullable|string|max:10',
            'payment_method' => 'nullable|string|max:50',
            'site_logo' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $setting = Setting::first() ?? new Setting();

        // Handle logo upload
        if ($request->hasFile('site_logo')) {
            // delete old logo if exists
            if ($setting->site_logo && Storage::exists('public/' . $setting->site_logo)) {
                Storage::delete('public/' . $setting->site_logo);
            }

            $path = $request->file('site_logo')->store('settings', 'public');
            $setting->site_logo = $path;
        }

        // Update other fields
        $setting->site_name = $request->site_name;
        $setting->email = $request->email;
        $setting->phone = $request->phone;
        $setting->address = $request->address;
        $setting->currency = $request->currency ?? 'BDT';
        $setting->payment_method = $request->payment_method ?? 'manual';
        $setting->save();

        return response()->json([
            'message' => 'Settings updated successfully',
            'data' => $setting,
        ]);
    }
}
