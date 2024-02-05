<?php

namespace App\Http\Controllers;

use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class PDFController extends Controller
{
    function generatePDF()
    {
        $qrCode = QrCode::size(200)->generate('i love you');
        $data = [
            'title' => 'PDF with QR Code',
            'content' => 'This is a sample PDF document with data and a QR code.',
            'qrCode' => $qrCode
        ];

        try {

            $pdf = PDF::loadView('pdf.ticket', $data);

            // Return the PDF as a response
            return response($pdf->output())
                ->header('Content-Type', 'application/pdf')
                ->header('Content-Disposition', 'inline; filename="ticket.pdf"');

        } catch (\Exception $e) {
            // Handle PDF generation error
            return response()->json(['error' => 'Failed to generate PDF.']);
        }
    }
}