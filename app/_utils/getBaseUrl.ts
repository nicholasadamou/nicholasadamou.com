export const getBaseUrl = (): string => {
	const isDevelopment = process.env.NODE_ENV === 'development';

	return isDevelopment ? 'http://localhost:3000' : 'https://n-a.io';
};
