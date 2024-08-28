import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	try {
		const { name, email, message } = await req.json();

		if (!name || !email || !message) {
			return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
		}

		const formcarryUrl = process.env.FORMCARRY_URL;

		const response = await fetch(formcarryUrl!, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ name, email, message }),
		});

		const data = await response.json();

		if (response.ok) {
			return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
		} else {
			return NextResponse.json({ message: data.title || 'Error sending email' }, { status: 500 });
		}
	} catch (error: any) {
		console.error(error);
		return NextResponse.json({ message: 'Error sending email' }, { status: 500 });
	}
}
