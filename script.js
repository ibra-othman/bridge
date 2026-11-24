const KEY='bridge-state';
// Skills are in learning order (prerequisites first): [name, minimum level]
const CAREERS={
 frontend:[['HTML',2],['CSS',2],['JavaScript',2],['Git',1],['APIs',2],['React',2]],
 backend:[['Git',1],['JavaScript',2],['Node.js',2],['Databases/SQL',2],['Express',2],['REST APIs',2],['System Architecture',1]],
 uiux:[['User Research',2],['Wireframing',2],['Figma',2],['Prototyping',2],['Design Systems',1]],
 data:[['Excel',2],['Statistics',2],['SQL',2],['Python',2],['Data Visualization',2]],
 tester:[['Agile Basics',1],['Manual Testing',2],['Bug Tracking',2],['Postman',2],['Selenium/Cypress',2]]
};
const ALL=[...new Set(Object.values(CAREERS).flatMap(c=>c.map(x=>x[0])))].sort();
// Official docs or well-known free courses. Other skills fall back to a search link.
const RES={
 'HTML':'https://developer.mozilla.org/en-US/docs/Web/HTML','CSS':'https://developer.mozilla.org/en-US/docs/Web/CSS',
 'JavaScript':'https://developer.mozilla.org/en-US/docs/Web/JavaScript','APIs':'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API',
 'Git':'https://git-scm.com/doc','React':'https://react.dev/learn','Node.js':'https://nodejs.org/en/learn',
 'Express':'https://expressjs.com','Databases/SQL':'https://sqlbolt.com','SQL':'https://sqlbolt.com',
 'Python':'https://docs.python.org/3/tutorial/','Postman':'https://learning.postman.com','Figma':'https://help.figma.com',
 'Selenium/Cypress':'https://www.selenium.dev/documentation/'
};
const I={
en:{lang:'العربية',reset:'Reset data',title:'BRIDGE – Know Your Skills. Find Your Gap.',
 nav:{home:'Home',skills:'My skills',careers:'Careers',analysis:'Gap analysis',roadmap:'Roadmap',track:'Track',portfolio:'Portfolio',progress:'Progress',admin:'Admin'},
 lv:['Not yet','Beginner','Intermediate','Advanced'],
 c:{frontend:'Frontend Developer',backend:'Backend Developer',uiux:'UI/UX Designer',data:'Data Analyst',tester:'Software Tester'},
 h1:'Know your skills. Find your gap. Build your future.',
 sub:'University teaches a lot, and jobs ask for something specific. BRIDGE compares what you know with what your target role needs, then turns the difference into a learning order you can follow.',
 cta:'Start your journey',
 steps:[['1. Add your skills','Pick what you know and how well.'],['2. Choose a career','Five roles with required levels.'],['3. See your gap','A match score and what’s missing.'],['4. Follow the roadmap','Tick items off and watch the score rise.']],
 note:'The match score reflects coverage of the skills listed in BRIDGE’s own dataset. It is not a guarantee of job readiness.',fxHint:'Tip: click or tap any empty space for a surprise.',
 sT:'My skills',sS:n=>`Tick each skill you have, then set your level. ${n} selected.`,search:'Search skills',add:'Add a skill',choose:'Choose a career',noMatch:'No skills match your search. Use “Add a skill” to create it.',
 rename:'Rename skill',del:'Delete skill',
 cT:'Explore careers',cS:'Pick the role you’re aiming for. Each skill shows the minimum level employers expect.',selT:'Selected as your target',selB:'Select as target',
 aT:t=>`${t}: gap analysis`,aS:'Your skills compared with the minimum levels this role needs.',noCar:'Choose a target career first',noCarP:'The analysis compares your skills with one role.',explore:'Explore careers',
 match:p=>`Career match: ${p}%`,sum:(m,n,r)=>`${m} of ${n} skills meet the required level. ${r?`${r} still need work.`:'You cover every skill in this role.'}`,
 seeRm:'See my roadmap',mt:'Matched',lo:'Level too low',mi:'Missing',none:'None',needs:l=>`needs ${l}`,tap:'Tap any skill to change its level or open a learning resource.',
 rT:'My roadmap',rS:'Learn these in order. Tick a skill when you reach the required level and your match score updates.',done:(d,n)=>`${d} of ${n} completed`,mp:p=>`Match ${p}%`,
 noRm:'No roadmap yet',noRmP:'Pick a target career and your roadmap appears here.',youAt:(h,r)=>`You’re at ${h}. Reach ${r}.`,newS:r=>`New skill. Reach ${r}.`,
 learn:'Start learning',srch:'Find resources',left:'Nothing left to learn here',leftP:'You meet every requirement for this role. Try another career.',
 addT:'Add a skill',renT:'Rename skill',addP:'Add a skill that isn’t on the list yet.',ph:'e.g. TypeScript',cancel:'Cancel',save:'Save',addB:'Add skill',
 dup:'This skill already exists.',empty:'Please enter a skill name.',fl:['All','Selected','Not selected'],reqLv:l=>`Required level: ${l}`,yourLv:'Your level',
 rsT:'Reset all data?',rsP:'This clears your skills, target career, custom skills and roadmap progress. It can’t be undone.',rsB:'Reset data',
 trT:t=>`${t}: learning track`,trS:'Pass each test to unlock the next level. If you don’t pass, review the lesson and try again.',lvl:n=>`Level ${n}`,stLocked:'Locked',take:'Take test',retake:'Retake',
 finalT:'Final test',finalD:'Covers every skill in this track. Pass to unlock your portfolio.',finalLockP:'Pass all levels first.',toPf:'Open portfolio',
 qOf:(i,n)=>`Question ${i} of ${n}`,next:'Next',seeRes:'See result',score:(s,n)=>`Score: ${s}/${n}`,needPct:p=>`Pass mark: ${p}%.`,
 passMsg:'Great work! The next level is unlocked.',failMsg:'Not yet. Review the lesson, then try again.',finalPass:'You passed the final test! Your portfolio is ready.',retry:'Try again',cont:'Continue',close:'Close',
 pfLockT:'Portfolio locked',pfLockP:'Pass the final test of your track to unlock it.',pfS:'Fill in your details. The portfolio below updates live and can be saved as a PDF.',
 pfName:'Your name',pfGit:'GitHub or website',pfMail:'Email',pfBio:'Short bio',pfPrint:'Print / Save as PDF',pfYou:'Your Name',pfBadge:'BRIDGE verified',
 pfAch:'Achievements',pfCert:d=>`Final test passed on ${d}`,pfSk:'Verified skills',pfProj:'Projects to build next',
 acc:'Account',login:'Log in',register:'Create account',nameLbl:'Your name',email:'Email',pass:'Password (8+ characters)',logout:'Log out',signedAs:e=>`Signed in as ${e}`,
 synced:'Your progress is saved to your account and syncs across devices.',offline:'Cannot reach the server. You can keep working offline.',tSync:'Signed in and synced',
 multiHint:'Select all the correct answers',orderHint:'Use the arrows to put the steps in order',codeHint:'Type the corrected line',check:'Check',
 more:'More courses',resT:'Free lessons and courses for this skill',courses:'Courses and platforms',
 pfPdf:'Download PDF',pfShare:'Share link',pfLinkLogin:'Log in to create a public link.',pfCopied:'Link copied',pfPublic:'Public portfolio link',unshare:'Stop sharing',pdfFail:'Could not create the PDF. Check your connection.',
 tourBtn:'Quick tour',tSkip:'Skip',tourDone:'Done',
 tour:[['Navigate','Use these tabs to move between skills, careers, analysis, your track and portfolio.'],['Start with your skills','Add the skills you already know, then choose a target career.'],['Save to the cloud','Create an account to keep your progress on every device.'],['Your language','Switch between English and Arabic any time.']],
 pushOn:'Enable daily reminders',pushDone:'Daily reminders enabled',pushNo:'Notifications are not available or are blocked',
 prT:'My progress',prS:'Your learning streak, activity and the skills that need more practice.',streak:'Day streak',best:'Best streak',tests:'Tests taken',avg:'Average score',
 act:'Activity',d7:'7 days',d30:'30 days',actNone:'No tests yet. Take your first level test to start your streak.',
 weakT:'Skills to strengthen',weakRow:(a,n,f)=>`Average ${a}% over ${n} attempts, ${f} not passed`,practice:'Practice again',review:'Review',
 nextT:'Next step',nextD:n=>`Take the ${n} test to unlock the next level.`,allGood:'Nothing needs extra practice right now. Keep going.',focus:'Focus',
 selfTag:'self-checked',noTest:'There are no test questions for this skill yet. You can mark it as learned yourself, or ask an instructor to add questions.',selfBtn:'Mark as learned',
 bNew:'Create custom track',bT:'Custom career track',bTitle:'Job title',bAddPh:'Add another skill',bAdd:'Add',bPick:'Tap to add skills from the list',bSkills:'Skills for this track, in learning order',bNeed:'Enter a title and add 2 to 15 skills.',tTrack:'Track saved',tTrackDel:'Track deleted',
 forgot:'Forgot password?',forgotT:'Reset your password',forgotP:'Enter your email and we will send you a reset link.',sendLink:'Send reset link',forgotOk:'If that email has an account, a reset link is on its way.',devLink:'Development link:',
 newPass:'New password (8+ characters)',setPass:'Set new password',resetOk:'Password updated. You can log in now.',orWith:'Or continue with',
 tAdd:'Skill added',tRen:'Skill renamed',tDel:'Skill deleted',tRes:'Data reset',tUp:'Level updated',tDone:(n,p)=>`${n} done. Match is now ${p}%`,tAll:'Role complete. Well done!'},
ar:{lang:'English',reset:'إعادة تعيين البيانات',title:'BRIDGE – اعرف مهاراتك. اكتشف فجوتك.',
 nav:{home:'الرئيسية',skills:'مهاراتي',careers:'الوظائف',analysis:'تحليل الفجوة',roadmap:'خطة التعلم',track:'المسار',portfolio:'البورتفوليو',progress:'التقدم',admin:'الإدارة'},
 lv:['لم أتعلمها بعد','مبتدئ','متوسط','متقدم'],
 c:{frontend:'مطوّر واجهات أمامية',backend:'مطوّر واجهات خلفية',uiux:'مصمم UI/UX',data:'محلل بيانات',tester:'مختبر برمجيات'},
 h1:'اعرف مهاراتك. اكتشف فجوتك. ابنِ مستقبلك.',
 sub:'الجامعة تعلّمك الكثير، لكن الوظائف تطلب مهارات محددة. يقارن BRIDGE بين ما تعرفه وما تتطلبه وظيفتك المستهدفة، ثم يحوّل الفرق إلى خطة تعلّم مرتبة يمكنك اتباعها.',
 cta:'ابدأ رحلتك',
 steps:[['١. أضف مهاراتك','اختر ما تعرفه ومستواك فيه.'],['٢. اختر وظيفة','خمس وظائف بمستويات مطلوبة.'],['٣. اعرف فجوتك','نسبة توافق وما ينقصك.'],['٤. اتبع الخطة','علّم على ما أنجزته وشاهد النسبة ترتفع.']],
 note:'تعكس النسبة تغطية المهارات الموجودة في بيانات BRIDGE فقط، وليست ضمانًا للجاهزية لسوق العمل.',fxHint:'جرّب: اضغط على أي مساحة فارغة لتشاهد مفاجأة.',
 sT:'مهاراتي',sS:n=>`علّم على كل مهارة تعرفها ثم حدّد مستواك. المختار: ${n}.`,search:'ابحث عن مهارة',add:'إضافة مهارة',choose:'اختر وظيفة',noMatch:'لا توجد مهارة مطابقة. استخدم «إضافة مهارة» لإنشائها.',
 rename:'تعديل اسم المهارة',del:'حذف المهارة',
 cT:'استكشف الوظائف',cS:'اختر الوظيفة التي تستهدفها. تظهر لكل مهارة الحد الأدنى للمستوى الذي يطلبه أصحاب العمل.',selT:'وظيفتك المستهدفة',selB:'اختر كهدف',
 aT:t=>`تحليل الفجوة: ${t}`,aS:'مقارنة بين مهاراتك والحد الأدنى المطلوب لهذه الوظيفة.',noCar:'اختر وظيفة مستهدفة أولًا',noCarP:'يقارن التحليل مهاراتك بوظيفة واحدة.',explore:'استكشف الوظائف',
 match:p=>`نسبة التوافق: ${p}%`,sum:(m,n,r)=>`${m} من ${n} مهارات تحقق المستوى المطلوب. ${r?`يتبقى ${r} تحتاج عملًا.`:'أنت تغطي كل مهارات هذه الوظيفة.'}`,
 seeRm:'عرض خطة التعلم',mt:'مطابقة',lo:'المستوى أقل من المطلوب',mi:'مفقودة',none:'لا يوجد',needs:l=>`المطلوب: ${l}`,tap:'اضغط على أي مهارة لتغيير مستواها أو فتح مصدر للتعلم.',
 rT:'خطة التعلم',rS:'تعلّم بهذا الترتيب. علّم على المهارة عند وصولك للمستوى المطلوب فتتحدّث النسبة.',done:(d,n)=>`أُنجز ${d} من ${n}`,mp:p=>`التوافق ${p}%`,
 noRm:'لا توجد خطة بعد',noRmP:'اختر وظيفة مستهدفة لتظهر خطتك هنا.',youAt:(h,r)=>`مستواك الحالي: ${h}. المطلوب: ${r}.`,newS:r=>`مهارة جديدة. المطلوب: ${r}.`,
 learn:'ابدأ التعلم',srch:'ابحث عن مصادر',left:'لا يوجد ما تتعلمه هنا',leftP:'أنت تحقق كل متطلبات هذه الوظيفة. جرّب وظيفة أخرى.',
 addT:'إضافة مهارة',renT:'تعديل اسم المهارة',addP:'أضف مهارة غير موجودة في القائمة.',ph:'مثال: TypeScript',cancel:'إلغاء',save:'حفظ',addB:'إضافة',
 dup:'هذه المهارة موجودة بالفعل.',empty:'من فضلك أدخل اسم المهارة.',fl:['الكل','المحددة','غير المحددة'],reqLv:l=>`المستوى المطلوب: ${l}`,yourLv:'مستواك',
 rsT:'إعادة تعيين كل البيانات؟',rsP:'سيُمسح كل ما أدخلته: المهارات والوظيفة المستهدفة والمهارات المخصصة وتقدمك في الخطة. لا يمكن التراجع.',rsB:'إعادة التعيين',
 trT:t=>`مسار التعلّم: ${t}`,trS:'اجتز اختبار كل مستوى لتفتح المستوى التالي. وإن لم تنجح راجع الدرس ثم أعد المحاولة.',lvl:n=>`المستوى ${n}`,stLocked:'مغلق',take:'ابدأ الاختبار',retake:'إعادة الاختبار',
 finalT:'الاختبار النهائي',finalD:'يغطي كل مهارات المسار. اجتزه لتفتح البورتفوليو.',finalLockP:'اجتز كل المستويات أولًا.',toPf:'افتح البورتفوليو',
 qOf:(i,n)=>`السؤال ${i} من ${n}`,next:'التالي',seeRes:'عرض النتيجة',score:(s,n)=>`النتيجة: ${s}/${n}`,needPct:p=>`درجة النجاح: ${p}%.`,
 passMsg:'عمل رائع! تم فتح المستوى التالي.',failMsg:'لم تنجح بعد. راجع الدرس ثم أعد المحاولة.',finalPass:'نجحت في الاختبار النهائي! البورتفوليو جاهز.',retry:'حاول مرة أخرى',cont:'متابعة',close:'إغلاق',
 pfLockT:'البورتفوليو مغلق',pfLockP:'اجتز الاختبار النهائي للمسار لتفتحه.',pfS:'املأ بياناتك. يتحدّث البورتفوليو بالأسفل مباشرة ويمكن حفظه كملف PDF.',
 pfName:'اسمك',pfGit:'GitHub أو موقعك',pfMail:'البريد الإلكتروني',pfBio:'نبذة قصيرة عنك',pfPrint:'طباعة / حفظ PDF',pfYou:'اسمك هنا',pfBadge:'موثّق من BRIDGE',
 pfAch:'الإنجازات',pfCert:d=>`اجتاز الاختبار النهائي بتاريخ ${d}`,pfSk:'المهارات الموثّقة',pfProj:'مشاريع مقترحة لبناء أعمالك',
 acc:'الحساب',login:'تسجيل الدخول',register:'إنشاء حساب',nameLbl:'اسمك',email:'البريد الإلكتروني',pass:'كلمة المرور (8 أحرف أو أكثر)',logout:'تسجيل الخروج',signedAs:e=>`مسجّل الدخول بـ ${e}`,
 synced:'تقدمك محفوظ في حسابك ويتزامن بين أجهزتك.',offline:'تعذّر الوصول للخادم. يمكنك المتابعة بدون اتصال.',tSync:'تم تسجيل الدخول والمزامنة',
 multiHint:'اختر كل الإجابات الصحيحة',orderHint:'استخدم الأسهم لترتيب الخطوات',codeHint:'اكتب السطر بعد تصحيحه',check:'تحقق',
 more:'المزيد من الدورات',resT:'دروس ودورات مجانية لهذه المهارة',courses:'الدورات والمنصات',
 pfPdf:'تحميل PDF',pfShare:'رابط المشاركة',pfLinkLogin:'سجّل الدخول لإنشاء رابط عام.',pfCopied:'تم نسخ الرابط',pfPublic:'رابط البورتفوليو العام',unshare:'إيقاف المشاركة',pdfFail:'تعذّر إنشاء ملف PDF. تحقق من الاتصال.',
 tourBtn:'جولة سريعة',tSkip:'تخطّي',tourDone:'تم',
 tour:[['التنقل','استخدم هذه التبويبات للتنقل بين المهارات والوظائف والتحليل والمسار والبورتفوليو.'],['ابدأ بمهاراتك','أضف المهارات التي تعرفها ثم اختر وظيفتك المستهدفة.'],['احفظ على السحابة','أنشئ حسابًا لتحتفظ بتقدمك على كل أجهزتك.'],['لغتك','بدّل بين العربية والإنجليزية في أي وقت.']],
 pushOn:'تفعيل التذكير اليومي',pushDone:'تم تفعيل التذكير اليومي',pushNo:'الإشعارات غير متاحة أو محظورة',
 prT:'تقدمي',prS:'سلسلة أيامك ونشاطك والمهارات التي تحتاج تدريبًا أكثر.',streak:'أيام متتالية',best:'أفضل سلسلة',tests:'اختبارات أُجريت',avg:'متوسط الدرجات',
 act:'النشاط',d7:'٧ أيام',d30:'٣٠ يومًا',actNone:'لا توجد اختبارات بعد. ابدأ باختبار أول مستوى لتبدأ سلسلتك.',
 weakT:'مهارات تحتاج تقوية',weakRow:(a,n,f)=>`المتوسط ${a}% في ${n} محاولات، لم تنجح في ${f}`,practice:'تدرّب مرة أخرى',review:'راجع',
 nextT:'الخطوة التالية',nextD:n=>`اجتز اختبار ${n} لتفتح المستوى التالي.`,allGood:'لا شيء يحتاج تدريبًا إضافيًا الآن. واصل التقدم.',focus:'ركّز عليها',
 selfTag:'تقييم ذاتي',noTest:'لا توجد أسئلة اختبار لهذه المهارة بعد. يمكنك تسجيلها كمتعلَّمة بنفسك أو اطلب من المشرف إضافة أسئلة.',selfBtn:'سجّلها كمتعلَّمة',
 bNew:'أنشئ مسارًا مخصصًا',bT:'مسار مهني مخصص',bTitle:'المسمى الوظيفي',bAddPh:'أضف مهارة أخرى',bAdd:'إضافة',bPick:'اضغط لإضافة مهارات من القائمة',bSkills:'مهارات المسار بترتيب التعلم',bNeed:'اكتب عنوانًا وأضف من ٢ إلى ١٥ مهارة.',tTrack:'تم حفظ المسار',tTrackDel:'تم حذف المسار',
 forgot:'نسيت كلمة المرور؟',forgotT:'إعادة تعيين كلمة المرور',forgotP:'اكتب بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين.',sendLink:'أرسل الرابط',forgotOk:'إن كان للبريد حساب فقد أُرسل إليه رابط إعادة التعيين.',devLink:'رابط التطوير:',
 newPass:'كلمة مرور جديدة (8 أحرف أو أكثر)',setPass:'حفظ كلمة المرور',resetOk:'تم تحديث كلمة المرور. يمكنك تسجيل الدخول الآن.',orWith:'أو تابع عبر',
 tAdd:'تمت إضافة المهارة',tRen:'تم تعديل الاسم',tDel:'تم حذف المهارة',tRes:'تمت إعادة تعيين البيانات',tUp:'تم تحديث المستوى',tDone:(n,p)=>`اكتملت ${n}. التوافق الآن ${p}%`,tAll:'اكتملت الوظيفة. أحسنت!'}
};
function fresh(lang){return {skills:{},custom:[],career:null,done:{},q:'',f:'all',passed:{},finals:{},name:'',bio:'',git:'',mail:'',history:[],customTracks:{},self:{},lang}}
let S=fresh(/^ar/i.test(navigator.language||'')?'ar':'en');
try{const r=localStorage.getItem(KEY);if(r)S={...S,...JSON.parse(r)}}catch(e){}
S.q='';S.f='all';
let barNow=0,barTo=0;
const L=()=>I[S.lang];
const save=()=>{S.updated=Date.now();try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}cloudSave()};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const $=id=>document.getElementById(id);
const nm=e=>e.closest('[data-n]').dataset.n;
const VIEWS=['home','skills','careers','analysis','roadmap','track','progress','portfolio'];
let view='home',booting=true;
const dlg=$('dlg');
function closeDlg(){if(!dlg.open)return;dlg.classList.add('out');setTimeout(()=>{dlg.close();dlg.classList.remove('out','wide')},180)}
dlg.addEventListener('close',()=>dlg.classList.remove('wide'));
dlg.addEventListener('click',e=>{if(e.target===dlg)closeDlg()});
const allSkills=()=>[...ALL,...S.custom.filter(c=>!ALL.includes(c))];
const resLink=n=>{const u=RES[n];const href=u||'https://www.google.com/search?q='+encodeURIComponent('learn '+n+' for beginners');
 return `<a class="res" href="${href}" target="_blank" rel="noopener" onclick="event.stopPropagation()">${u?L().learn:L().srch} ↗</a>`};

