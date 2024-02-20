import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ErrorData, EventData } from './Home';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { FormEvent, useState } from 'react';
import { isLoggedIn } from '../auth/isLoggedIn';
import { sendRequest } from '../global/sendRequest';
import Error from './Error';

const Event = () => {
	const { id } = useParams();
	const user = isLoggedIn();	
	const queryClient = useQueryClient();
	const [errors, setErrors] = useState('');
	const [tickets, setTickets] = useState<false | number[]>(false);

	const {
		isLoading,
		error,
		data: event,
	} = useQuery<EventData, ErrorData>({
		queryKey: ['events', id],
		queryFn: () =>
			axios
				.get(`http://127.0.0.1:8000/api/event/${parseInt(id!)}`)
				.then(res => res.data.data),
	});

	const { mutate, status } = useMutation({
		mutationFn: (data: any) => sendRequest('post', 'buy-ticket', data),
		mutationKey: ['tickets'],
		onSuccess: response => {
			console.log('success', response);

			setTickets(response.data.orderedTickets);
			setErrors('');
		},
		onError: (res: any) => {
			const error = res.response.data as ErrorData;
			if (!error.result) {
				console.log();
				if (error.errors) {
					setErrors(Object.values(error.errors)[0][0]);
					return;
				}
				setErrors(error.message);
			}
			console.log('error:', res);
		},
	});

	useQuery({
		queryFn: () => sendRequest('post', 'get-ticket', {orderedTickets: tickets}, {}, 'blob'),
		queryKey: ['tickets', tickets],
		onSuccess: (response) => {
			console.log('success', response);
			const blob = new Blob([response.data], { type: 'application/pdf' });

			// Create a link element and set its href to the blob URL
			const link = document.createElement('a');
			link.href = window.URL.createObjectURL(blob);
	
			// Set the link's download attribute to specify the file name
			link.download = 'tickets.pdf';
	
			// Append the link to the document and trigger a click event to start the download
			document.body.appendChild(link);
			link.click();
	
			// Remove the link from the document after the download is complete
			document.body.removeChild(link);
			queryClient.invalidateQueries('tickets');
			setTickets(false);
		},
		onError: (error) => {
			console.log({orderedTickets: tickets});
			console.log(error)
		},
		enabled: !!tickets
	})

	const buyTicket = (e: FormEvent) => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		const data = Object.fromEntries(formData.entries());
		console.log(data);
		mutate(data);
	};

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Error: {error.message}</div>;

	return (
		<div>
			{errors && <Error setError={() => setErrors('')}>{errors}</Error>}
			<div className='event'>
				<div className='image'>
					<img src={event?.image} alt='' />
				</div>
				<div>
					<h2>{event?.name}</h2>
					<p>
						<strong>{event?.location}</strong>
					</p>
					<p>{event?.event_type.type_name}</p>
					<li>{event?.datetime}</li>
					<div className='ticketTypes'>
						{/* list of tickets with their names and prices */}
						{event?.tickets.map(ticket => (
							<div key={ticket.id} className='ticket-type'>
								<h4>{ticket.ticket_name}</h4>|<p>{ticket.price}€</p>|
								<p>{ticket.seatsAvailable} seats available</p>
							</div>
						))}
					</div>
				</div>
			</div>
			<div>
				{user ? (
					<>
						<h2>Buy ticket:</h2>
						<form onSubmit={buyTicket}>
							<label>
								Ticket Type:
								<select name='ticketId'>
									{event?.tickets.map(ticket => (
										<option key={ticket.id} value={ticket.id}>
											{ticket.ticket_name}
										</option>
									))}
								</select>
							</label>
							<label>
								Ticket Count:
								<input type='number' name='count' defaultValue='1' min='1' />
							</label>
							{status === 'loading' ? (
								<input type='submit' disabled value='Buing...' />
							) : (
								<input type='submit' value='Buy' />
							)}
						</form>
					</>
				) : (
					<Link to='/login'>You need to log in to buy a ticket</Link>
				)}
			</div>
		</div>
	);
};

export default Event;
