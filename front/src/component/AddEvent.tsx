import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ErrorData, EventType } from './Home';
import { useState } from 'react';
import { sendRequest } from '../global/sendRequest';
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
}: {
	name?: string;
	price?: number;
	seats?: number;
	deleteElem: (index: number) => void;
	index: number;
	errors: { [key: string]: string };
}) => {
	const error = {} as { [key: string]: string };
	for (let key in errors) {
		const splitKey = key.split('.');
		if(splitKey.length === 1) continue;
		if(parseInt(splitKey[1]) != index) continue;
		const newKey = splitKey.pop();
		if (!newKey) continue;
		error[newKey] = errors[key];
	}
	const isError = Object.keys(error).length > 0;
	return (
		<div className={`box ${isError ? 'error-border' : ''}`}>
			<h2>Ticket type</h2>
			<div className='form'>
				<label>
					Name:
					<input defaultValue={name} type='text' name={`tickets[${index}][ticketName]`} />
					{error?.ticketName && <p className='error-message'>{error?.ticketName}</p>}
				</label>
				<label>
					Price:
					<input
						defaultValue={price}
						type='number'
						step='0.01'
						name={`tickets[${index}][price]`}
					/>
					{error?.price && <p className='error-message'>{error?.price}</p>}
				</label>
				<label>
					Seat count:
					<input defaultValue={seats} type='number' name={`tickets[${index}][seats]`} />
					{error?.seats && <p className='error-message'>{error?.seats}</p>}
				</label>
				<button type='button' onClick={() => deleteElem(index)}>
					x
				</button>
			</div>
		</div>
	);
};

const AddEvent = () => {
	const queryClient = useQueryClient();
	const { mutate: addEvent, error } = useMutation({
		mutationFn: (data: FormData) => sendRequest('post', 'create-event', data),
		onSuccess: () => {
			queryClient.invalidateQueries(['events']);
			console.log('success');
		},
	});

	const validation: ErrorData | null = error as ErrorData;

	// console.log(error)

	const { data: eventTypes } = useQuery<EventType[]>({
		queryKey: ['eventTypes'],
		queryFn: async () => {
			const response = await axios.get('http://127.0.0.1:8000/api/event-types');
			return response.data;
		},
	});
	const deleteTicket = (index: number) => {
		console.log(index);
		setTickets(tickets.filter(elem => elem.index !== index));
	};
	const addTicket = () => {
		setTickets([
			...tickets,
			{ key: tickets.length + 1, index: tickets.length + 1, name: '', price: 0, seats: 0 },
		]);
	};
	const [tickets, setTickets] = useState([
		{ key: 1, index: 1, name: 'default', price: 5, seats: 100 },
	]);

	const handleSubmit = e => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		// console.log(...formData);
		addEvent(formData);
	};

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
						/>
						{validation?.errors?.location && (
							<p className='error-message'>{validation?.errors?.location}</p>
						)}
					</label>
					<label>
						Type:
						<select
							name='eventType'
							className={validation?.errors?.eventType ? 'error-border' : ''}>
								<option selected hidden></option>
							{eventTypes?.map(elem => (
								<option value={elem.id}>{elem.type_name}</option>
							))}
						</select>
						{validation?.errors?.eventType && (
							<p className='error-message'>{validation?.errors?.eventType}</p>
						)}
					</label>
				</div>
			</div>
			<div className='box'>
				<h2>Ticket information</h2>
				<div className='gap'>
					{tickets.map(elem => (
						<TicketType
							{...elem}
							deleteElem={deleteTicket}
							errors={validation?.errors}
						/>
					))}
					<button type='button' onClick={addTicket}>
						Add ticket
					</button>
				</div>
			</div>
			<button>Create Event</button>
		</form>
	);
};

export default AddEvent;