function analyze(){
  const c=CAREERS[S.career];if(!c)return null;
  let pts=0;const matched=[],deficit=[],missing=[];
  c.forEach(([n,req])=>{
    const have=S.done[n]?Math.max(S.skills[n]||0,req):(S.skills[n]||0);
    pts+=Math.min(have/req,1);
    (have>=req?matched:have>0?deficit:missing).push({n,have,req});
  });
  return {id:S.career,c,matched,deficit,missing,pct:Math.round(pts/c.length*100)};
}
function go(v){location.hash=v}
function route(){const h=location.hash.slice(1);view=VIEWS.includes(h)||h==='admin'?h:'home';render(true);window.scrollTo(0,0)}
function render(anim){
  const l=L();
  document.documentElement.lang=S.lang;document.documentElement.dir=S.lang==='ar'?'rtl':'ltr';document.title=l.title;
  $('langBtn').textContent=l.lang;$('resetBtn').textContent=l.reset;
  $('accBtn').textContent=USER?'👤 '+(USER.name||USER.email.split('@')[0]):l.acc;$('tourBtn').textContent='?';$('tourBtn').title=l.tourBtn;
  $('nav').innerHTML=[...VIEWS,...(isAdmin()?['admin']:[])].map(v=>`<button class="${v===view?'on':''}" onclick="go('${v}')">${l.nav[v]}</button>`).join('');
  const app=$('app');
  app.innerHTML=({home,skills,careers,analysis,roadmap,track,progress,portfolio,admin})[view]();
  app.insertAdjacentHTML('beforeend',pager());
  if(anim&&!booting)puzzle(app);
  if(view==='roadmap')requestAnimationFrame(()=>requestAnimationFrame(()=>{const b=document.querySelector('.bar i');if(b)b.style.width=barTo+'%';barNow=barTo}));
  if(view==='analysis'){const a=analyze();if(a)requestAnimationFrame(()=>{const f=document.querySelector('.ring-fill');if(f)f.style.strokeDashoffset=String(502*(1-a.pct/100))})}
}
function toggleLang(){S.lang=S.lang==='ar'?'en':'ar';save();render()}

