import {db,readWorkspace,sameOrigin,errorResponse} from '@/lib/server';
import {mutate} from '@/lib/model';
import {z} from 'zod';
const input=z.object({action:z.string(),role:z.enum(['Business','Creator','Admin']),version:z.number().int().nonnegative(),payload:z.record(z.any()).default({})});
export const dynamic='force-dynamic';
export async function GET(){try{return Response.json(await readWorkspace(),{headers:{'Cache-Control':'no-store'}});}catch(e){return errorResponse(e,500);}}
export async function POST(req:Request){try{
 sameOrigin(req);const body=input.parse(await req.json());const {state,version}=await readWorkspace();
 if(body.version!==version)return Response.json({error:'This workspace changed. Refreshing to the latest version—please try again.'},{status:409});
 if(body.action==='submit'){
  const asset=await db().prepare('SELECT id,name,mime,deal_id FROM assets WHERE id=?').bind(String(body.payload?.assetId??'')).first<{id:string;name:string;mime:string;deal_id:string}>();
  if(!asset||asset.deal_id!==body.payload?.id)throw new Error('Upload a review file for this deal first.');
  body.payload.asset=asset;
 }
 const next=mutate(state,body.action,body.payload??{},body.role);
 const result=await db().prepare('UPDATE workspaces SET payload=?,version=version+1 WHERE id=? AND version=?').bind(JSON.stringify(next),'sandbox',version).run();
 if(!result.meta.changes)return Response.json({error:'Another update was saved. Refresh and try again.'},{status:409});
 return Response.json({state:next,version:version+1},{headers:{'Cache-Control':'no-store'}});
 }catch(e){return errorResponse(e);}}
