import {env} from 'cloudflare:workers';
import {db,readWorkspace,sameOrigin,errorResponse} from '@/lib/server';
export async function POST(req:Request){try{
 sameOrigin(req);if(Number(req.headers.get('content-length')??0)>45*1024*1024)throw new Error('Each file must be under 20 MB.');
 const f=await req.formData();const role=f.get('role'),dealId=String(f.get('dealId')),original=f.get('original'),preview=f.get('preview');
 const {state}=await readWorkspace();const d=state.deals.find(d=>d.id===dealId);
 if(role!=='Creator'||!d||d.status!=='In progress'||!d.funded)throw new Error('Switch to Creator and open a funded deal in progress.');
 if(!(original instanceof File)||!(preview instanceof File))throw new Error('Both original and watermarked preview are required.');
 const allowed=['image/jpeg','image/png','image/webp','video/mp4','video/webm'];
 if(!allowed.includes(original.type)||!allowed.includes(preview.type))throw new Error('Use JPG, PNG, WebP, MP4 or WebM.');
 if(original.size>20*1024*1024||preview.size>20*1024*1024||!original.size||!preview.size)throw new Error('Files must be nonempty and under 20 MB each.');
 if(original.type.startsWith('video/')&&f.get('watermarked')!=='yes')throw new Error('Confirm the review video has a burned-in watermark.');
 if(!env.BUCKET)throw new Error('File storage is unavailable.');const id=crypto.randomUUID();
 await env.BUCKET.put(id+'/original',original.stream(),{httpMetadata:{contentType:original.type}});
 try{await env.BUCKET.put(id+'/preview',preview.stream(),{httpMetadata:{contentType:preview.type}});
 await db().prepare('INSERT INTO assets (id,deal_id,name,mime,preview_mime,created_at) VALUES (?,?,?,?,?,?)').bind(id,dealId,original.name.slice(0,200),original.type,preview.type,new Date().toISOString()).run();}
 catch(e){await env.BUCKET.delete([id+'/original',id+'/preview']);throw e;}
 return Response.json({id,name:original.name,mime:original.type});
 }catch(e){return errorResponse(e);}}
