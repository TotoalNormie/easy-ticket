import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { FormEvent, useEffect, useState } from 'react';

const stripePromise = loadStripe(
	'pk_test_51OeitfDkhb5CGVpn7iOaGuHN8NO3nGa24DcBgJGRk60xvSHPd3nX3BYVMFVz8vsoYhZuJf5AOxsDG92aecFedjnv00RuB6FoAE'
);

const MyStripeComponent = () => {
	const [secret, setSecret] = useState<string | null>(null);

	useEffect(() => {
		axios
			.post('http://127.0.0.1:8000/api/create-payment-intent')
			.then(response => {
				console.log(response);
				setSecret(response.data.client_secret);
			})
			.catch(err => console.log(err));
	}, []);

	return secret ? (
		<Elements stripe={stripePromise} options={{ clientSecret: secret }}>
			<MyPaymentForm secret={secret} />
		</Elements>
	) : null;
};

const MyPaymentForm = () => {
	const stripe = useStripe();
	const elements = useElements();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setLoading(true);

		if (!stripe || !elements) {
			// Handle error when Stripe.js hasn't loaded
			setLoading(false);
			return;
		}

		try {
			const result = await stripe.confirmPayment({
				//`Elements` instance that was used to create the Payment Element
				elements,
				confirmParams: {
					return_url: 'https://example.com/order/123/complete',
				},
			});
			// setError('');
			console.log(result);
			if(result.error) {
				setError(result.error.message);
			}else {
				setError('');
			}
		} catch (error) {
			// Handle any other errors
			console.log(error);
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<PaymentElement />
			<button type='submit' disabled={loading}>
				{loading ? 'Processing...' : 'Submit'}
			</button>
			<p>{error}</p>
		</form>
	);
};

export default MyStripeComponent;
