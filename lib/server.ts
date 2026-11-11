import { env } from 'cloudflare:workers';
import { seed, type State } from './model';
// This is one owner-private sandbox. Demo roles are presentation/test controls,
// not participant authentication. Do not make public before adding real memberships.
export function db(){if(!env.DB)throw new Error('Workspace database is unavailable.');return env.DB;}
export async function readWorkspace(){
 await db().prepare('INSERT OR IGNORE INTO workspaces (id,payload,version) VALUES (?,?,0)').bind('sandbox',JSON.stringify(seed())).run();
 const row=await db().prepare('SELECT payload,version FROM workspaces WHERE id=?').bind('sandbox').first<{payload:string;version:number}>();
 if(!row)throw new Error('Workspace could not be loaded.');
 return {state:JSON.parse(row.payload) as State,version:row.version};
}
export function sameOrigin(req:Request){const origin=req.headers.get('origin');if(origin&&origin!==new URL(req.url).origin)throw new Error('Request origin is not allowed.');}
export function errorResponse(e:unknown,status=400){return Response.json({error:e instanceof Error?e.message:'Something went wrong.'},{status,headers:{'Cache-Control':'no-store'}});}
