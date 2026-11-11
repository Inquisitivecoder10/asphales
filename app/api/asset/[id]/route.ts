import {env} from 'cloudflare:workers';
import {db,readWorkspace,errorResponse} from '@/lib/server';
export async function GET(req:Request,{params}:{params:Promise<{id:string}>}){try{
 const {id}=await params;const asset=await db().prepare('SELECT * FROM assets WHERE id=?').bind(id).first<{deal_id:string;name:string;mime:string;preview_mime:string}>();if(!asset)return new Response('Not found',{status:404});
 const {state}=await readWorkspace();const d=state.deals.find(x=>x.id===asset.deal_id);const original=new URL(req.url).searchParams.get('original')==='1';
 // Originals only unlock after the approval state. No client-selected role bypass.
 if(!d||!d.submissions.some(s=>s.id===id))return new Response('Not found',{status:404});
 if(original&&d.status!=='Completed')return new Response('Final originals unlock after approval.',{status:403});
 const file=await env.BUCKET?.get(id+(original?'/original':'/preview'));if(!file)return new Response('Not found',{status:404});
 return new Response(file.body,{headers:{'Content-Type':original?asset.mime:asset.preview_mime,'Content-Disposition':original?`attachment; filename="${asset.name.replace(/[^a-zA-Z0-9. _-]/g,'_')}"`:'inline','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});
 }catch(e){return errorResponse(e,500);}}
