<style>
    body {
        font-family: sans-serif;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    td {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 2rem .5rem;
        
    }
</style>

<table>
    @foreach ($data as $ticket)
        <tr>
            <td>
                <p>Ticket Id: {{ $ticket['id'] }}</p>
                <p>Event: {{ $ticket['event'] }}</p>
                <p>Datetime: {{ $ticket['datetime'] }}</p>
                <p>Ticket: {{ $ticket['ticket'] }}</p>
            </td>
            <td>
                <img src="data:image/png;base64,{{ base64_encode($ticket['qrCode']) }}" alt="QR Code">
            </td>
        </tr>
    @endforeach
</table>
