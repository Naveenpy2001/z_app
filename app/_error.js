import { ErrorBoundaryProps } from 'expo-router';

export default function ErrorBoundary(props) {
  return (
    <div>
      <h2>Error!</h2>
      <p>{props.error.message}</p>
      <button onClick={props.retry}>Retry</button>
    </div>
  );
}