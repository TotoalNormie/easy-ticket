<?php

namespace App\Http\Controllers;

use App\Models\OrderedTicket;
use App\Models\TicketType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Barryvdh\DomPDF\Facade\Pdf;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class OrderedTicketController extends Controller
{
    // ... (your existing code)

    function buy(Request $request)
    {
        try {
            $request->validate([
                'count' => 'required|integer|max:5',
                'ticketId' => 'required|integer',
            ]);
        } catch (ValidationException $e) {
            return response([
                'result' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }

        $count = $request->count;
        $ticketId = $request->ticketId;
        $available = $this->availableTickets($ticketId);

        $isAvailable = ($available - $count) >= 0;

        if (!$isAvailable) {
            return response()->json([
                'result' => false,
                'message' => 'Seats not available',
            ], 422);
        }

        // Use a transaction to ensure data consistency
        $orderedTickets = [];

        // Use a transaction to ensure data consistency
        \DB::transaction(function () use ($count, $ticketId, &$orderedTickets) {
            for ($i = 0; $i < $count; $i++) {
                $orderedTicket = new OrderedTicket;
                $orderedTicket->ticket_type_id = $ticketId;
                $orderedTicket->user_id = auth()->id();
                $orderedTicket->save();

                $orderedTickets[] = $orderedTicket->id;
            }
        }, 5); // 5 is the number of attempts for the transaction

       // return json response fro succes with ordered tickets
        return response()->json([
            'result' => true,
            'message' => 'Tickets bought successfully',
            'orderedTickets' => $orderedTickets,
        ]);

    }

    function generatePDF(Request $request)
    {
        // $data = [];

        $orderedTickets = $request->orderedTickets;
        // print_r($request->all());

        foreach ($orderedTickets as $orderedTicket) {
            $ticket = OrderedTicket::with('ticketType.event')->find($orderedTicket)->toArray();
            $qrCode = QrCode::size(200)->generate($ticket['id']);
            // print_r($ticket);
            $data[] = [
                'event' => $ticket['ticket_type']['event']['name'],
                'id' => $ticket['id'],
                'datetime' => $ticket['ticket_type']['event']['datetime'],
                'ticket' => $ticket['ticket_type']['ticket_name'],
                'qrCode' => $qrCode,
            ];

        }

        // Log::debug('Debugging $data:', $data);
        // print_r($data);

        $pdf = PDF::loadView('pdf.ticket', ['data' => $data]);

        return response($pdf->output(), 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'inline; filename="tickets.pdf"');
    }

    // ... (rest of your existing code)


    function getPrice($ticketId)
    {
        return TicketType::find($ticketId)->price;
    }

    static function availableTickets($ticketId)
    {
        $bought = OrderedTicket::where('ticket_type_id', $ticketId)->count();
        $ticketsType = TicketType::find($ticketId);
        if (!$ticketsType)
            return 'ticket type not found';
        $all = $ticketsType->seats;
        return $all - $bought;
    }

    function verifyTicket($orderedTicketId)
    {
        $ticket = OrderedTicket::with('ticketType', 'event')->find($orderedTicketId);

        return response()->json($ticket->all());
    }
}
