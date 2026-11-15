// OpenAI-compatible Chat Completions adapter. Requires a user-supplied API key for live calls.
export async function complete(messages, tools=[], {fetchImpl=fetch, env=process.env}={}) {
 const key=env.LLM_API_KEY, model=env.LLM_MODEL;
 if(!key || !model) throw new Error('Set LLM_API_KEY and LLM_MODEL before using the live API');
 const base=(env.LLM_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/,'');
 let response;
 try { response=await fetchImpl(`${base}/chat/completions`,{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({model,messages,tools:tools.length?tools:undefined,tool_choice:tools.length?'auto':undefined,temperature:0.2}),signal:AbortSignal.timeout(30000)}); }
 catch(e){throw new Error(`LLM connection failed: ${e.message}`);}
 if(!response.ok) throw new Error(`LLM API returned HTTP ${response.status}`);
 let data; try{data=await response.json();}catch{throw new Error('LLM API returned invalid JSON');}
 const msg=data?.choices?.[0]?.message;
 if(!msg || (typeof msg.content!=='string' && !Array.isArray(msg.tool_calls))) throw new Error('LLM response missing content');
 return msg;
}