function home(){const l=L();return `
<section class="hero"><div><h1>${l.h1}</h1><p class="sub">${l.sub}</p><button class="btn" onclick="go('skills')">${l.cta}</button></div>
<svg viewBox="0 0 400 240" aria-hidden="true"><rect x="10" y="150" width="90" height="80" rx="6" fill="#233157"/><rect x="300" y="150" width="90" height="80" rx="6" fill="#233157"/>
<path d="M100 150C150 60 250 60 300 150" fill="none" stroke="#22d3ee" stroke-width="5"/><g stroke="#6366f1" stroke-width="3"><path d="M130 112v38M165 88v62M200 80v70M235 88v62M270 112v38"/></g><circle cx="200" cy="80" r="7" fill="#22d3ee"/></svg></section>
<div class="steps">${l.steps.map(s=>`<div class="card"><b>${s[0]}</b><p class="sub" style="margin:6px 0 0">${s[1]}</p></div>`).join('')}</div>
<p class="sub" style="margin-top:24px;font-size:13px">${l.note}</p><p class="sub fxhint" style="font-size:13px">✨ ${l.fxHint}</p>`}

function skills(){const l=L();return `<h2>${l.sT}</h2><p class="sub">${l.sS(Object.keys(S.skills).length)}</p>
<div class="tools"><input type="search" placeholder="${l.search}" value="${esc(S.q)}" oninput="S.q=this.value;$('sg').innerHTML=skillCards()" aria-label="${l.search}"><div class="seg" role="group">${['all','sel','unsel'].map((k,i)=>`<button class="${S.f===k?'on':''}" data-f="${k}" onclick="setF('${k}')">${l.fl[i]}</button>`).join('')}</div><button class="btn ghost" onclick="openCustom()">${l.add}</button><button class="btn" onclick="go('careers')">${l.choose}</button></div>
<div class="grid" id="sg">${skillCards()}</div>`}
function skillCards(){
  const l=L(),q=S.q.toLowerCase(),list=allSkills().filter(n=>n.toLowerCase().includes(q)&&(S.f==='all'||(S.f==='sel')===!!S.skills[n]));
  if(!list.length)return `<div class="card empty" style="grid-column:1/-1"><p>${l.noMatch}</p></div>`;
  return list.map(n=>{const v=S.skills[n]||0,k=esc(n),cu=S.custom.includes(n);
   return `<div class="card sk ${v?'has':''}" data-n="${k}"><div class="top"><label class="lbl"><input type="checkbox" ${v?'checked':''} onchange="toggle(nm(this),this.checked)">${k}</label>${cu?`<button class="x" title="${l.rename}" aria-label="${l.rename}" onclick="openCustom(nm(this))">✎</button><button class="x" title="${l.del}" aria-label="${l.del}" onclick="delCustom(nm(this))">×</button>`:''}</div>
<div class="lv">${[1,2,3].map(i=>`<button class="${v===i?'on':''}" ${v?'':'disabled'} onclick="setLv(nm(this),${i})">${l.lv[i]}</button>`).join('')}</div></div>`}).join('')}
function toggle(n,on){if(on)S.skills[n]=S.skills[n]||1;else{delete S.skills[n];delete S.done[n]}save();render();flash(n)}
function setLv(n,v){S.skills[n]=v;save();render();flash(n)}
function flash(n){const el=[...document.querySelectorAll('.sk')].find(e=>e.dataset.n===n);if(el)el.classList.add('pulse')}
function setF(f){S.f=f;document.querySelectorAll('.seg button').forEach(b=>b.classList.toggle('on',b.dataset.f===f));$('sg').innerHTML=skillCards()}

// Custom skills: add, rename, delete
let editing=null;
function openCustom(old){
  const l=L();editing=old||null;
  dlg.innerHTML=`<h2>${old?l.renT:l.addT}</h2><p class="sub" style="margin-bottom:14px">${l.addP}</p><input type="text" id="cust" maxlength="30" placeholder="${l.ph}" value="${old?esc(old):''}" aria-label="${l.addT}"><p class="bd" id="err" role="alert" style="margin:8px 0 0;font-size:13px"></p>
<div class="acts"><button class="btn ghost" onclick="closeDlg()">${l.cancel}</button><button class="btn" onclick="saveCustom()">${old?l.save:l.addB}</button></div>`;
  dlg.showModal();$('cust').focus();$('cust').addEventListener('input',()=>{$('err').textContent='';$('cust').removeAttribute('aria-invalid')});
}
function saveCustom(){
  const l=L(),v=$('cust').value.trim().replace(/\s+/g,' ');if(!v)return fail(l.empty);
  const others=[...ALL,...S.custom].filter(x=>x!==editing);
  if(others.some(x=>x.toLowerCase()===v.toLowerCase()))return fail(l.dup);
  if(editing){
    S.custom=S.custom.map(x=>x===editing?v:x);
    if(editing in S.skills){S.skills[v]=S.skills[editing];delete S.skills[editing]}
    if(editing in S.done){S.done[v]=S.done[editing];delete S.done[editing]}
    toast(l.tRen);
  }else{S.custom.push(v);S.skills[v]=1;toast(l.tAdd)}
  save();closeDlg();render();
}
function fail(m){$('err').textContent=m;const i=$('cust');i.setAttribute('aria-invalid','true');i.classList.remove('shake');void i.offsetWidth;i.classList.add('shake');i.focus()}
function delCustom(n){S.custom=S.custom.filter(x=>x!==n);delete S.skills[n];delete S.done[n];save();render();toast(L().tDel)}

function careers(){const l=L();return `<h2>${l.cT}</h2><p class="sub">${l.cS}</p><button class="btn ghost" onclick="openBuilder()" style="margin-bottom:16px">＋ ${l.bNew}</button>
<div class="grid">${Object.entries(CAREERS).map(([id,c])=>`<div class="card job ${S.career===id?'sel':''}" tabindex="0" onclick="pick('${id}')" onkeydown="if(event.key==='Enter')pick('${id}')">
<h3>${esc(l.c[id]||id)}${id.startsWith('u-')?`<span style="float:inline-end"><button class="x" aria-label="edit" onclick="event.stopPropagation();openBuilder('${id}')">✎</button> <button class="x" aria-label="delete" onclick="event.stopPropagation();delTrack('${id}')">×</button></span>`:''}</h3>${c.map(([n,v])=>`<span class="tag">${esc(n)} · ${l.lv[v]}</span>`).join('')}
<p class="sub" style="margin:10px 0 0;font-size:13px">${S.career===id?l.selT:l.selB}</p></div>`).join('')}</div>`}
function pick(id){S.career=id;save();go('analysis')}

function analysis(){
  const l=L(),a=analyze();
  if(!a)return `<div class="card empty"><h2>${l.noCar}</h2><p>${l.noCarP}</p><button class="btn" onclick="go('careers')">${l.explore}</button></div>`;
  const arrow=S.lang==='ar'?'←':'→';
  const li=(arr,cls,fn)=>arr.length?arr.map(x=>`<div class="row clk" role="button" tabindex="0" data-n="${esc(x.n)}" onclick="openSkill(nm(this))" onkeydown="if(event.key==='Enter')openSkill(nm(this))"><span>${esc(x.n)}</span><span class="${cls}">${fn(x)}</span></div>`).join(''):`<p class="sub" style="margin:0">${l.none}</p>`;
  const rest=a.deficit.length+a.missing.length;
  return `<h2>${l.aT(l.c[a.id])}</h2><p class="sub">${l.aS}</p>
<div class="card score"><div class="ring"><svg width="180" height="180" viewBox="0 0 180 180"><circle class="ring-track" cx="90" cy="90" r="80"/><circle class="ring-fill" cx="90" cy="90" r="80" stroke-dasharray="502" stroke-dashoffset="502"/></svg><span>${a.pct}%</span></div>
<div><h2 style="font-size:20px">${l.match(a.pct)}</h2><p class="sub" style="margin:0 0 14px">${l.sum(a.matched.length,a.c.length,rest)}</p><button class="btn" onclick="go('roadmap')">${l.seeRm}</button></div></div>
<div class="cols">
<div class="card"><h3 class="ok" style="margin-top:0">✅ ${l.mt} (${a.matched.length})</h3>${li(a.matched,'ok',x=>l.lv[x.have])}</div>
<div class="card"><h3 class="wr" style="margin-top:0">⚠️ ${l.lo} (${a.deficit.length})</h3>${li(a.deficit,'wr',x=>`${l.lv[x.have]} ${arrow} ${l.lv[x.req]}`)}</div>
<div class="card"><h3 class="bd" style="margin-top:0">❌ ${l.mi} (${a.missing.length})</h3>${li(a.missing,'bd',x=>l.needs(l.lv[x.req]))}</div></div>
<p class="hint">${l.tap}</p>`}

// Skill dialog opened from the analysis page
let pend=0;
function openSkill(n){
  const l=L(),req=(CAREERS[S.career]||[]).find(x=>x[0]===n);pend=S.skills[n]||0;
  dlg.innerHTML=`<h2 data-n="${esc(n)}">${esc(n)}</h2><p class="sub" style="margin:0">${req?l.reqLv(l.lv[req[1]]):''}</p>
<p style="margin:14px 0 0;font-size:14px">${l.yourLv}</p><div class="lv" id="plv">${[0,1,2,3].map(i=>`<button class="${pend===i?'on':''}" onclick="pickLv(${i})">${l.lv[i]}</button>`).join('')}</div>
${resLink(n)}<div class="acts"><button class="btn ghost" onclick="closeDlg()">${l.cancel}</button><button class="btn" onclick="saveSkill(nm(this))">${l.save}</button></div>`;
  dlg.showModal();
}
function pickLv(i){pend=i;[...document.querySelectorAll('#plv button')].forEach((b,j)=>b.classList.toggle('on',j===i))}
function saveSkill(n){
  if(pend===0){delete S.skills[n];delete S.done[n]}else S.skills[n]=pend;
  save();closeDlg();render();toast(L().tUp);
}

function roadmap(){
  const l=L(),a=analyze();
  if(!a)return `<div class="card empty"><h2>${l.noRm}</h2><p>${l.noRmP}</p><button class="btn" onclick="go('careers')">${l.explore}</button></div>`;
  const wk=new Set(weakList().map(x=>x.n)),steps=a.c.filter(([n,r])=>(S.skills[n]||0)<r).sort((x,y)=>wk.has(y[0])-wk.has(x[0])),done=steps.filter(([n])=>S.done[n]).length,p=steps.length?Math.round(done/steps.length*100):100;
  barTo=p;
  return `<h2>${l.rT}</h2><p class="sub">${l.rS}</p>
<div class="card" style="margin-bottom:16px"><div style="display:flex;justify-content:space-between"><b>${l.done(done,steps.length)}</b><b class="ok">${l.mp(a.pct)}</b></div><div class="bar"><i style="width:${barNow}%"></i></div>
${steps.length?steps.map(([n,r],i)=>{const h=S.skills[n]||0;return `<label class="step card ${S.done[n]?'done':''}" id="st-${i}" data-n="${esc(n)}"><input type="checkbox" ${S.done[n]?'checked':''} onchange="finish(nm(this),this.checked,${i})"><span class="grow"><span class="nm">${esc(n)}</span>${wk.has(n)?` <span class="chip">${l.focus}</span>`:''}<small>${h?l.youAt(l.lv[h],l.lv[r]):l.newS(l.lv[r])}</small></span>${resLink(n)}</label>`}).join(''):`<div class="empty"><h2 class="ok">${l.left}</h2><p>${l.leftP}</p><button class="btn" onclick="go('careers')">${l.explore}</button></div>`}</div>`}
function finish(n,on,i){
  if(on)S.done[n]=true;else delete S.done[n];save();render();
  if(on){const el=$('st-'+i);if(el)el.classList.add('pop');const a=analyze();toast(a.pct===100?L().tAll:L().tDone(n,a.pct))}
}

