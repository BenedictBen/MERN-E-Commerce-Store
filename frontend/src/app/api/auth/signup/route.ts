import { cookies } from 'next/headers';

function extractJwt(cookieHeader: string) {
  const cookieParts = cookieHeader.split(';'); // Split the cookie by semicolons
  for (const part of cookieParts) {
    const [key, value] = part.trim().split('=');
    if (key === 'jwt') {
      return value;
    }
  }
  return null;
}


export async function POST(request: Request) {
  try {
    const reqBody = await request.json();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
      method: 'POST',
      body: JSON.stringify(reqBody),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // First check if response is OK
    if (!res.ok) {
      const errorData = await res.text().catch(() => 'Unknown error');
      throw new Error(`Backend error: ${errorData}`);
    }

    // Try to parse JSON only if content-type is application/json
    const contentType = res.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      throw new Error('Invalid response format from backend');
    }

    const data = await res.json();

    // Handle cookie setting
    const cookieHeader = res.headers.get('set-cookie');
    if (cookieHeader) {
      const jwt = extractJwt(cookieHeader);
      if (jwt) {
        
        const cookieStore = await cookies();
        cookieStore.set('jwt', jwt, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 1 week
        });
      }
    }

    return Response.json({
      success: true,
      user: {
        _id: data._id,
        username: data.username,
        email: data.email,
        isAdmin: data.isAdmin,
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    return Response.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Signup failed' 
      },
      { status: 500 }
    );
  }
}