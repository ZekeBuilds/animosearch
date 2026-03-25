import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ALLOWED_ORIGINS = [
  'https://animosearch.vercel.app',
  'http://localhost:5173',
  'http://localhost:4173',
]

const GAP_FINDER_SYSTEM = `You are a research gap analyst for De La Salle University (DLSU) in Manila, Philippines.
Your job: given a list of existing thesis titles and keywords from a specific college/department, identify 5 specific, actionable research gaps — topics that are clearly underrepresented or absent from the data.

Rules:
- Base your analysis ONLY on the provided thesis data. Do not invent theses or cite external sources.
- Each gap must be specific to the college and department context provided.
- If a user-specified topic area is provided, prioritize gaps within that area.
- Format your response as a numbered list of exactly 5 items.
- Each item: one clear research gap title, followed by a dash, followed by one sentence explaining why it's a gap based on the data.
- Keep each entry to 1-2 lines. No extra commentary. No introductions. Just the 5 items.
- Use plain text only. No markdown asterisks or headers.`

Deno.serve(async (req: Request) => {
  const origin = req.headers.get('origin') ?? ''
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]

  const corsHeaders: Record<string, string> = {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }

  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: corsHeaders })

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  try {
    let body: { college?: string; department?: string; topic?: string }
    try {
      body = await req.json()
    } catch {
      return json({ error: 'Invalid JSON body.' }, 400)
    }

    const college = (body?.college ?? '').trim().slice(0, 20)
    const department = (body?.department ?? '').trim().slice(0, 80)
    const topic = (body?.topic ?? '').trim().slice(0, 150)

    if (!college) return json({ error: 'College is required.' }, 400)

    // --- Rate limit (10 req/min per IP) ---
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const ipRaw = req.headers.get('x-forwarded-for') ?? req.headers.get('cf-connecting-ip') ?? 'unknown'
    const ip = ipRaw.split(',')[0].trim().slice(0, 64)

    const { count: recentCount } = await supabase
      .from('chat_requests')
      .select('*', { count: 'exact', head: true })
      .eq('ip', ip)
      .gte('created_at', new Date(Date.now() - 60_000).toISOString())

    if ((recentCount ?? 0) >= 10) {
      return json({ error: 'Too many requests. Please wait a moment before trying again.' }, 429)
    }

    supabase.from('chat_requests').insert({ ip }).then(() => {})

    // --- Fetch theses for this college/dept ---
    let query = supabase
      .from('theses')
      .select('title, keywords, year, degree_level')
      .eq('college', college)
      .limit(80)

    if (department && department !== 'All Departments') {
      query = query.eq('department', department)
    }

    const { data: theses, error: dbError } = await query
    if (dbError) {
      console.error('DB error:', dbError.message)
      return json({ error: 'Database error.' }, 500)
    }

    if (!theses || theses.length === 0) {
      return json({ error: `No theses found for ${college}${department ? ` / ${department}` : ''}. Try a different college or department.` }, 404)
    }

    // --- Build context block ---
    const thesisBlock = theses
      .map((t, i) => `${i + 1}. "${t.title}" (${t.year}, ${t.degree_level})${t.keywords?.length ? ' — Keywords: ' + t.keywords.join(', ') : ''}`)
      .join('\n')

    const userMessage = [
      `College: ${college}`,
      department && department !== 'All Departments' ? `Department: ${department}` : '',
      topic ? `User-specified topic area: ${topic}` : '',
      '',
      `Existing theses (${theses.length} records):`,
      thesisBlock,
    ].filter(Boolean).join('\n')

    // --- Call Groq ---
    const groqKey = Deno.env.get('GROQ_API_KEY')!

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${groqKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: GAP_FINDER_SYSTEM },
          { role: 'user', content: userMessage },
        ],
        max_tokens: 600,
        temperature: 0.5,
      }),
    })

    if (!groqRes.ok) {
      if (groqRes.status === 429) return json({ error: 'AI service temporarily busy. Try again in a moment.' }, 503)
      throw new Error(`Groq API error ${groqRes.status}`)
    }

    const groqData = await groqRes.json()
    const analysis: string = groqData.choices?.[0]?.message?.content?.trim() ?? ''

    return json({ analysis, college, department, topic, thesisCount: theses.length })
  } catch (err) {
    console.error('Gap finder error:', err)
    return json({ error: 'Something went wrong. Please try again.' }, 500)
  }
})
