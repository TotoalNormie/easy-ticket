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
    protected $messages = [
        'tickets.*.ticketName.required' => 'The ticket name field is required.',
        'tickets.*.ticketName.string' => 'The ticket name must be a string.',
        'tickets.*.ticketName.max' => 'The ticket name must not exceed :max characters.',
        'tickets.*.seats.required' => 'The seats field is required.',
        'tickets.*.seats.integer' => 'The seats field must be an integer.',
        'tickets.*.seats.min' => 'The seats field must be at least :min.',
        'tickets.*.seats.max' => 'The seats field must not exceed :max.',
        'tickets.*.price.required' => 'The price field is required.',
        'tickets.*.price.numeric' => 'The price field must be a number.',
        'tickets.*.price.between' => 'The price field must be between :min and :max.',
    ];
    
    function getById($id)
    {
        $event = Event::with('eventType')->with('tickets')->find($id);
        if (!$event) {
            return response()->json([
                'result' => false,
                'message' => 'Event not found',
            ], 422);
        }

        foreach ($event->tickets as $id => $ticket) {
            $event->tickets[$id]->seatsAvailable = OrderedTicketController::availableTickets($ticket->id);
        }

        return response()->json([
            'result' => true,
            'data' => $event
        ]);
    }
    function get(Request $request)
    {
        // Set default options
        $options = [
            'orderBy' => 'datetime', // Default order by datetime
            'orderDirection' => 'asc', // Default order direction ascending
            'limit' => 10, // Default limit
            'eventTypes' => [], // Default empty array for event types
        ];

        // Merge default options with the provided options from the request
        $options = array_merge($options, $request->all());

        // Validate options if needed

        // Query events table based on options, filter for future events, and event types
        $events = Event::with('eventType')->where('datetime', '>', Carbon::now())
            ->when(!empty($options['eventTypes']), function ($query) use ($options) {
                // If eventTypes are provided, filter by them
                $query->whereIn('event_type_id', $options['eventTypes']);
            })
            ->orderBy($options['orderBy'], $options['orderDirection'])
            ->limit($options['limit'])
            ->get();

        // Return the result
        return response()->json($events);
    }

    function create(Request $request, Event $event)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:20|unique:events,name',
                'description' => 'required|string|max:1000',
                'image' => 'required|string|max:1000',
                'eventType' => 'required|integer',
                'datetime' => 'required|string',
                'location' => 'required|string|max:100',
                'tickets' => 'required|array',
                'tickets.*.ticketName' => 'required|string|max:15',
                'tickets.*.seats' => 'required|integer|min:5|max:1000',
                'tickets.*.price' => 'required|numeric|between:0.01,999999.99',
            ], $this->messages);
        } catch (ValidationException $e) {
            return response([
                'result' => false,
                'message' => 'Validation failed',
                'errors' => array_map(function($error) {
                    return $error[0];
                }, $e->errors()),
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
        $event->image = $request->image;
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
                'image' => 'required|string|max:1000',
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

        $event = Event::find($id);

        if (!$event) {
            return response([
                'result' => false,
                'message' => 'event not found',
            ], 422);
        }
        // var

        $event->name = $request->name;
        $event->description = $request->description;
        $event->image = $request->image;
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
        $ticketIdArray = [];

        foreach ($request->tickets as $ticket) {
            $ticketObject = TicketType::find($ticket['id']);
            if (!$ticketObject) {
                return response([
                    'result' => false,
                    'message' => 'ticket not found',
                ], 422);
            }
            $ticketObject->update([
                'ticket_name' => $ticket['ticketName'],
                'seats' => $ticket['seats'],
                'price' => $ticket['price'],
            ]);
            $ticketIdArray[] = $ticket['id'];
        }

        TicketType::where('event_id', $id)->whereNotIn('id', $ticketIdArray)->delete();

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
