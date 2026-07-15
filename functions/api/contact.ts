interface Env {
  RESEND_API_KEY: string;
  CONTACT_EMAIL: string;
}

interface ContactPayload {
  name: string;
  businessName: string;
  email: string;
  phone?: string;
  message: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const payload: ContactPayload = await context.request.json();

    if (!payload.name || !payload.businessName || !payload.email || !payload.message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.email)) {
      return new Response(JSON.stringify({ error: 'Invalid email address' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${context.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'NextWave AI Website <noreply@nextwaveaisolutions.com>',
        to: [context.env.CONTACT_EMAIL],
        reply_to: payload.email,
        subject: `New message from ${payload.name} - ${payload.businessName}`,
        text: `
Name: ${payload.name}
Business: ${payload.businessName}
Email: ${payload.email}
Phone: ${payload.phone || 'Not provided'}

Message:
${payload.message}
        `.trim(),
        html: `
<p><strong>Name:</strong> ${payload.name}</p>
<p><strong>Business:</strong> ${payload.businessName}</p>
<p><strong>Email:</strong> <a href="mailto:${payload.email}">${payload.email}</a></p>
<p><strong>Phone:</strong> ${payload.phone || 'Not provided'}</p>
<hr>
<p><strong>Message:</strong></p>
<p>${payload.message.replace(/\n/g, '<br>')}</p>
        `.trim(),
      }),
    });

    if (!resendResponse.ok) {
      const error = await resendResponse.text();
      console.error('Resend error:', error);
      return new Response(JSON.stringify({ error: 'Email delivery failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (err) {
    console.error('Worker error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