// ===== Track: level tests, final test, portfolio, page navigation =====
// Each entry: question | correct answer | wrong | wrong (options are shuffled when shown)
const QB={
 'HTML':["Which element holds the visible page content?|<body>|<head>|<meta>","Which tag creates a hyperlink?|<a>|<link>|<href>","What is the alt attribute on <img> for?|Text alternative for the image|Sets the image size|Adds a border"],
 'CSS':["Which property changes text color?|color|font-color|text-style","What does display:flex enable?|A flexible box layout|Hiding elements|Page animations","Which selector targets the class card?|.card|#card|card()"],
 'JavaScript':["Which keyword declares a constant?|const|var|let","What does === check?|Value and type|Value only|Reference only","Which method adds an item to the end of an array?|push()|pop()|shift()"],
 'Git':["Which command saves staged changes as a commit?|git commit|git add|git push","Which command copies a remote repository?|git clone|git init|git merge","What does git status show?|The state of your working files|The remote URL|The commit authors"],
 'APIs':["Which JavaScript function makes an HTTP request?|fetch()|send()|request.get()","Which format do most web APIs return?|JSON|PNG|CSS","What does HTTP status 404 mean?|Not found|Server error|Success"],
 'React':["What does a React component return?|JSX|SQL|CSS","Which hook stores state in a function component?|useState|useFetch|useClass","How is data passed from a parent to a child component?|props|cookies|SQL queries"],
 'Node.js':["Node.js lets you run JavaScript...|Outside the browser|Only in browsers|Only on phones","Which command installs a package?|npm install|node get|npm run","Which file lists the project dependencies?|package.json|index.html|node.config"],
 'Databases/SQL':["A row in a table is also called a...|record|column|index","What does a primary key do?|Uniquely identifies each row|Sorts the data|Encrypts the data","Which one is a relational database?|MySQL|Figma|Git"],
 'Express':["Express is a web framework for...|Node.js|Python|Java","Which method defines a GET route?|app.get()|app.fetch()|app.read()","What is middleware?|A function that runs between request and response|A database|A CSS file"],
 'REST APIs':["Which HTTP method usually creates a resource?|POST|GET|HEAD","Which HTTP method removes a resource?|DELETE|PUT|PATCH","What does stateless mean in REST?|Each request carries all the info it needs|The server keeps sessions|There are no URLs"],
 'System Architecture':["What does a load balancer do?|Spreads traffic across servers|Compresses images|Writes CSS","Caching mainly improves...|Read speed|Font size|Password strength","In the client-server model, the client...|Requests services from the server|Hosts the database|Stores all the data"],
 'User Research':["Which is a qualitative method?|User interviews|Page view counts|Server logs","What is a persona?|A fictional profile of a typical user|A color palette|A bug report","Why test with real users?|To find real usability problems early|To skip design|To pick a font"],
 'Wireframing':["A wireframe mainly shows...|Layout and structure|Final colors|Brand photos","A low-fidelity wireframe is usually...|A simple sketch|Finished code|A final visual","Why wireframe before visual design?|To agree on layout cheaply|To avoid user needs|To pick fonts first"],
 'Figma':["Figma is mainly a...|Collaborative design tool|Database|Compiler","What are Frames in Figma used for?|Containers for screens and layouts|Version control|Coding","Auto layout helps you...|Resize and space content automatically|Export to SQL|Write tests"],
 'Prototyping':["A prototype lets you test...|The interaction flow|Server speed|Database size","A high-fidelity prototype looks...|Close to the final product|Like a sketch|Like plain code","When should you prototype?|Before development|Only after release|Never"],
 'Design Systems':["A design system provides...|Reusable components and guidelines|A database|A server","Design tokens store...|Values like colors and spacing|Passwords|Bug reports","The main benefit is...|Consistency across the product|Longer builds|Fewer users"],
 'Excel':["Which function adds a range of numbers?|SUM|ADD|PLUS","What does a PivotTable do?|Summarizes data by groups|Sends email|Locks cells","Which function looks up a value in a table?|VLOOKUP|SUMUP|FINDIT"],
 'Statistics':["The average of a set of values is the...|Mean|Mode|Range","The middle value of sorted data is the...|Median|Mean|Mode","Standard deviation measures...|The spread of data|The sample size|The median"],
 'SQL':["Which clause filters rows?|WHERE|ORDER BY|GROUP BY","Which statement reads data?|SELECT|INSERT|UPDATE","What does JOIN do?|Combines rows from tables|Deletes tables|Sorts text"],
 'Python':["Which one creates a list?|[1, 2, 3]|{1, 2, 3}|<1, 2, 3>","How do you define a function?|def f():|function f()|fn f()","What does len(\"abc\") return?|3|abc|2"],
 'Data Visualization':["Best chart for change over time?|Line chart|Pie chart|Single number","A pie chart shows...|Parts of a whole|Trends only|Correlation only","A good practice is to...|Label axes clearly|Add heavy 3D effects|Hide the scale"],
 'Agile Basics':["A Scrum sprint is...|A fixed-length work cycle|A bug|A tool","A daily stand-up is for...|A short team sync on progress|The final release|Reviewing all code","Agile values...|Responding to change|Following a rigid plan|Skipping tests"],
 'Manual Testing':["A test case includes...|Steps and an expected result|Only code|Only colors","Regression testing checks that...|Old features still work after changes|A new logo looks good|Server cost is low","Black-box testing means testing...|Without looking at the code|Only the code|Only databases"],
 'Bug Tracking':["A good bug report includes...|Steps to reproduce|Opinions only|Nothing","Severity describes...|The impact of the bug|Who found it|The date","Which one is a bug tracker?|Jira|Figma|Photoshop"],
 'Postman':["Postman is used to...|Test APIs|Draw wireframes|Edit videos","A Postman collection is...|A group of saved requests|A database|A chart","Where do you put JSON for a POST request?|Body|Docs|Console"],
 'Selenium/Cypress':["Selenium and Cypress automate...|Browser tests|Image editing|Database design","A locator is used to...|Find an element on the page|Deploy code|Write SQL","Why wait for elements?|They may load asynchronously|Tests must be slow|Waiting is forbidden"]
};
// Project ideas for the portfolio: title | description | stack
const PROJ={
 frontend:["Personal portfolio site|Responsive site with about, skills and contact sections|HTML · CSS","Weather dashboard|Fetch live data from a public API and show a 5-day forecast|JavaScript · APIs","Task manager app|React app to add, edit and filter tasks|React · Git"],
 backend:["Blog REST API|CRUD endpoints for posts and users|Node.js · Express","Auth service|Sign-up, login and protected routes|Express · SQL","Orders database|Schema design and reporting queries|SQL · Architecture"],
 uiux:["Mobile app redesign|Research, wireframes and a clickable prototype|Figma","Design system starter|Colors, type scale and 10 reusable components|Design Systems","Usability test report|Interview 5 users and present the findings|User Research"],
 data:["Sales dashboard|Clean data in Excel and build charts|Excel · Visualization","SQL analysis report|Answer business questions with joins and aggregates|SQL · Statistics","Python data story|Analyze a public dataset and present insights|Python"],
 tester:["Test plan and cases|A plan with 20 test cases for a web app|Manual Testing","Bug report pack|Document 10 bugs with steps and severity|Bug Tracking","API test collection|Postman collection with automated checks|Postman"]
};
const parseQ=r=>{const [q,...o]=r.split('|');return {q,a:o[0],o}};
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const levelsOf=()=>CAREERS[S.career]||[];
let Z=null;

function pager(){
  if(view==='admin')return '';
  const l=L(),i=VIEWS.indexOf(view),p=VIEWS[i-1],n=VIEWS[i+1],rtl=S.lang==='ar';
  return `<div class="pager noprint">${p?`<button class="btn ghost" onclick="go('${p}')">${rtl?'→':'←'} ${l.nav[p]}</button>`:'<span></span>'}${n?`<button class="btn" onclick="go('${n}')">${l.nav[n]} ${rtl?'←':'→'}</button>`:'<span></span>'}</div>`;
}
function needCareer(){const l=L();return `<div class="card empty"><h2>${l.noCar}</h2><p>${l.noCarP}</p><button class="btn" onclick="go('careers')">${l.explore}</button></div>`}

function track(){
  const l=L(),c=levelsOf();if(!c.length)return needCareer();
  let prev=true;const n0=c.filter(([n])=>n in S.passed||S.self[n]).length;
  const rows=c.map(([n,req],i)=>{
    const ps=n in S.passed||!!S.self[n],open=prev,st=ps?'pass':open?'open':'lock',k=esc(n);prev=prev&&ps;
    return `<div class="card lvl ${st}" data-n="${k}"><span class="num">${ps?'✓':i+1}</span><div class="grow"><b>${k}</b><small>${l.lvl(i+1)} · ${l.lv[req]}${ps?` · ${n in S.passed?S.passed[n]+'%':l.selfTag}`:''}</small></div>${resLink(n)}<a class="res" href="#" onclick="openRes(nm(this));return false">${l.more}</a>${open?`<button class="btn ${ps?'ghost':''} sm" data-n="${k}" onclick="startQuiz(nm(this))">${ps?l.retake:l.take}</button>`:`<span class="chip">🔒 ${l.stLocked}</span>`}</div>`}).join('');
  const f=S.finals[S.career];
  return `<h2>${l.trT(l.c[S.career])}</h2><p class="sub">${l.trS}</p>
<div class="card"><div style="display:flex;justify-content:space-between"><b>${n0}/${c.length}</b><b class="ok">${Math.round(n0/c.length*100)}%</b></div><div class="bar"><i style="width:${n0/c.length*100}%"></i></div>${rows}</div>
<div class="card lvl ${prev?'open':'lock'}" style="margin-top:14px"><span class="num">★</span><div class="grow"><b>${l.finalT}</b><small>${prev?l.finalD:l.finalLockP}</small></div>${prev?`<button class="btn sm" onclick="startQuiz('#final')">${f?l.retake:l.take}</button>`:`<span class="chip">🔒 ${l.stLocked}</span>`}${f?`<button class="btn ghost sm" onclick="go('portfolio')">${l.toPf}</button>`:''}</div>`;
}

