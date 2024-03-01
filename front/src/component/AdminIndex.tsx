import { Link } from 'react-router-dom';
import { sendRequest } from '../global/sendRequest';
import { useMutation, useQuery, useQueryClient } from 'react-query';

const AdminIndex = () => {
    const queryClient = useQueryClient();
	const options = { datetime: 'all' };
	const { data, isLoading, isError, error } = useQuery({
		queryKey: ['events', options],
		queryFn: () => sendRequest('get', 'events?datetime=all'),
	});
    const {mutate: deleteEvent} = useMutation({
        mutationFn: (id: number) => sendRequest('delete', `delete-event/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries(['events'])
        }
    })
	if (isLoading) return <div>Loading...</div>;
	if (isError) return <div>Error: {error.message}</div>;
	return (
		<div>
			<h1>Admin panel</h1>
			<div className='grid'>
				{data?.map((event: any) => {
					return (
						<div className='box' key={event.id}>
							<h2>{event.name}</h2>
                            <Link to={`editEvent/${event.id}`}>Edit Event</Link>
                            <button onClick={() => deleteEvent(event.id)}>Delete event</button>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default AdminIndex;
