<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    // 🔹 Show all notifications for logged user
    public function index(Request $request)
    {
        $user = $request->user();
        $notifications = Notification::where('user_id', $user->id)->latest()->get();
        return response()->json($notifications);
    }

    // 🔹 Create notification (Admin use)
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'type' => 'required|in:SMS,Email,System'
        ]);

        $notification = Notification::create($request->all());
        return response()->json(['message' => 'Notification sent successfully', 'data' => $notification]);
    }

    // 🔹 Mark notification as read
    public function markAsRead($id)
    {
        $notification = Notification::findOrFail($id);
        $notification->update(['status' => 'Read']);
        return response()->json(['message' => 'Notification marked as read']);
    }

    // 🔹 Delete notification
    public function destroy($id)
    {
        $notification = Notification::findOrFail($id);
        $notification->delete();
        return response()->json(['message' => 'Notification deleted']);
    }
}
