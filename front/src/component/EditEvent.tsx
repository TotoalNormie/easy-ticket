import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ErrorData, EventData, EventType } from './Home';
import { useEffect, useState } from 'react';
import { sendRequest } from '../global/sendRequest';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function objectHasKeys(obj: { [key: string]: string } | null, keys: string[]) {
	console.log(typeof obj);
	if (!obj) {
		return false;
	}
	for (let key of keys) {
		if (key in obj) {
			console.log('true');
			return true;
		}
	}
	console.log('false');

	return false;
}

const TicketType = ({
	name = '',
	price = 0,
	seats = 0,
	deleteElem,
	index,
	errors = {},
	id,
}: {
	name?: string;
	price?: number;
	seats?: number;
	id?: number;
	deleteElem: (index: number) => void;
	index: number;
	errors?: { [key: string]: string };
}) => {
	const error = {} as { [key: string]: string };
	for (let key in errors) {
		const splitKey = key.split('.');
		if (splitKey.length === 1) continue;
		if (parseInt(splitKey[1]) != index) continue;
		const newKey = splitKey.pop();
		if (!newKey) continue;
		error[newKey] = errors[key];
	}
	const isError = Object.keys(error).length > 0;
	return (
		<div className={`box ${isError ? 'error-border' : ''}`}>
			<h2>Ticket type</h2>
			<div className='form'>
				<input type='hidden' name={`tickets[${index}][id]`} value={id} />
				<label>
					Name:
					<input
						defaultValue={name}
						type='text'
						name={`tickets[${index}][ticketName]`}
						className={error?.ticketName ? 'error-border' : ''}
					/>
					{error?.ticketName && <p className='error-message'>{error?.ticketName}</p>}
				</label>
				<label>
					Price:
					<input
						defaultValue={price}
						type='number'
						step='0.01'
						name={`tickets[${index}][price]`}
						className={error?.price ? 'error-border' : ''}
					/>
					{error?.price && <p className='error-message'>{error?.price}</p>}
				</label>
				<label>
					Seat count:
					<input
						defaultValue={seats}
						type='number'
						name={`tickets[${index}][seats]`}
						className={error?.seats ? 'error-border' : ''}
					/>
					{error?.seats && <p className='error-message'>{error?.seats}</p>}
				</label>
				<button type='button' onClick={() => deleteElem(index)}>
					x
				</button>
			</div>
		</div>
	);
};

const EditEvent = () => {
	const queryClient = useQueryClient();
	const { eventId: id } = useParams();
	const { data: eventTypes } = useQuery<EventType[]>({
		queryKey: ['eventTypes'],
		queryFn: async () => {
			const response = await axios.get('http://127.0.0.1:8000/api/event-types');
			return response.data;
		},
	});
	const {
		mutate: editEvent,
		error,
		status,
	} = useMutation({
		mutationFn: (data: FormData) => sendRequest('post', `edit-event/${id}`, data),
		onSuccess: () => {
			queryClient.invalidateQueries(['events', id]);
			console.log('success');
		},
	});

	const {
		isLoading,
		data,
		error: eventErrorData,
	} = useQuery({
		queryFn: () => sendRequest('get', `event/${id}`),
		queryKey: ['events', id],
	});
	const event = data?.data as EventData;
	const eventError = eventErrorData as ErrorData;

	const validation: ErrorData | null = error as ErrorData;

	console.log(event);

	const deleteTicket = (index: number) => {
		console.log(index);
		if (tickets) setTickets(tickets.filter(elem => elem.index !== index));
	};
	const addTicket = () => {
		if (tickets) {
			setTickets([...tickets, { index: tickets.length + 1, name: '', price: 0, seats: 0 }]);
		} else {
			setTickets([{ index: 1, name: '', price: 0, seats: 0 }]);
		}
	};
	const [tickets, setTickets] = useState<{ [key: string]: string | number }[] | null>(null);

	useEffect(() => {
		// Set tickets state only on initial render
		if (event?.tickets && tickets === null) {
			const initialTickets = event?.tickets?.map((ticket, index) => ({
				...ticket,
				name: ticket.ticket_name,
				index,
			}));
			setTickets(initialTickets);
		}
	}, [event?.tickets, tickets?.length]);

	const handleSubmit = e => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		console.log(...formData);
		editEvent(formData);
	};

	if (isLoading || !eventTypes) return <div className='loader'></div>;
	if (eventError) return <div>{eventError?.message}</div>;
	// console.log(tickets);
	return (
		<form onSubmit={handleSubmit} className='gap'>
			<div
				className={`box ${
					objectHasKeys(validation?.errors, [
						'name',
						'description',
						'image',
						'datetime',
						'location',
						'eventType',
					])
						? 'error-border'
						: ''
				}`}>
				<h2>Event info</h2>
				<div className='form'>
					<label>
						Name:
						<input
							type='text'
							name='name'
							className={validation?.errors?.name ? 'error-border' : ''}
							defaultValue={event?.name}
						/>
						{validation?.errors?.name && (
							<p className='error-message'>{validation?.errors?.name}</p>
						)}
					</label>
					<label>
						Description:
						<input
							type='text'
							name='description'
							className={validation?.errors?.description ? 'error-border' : ''}
							defaultValue={event?.description}
						/>
						{validation?.errors?.description && (
							<p className='error-message'>{validation?.errors?.description}</p>
						)}
					</label>
					<label>
						Image:
						<input
							type='text'
							name='image'
							className={validation?.errors?.image ? 'error-border' : ''}
							defaultValue={event?.image}
						/>
						{validation?.errors?.image && (
							<p className='error-message'>{validation?.errors?.image}</p>
						)}
					</label>
					<label>
						Datetime:
						<input
							type='datetime-local'
							name='datetime'
							className={validation?.errors?.datetime ? 'error-border' : ''}
							defaultValue={event?.datetime}
						/>
						{validation?.errors?.datetime && (
							<p className='error-message'>{validation?.errors?.datetime}</p>
						)}
					</label>
					<label>
						Location:
						<input
							type='text'
							name='location'
							className={validation?.errors?.location ? 'error-border' : ''}
							defaultValue={event?.location}
						/>
						{validation?.errors?.location && (
							<p className='error-message'>{validation?.errors?.location}</p>
						)}
					</label>
					<label>
						Type:
						{event?.event_type_id && (
							<select
								name='eventType'
								className={validation?.errors?.eventType ? 'error-border' : ''}
								defaultValue={event?.event_type_id}>
								<option selected hidden></option>
								{eventTypes?.map(elem => (
									<option key={elem.id} value={elem.id}>
										{elem.type_name}
									</option>
								))}
							</select>
						)}
						{validation?.errors?.eventType && (
							<p className='error-message'>{validation?.errors?.eventType}</p>
						)}
					</label>
				</div>
			</div>
			<div className='box'>
				<h2>Ticket information</h2>
				{validation?.errors?.tickets && (
					<p className='error-message'>{validation?.errors?.tickets}</p>
				)}
				<div className='gap'>
					{tickets?.map(elem => (
						<TicketType
							{...elem}
							key={elem?.index}
							deleteElem={deleteTicket}
							errors={validation?.errors}
						/>
					))}
					<button type='button' onClick={addTicket}>
						Add ticket
					</button>
				</div>
				{status == 'success' ? <div className='success'>Event Updated!</div> : null}
				{/* <div className='success'>Event created succesfully!</div> */}
			</div>
			{status == 'loading' ? <div className='loader'></div> : null}
			<button>Edit Event</button>
		</form>
	);
};

export default EditEvent;
