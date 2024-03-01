import { sendRequest } from '../global/sendRequest';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ErrorData, EventType } from './Home';
import { useState } from 'react';

const Type = ({ type_name, id }: EventType) => {
	const [isEdit, setIsEdit] = useState(false);
	const queryClient = useQueryClient();

	const { mutate, status, error } = useMutation({
		mutationFn: (name: string) => sendRequest('post', `edit-event-type/${id}`, { name }),
		onSuccess: () => {
			queryClient.invalidateQueries(['eventTypes']);
			setIsEdit(false);
		},
	});
	const validation: ErrorData | null = error as ErrorData;
	const { mutate: deleteType, status: deleteStatus } = useMutation({
		mutationFn: () => sendRequest('delete', `delete-event-type/${id}`),
		onSuccess: () => {
			queryClient.invalidateQueries(['eventTypes']);
			setIsEdit(false);
		},
	});
	const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const type_name = formData.get('type_name') as string;
		mutate(type_name);
	};
	console.log(error);
	return (
		<form className='box flex between' onSubmit={handleForm}>
			{isEdit ? (
				<>
					<label>
						<input
							type='text'
							defaultValue={type_name}
							name='type_name'
							className={validation?.errors?.name ? 'error-border' : ''}
						/>
                        {validation?.errors?.name && (
							<p className='error-message'>{validation?.errors?.name}</p>
						)}
					</label>
					<button type='button' onClick={() => deleteType()}>
						delete
					</button>
					<button>save</button>
				</>
			) : (
				<>
					<p>{type_name}</p>
					<button onClick={() => setIsEdit(true)}>edit</button>
				</>
			)}
		</form>
	);
};

const Types = () => {
	const { data } = useQuery({
		queryKey: ['eventTypes'],
		queryFn: () => sendRequest('get', 'event-types'),
	});
	const queryClient = useQueryClient();
	const eventTypes = data as EventType[];
	const { mutate: createType, status: creationStatus } = useMutation({
		mutationFn: (name: string) => sendRequest('post', 'create-event-type', { name }),
		onSuccess: () => {
			queryClient.invalidateQueries(['eventTypes']);
		},
	});
	const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const type_name = formData.get('type_name') as string;
		createType(type_name);
	};
	return (
		<>
			<h2>Event type control panel</h2>
			<form onSubmit={handleForm}>
				<input type='text' name='type_name' />
				<button>Submit</button>
			</form>
			<div className='grid'>
				{eventTypes?.map(type => (
					<Type {...type} />
				))}
			</div>
		</>
	);
};

export default Types;
