// import { cookies } from 'next/headers';

// function extractJwt(cookieHeader: string) {
//   const cookieParts = cookieHeader.split(';'); // Split the cookie by semicolons
//   for (const part of cookieParts) {
//     const [key, value] = part.trim().split('=');
//     if (key === 'jwt') {
//       return value;
//     }
//   }
//   return null;
// }

// export async function POST(request: Request) {
//   try {
//     const reqBody = await request.json();
//     console.log('reqBody', reqBody);

//     const login = `${process.env.NEXT_PUBLIC_API_URL}/api/users/auth`;

//     try {
//       const res = await fetch(login, {
//         method: 'POST',
//         body: JSON.stringify(reqBody),
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       console.log(res);

//       const data = await res.json();

//       if (data) {
//         // Accessing all headers
//         const headers = res.headers;
//         console.log('Response Headers:', headers);

//         // Getting the 'set-cookie' header
//         const cookieHeader = headers.get('set-cookie');

//         if (cookieHeader) {
//           const jwt = extractJwt(cookieHeader);

//           if (jwt) {
//             const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30d

//             const cookieStore = await cookies();

//             cookieStore.set('jwt', jwt, {
//               expires,
//               httpOnly: true,
//               secure: true,
//               sameSite: 'lax',
//               path: '/', // Ensure the cookie is available site-wide
//             });

//             console.log('JWT Token:', jwt);


//             // First check if the response is not OK (status not in 200-299 range)
   

//             return new Response(
//               JSON.stringify({
//                 success: true,
//                 message: 'Login successful',
//                 user: {
//                   _id: data._id,
//                   username: data.username,
//                   email: data.email,
//                   isAdmin: data.isAdmin,
//                 },
//               }),
//               {
//                 status: 200,
//                 headers: { 'Content-Type': 'application/json' },
//               }
//             );
//           } else {
//             console.error('JWT not found in the cookie header');
//             return new Response(
//               JSON.stringify({ message: 'JWT not found in response' }),
//               { status: 401 }
//             );
//           }
//         } else {
//           console.error('Cookie header not found');
//           return new Response(
//             JSON.stringify({ message: 'Cookie header not found' }),
//             { status: 401 }
//           );
//         }
//       }
//     } catch (error) {
//       console.log('Invalid email or password', error);
//       return new Response(
//         JSON.stringify({ message: 'Invalid email or password', error: (error as Error).message }),
//         { status: 500 }
//       );
//     }
//   } catch (error) {
//     return new Response(`Server error: ${(error as Error).message}`, {
//       status: 400,
//     });
//   }

//   return new Response('Success!', {
//     status: 200,
//   });
// }


import { cookies } from 'next/headers';

function extractJwt(cookieHeader: string) {
  const cookieParts = cookieHeader.split(';');
  const tokenPart = cookieParts[0];
  return tokenPart.split('=')[1];
}

export async function POST(request: Request) {
  try {
    const reqBody = await request.json();
    console.log('Login request body:', reqBody);

    const loginUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/users/auth`;

    const res = await fetch(loginUrl, {
      method: 'POST',
      body: JSON.stringify(reqBody),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    console.log('Login response data:', data);

    // Success response handling
    if (res.ok && data._id) {
      const cookieHeader = res.headers.get('set-cookie');

      if (cookieHeader) {
        const jwt = extractJwt(cookieHeader);
        const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

        const cookieStore = await cookies();
        cookieStore.set('jwt', jwt, {
          expires,
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          path: '/',
        });

        console.log('JWT token set successfully');
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Login successful",
          user: {
            _id: data._id,
            username: data.username,
            email: data.email,
            isAdmin: data.isAdmin,
          },
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Error response from API (e.g., wrong credentials)
    const errorMessage = data.message || data.error || "Login failed";

    return new Response(
      JSON.stringify({
        success: false,
        message: errorMessage,
      }),
      {
        status: res.status,
        headers: { 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    // Unexpected server errors (e.g., network failure, JSON parse error)
    console.error('Error in login POST:', error);

    return new Response(
      JSON.stringify({
        success: false,
        message: `Server error: ${error.message}`,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}