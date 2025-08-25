// Function to format date using date-fns (returns short month format)
export const formatShortDate = (dateString: string): string =>
	new Date(dateString).toLocaleString("en-US", {
		month: "short" as const, // Use 'as const' to ensure the type is literal
		day: "2-digit" as const,
		year: "numeric" as const,
		timeZone: "UTC",
	});

// Function to format date with full month name and ordinal suffix
export const formatLongDateWithSuffix = (dateString: string): string => {
	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	};
	const date = new Date(dateString);
	const formattedDate = date.toLocaleDateString('en-US', options);

	// Get the day as a number
	const day: number = date.getDate();
	const suffix = (day: number): string => {
		if (day > 3 && day < 21) {
    return 'th';
  } // 4-20
		switch (day % 10) {
			case 1: return 'st';
			case 2: return 'nd';
			case 3: return 'rd';
			default: return 'th';
		}
	};

	// Replace the day in the formatted date with the day and its suffix
	return formattedDate.replace(/\d+/, (match) => `${match}${suffix(day)}`);
};

