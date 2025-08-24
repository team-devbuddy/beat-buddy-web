export async function postLikeEvent(eventId: number, accessToken: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/events/${eventId}/like`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access': `Bearer ${accessToken}`,
        },
    });
    return response.json();
}