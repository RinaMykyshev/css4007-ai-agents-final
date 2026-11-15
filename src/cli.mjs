import {runAgent} from './agent.mjs';
const question=process.argv.slice(2).join(' ');
if(!question){console.error('Usage: npm run ask -- "When is the AI101 deadline?"');process.exitCode=1;}
else {try {const result=await runAgent(question,{logger:record=>console.error('[tool]',JSON.stringify(record))});console.log(result.answer);}catch(e){console.error('Error:',e.message);process.exitCode=1;}}
