import {readPlatform,writePlatform} from '@/lib/platform-server';
import {sameOrigin,errorResponse} from '@/lib/server';
import {z} from 'zod';
export const dynamic='force-dynamic';
const schema=z.object({action:z.enum(['pitch','pitchStatus','shortlist','invite','brief','contacted','forms']),payload:z.record(z.unknown()).default({}),version:z.number().int().nonnegative()});
// Protected by the existing owner-private Site boundary; demo role switches are not authorization.
export async function GET(){try{return Response.json(await readPlatform(),{headers:{'Cache-Control':'no-store'}});}catch(e){return errorResponse(e,500);}}
export async function POST(req:Request){try{sameOrigin(req);const p=schema.parse(await req.json());return Response.json(await writePlatform(p.action,p.payload,p.version),{headers:{'Cache-Control':'no-store'}});}catch(e){return errorResponse(e);}}