// Quiz engine: single choice, multiple answers, ordering and short code fixes.
// Base questions are built in; more are fetched from /api/questions (questions.json on the server).
const norm=x=>String(x).replace(/\s+/g,'').replace(/;$/,'');
async function pool(skill){
  const base=(QB[skill]||[]).map(r=>{const p=parseQ(r);return {t:'single',q:p.q,o:p.o,a:p.a}});
  let extra=[];
  try{const ctl=new AbortController();setTimeout(()=>ctl.abort(),2500);extra=await (await fetch(API+'/api/questions/'+encodeURIComponent(skill),{signal:ctl.signal})).json()}catch(e){}
  return {base,extra:Array.isArray(extra)?extra:[]};
}
function prepQ(x){
  if(x.t==='single')return {...x,o:shuffle(x.o)};
  if(x.t==='multi')return {t:'multi',q:x.q,a:x.a.map(i=>x.o[i]),o:shuffle(x.o),sel:new Set()};
  if(x.t==='order')return {t:'order',q:x.q,order:x.o,cur:shuffle(x.o)};
  return {t:'code',q:x.q,code:x.code,a:x.a,val:''};
}
async function startQuiz(skill){
  const final=skill==='#final',c=levelsOf();
  dlg.classList.add('wide');dlg.innerHTML='<p class="sub">…</p>';if(!dlg.open)dlg.showModal();
  let qs;
  if(final){const ps=await Promise.all(c.map(([n])=>pool(n)));qs=ps.map(p=>{const all=[...p.base,...p.extra];return all.length?all[Math.floor(Math.random()*all.length)]:null}).filter(Boolean)}
  else{const p=await pool(skill);qs=[...p.base,...shuffle(p.extra).slice(0,2)]}
  if(!qs.length)return noTest(skill);
  Z={skill,final,i:0,score:0,sel:null,checked:false,qs:qs.map(prepQ)};
  drawQuiz();
}
function drawQuiz(){
  const l=L(),q=Z.qs[Z.i],ck=Z.checked,last=Z.i+1>=Z.qs.length;let body='';
  if(q.t==='single')body=q.o.map((o,k)=>`<button class="opt ${ck?(o===q.a?'good':k===Z.sel?'bad':''):''}" dir="ltr" ${ck?'disabled':''} onclick="answer(${k})">${esc(o)}</button>`).join('');
  else if(q.t==='multi')body=q.o.map((o,k)=>`<button class="opt ${ck?(q.a.includes(o)?'good':q.sel.has(k)?'bad':''):(q.sel.has(k)?'on':'')}" dir="ltr" ${ck?'disabled':''} onclick="toggleOpt(${k})">${esc(o)}</button>`).join('');
  else if(q.t==='order')body=q.cur.map((o,k)=>`<div class="opt ord ${ck?(o===q.order[k]?'good':'bad'):''}" dir="ltr"><span>${k+1}. ${esc(o)}</span>${ck?'':`<span><button class="x" onclick="move(${k},-1)" aria-label="up">↑</button><button class="x" onclick="move(${k},1)" aria-label="down">↓</button></span>`}</div>`).join('');
  else body=`<pre class="code" dir="ltr">${esc(q.code)}</pre><input type="text" id="codein" dir="ltr" ${ck?'disabled':''} value="${esc(q.val||'')}" oninput="Z.qs[Z.i].val=this.value" onkeydown="if(event.key==='Enter')checkQ()" style="width:100%">${ck?`<p class="${q.ok?'ok':'bd'}" dir="ltr">${q.ok?'✓':'✗ '+esc(q.a[0])}</p>`:''}`;
  const hint={multi:l.multiHint,order:l.orderHint,code:l.codeHint}[q.t];
  dlg.innerHTML=`<p class="sub" style="margin:0 0 6px">${Z.final?l.finalT:esc(Z.skill)} · ${l.qOf(Z.i+1,Z.qs.length)}</p><h2 dir="ltr" style="text-align:start">${esc(q.q)}</h2>${hint?`<p class="hintline">${hint}</p>`:''}
<div class="opts">${body}</div>
<div class="acts"><button class="btn ghost" onclick="closeDlg()">${l.cancel}</button>${!ck&&q.t!=='single'?`<button class="btn" onclick="checkQ()">${l.check}</button>`:''}${ck?`<button class="btn" onclick="nextQ()">${last?l.seeRes:l.next}</button>`:''}</div>`;
}
function answer(k){if(Z.checked)return;const q=Z.qs[Z.i];Z.sel=k;Z.checked=true;if(q.o[k]===q.a)Z.score++;drawQuiz()}
function toggleOpt(k){const q=Z.qs[Z.i];if(Z.checked)return;q.sel.has(k)?q.sel.delete(k):q.sel.add(k);drawQuiz()}
function move(k,d){const q=Z.qs[Z.i],j=k+d;if(j<0||j>=q.cur.length)return;[q.cur[k],q.cur[j]]=[q.cur[j],q.cur[k]];drawQuiz()}
function checkQ(){
  if(Z.checked)return;
  const q=Z.qs[Z.i];let ok;
  if(q.t==='multi')ok=[...q.sel].map(k=>q.o[k]).sort().join('|')===[...q.a].sort().join('|');
  else if(q.t==='order')ok=q.cur.every((o,k)=>o===q.order[k]);
  else{const v=($('codein')||{}).value??q.val;q.val=v;ok=q.a.some(a=>norm(a)===norm(v))}
  q.ok=ok;Z.checked=true;if(ok)Z.score++;drawQuiz();
}
function nextQ(){Z.i++;Z.sel=null;Z.checked=false;Z.i>=Z.qs.length?quizResult():drawQuiz()}
function quizResult(){
  const l=L(),n=Z.qs.length,pct=Math.round(Z.score/n*100),need=Z.final?70:67,ok=pct>=need;
  S.history.push({d:day(),s:Z.final?'#final':Z.skill,pct,ok});if(S.history.length>400)S.history=S.history.slice(-400);
  if(ok){
    if(Z.final)S.finals[S.career]={pct,date:new Date().toISOString().slice(0,10)};
    else{S.passed[Z.skill]=Math.max(S.passed[Z.skill]||0,pct);S.done[Z.skill]=true}
  }
  save();
  const review=ok?'':(Z.final?levelsOf().map(([k])=>`${esc(k)} ${resLink(k)}`).join('<br>'):resLink(Z.skill));
  dlg.innerHTML=`<h2 class="${ok?'ok':'wr'}">${ok?'🎉':'📘'} ${l.score(Z.score,n)} (${pct}%)</h2><p class="sub" style="margin:0 0 10px">${ok?(Z.final?l.finalPass:l.passMsg):l.failMsg} ${l.needPct(need)}</p>${review?`<p style="line-height:2">${review}</p>`:''}
<div class="acts">${ok?`<button class="btn ghost" onclick="finishQuiz()">${l.cont}</button>${Z.final?`<button class="btn" onclick="finishQuiz('portfolio')">${l.toPf}</button>`:''}`:`<button class="btn ghost" onclick="finishQuiz()">${l.close}</button><button class="btn" onclick="startQuiz(Z.final?'#final':Z.skill)">${l.retry}</button>`}</div>`;
}
function finishQuiz(to){closeDlg();if(to)go(to);else render()}

function portfolio(){
  const l=L(),f=S.finals[S.career];
  if(!f)return `<div class="card empty"><h2>🔒 ${l.pfLockT}</h2><p>${l.pfLockP}</p><button class="btn" onclick="go('track')">${l.nav.track}</button></div>`;
  const inp=(k,ph,t)=>`<input type="${t||'text'}" value="${esc(S[k]||'')}" placeholder="${ph}" aria-label="${ph}" oninput="S.${k}=this.value;save();$('pfv').innerHTML=pfPreview()">`;
  return `<div class="noprint"><h2>${l.nav.portfolio}</h2><p class="sub">${l.pfS}</p>
<div class="tools">${inp('name',l.pfName)}${inp('git',l.pfGit)}${inp('mail',l.pfMail,'email')}</div>
<textarea rows="3" placeholder="${l.pfBio}" aria-label="${l.pfBio}" oninput="S.bio=this.value;save();$('pfv').innerHTML=pfPreview()">${esc(S.bio)}</textarea>
<div class="tools"><button class="btn ghost" onclick="print()">🖨 ${l.pfPrint}</button><button class="btn" onclick="exportPdf()">⬇ ${l.pfPdf}</button><button class="btn" onclick="shareLink()">🔗 ${l.pfShare}</button></div></div>
<div id="pfv">${pfPreview()}</div>`;
}
function pfPreview(){
  const l=L(),c=levelsOf(),f=S.finals[S.career]||{pct:0,date:''},who=S.name.trim()||l.pfYou;
  const ini=who.split(/\s+/).slice(0,2).map(w=>w[0]).join('').toUpperCase();
  const links=[S.git.trim()&&`<span class="chip">🔗 ${esc(S.git)}</span>`,S.mail.trim()&&`<span class="chip">✉ ${esc(S.mail)}</span>`].filter(Boolean).join('');
  const sk=c.map(([n,r])=>{const v=S.passed[n]||0;return `<div class="card"><div style="display:flex;justify-content:space-between"><b>${esc(n)}</b><span class="ok">${n in S.passed?v+'%':S.self[n]?l.selfTag:'0%'}</span></div><div class="bar"><i style="width:${v}%"></i></div><small class="sub">${l.lv[r]}</small></div>`}).join('');
  const pr=projFor(S.career).map(x=>{const [t,d,st]=x.split('|');return `<div class="card"><h3 style="margin:0 0 6px;font-size:17px">${t}</h3><p class="sub" style="margin:0 0 10px;font-size:14px">${d}</p><span class="tag">${st}</span></div>`}).join('');
  return `<article class="pf"><div class="pfh"><div class="av">${esc(ini)}</div><div><h1>${esc(who)}</h1><p class="role">${l.c[S.career]} · ${l.pfBadge}</p>${links}</div></div>
${S.bio.trim()?`<p class="pfbio">${esc(S.bio)}</p>`:''}
<h3>${l.pfAch}</h3><div class="badges"><span class="chip big">🏆 ${l.pfCert(f.date)} · ${f.pct}%</span>${c.filter(([n])=>n in S.passed).map(([n])=>`<span class="chip">✓ ${esc(n)}</span>`).join('')}</div>
<h3>${l.pfSk}</h3><div class="grid">${sk}</div><h3>${l.pfProj}</h3><div class="grid">${pr}</div></article>`;
}

// ===== Puzzle animation: intro splash and page assembly =====
const reduceMotion=()=>matchMedia('(prefers-reduced-motion:reduce)').matches;
function puzzleArt(){
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#22d3ee"/></linearGradient></defs><rect width="600" height="400" fill="url(#g)"/><g fill="none" stroke="#fff" stroke-linecap="round"><path d="M90 250C150 90 450 90 510 250" stroke-width="14"/><path d="M150 250V170M225 250V130M300 250V120M375 250V130M450 250V170" stroke-width="10"/><path d="M60 250H540" stroke-width="12"/></g><text x="300" y="350" font-family="Sora,Arial,sans-serif" font-size="64" font-weight="800" fill="#fff" text-anchor="middle" letter-spacing="8">BRIDGE</text></svg>`;
  return 'url("data:image/svg+xml,'+encodeURIComponent(svg)+'")';
}
/** Splash: a picture cut into tiles that fly in from every side and lock together. */
function intro(){
  if(reduceMotion()){booting=false;return}
  const C=6,R=4,el=document.createElement('div');el.id='intro';el.style.setProperty('--img',puzzleArt());
  let tiles='';
  for(let r=0;r<R;r++)for(let c=0;c<C;c++){
    const a=Math.random()*Math.PI*2,d=320+Math.random()*520;
    tiles+=`<i style="--x:${c};--y:${r};--tx:${Math.round(Math.cos(a)*d)}px;--ty:${Math.round(Math.sin(a)*d)}px;--tr:${Math.round(Math.random()*160-80)}deg;--td:${(Math.random()*.8).toFixed(2)}s"></i>`;
  }
  el.innerHTML=`<div class="pz" style="--c:${C};--r:${R}">${tiles}</div>`;
  document.body.appendChild(el);
  let ended=false;
  const end=()=>{if(ended)return;ended=true;el.classList.add('out');booting=false;puzzle($('app'));setTimeout(()=>el.remove(),700)};
  el.addEventListener('click',end);setTimeout(end,2600);
}
/** Page change: every block starts scattered and snaps into place, one after another. */
function puzzle(app){
  if(reduceMotion())return;
  const parts=[];
  [...app.children].forEach(c=>c.matches('.grid,.steps,.cols,.tools')?parts.push(...c.children):parts.push(c));
  const r=a=>(Math.random()*2-1)*a;
  parts.slice(0,40).forEach((p,i)=>{
    p.style.setProperty('--px',Math.round(r(170))+'px');p.style.setProperty('--py',Math.round(r(130))+'px');
    p.style.setProperty('--pr',Math.round(r(24))+'deg');p.style.setProperty('--ps',(.55+Math.random()*.3).toFixed(2));
    p.style.setProperty('--pd',(Math.min(i,14)*.05).toFixed(2)+'s');p.classList.add('piece');
  });
  setTimeout(()=>parts.forEach(p=>p.classList.remove('piece')),2000);
}

