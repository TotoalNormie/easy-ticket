<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\TicketType;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class EventController extends Controller
{
    function create(Request $request, Event $event)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:20',
                'description' => 'required|string|max:1000',
                'eventType' => 'required|integer',
                'datetime' => 'required|string',
                'location' => 'required|string|max:100',
                'tickets' => 'required|array',
                'tickets.*.ticketName' => 'required|string|max:15',
                'tickets.*.seats' => 'required|integer|min:5|max:1000',
                'tickets.*.price' => 'required|numeric|between:0.01,999999.99',
            ]);
        } catch (ValidationException $e) {
            return response([
                'result' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
                'input' => $request->all(),
            ], 422);
        }

        // $data = $request->input();

        $datetime = Carbon::parse($request->datetime);


        if ($datetime->isPast()) {
            return response([
                'result' => false,
                'message' => 'Validation failed',
                'errors' => [
                    'datetime' => 'Date can not be in the past',
                ]
            ], 422);
        }


        $event->name = $request->name;
        $event->event_type_id = $request->eventType;
        $event->description = $request->description;
        $event->datetime = $datetime;
        $event->location = $request->location;

        if (!$event->save()) {
            return response([
                'errors' => $event->getErrors()->all()
            ]);
        }

        $eventId = $event->id;

        foreach ($request->tickets as $ticket) {
            TicketType::create([
                'event_id' => $eventId,
                'ticket_name' => $ticket['ticketName'],
                'seats' => $ticket['seats'],
                'price' => $ticket['price'],
            ]);
        }

        return response([
            'result' => true,
            'message' => 'Event added successfully',
        ]);
    }

    function update(Request $request, $id)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:20',
                'description' => 'required|string|max:1000',
                'eventType' => 'required|integer',
                'datetime' => 'required|string',
                'location' => 'required|string|max:100',
                'tickets' => 'required|array',
                'tickets.*.ticketName' => 'required|string|max:15',
                'tickets.*.id' => 'required|integer',
                'tickets.*.seats' => 'required|integer|min:5|max:1000',
                'tickets.*.price' => 'required|numeric|between:0.01,999999.99',
            ]);
        } catch (ValidationException $e) {
            return response([
                'result' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
                'input' => $request->all(),
            ], 422);
        }

        // $data = $request->input();

        $datetime = Carbon::parse($request->datetime);


        if ($datetime->isPast()) {
            return response([
                'result' => false,
                'message' => 'Validation failed',
                'errors' => [
                    'datetime' => 'Date can not be in the past',
                ]
            ], 422);
        }

        $event = Event::with('tickets')->find($id);


        $event->name = $request->name;
        $event->description = $request->description;
        $event->event_type_id = $request->eventType;
        $event->datetime = $datetime;
        $event->location = $request->location;

        if (!$event->save()) {
            return response([
                'errors' => $event->getErrors()->all()
            ], 500);
        }
        // print_r($event->toArray());


        //     $eventId = $event->id;

        foreach ($request->tickets as $ticket) {
            TicketType::find($ticket['id'])->update([
                'ticket_name' => $ticket['ticketName'],
                'seats' => $ticket['seats'],
                'price' => $ticket['price'],
            ]);
        }

        return response([
            'result' => true,
            'message' => 'Event edited successfully',
        ]);
    }

    function remove($id)
    {
        $event = Event::find($id);

        if ($event) {
            $event->delete();

            return response()->json(['result' => true, 'message' => 'Event deleted successfully']);
        } else {
            return response()->json(['result' => false, 'message' => 'Event not found'], 422);
        }
    }


}
