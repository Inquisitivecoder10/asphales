import {readPlatform,writePlatform} from '@/lib/platform-server';
import {sameOrigin,errorResponse} from '@/lib/server';
import {z} from 'zod';
export const dynamic='force-dynamic';
export async function GET(){try{return Response.json((await readPlatform()).state.config,{headers:{'Cache-Control':'no-store'}});}catch(e){return errorResponse(e,500);}}
export async function POST(req:Request){try{sameOrigin(req);await writePlatform('intake',z.record(z.unknown()).parse(await req.json()));return Response.json({ok:true,message:'Thank you! Our onboarding specialist will be in touch with you soon.'},{headers:{'Cache-Control':'no-store'}});}catch(e){return errorResponse(e);}}