// ===== Cloud: accounts, sync, resources, portfolio export, tour, push =====
const API=location.protocol==='file:'?'http://localhost:3000':'';
let TOKEN=localStorage.getItem('bridge-token')||'',USER=null,syncTimer=0,authMode='login';
try{USER=JSON.parse(localStorage.getItem('bridge-user')||'null')}catch(e){}
async function api(path,opt={}){
  const r=await fetch(API+path,{...opt,headers:{'Content-Type':'application/json',...(TOKEN?{Authorization:'Bearer '+TOKEN}:{}),...(opt.headers||{})}});
  const j=await r.json().catch(()=>({}));
  if(!r.ok){if(r.status===401&&TOKEN&&!path.startsWith('/api/login'))logout(true);throw new Error(j.error||'HTTP '+r.status)}
  return j;
}
// what gets stored in the cloud (last write wins, newest timestamp)
const SYNC=['skills','custom','career','done','passed','finals','name','bio','git','mail','history','customTracks','self','lang'];
const cloudData=()=>Object.fromEntries(SYNC.map(k=>[k,S[k]]));
function cloudSave(){if(!TOKEN)return;clearTimeout(syncTimer);syncTimer=setTimeout(pushState,800)}
async function pushState(){try{await api('/api/state',{method:'PUT',body:JSON.stringify({data:cloudData(),updated:S.updated})})}catch(e){}}
async function syncDown(){
  const r=await api('/api/state');
  if(r.data&&r.updated>(S.updated||0)){
    Object.assign(S,fresh(S.lang),r.data,{updated:r.updated,lang:S.lang});
    try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}
    registerTracks();render();
  }else await pushState();
}
function bootCloud(){
  loadRemoteCareers();
  const q=new URLSearchParams(location.search);
  if(q.get('reset')){RESET_TOKEN=q.get('reset');history.replaceState(null,'',location.pathname+location.hash);resetDialog()}
  if(location.hash.startsWith('#auth=')){
    TOKEN=location.hash.slice(6);history.replaceState(null,'',location.pathname+'#home');
    api('/api/me').then(u=>{USER=u;localStorage.setItem('bridge-token',TOKEN);localStorage.setItem('bridge-user',JSON.stringify(u));return syncDown()}).then(()=>{render();toast(L().tSync)}).catch(()=>logout(true));
  }else if(TOKEN){api('/api/me').then(u=>{USER=u;localStorage.setItem('bridge-user',JSON.stringify(u));render()}).catch(()=>{});syncDown().catch(()=>{})}
  setTimeout(()=>{try{if(!localStorage.getItem('bridge-tour'))startTour()}catch(e){}},3800);
}
function openAccount(){
  const l=L(),login=authMode==='login';
  if(USER)dlg.innerHTML=`<h2>${esc(USER.name)}</h2><p class="sub" style="margin:0 0 6px">${l.signedAs(esc(USER.email))}</p><p class="sub" style="margin:0 0 14px">${l.synced}</p>
<button class="btn ghost sm" onclick="enablePush()">🔔 ${l.pushOn}</button>${USER.role==='admin'?` <button class="btn ghost sm" onclick="closeDlg();go('admin')">⚙ ${l.nav.admin}</button>`:''}<div class="acts"><button class="btn ghost" onclick="closeDlg()">${l.close}</button><button class="btn danger" onclick="logout()">${l.logout}</button></div>`;
  else dlg.innerHTML=`<h2>${login?l.login:l.register}</h2>${login?'':`<input type="text" id="au-name" maxlength="40" placeholder="${l.nameLbl}" style="width:100%;margin-bottom:10px">`}
<input type="email" id="au-mail" placeholder="${l.email}" autocomplete="email" style="width:100%;margin-bottom:10px"><input type="password" id="au-pass" placeholder="${l.pass}" autocomplete="${login?'current-password':'new-password'}" style="width:100%">
<p class="bd" id="au-err" role="alert" style="margin:8px 0 0;min-height:1.3em;font-size:13px"></p>${login?`<a class="res" href="#" onclick="forgotDialog();return false">${l.forgot}</a>`:''}<div id="oauth"></div>
<div class="acts"><button class="btn ghost" onclick="authMode='${login?'register':'login'}';openAccount()">${login?l.register:l.login}</button><button class="btn" onclick="submitAuth()">${login?l.login:l.register}</button></div>`;
  if(!dlg.open)dlg.showModal();
  if(!USER)loadProviders();
}
async function submitAuth(){
  const g=id=>($(id)||{}).value||'';
  try{
    const r=await api(authMode==='login'?'/api/login':'/api/register',{method:'POST',body:JSON.stringify({email:g('au-mail'),password:g('au-pass'),name:g('au-name')})});
    TOKEN=r.token;USER=r.user;localStorage.setItem('bridge-token',TOKEN);localStorage.setItem('bridge-user',JSON.stringify(USER));
    closeDlg();await syncDown();render();toast(L().tSync);
  }catch(e){const el=$('au-err');if(el)el.textContent=e instanceof TypeError?L().offline:e.message}
}
function logout(silent){
  TOKEN='';USER=null;authMode='login';localStorage.removeItem('bridge-token');localStorage.removeItem('bridge-user');
  if(silent!==true)closeDlg();render();
}

// learning resources: YouTube lessons (when the server has an API key) and course platforms
async function openRes(n){
  const l=L();dlg.classList.add('wide');
  dlg.innerHTML=`<h2>${esc(n)}</h2><p class="sub">${l.resT}</p><div id="reslist">…</div><div class="acts"><button class="btn ghost" onclick="closeDlg()">${l.close}</button></div>`;if(!dlg.open)dlg.showModal();
  let r;
  try{r=await api('/api/resources/'+encodeURIComponent(n))}
  catch(e){const q=encodeURIComponent(n+' tutorial for beginners');r={videos:[],courses:[{title:'YouTube',url:'https://www.youtube.com/results?search_query='+q},{title:'freeCodeCamp',url:'https://www.freecodecamp.org/news/search?query='+q}]}}
  const li=a=>`<li><a class="res" href="${esc(a.url)}" target="_blank" rel="noopener">${esc(a.title)}</a>${a.channel?` <small class="sub">· ${esc(a.channel)}</small>`:''}</li>`;
  const box=$('reslist');if(box)box.innerHTML=(r.videos.length?`<h3>▶ YouTube</h3><ul class="reslist">${r.videos.map(li).join('')}</ul>`:'')+`<h3>🎓 ${l.courses}</h3><ul class="reslist">${r.courses.map(li).join('')}</ul>`;
}

// portfolio: real PDF (html2canvas + jsPDF, loaded on demand) and a public link
const loadJs=u=>new Promise((ok,no)=>{if(document.querySelector(`script[src="${u}"]`))return ok();const e=document.createElement('script');e.src=u;e.onload=ok;e.onerror=no;document.head.appendChild(e)});
async function exportPdf(){
  const el=$('pfv').firstElementChild;toast('…');
  try{
    await loadJs('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
    await loadJs('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
    const cv=await html2canvas(el,{scale:2,backgroundColor:'#ffffff',onclone:d=>{
      const st=d.createElement('style');   // flat light colors: html2canvas cannot read color-mix()
      st.textContent=':root,:root:not([data-theme="dark"]){--bg:#fff;--card:#fff;--tx:#111;--mut:#555;--line:#ccc}.card,.pf{background:#fff!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important}*{animation:none!important}';
      d.head.appendChild(st);}});
    const {jsPDF}=window.jspdf,pdf=new jsPDF('p','mm','a4'),w=210,h=cv.height*w/cv.width,img=cv.toDataURL('image/jpeg',.92);
    for(let y=0;y<h;y+=297){if(y)pdf.addPage();pdf.addImage(img,'JPEG',0,-y,w,h)}
    pdf.save((S.name.trim()||'portfolio').replace(/\s+/g,'-')+'-BRIDGE.pdf');
  }catch(e){toast(L().pdfFail)}
}
const snapshot=()=>({name:S.name,bio:S.bio,git:S.git,mail:S.mail,role:I.en.c[S.career],final:S.finals[S.career],skills:levelsOf().map(([n,r])=>({n,min:I.en.lv[r],pct:S.passed[n]||0,self:!!S.self[n]&&!(n in S.passed)})),projects:projFor(S.career)});
async function shareLink(){
  const l=L();if(!TOKEN){toast(l.pfLinkLogin);openAccount();return}
  try{
    const r=await api('/api/share',{method:'POST',body:JSON.stringify({snapshot:snapshot()})});
    try{await navigator.clipboard.writeText(r.url);toast(l.pfCopied)}catch(e){}
    dlg.innerHTML=`<h2>${l.pfPublic}</h2><input type="text" readonly value="${esc(r.url)}" onfocus="this.select()" style="width:100%"><div class="acts"><button class="btn ghost" onclick="unshare()">${l.unshare}</button><button class="btn" onclick="closeDlg()">${l.close}</button></div>`;
    if(!dlg.open)dlg.showModal();
  }catch(e){toast(e.message)}
}
async function unshare(){try{await api('/api/share',{method:'DELETE'})}catch(e){}closeDlg()}

// onboarding tour: spotlight + tooltip, shown once to new visitors
function startTour(i){
  i=i||0;const l=L(),st=l.tour,t=st[i],tg=document.querySelector(['#nav','#app h1, #app h2','#accBtn','#langBtn'][i]);if(!tg)return endTour();
  let el=$('tour');if(!el){el=document.createElement('div');el.id='tour';document.body.appendChild(el)}
  const r=tg.getBoundingClientRect(),below=r.bottom+200<innerHeight;
  el.innerHTML=`<div class="hole" style="left:${r.left-8}px;top:${r.top-8}px;width:${r.width+16}px;height:${r.height+16}px"></div>
<div class="tip" role="dialog" style="left:${Math.max(12,Math.min(innerWidth-332,r.left))}px;top:${below?r.bottom+18:Math.max(12,r.top-190)}px"><b>${t[0]}</b><p>${t[1]}</p><div class="acts"><button class="btn ghost sm" onclick="endTour()">${l.tSkip}</button><button class="btn sm" onclick="${i+1<st.length?'startTour('+(i+1)+')':'endTour()'}">${i+1<st.length?l.next:l.tourDone}</button></div></div>`;
}
function endTour(){const e=$('tour');if(e)e.remove();try{localStorage.setItem('bridge-tour','1')}catch(x){}}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('tour'))endTour()});

// daily reminders (Web Push; the server sends them at REMINDER_HOUR)
const b64=k=>Uint8Array.from(atob((k+'='.repeat((4-k.length%4)%4)).replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));
async function enablePush(){
  const l=L();
  try{
    if(!('serviceWorker' in navigator)||!('PushManager' in window)||location.protocol==='file:')throw 0;
    if(await Notification.requestPermission()!=='granted')throw 0;
    const reg=await navigator.serviceWorker.register('/sw.js'),{key}=await api('/api/push/key');
    const sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64(key)});
    await api('/api/push/subscribe',{method:'POST',body:JSON.stringify(sub)});toast(l.pushDone);
  }catch(e){toast(l.pushNo)}
}

