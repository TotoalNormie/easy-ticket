import { useMutation, useQuery } from 'react-query';
import { isLoggedIn } from '../auth/isLoggedIn';
import { Navigate } from 'react-router-dom';
import { sendRequest } from '../global/sendRequest';
import download from '../assets/download.svg';

export type History = {
	[key: string]: { type: string; id: number }[];
};

const History = () => {
	const user = isLoggedIn();
	const { data, error, status } = useQuery({
		queryKey: ['history'],
		queryFn: () => sendRequest('get', 'get-tickets'),
	});

	const { mutate: save } = useMutation({
		mutationFn: (id: number) =>
			sendRequest('post', 'get-ticket', { orderedTickets: [id] }, {}, 'blob'),
		onSuccess: response => {
			console.log('success', response);
			const blob = new Blob([response], { type: 'application/pdf' });

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
			// queryClient.invalidateQueries('tickets');
		},
	});

	const history = data?.tickets as History;

	// const test = { a: 1, b: 2, c: 3 }.obJectKeys();

	console.log(data);

	if (!user) return <Navigate to='/login' />;
	if (status === 'loading') return <div className='loader' />;
	if (status === 'error') return <div>Error: {error.message}</div>;
	return (
		<div>
			{Object.keys(history).map(event => (
				<div key={event}>
					<h2>{event}</h2>
					<div className='grid'>
						{Array.isArray(history[event]) &&
							history[event].map(ticket => (
								<div key={ticket.id} className='box'>
									<p>
										<strong>Ticket:</strong> {ticket.id}
									</p>
									<p>
										<strong>Type:</strong> {ticket.type}
									</p>
									<button type='button' onClick={() => save(ticket.id)}>
										<img src={download} />
									</button>
								</div>
							))}
					</div>
				</div>
			))}
		</div>
	);
};

export default History;
