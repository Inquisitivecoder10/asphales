export type Audience='creator'|'brand';
export type Opportunity={id:string;brand:string;title:string;niche:string;budget:number;due:string;platform:string;brief:string;deliverables:string;shade:string};
export type Profile={id:string;name:string;handle:string;niche:string;followers:string;city:string;bio:string;shade:string};
export type Pitch={id:string;opportunityId:string;name:string;text:string;rate:number;status:'Submitted'|'Shortlisted'|'Passed';at:string};
export type Lead={id:string;kind:Audience;name:string;email:string;phone:string;niche:string;poc:string;managerName:string;managerEmail:string;managerPhone:string;followers:number;handles:string;at:string;status:'New'|'Contacted'};
export type Platform={opportunities:Opportunity[];pitches:Pitch[];shortlist:string[];invitations:{id:string;creatorId:string;text:string;at:string}[];leads:Lead[];config:{creatorForm:string;brandForm:string}};
export const profiles:Profile[]=[
 {id:'ananya',name:'Ananya Rao',handle:'@ananya.makes',niche:'Lifestyle',followers:'84K',city:'Bengaluru',bio:'Everyday stories, thoughtfully told. A little design, a little life, a lot of intention.',shade:'sage'},
 {id:'riya',name:'Riya Mehta',handle:'@riyainherownskin',niche:'Beauty',followers:'126K',city:'Mumbai',bio:'Skincare without the noise. Honest routines and beautifully simple product stories.',shade:'peach'},
 {id:'kabir',name:'Kabir Shah',handle:'@kabir.moves',niche:'Fitness',followers:'62K',city:'Pune',bio:'Movement for the everyday athlete. Training, recovery and finding your own pace.',shade:'blue'},
 {id:'neel',name:'Neel Kapoor',handle:'@neel.outofoffice',niche:'Travel',followers:'210K',city:'Delhi',bio:'Taking the slower road. Local places, thoughtful travel and stories worth staying for.',shade:'sand'},
 {id:'tara',name:'Tara Menon',handle:'@taras.table',niche:'Food & drink',followers:'48K',city:'Kochi',bio:'Good food and the people behind it. Small kitchens, big flavours and homegrown finds.',shade:'rose'},
 {id:'arjun',name:'Arjun Iyer',handle:'@arjun.unboxed',niche:'Technology',followers:'97K',city:'Bengaluru',bio:'Making tech feel human. Useful reviews and products that earn their place.',shade:'lilac'}
];
export function initialPlatform():Platform{return {opportunities:[
 {id:'OP-1',brand:'Aether Skin',title:'Make room for a slower ritual.',niche:'Beauty',budget:75000,due:'2026-12-04',platform:'Instagram',brief:'Bring our everyday skincare ritual into your world. We are looking for thoughtful, story-led content with a natural feel.',deliverables:'1 Instagram Reel + 3 Stories',shade:'peach'},
 {id:'OP-2',brand:'Sunday Coffee',title:'Your kind of morning.',niche:'Food & drink',budget:45000,due:'2026-12-08',platform:'Instagram',brief:'Show us what a good morning looks like, with a cup of small-batch coffee and your creative point of view.',deliverables:'1 Instagram Reel + 5 photographs',shade:'sand'},
 {id:'OP-3',brand:'Studio Forma',title:'Objects with a point of view.',niche:'Lifestyle',budget:100000,due:'2026-12-12',platform:'Instagram',brief:'Tell the story of daily objects that make a space feel like home. Warm light, honest moments, beautifully made.',deliverables:'2 Instagram Reels + 3 Stories',shade:'sage'},
 {id:'OP-4',brand:'Stride Club',title:'Find your everyday pace.',niche:'Fitness',budget:65000,due:'2026-12-15',platform:'Instagram',brief:'For early risers, evening walkers and everyone finding their rhythm. Help us tell a more inclusive movement story.',deliverables:'1 Reel + 1 carousel',shade:'blue'},
 {id:'OP-5',brand:'Elsewhere',title:'A little out of office.',niche:'Travel',budget:120000,due:'2026-12-18',platform:'YouTube',brief:'A considered travel story about the places between the destinations. Bring your audience on a slower adventure.',deliverables:'1 YouTube video + 2 Shorts',shade:'lilac'},
 {id:'OP-6',brand:'Everyday Audio',title:'A soundtrack for the ordinary.',niche:'Technology',budget:85000,due:'2026-12-21',platform:'YouTube',brief:'An honest look at audio made for everyday life. Show the details that matter to your audience.',deliverables:'1 YouTube review + 1 Short',shade:'rose'}
],pitches:[],shortlist:[],invitations:[],leads:[],config:{creatorForm:'',brandForm:''}};}
function need(v:unknown,m:string):asserts v{if(!v)throw Error(m);}
function required(v:unknown,name:string,max=300){need(typeof v==='string'&&v.trim().length>0&&v.trim().length<=max,`Please enter ${name}.`);return v.trim();}
const optional=(v:unknown,max=300)=>typeof v==='string'?v.trim().slice(0,max):'';
const email=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function validateLead(p:Record<string,unknown>):Omit<Lead,'id'|'at'|'status'>{
 need(p.kind==='creator'||p.kind==='brand','Choose an application type.');need(p.consent===true,'Please allow our onboarding team to contact you.');
 const name=required(p.name,'your name',100),niche=required(p.niche,'your niche',80),address=optional(p.email,160),phone=optional(p.phone,40),poc=p.poc==='manager'?'manager':'self';
 if(p.kind==='creator'||address)need(email.test(address),'Please enter a valid email address.');
 if(p.kind==='brand')need(/^\+?[\d\s()-]{10,25}$/.test(phone)&&phone.replace(/\D/g,'').length>=10&&phone.replace(/\D/g,'').length<=15,'Please enter a valid contact number.');
 const managerName=optional(p.managerName,100),managerEmail=optional(p.managerEmail,160),managerPhone=optional(p.managerPhone,40);
 if(p.kind==='creator'&&poc==='manager'){need(managerName,'Please enter your manager’s name.');need(email.test(managerEmail),'Please enter your manager’s email.');}
 const followers=p.kind==='creator'?Number(p.followers):0;
 if(p.kind==='creator')need(p.followers!==''&&p.followers!==undefined&&Number.isInteger(followers)&&followers>=0&&followers<=1000000000,'Please enter a valid follower count.');
 return {kind:p.kind,name,email:address,phone,niche,poc,managerName,managerEmail,managerPhone,followers,handles:p.kind==='creator'?required(p.handles,'a social handle or profile link',1500):''};
}
export function formUrl(v:unknown){const text=optional(v,1000);if(!text)return '';let url:URL;try{url=new URL(text);}catch{throw Error('Enter a valid Google Forms responder link.');}need(url.protocol==='https:'&&!url.username&&!url.password&&((url.hostname==='forms.gle'&&url.pathname.length>1)||(url.hostname==='docs.google.com'&&/^\/forms\/(?:u\/\d+\/)?d\/(?:e\/)?[\w-]+\/viewform\/?$/.test(url.pathname))),'Use a published Google Forms responder link (forms.gle or docs.google.com/forms/…/viewform).');return url.href;}
export function changePlatform(s:Platform,action:string,p:Record<string,unknown>):Platform{
 const id=()=>crypto.randomUUID(),at=new Date().toISOString();
 switch(action){
 case 'intake':s.leads.unshift({...validateLead(p),id:id(),at,status:'New'});break;
 case 'pitch':{const opportunity=s.opportunities.find(o=>o.id===p.opportunityId);need(opportunity,'Brief not found.');need(opportunity.due>=at.slice(0,10),'This brief is closed.');need(!s.pitches.some(x=>x.opportunityId===opportunity.id&&x.name==='Ananya Rao'),'You already pitched for this brief.');const rate=Number(p.rate);need(Number.isFinite(rate)&&rate>=1000&&rate<=100000000,'Enter a fee between ₹1,000 and ₹10 crore.');s.pitches.unshift({id:id(),opportunityId:opportunity.id,name:'Ananya Rao',text:required(p.text,'your pitch',3000),rate,status:'Submitted',at});break;}
 case 'pitchStatus':{const pitch=s.pitches.find(x=>x.id===p.id);need(pitch,'Pitch not found.');need(['Submitted','Shortlisted','Passed'].includes(String(p.status)),'Choose a valid status.');pitch.status=p.status as Pitch['status'];break;}
 case 'shortlist':{const creator=required(p.id,'a creator');need(profiles.some(c=>c.id===creator),'Creator not found.');s.shortlist=s.shortlist.includes(creator)?s.shortlist.filter(x=>x!==creator):[...s.shortlist,creator];break;}
 case 'invite':{const creatorId=required(p.creatorId,'a creator');need(profiles.some(c=>c.id===creatorId),'Creator not found.');s.invitations.unshift({id:id(),creatorId,text:required(p.text,'an introduction',3000),at});break;}
 case 'brief':{const budget=Number(p.budget),due=required(p.due,'a deadline');need(Number.isFinite(budget)&&budget>=1000&&budget<=100000000,'Enter a valid campaign budget.');need(/^\d{4}-\d{2}-\d{2}$/.test(due)&&!isNaN(Date.parse(due))&&due>=at.slice(0,10),'Choose a future delivery date.');s.opportunities.unshift({id:'OP-'+id().slice(0,8),brand:required(p.brand,'a brand name',100),title:required(p.title,'a campaign title',150),niche:required(p.niche,'a niche',80),budget,due,platform:required(p.platform,'a platform',40),brief:required(p.brief,'a brief',3000),deliverables:required(p.deliverables,'deliverables',1000),shade:'sage'});break;}
 case 'contacted':{const lead=s.leads.find(x=>x.id===p.id);need(lead,'Application not found.');lead.status=lead.status==='New'?'Contacted':'New';break;}
 case 'forms':s.config={creatorForm:formUrl(p.creatorForm),brandForm:formUrl(p.brandForm)};break;
 default:throw Error('Unknown action.');
 }return s;
}