// ===== Progress: streaks, activity chart, insights =====
const day=(o=0)=>{const d=new Date();d.setDate(d.getDate()-o);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
let pgRange=7;
function streaks(){
  const set=new Set(S.history.map(h=>h.d));let cur=0;
  for(let o=set.has(day())?0:1;set.has(day(o));o++)cur++;
  let best=0,run=0,prev=null;
  for(const d of [...set].sort()){const t=new Date(d+'T00:00:00');run=prev&&Math.round((t-prev)/864e5)===1?run+1:1;prev=t;best=Math.max(best,run)}
  return {cur,best};
}
function skillStats(){
  const m={};
  S.history.filter(h=>h.s!=='#final').forEach(h=>{const x=m[h.s]||(m[h.s]={n:h.s,att:0,fail:0,sum:0,last:true});x.att++;x.sum+=h.pct;if(!h.ok)x.fail++;x.last=h.ok});
  return Object.values(m).map(x=>({...x,avg:Math.round(x.sum/x.att)}));
}
// weak = the last attempt failed, or the average score is under 75%
const weakList=()=>skillStats().filter(x=>!x.last||x.avg<75).sort((a,b)=>a.avg-b.avg);
function progress(){
  const l=L(),H=S.history;
  if(!H.length)return `<div class="card empty"><h2>${l.prT}</h2><p>${l.actNone}</p><button class="btn" onclick="go('track')">${l.nav.track}</button></div>`;
  const {cur,best}=streaks(),avg=Math.round(H.reduce((a,h)=>a+h.pct,0)/H.length);
  const cols=Array.from({length:pgRange},(_,i)=>{const d=day(pgRange-1-i),xs=H.filter(h=>h.d===d);return {d,n:xs.length,avg:xs.length?Math.round(xs.reduce((a,h)=>a+h.pct,0)/xs.length):0}});
  const mx=Math.max(1,...cols.map(c=>c.n));
  const bars=cols.map(c=>`<div class="col" title="${c.d}: ${c.n} · ${c.avg}%"><div class="bw"><i class="${c.n?'on':''}" style="height:${c.n?Math.max(8,c.n/mx*100):2}%"></i></div><small>${pgRange>7&&+c.d.slice(8)%2?'':c.d.slice(8)}</small></div>`).join('');
  const weak=weakList().slice(0,5),nextLv=levelsOf().find(([n])=>!(n in S.passed||S.self[n]));
  const stat=(v,t)=>`<div class="card stat"><b>${v}</b><small>${t}</small></div>`;
  return `<h2>${l.prT}</h2><p class="sub">${l.prS}</p>
<div class="steps">${stat('🔥 '+cur,l.streak)}${stat(best,l.best)}${stat(H.length,l.tests)}${stat(avg+'%',l.avg)}</div>
<div class="card" style="margin-top:14px"><div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap"><b>${l.act}</b><div class="seg"><button class="${pgRange===7?'on':''}" onclick="pgRange=7;render()">${l.d7}</button><button class="${pgRange===30?'on':''}" onclick="pgRange=30;render()">${l.d30}</button></div></div><div class="chart">${bars}</div></div>
<div class="card" style="margin-top:14px"><b>${l.weakT}</b>${weak.length?weak.map(x=>`<div class="row" data-n="${esc(x.n)}"><span>${esc(x.n)}<small class="sub" style="display:block;margin:0">${l.weakRow(x.avg,x.att,x.fail)}</small></span><span><button class="btn ghost sm" onclick="openRes(nm(this))">${l.review}</button> <button class="btn sm" onclick="startQuiz(nm(this))">${l.practice}</button></span></div>`).join(''):`<p class="sub" style="margin:10px 0 0">${l.allGood}</p>`}</div>
${nextLv?`<div class="card" style="margin-top:14px"><b>${l.nextT}</b><p class="sub" style="margin:6px 0 10px">${l.nextD(esc(nextLv[0]))}</p><button class="btn sm" onclick="go('track')">${l.nav.track}</button></div>`:''}`;
}

// ===== Custom career track builder =====
let BD=null;
const knownSkills=()=>[...new Set([...ALL,...S.custom,...Object.values(CAREERS).flat().map(x=>x[0])])].sort();
function registerTracks(){Object.entries(S.customTracks).forEach(([id,t])=>{CAREERS[id]=t.skills;I.en.c[id]=I.ar.c[id]=t.title})}
const projFor=id=>PROJ[id]||(CAREERS[id]||[]).slice(0,3).map(([n],i,a)=>`${n} mini project|Build a small project that uses ${n}${a[i+1]?' and '+a[i+1][0]:''}|${n}${a[i+1]?' · '+a[i+1][0]:''}`);
function openBuilder(id){
  const t=id&&S.customTracks[id];
  BD=t?{id,title:t.title,skills:t.skills.map(x=>[...x])}:{id:null,title:'',skills:[]};
  dlg.classList.add('wide');drawBuilder();if(!dlg.open)dlg.showModal();
}
function drawBuilder(){
  const l=L(),have=new Set(BD.skills.map(x=>x[0]));
  dlg.innerHTML=`<h2>${l.bT}</h2><input type="text" id="bd-title" maxlength="60" placeholder="${l.bTitle}" value="${esc(BD.title)}" oninput="BD.title=this.value" style="width:100%;margin:10px 0">
<p class="hintline">${l.bPick}</p><div class="skillpick">${knownSkills().filter(n=>!have.has(n)).map(n=>`<button class="chip" data-n="${esc(n)}" onclick="bdAdd(nm(this))">＋ ${esc(n)}</button>`).join('')}</div>
<div class="tools" style="margin:10px 0"><input type="text" id="bd-new" maxlength="60" placeholder="${l.bAddPh}" onkeydown="if(event.key==='Enter')bdAddTyped()"><button class="btn ghost sm" onclick="bdAddTyped()">${l.bAdd}</button></div>
<b>${l.bSkills} (${BD.skills.length}/15)</b>
<div>${BD.skills.map(([n,v],i)=>`<div class="row"><span>${i+1}. ${esc(n)}</span><span><select aria-label="level" onchange="BD.skills[${i}][1]=+this.value">${[1,2,3].map(k=>`<option value="${k}" ${v===k?'selected':''}>${l.lv[k]}</option>`).join('')}</select> <button class="x" onclick="bdMove(${i},-1)" aria-label="up">↑</button><button class="x" onclick="bdMove(${i},1)" aria-label="down">↓</button><button class="x" onclick="bdDel(${i})" aria-label="remove">×</button></span></div>`).join('')}</div>
<p class="bd" id="bd-err" role="alert" style="min-height:1.3em;margin:8px 0 0;font-size:13px"></p>
<div class="acts"><button class="btn ghost" onclick="closeDlg()">${l.cancel}</button><button class="btn" onclick="bdSave()">${l.save}</button></div>`;
}
const bdAdd=n=>{if(BD.skills.length<15&&!BD.skills.some(x=>x[0]===n)){BD.skills.push([n,2]);drawBuilder()}};
function bdAddTyped(){const v=($('bd-new').value||'').trim().replace(/[;=|]/g,' ').replace(/\s+/g,' ');v?bdAdd(v):$('bd-new').focus()}
const bdMove=(i,d)=>{const j=i+d,s=BD.skills;if(j<0||j>=s.length)return;[s[i],s[j]]=[s[j],s[i]];drawBuilder()};
const bdDel=i=>{BD.skills.splice(i,1);drawBuilder()};
function bdSave(){
  const t=BD.title.trim();
  if(!t||BD.skills.length<2||BD.skills.length>15){$('bd-err').textContent=L().bNeed;return}
  const id=BD.id||'u-'+Date.now().toString(36);
  S.customTracks[id]={title:t,skills:BD.skills};registerTracks();S.career=id;save();closeDlg();toast(L().tTrack);go('analysis');
}
function delTrack(id){delete S.customTracks[id];delete CAREERS[id];if(S.career===id)S.career=null;save();render();toast(L().tTrackDel)}

// skills that have no test questions yet can be self-checked
function noTest(skill){
  const l=L();
  dlg.innerHTML=`<h2>${skill==='#final'?l.finalT:esc(skill)}</h2><p class="sub">${l.noTest}</p><div class="acts"><button class="btn ghost" onclick="closeDlg()">${l.close}</button>${skill==='#final'?'':`<button class="btn" data-n="${esc(skill)}" onclick="selfPass(nm(this))">${l.selfBtn}</button>`}</div>`;
}
function selfPass(n){S.self[n]=true;S.done[n]=true;save();closeDlg();render()}

// admin-published tracks are merged into CAREERS
async function loadRemoteCareers(){
  try{
    const list=await (await fetch(API+'/api/careers')).json();
    if(Array.isArray(list)&&list.length){list.forEach(c=>{CAREERS[c.id]=c.skills;I.en.c[c.id]=c.title.en;I.ar.c[c.id]=c.title.ar;if(c.projects&&c.projects.length)PROJ[c.id]=c.projects});if(view!=='admin')render()}
  }catch(e){}
}

// password reset and social sign-in
let RESET_TOKEN='';
async function loadProviders(){
  try{
    const ps=await (await fetch(API+'/api/auth/providers')).json(),box=$('oauth');
    if(box&&ps.length)box.innerHTML=`<p class="hintline">${L().orWith}</p>`+ps.map(p=>`<a class="btn ghost sm" style="text-decoration:none;display:inline-block;margin-inline-end:6px" href="${API}/auth/${p}">${p==='google'?'Google':'GitHub'}</a>`).join('');
  }catch(e){}
}
function forgotDialog(){
  const l=L();
  dlg.innerHTML=`<h2>${l.forgotT}</h2><p class="sub" style="margin:0 0 12px">${l.forgotP}</p><input type="email" id="fg-mail" placeholder="${l.email}" autocomplete="email" style="width:100%"><p id="fg-msg" role="status" class="ok" style="margin:8px 0 0;min-height:1.3em;font-size:13px"></p><div class="acts"><button class="btn ghost" onclick="openAccount()">${l.cancel}</button><button class="btn" onclick="sendForgot()">${l.sendLink}</button></div>`;
}
async function sendForgot(){
  const l=L(),box=$('fg-msg');
  try{
    const r=await api('/api/forgot',{method:'POST',body:JSON.stringify({email:($('fg-mail')||{}).value||''})});
    box.innerHTML=esc(l.forgotOk)+(r.devLink?`<br><small>${l.devLink} <a class="res" href="${esc(r.devLink)}">${esc(r.devLink)}</a></small>`:'');
  }catch(e){box.className='bd';box.textContent=e instanceof TypeError?l.offline:e.message}
}
function resetDialog(){
  const l=L();
  dlg.innerHTML=`<h2>${l.forgotT}</h2><input type="password" id="rs-pass" placeholder="${l.newPass}" autocomplete="new-password" style="width:100%"><p class="bd" id="rs-err" role="alert" style="margin:8px 0 0;min-height:1.3em;font-size:13px"></p><div class="acts"><button class="btn ghost" onclick="closeDlg()">${l.cancel}</button><button class="btn" onclick="applyReset()">${l.setPass}</button></div>`;
  if(!dlg.open)dlg.showModal();
}
async function applyReset(){
  try{
    await api('/api/reset',{method:'POST',body:JSON.stringify({token:RESET_TOKEN,password:$('rs-pass').value})});
    authMode='login';openAccount();toast(L().resetOk);
  }catch(e){$('rs-err').textContent=e instanceof TypeError?L().offline:e.message}
}

// ===== Admin panel (tab visible to administrators only; the server enforces the role too) =====
const isAdmin=()=>!!USER&&USER.role==='admin';
const AD={tab:'q',filter:'',qs:[],tracks:[],editQ:null};
const admSay=(id,t,ok)=>{const e=$(id);if(e){e.textContent=t;e.className='hintline '+(ok?'ok':'bd')}};
const admLines=id=>$(id).value.split('\n').map(x=>x.trim()).filter(Boolean);
function admin(){
  if(!isAdmin())return `<div class="card empty"><h2>Administrators only</h2><p>Log in with an administrator account to manage questions and career tracks.</p><button class="btn" onclick="openAccount()">${L().login}</button></div>`;
  setTimeout(admLoad,0);
  const tab=(k,t)=>`<button class="${AD.tab===k?'on':''}" onclick="AD.tab='${k}';render()">${t}</button>`;
  return `<div class="adm" dir="ltr"><h2>Admin</h2><p class="sub">Add, edit and publish questions and career tracks. Changes reach students immediately.</p><div class="seg" style="width:max-content;margin-bottom:16px">${tab('q','Questions')}${tab('t','Career tracks')}</div>${AD.tab==='q'?admQForm():admTForm()}</div>`;
}
const admQForm=()=>`<div class="adm-grid"><div class="card"><label for="aq-filter">Skill</label><select id="aq-filter" onchange="AD.filter=this.value;admLoad()"></select><div id="aq-list"></div></div>
<div class="card"><h3 id="aq-title" style="margin-top:0">New question</h3>
<label for="aq-skill">Skill</label><input type="text" id="aq-skill" list="aq-skills" maxlength="60"><datalist id="aq-skills"></datalist>
<label for="aq-type">Type</label><select id="aq-type" onchange="admTypeUi()"><option value="single">Single choice</option><option value="multi">Multiple answers</option><option value="order">Put in order</option><option value="code">Fix the code</option></select>
<label for="aq-text">Question</label><textarea id="aq-text" maxlength="300"></textarea>
<div id="aq-fopts"><label for="aq-opts" id="aq-optsl">Options (one per line)</label><textarea id="aq-opts"></textarea></div>
<div id="aq-fcorrect"><label for="aq-correct">Correct option numbers (for example 1 or 1,3)</label><input type="text" id="aq-correct"></div>
<div id="aq-fcode" hidden><label for="aq-code">Faulty code</label><textarea id="aq-code" maxlength="500"></textarea><label for="aq-acc">Accepted answers (one per line)</label><textarea id="aq-acc"></textarea></div>
<label><input type="checkbox" id="aq-active" checked style="width:auto"> Visible to students</label>
<p class="hintline" id="aq-msg" role="status"></p><div style="display:flex;gap:10px;margin-top:12px"><button class="btn" onclick="admSaveQ()">Save question</button><button class="btn ghost" onclick="admNewQ()">Clear</button></div></div></div>`;
const admTForm=()=>`<div class="adm-grid"><div class="card" id="at-list"></div>
<div class="card"><h3 style="margin-top:0">Career track</h3><label for="at-id">Id (letters, digits, dashes)</label><input type="text" id="at-id" maxlength="30"><label for="at-en">Title (English)</label><input type="text" id="at-en" maxlength="60"><label for="at-ar">Title (Arabic)</label><input type="text" id="at-ar" maxlength="60" dir="rtl">
<label for="at-skills">Skills in learning order, one per line as Name:level (level 1 to 3)</label><textarea id="at-skills" placeholder="Linux:2&#10;Git:1&#10;Docker:2"></textarea>
<label for="at-proj">Portfolio projects, one per line as Title|Description|Stack (optional)</label><textarea id="at-proj"></textarea>
<label><input type="checkbox" id="at-active" checked style="width:auto"> Published</label><p class="hintline" id="at-msg" role="status"></p>
<div style="display:flex;gap:10px;margin-top:12px"><button class="btn" onclick="admSaveT()">Save track</button><button class="btn ghost" onclick="admNewT()">Clear</button></div></div></div>`;
async function admLoad(){
  if(!isAdmin())return;
  try{
    if(AD.tab==='q'){
      admTypeUi();
      const [sk,qs]=await Promise.all([api('/api/admin/skills'),api('/api/admin/questions'+(AD.filter?'?skill='+encodeURIComponent(AD.filter):''))]);
      AD.qs=qs;const f=$('aq-filter'),dl=$('aq-skills'),box=$('aq-list');
      if(f)f.innerHTML='<option value="">All skills</option>'+sk.map(r=>`<option value="${esc(r.skill)}" ${r.skill===AD.filter?'selected':''}>${esc(r.skill)} (${r.n})</option>`).join('');
      if(dl)dl.innerHTML=sk.map(r=>`<option value="${esc(r.skill)}">`).join('');
      if(box)box.innerHTML=qs.length?qs.map(q=>`<div class="row"><span><span class="tag">${esc(q.skill)}</span><span class="tag">${q.t}</span>${q.active?'':'<span class="tag">hidden</span>'}<br>${esc(q.q)}</span><span><button class="btn ghost sm" onclick="admEditQ(${q.id})">Edit</button> <button class="btn ghost sm" onclick="admDelQ(${q.id})">Delete</button></span></div>`).join(''):'<p class="sub">No questions for this skill yet.</p>';
    }else{
      AD.tracks=await api('/api/admin/careers');const b=$('at-list');
      if(b)b.innerHTML=AD.tracks.length?AD.tracks.map(t=>`<div class="row"><span><b>${esc(t.title.en)}</b> <span class="tag">${esc(t.id)}</span>${t.active?'':'<span class="tag">hidden</span>'}<br><small class="sub">${t.skills.map(s=>esc(s[0])).join(' → ')}</small></span><span><button class="btn ghost sm" data-n="${esc(t.id)}" onclick="admEditT(nm(this))">Edit</button> <button class="btn ghost sm" data-n="${esc(t.id)}" onclick="admDelT(nm(this))">Delete</button></span></div>`).join(''):'<p class="sub">No published tracks yet. The five built-in tracks are always available.</p>';
    }
  }catch(e){admSay(AD.tab==='q'?'aq-msg':'at-msg',e.message)}
}
function admTypeUi(){
  const t=$('aq-type');if(!t)return;
  $('aq-fopts').hidden=t.value==='code';$('aq-fcorrect').hidden=t.value==='order'||t.value==='code';$('aq-fcode').hidden=t.value!=='code';
  $('aq-optsl').textContent=t.value==='order'?'Steps in the CORRECT order (one per line)':'Options (one per line)';
}
function admFillQ(q){
  $('aq-title').textContent=q?'Edit question #'+q.id:'New question';
  $('aq-skill').value=q?q.skill:AD.filter;$('aq-type').value=q?q.t:'single';$('aq-text').value=q?q.q:'';$('aq-opts').value=q&&q.o?q.o.join('\n'):'';
  $('aq-correct').value=q&&(q.t==='single'||q.t==='multi')?q.a.map(i=>i+1).join(','):'';$('aq-code').value=(q&&q.code)||'';
  $('aq-acc').value=q&&q.t==='code'?q.a.join('\n'):'';$('aq-active').checked=q?q.active:true;admTypeUi();
}
const admNewQ=()=>{AD.editQ=null;admFillQ(null);admSay('aq-msg','')};
const admEditQ=id=>{const q=AD.qs.find(x=>x.id===id);if(q){AD.editQ=id;admFillQ(q);scrollTo(0,0)}};
async function admSaveQ(){
  const t=$('aq-type').value,body={skill:$('aq-skill').value,t,q:$('aq-text').value,active:$('aq-active').checked};
  if(t==='single'||t==='multi'){body.o=admLines('aq-opts');body.a=$('aq-correct').value.split(',').map(x=>parseInt(x,10)-1).filter(n=>n>=0)}
  if(t==='order')body.o=admLines('aq-opts');
  if(t==='code'){body.code=$('aq-code').value;body.a=admLines('aq-acc')}
  try{await api('/api/admin/questions'+(AD.editQ?'/'+AD.editQ:''),{method:AD.editQ?'PUT':'POST',body:JSON.stringify(body)});AD.editQ=null;admFillQ(null);admSay('aq-msg','Saved.',true);admLoad()}
  catch(e){admSay('aq-msg',e.message)}
}
async function admDelQ(id){if(!confirm('Delete this question?'))return;try{await api('/api/admin/questions/'+id,{method:'DELETE'});admLoad()}catch(e){admSay('aq-msg',e.message)}}
const admNewT=()=>{['at-id','at-en','at-ar','at-skills','at-proj'].forEach(i=>$(i).value='');$('at-active').checked=true;admSay('at-msg','')};
function admEditT(id){
  const t=AD.tracks.find(x=>x.id===id);if(!t)return;
  $('at-id').value=t.id;$('at-en').value=t.title.en;$('at-ar').value=t.title.ar;$('at-skills').value=t.skills.map(s=>s[0]+':'+s[1]).join('\n');$('at-proj').value=(t.projects||[]).join('\n');$('at-active').checked=t.active;
}
async function admSaveT(){
  const body={id:$('at-id').value,title:{en:$('at-en').value,ar:$('at-ar').value},active:$('at-active').checked,projects:admLines('at-proj'),
    skills:admLines('at-skills').map(l=>{const i=l.lastIndexOf(':');return [l.slice(0,i).trim(),parseInt(l.slice(i+1),10)]})};
  try{await api('/api/admin/careers',{method:'PUT',body:JSON.stringify(body)});admSay('at-msg','Saved. Students see it the next time they open the app.',true);admLoad();loadRemoteCareers()}
  catch(e){admSay('at-msg',e.message)}
}
async function admDelT(id){if(!confirm('Delete this track?'))return;try{await api('/api/admin/careers/'+id,{method:'DELETE'});delete CAREERS[id];admLoad()}catch(e){admSay('at-msg',e.message)}}

// Reset
function askReset(){
  const l=L();
  dlg.innerHTML=`<h2>${l.rsT}</h2><p class="sub" style="margin:0">${l.rsP}</p><div class="acts"><button class="btn ghost" onclick="closeDlg()">${l.cancel}</button><button class="btn danger" onclick="doReset()">${l.rsB}</button></div>`;
  dlg.showModal();
}
function doReset(){
  try{localStorage.removeItem(KEY)}catch(e){}
  S=fresh(S.lang);save();closeDlg();go('home');render();toast(L().tRes);
}
let tt;function toast(m){const t=$('toast');t.textContent=m;t.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('show'),2200)}
dlg.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.id==='cust')saveCustom()});
window.addEventListener('hashchange',route);registerTracks();route();intro();bootCloud();

