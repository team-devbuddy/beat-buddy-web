export const PostSubmitBusinessSignup = async (accessToken: string, data: { businessName: string; nickname: string }) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/business/settings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Access: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error('Business setting failed');
    }

    return await res.json();
} 