<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use \Stripe\Checkout\Session;

class PaymentController extends Controller
{
    public function createPaymentIntent(Request $request)
    {
        Stripe::setApiKey(config('services.stripe.secret'));

        $domain = 'http://localhost:5173';

        try {
            $checkout_session = Session::create([
                'line_items' => [[
                  # Provide the exact Price ID (e.g. pr_1234) of the product you want to sell
                  'price' => '{{PRICE_ID}}',
                  'quantity' => 1,
                ]],
                'mode' => 'payment',
                'success_url' => $domain . '/success',
                'cancel_url' => $domain . '/canceled',
              ]);

            return response($checkout_session->url);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function confirmPayment(Request $request)
    {
        // Handle payment confirmation and update your database accordingly
    }
}