// Background parallax: shapes and orbs follow the mouse slightly (desktop only)
(()=>{
  const bg=document.querySelector('.bg');
  if(!bg||!matchMedia('(hover:hover)').matches||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  let raf=0;
  addEventListener('mousemove',e=>{
    if(raf)return;
    raf=requestAnimationFrame(()=>{raf=0;
      bg.style.setProperty('--px',(e.clientX/innerWidth-.5).toFixed(3));
      bg.style.setProperty('--py',(e.clientY/innerHeight-.5).toFixed(3));
    });
  });
})();

// Interactive background: click or tap empty space for a burst, ripples, a glow,
// a kick to nearby floating shapes, and a bridge arc to your previous click.
(()=>{
  if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  const fx=document.createElement('div');fx.className='fx';fx.setAttribute('aria-hidden','true');document.body.appendChild(fx);
  const SHAPES=['<circle cx="20" cy="20" r="14"/>','<path d="M20 5 36 33H4z"/>','<path d="M20 6v28M6 20h28"/>','<path d="M20 4l14 8v16l-14 8-14-8V12z"/>','<path d="M20 4l16 16-16 16L4 20z"/>','<path d="M20 3l5 11 12 1-9 8 3 12-11-6-11 6 3-12-9-8 12-1z"/>','<rect x="7" y="7" width="26" height="26" rx="4"/>'];
  const COLORS=['--ac','--ac2','--ok','--warn'],SKIP='button,a,input,label,select,textarea,dialog,summary,[role=button],.card,nav,header,.toast';
  const rnd=(a,b)=>a+Math.random()*(b-a);
  let last=null,live=0;
  const add=(cls,x,y)=>{const el=document.createElement('div');el.className=cls;el.style.left=x+'px';el.style.top=y+'px';fx.appendChild(el);el.addEventListener('animationend',()=>el.remove());return el};
  function particle(x,y,i,n){
    if(live>90)return;live++;
    const size=rnd(16,36),el=add('fxp',x,y),a=(i/n)*Math.PI*2+rnd(-.3,.3),d=rnd(70,170);
    el.style.width=el.style.height=size+'px';el.style.color='var('+COLORS[i%4]+')';
    el.innerHTML='<svg viewBox="0 0 40 40">'+SHAPES[Math.floor(Math.random()*SHAPES.length)]+'</svg>';
    el.animate([{transform:'translate(-50%,-50%) scale(.2) rotate(0deg)',opacity:1},
      {transform:`translate(calc(-50% + ${Math.cos(a)*d}px),calc(-50% + ${Math.sin(a)*d+rnd(25,70)}px)) scale(1) rotate(${rnd(-320,320)}deg)`,opacity:0}],
      {duration:rnd(800,1300),easing:'cubic-bezier(.15,.7,.3,1)'}).onfinish=()=>{el.remove();live--};
  }
  function arc(x1,y1,x2,y2){
    const d=Math.hypot(x2-x1,y2-y1),svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('class','fxa');svg.setAttribute('viewBox','0 0 '+innerWidth+' '+innerHeight);
    svg.innerHTML=`<path d="M${x1} ${y1}Q${(x1+x2)/2} ${Math.min(y1,y2)-d*.35} ${x2} ${y2}"/><circle cx="${x1}" cy="${y1}" r="6"/><circle cx="${x2}" cy="${y2}" r="6"/>`;
    fx.appendChild(svg);
    const path=svg.querySelector('path');let len=d*1.3;try{len=path.getTotalLength()}catch(_){}
    path.style.strokeDasharray=len;
    path.animate([{strokeDashoffset:len},{strokeDashoffset:0}],{duration:600,easing:'ease-out',fill:'forwards'});
    svg.animate([{opacity:1},{opacity:1,offset:.7},{opacity:0}],{duration:1800,fill:'forwards'}).onfinish=()=>svg.remove();
  }
  document.addEventListener('click',e=>{
    if(!e.detail||e.button||e.target.closest(SKIP))return;
    const x=e.clientX,y=e.clientY,n=Math.floor(rnd(9,15));
    add('fxg',x,y);add('fxr',x,y);add('fxr b',x,y);
    for(let i=0;i<n;i++)particle(x,y,i,n);
    document.querySelectorAll('.sh').forEach(sh=>{
      const r=sh.getBoundingClientRect();
      if(Math.hypot(r.left+r.width/2-x,r.top+r.height/2-y)<220)sh.animate([{scale:1,opacity:.38},{scale:1.9,opacity:.95},{scale:1,opacity:.38}],{duration:750,easing:'ease-out'});
    });
    const now=Date.now();
    if(last&&now-last.t<5000&&Math.hypot(x-last.x,y-last.y)>90)arc(last.x,last.y,x,y);
    last={x,y,t:now};
  });
})();
