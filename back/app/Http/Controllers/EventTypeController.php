<?php

namespace App\Http\Controllers;

use App\Models\EventType;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class EventTypeController extends Controller
{
    function create(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:25',
            ]);
        } catch (ValidationException $e) {
            return response([
                'result' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
                'input' => $request->all(),
            ], 422);
        }

        EventType::create([
            'type_name' => $request->name,
        ]);

        return response([
            'result' => true,
            'message' => 'Event type added successfully',
        ]);
    }

    function update(Request $request, $id)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:25',
            ]);
        } catch (ValidationException $e) {
            return response([
                'result' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
                'input' => $request->all(),
            ], 422);
        }

        EventType::find($id)->update([
            'type_name' => $request->name,
        ]);

        return response([
            'result' => true,
            'message' => 'Event type updated successfully',
        ]);
    }

    function remove($id)
    {
        $eventType = EventType::find($id);

        if ($eventType) {
            $eventType->delete();
            return response()->json(['result' => true, 'message' => 'Event type deleted successfully']);
        } else {
            return response()->json(['result' => false, 'message' => 'Event type not found'], 422);
        }
    }
}


