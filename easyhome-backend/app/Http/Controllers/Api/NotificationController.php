<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Notification;

class NotificationController extends Controller
{
    // 🔹 Get all notifications for logged-in user
    public function index(Request $request)
    {
        $userId = $request->user()->id;
        $notifications = Notification::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($notifications);
    }

    // 🔹 Mark as read
    public function markAsRead($id)
    {
        $notification = Notification::findOrFail($id);
        $notification->update(['status' => 'Read']);
        return response()->json(['message' => 'Marked as read']);
    }

    // 🔹 Delete notification
    public function destroy($id)
    {
        Notification::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
