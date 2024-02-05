type Props = {
    children: string,
    setError: () => void,
}

const Error = ({ children, setError }: Props) => {

	return (
		<div className='box error'>
			<button
				onClick={() => {
					setError();
				}}>
				x
			</button>
			<p>{children}</p>
		</div>
	);
};

export default Error;
