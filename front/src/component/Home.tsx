import axios from 'axios';
import { ChangeEventHandler, useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { stringSimilarity } from 'string-similarity-js';

type Options = {
	orderBy: string;
	orderDirection: string;
	eventTypes: number[];
};

export type EventData = {
	created_at: string;
	datetime: string;
	description: string;
	event_type: { id: number; created_at: string; updated_at: string; type_name: string };
	event_type_id: number;
	id: number;
	image: string;
	location: string;
	name: string;
	updated_at: string;
	tickets: {
		id: number;
		created_at: string;
		updated_at: string;
		event_id: number;
		ticket_name: string;
		seats: number;
		seatsAvailable: number;
		price: string;
	}[];
};

export type ErrorData = {
	message: string;
	result: boolean;
	errors: { [key: string]: string };
};

export type EventType = {
	created_at: string;
	id: number;
	type_name: string;
	updated_at: string;
};

const Home = () => {
	const [options, setOptions] = useState<Options>({
		orderBy: 'datetime',
		orderDirection: 'asc',
		eventTypes: [],
	});
	const order = ['datetime', 'name', 'location'];
	const [optionsSeen, setOptionsSeen] = useState(false);
	const [search, setSearch] = useState('');

	const fetchEvents = (options: Options) => {
		return axios
			.get('http://127.0.0.1:8000/api/events', {
				params: {
					...options,
				},
			})
			.then(res => res.data);
	};

	const {
		isLoading,
		error,
		data: events,
	} = useQuery<EventData[], ErrorData>(
		['events', { options }], // queryKey
		() => fetchEvents(options) // queryFn
	);

	const { data: eventTypes } = useQuery<EventType[]>({
		queryKey: ['eventTypes'],
		queryFn: async () => {
			const response = await axios.get('http://127.0.0.1:8000/api/event-types');
			return response.data;
		},
	});

	const handleOption: ChangeEventHandler<HTMLInputElement | HTMLSelectElement> = e => {
		e.preventDefault();
		// console.log({ [e.target.name]: e.target.value });
		setOptions({
			...options,
			[e.target.name]: e.target.value,
		});
	};

	const handleEventType: ChangeEventHandler<HTMLInputElement> = e => {
		if (e.target === null) return;

		const isChecked = e.target.checked;
		const isInArray = options.eventTypes.includes(parseInt(e.target.value));

		if (isChecked && !isInArray) {
			setOptions({
				...options,
				eventTypes: [...options.eventTypes, parseInt(e.target.value)],
			});
		}

		if (!isChecked && isInArray) {
			setOptions({
				...options,
				eventTypes: options.eventTypes.filter(elem => elem !== parseInt(e.target.value)),
			});
		}

		console.log(e.target, isChecked);
	};

	const filteredItems: EventData[] | undefined = events?.filter(event => {
		if (!search) return true;

		// console.log(
		// 	event.name.substr(0, search.length).toLowerCase(),
		// 	search.toLowerCase(),
		// 	stringSimilarity(
		// 		event.name.substr(0, search.length).toLowerCase(),
		// 		search.toLowerCase()
		// 	)
		// );
		if (
			stringSimilarity(
				event.name.substr(0, search.length).toLowerCase(),
				search.toLowerCase()
			) >= 0.5
		)
			return true;
		if (
			stringSimilarity(
				event.location.substr(0, search.length).toLowerCase(),
				search.toLowerCase()
			) >= 0.5
		)
			return true;
		if (
			stringSimilarity(
				event.event_type.type_name.substr(0, search.length).toLowerCase(),
				search.toLowerCase()
			) >= 0.5
		)
			return true;
	});

	// console.log('items', filteredItems);

	if (error) return 'An error has occurred: ' + error.message;

	return (
		<div>
			<div className='search'>
				<input
					type='text'
					placeholder='Search'
					value={search}
					onChange={e => setSearch(e.target.value)}
				/>
				<button onClick={() => setOptionsSeen(!optionsSeen)}>Options</button>
				<div className={`options ${!optionsSeen ? 'hidden' : ''}`}>
					<div>
						<label>
							Order by:{' '}
							<select name='orderBy' value={options.orderBy} onChange={handleOption}>
								{order.map(elem => (
									<option key={elem}	value={elem}>{elem}</option>
								))}
							</select>
						</label>
						<div></div>
						<label>
							Order direction:{' '}
							<select
								name='orderDirection'
								value={options.orderDirection}
								onChange={handleOption}>
								<option value='asc'>Ascending</option>
								<option value='desc'>Descending</option>
							</select>
						</label>
					</div>
					<div>
						{eventTypes && (
							<div>
								<label>Event types:</label>
								{eventTypes.map(elem => (
									<div key={elem.id}>
										<input
											type='checkbox'
											name='eventTypes'
											value={elem.id}
											onChange={e => handleEventType(e)}
											checked={options.eventTypes.includes(elem.id)}
										/>{' '}
										{elem.type_name}
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
			<h1>Current Events:</h1>
			<div className='grid'>
				{isLoading
					? <div className='loader'></div>
					: filteredItems?.map(event => (
							<Link to={`/event/${event.id}`} key={event.id} className='box'>
								<div className='image'>
									<img src={event.image} alt={event.name} />
								</div>
								<h2>{event.name}</h2>
								<p>
									<strong>{event.location}</strong>
								</p>
								<p>{event.event_type.type_name}</p>
								<li>{event.datetime}</li>
							</Link>
					  ))}
			</div>
		</div>
	);
};

export default Home;
