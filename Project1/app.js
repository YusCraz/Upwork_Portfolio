const header = document.getElementById('site-header');
const menuBtn = document.getElementById('menu-button');
const mobileNav = document.getElementById('mobile-nav');
const backTop = document.getElementById('back-top');
const year = document.getElementById('year');
year.textContent = new Date().getFullYear();

function syncHeader(){
  header.classList.toggle('scrolled', window.scrollY > 8);
  backTop.classList.toggle('show', window.scrollY > 900);
}
syncHeader();
window.addEventListener('scroll', syncHeader, {passive:true});

menuBtn.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(isOpen));
  menuBtn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  menuBtn.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
});
mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mobileNav.classList.remove('open');
  menuBtn.setAttribute('aria-expanded','false');
  menuBtn.setAttribute('aria-label','Open menu');
  menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
}));
backTop.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));

const projects = [
  {label:'Flowerbed Renovation',before:'assets/before-bed.jpg',after:'assets/flowerbed.jpg',note:'Overgrown, weedy bed cleared, re-edged, replanted and finished with fresh mulch.'},
  {label:'Shrub Restoration',before:'assets/before-shrubs.jpg',after:'assets/shrubs.jpg',note:"Overgrown shrubs cut back and professionally shaped to open up the home's front."},
  {label:'Lawn Recovery',before:'assets/before-shrubs.jpg',after:'assets/hero.jpg',note:'Patchy, thin turf brought back with aeration, overseeding and routine maintenance.'},
  {label:'New Landscape',before:'assets/before-bed.jpg',after:'assets/landscape.jpg',note:'An unused area transformed into a planted landscape with a stone patio and walls.'}
];
const range = document.getElementById('ba-range');
const beforeClip = document.getElementById('before-clip');
const divider = document.getElementById('ba-divider');
const beforeImage = document.getElementById('before-image');
const afterImage = document.getElementById('after-image');
const baNote = document.getElementById('ba-note');
function setRange(v){ beforeClip.style.clipPath = `inset(0 ${100-v}% 0 0)`; divider.style.left = `${v}%`; }
range.addEventListener('input', e => setRange(Number(e.target.value)));
document.querySelectorAll('.project-btn').forEach(btn => btn.addEventListener('click', () => {
  const idx = Number(btn.dataset.project), p = projects[idx];
  document.querySelectorAll('.project-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active'); range.value='50'; setRange(50);
  beforeImage.src=p.before; beforeImage.alt=`Before: ${p.label}`;
  afterImage.src=p.after; afterImage.alt=`After: ${p.label}`;
  baNote.textContent=p.note;
}));

const galleryData = [
  {src:'assets/hero.jpg',cat:'Lawns',alt:'Striped front lawn and manicured beds at a two-story home'},
  {src:'assets/flowerbed.jpg',cat:'Gardens',alt:'Hydrangea and coneflower bed with stone border edging'},
  {src:'assets/landscape.jpg',cat:'Landscaping',alt:'Backyard paver patio with lit seat walls and grasses'},
  {src:'assets/shrubs.jpg',cat:'Trees & Shrubs',alt:'Freshly shaped boxwood shrubs and standard tree'},
  {src:'assets/lawn.jpg',cat:'Lawns',alt:'Weekly mowing with clean sidewalk edging'},
  {src:'assets/crew.jpg',cat:'Gardens',alt:'New shrubs planted in a freshly mulched garden bed'}
];
let visibleIndices = galleryData.map((_,i)=>i), lightboxPos=0;
const filters=[...document.querySelectorAll('.filter-btn')], items=[...document.querySelectorAll('#gallery-grid li')];
filters.forEach(btn=>btn.addEventListener('click',()=>{
  filters.forEach(b=>b.classList.remove('active')); btn.classList.add('active');
  const f=btn.dataset.filter; visibleIndices=[];
  items.forEach((li,i)=>{const show=f==='All'||li.dataset.cat===f; li.classList.toggle('hidden',!show); if(show) visibleIndices.push(i);});
}));
const lightbox=document.getElementById('lightbox'), lbImg=document.getElementById('lightbox-img'), lbCap=document.getElementById('lightbox-caption');
function showLightbox(pos){lightboxPos=(pos+visibleIndices.length)%visibleIndices.length;const data=galleryData[visibleIndices[lightboxPos]];lbImg.src=data.src;lbImg.alt=data.alt;lbCap.textContent=data.alt;lightbox.hidden=false;document.body.style.overflow='hidden';}
function closeLightbox(){lightbox.hidden=true;document.body.style.overflow='';}
document.querySelectorAll('.gallery-item').forEach(btn=>btn.addEventListener('click',()=>{const globalIndex=Number(btn.dataset.index);showLightbox(visibleIndices.indexOf(globalIndex));}));
document.getElementById('lightbox-close').addEventListener('click',closeLightbox);
document.getElementById('lightbox-prev').addEventListener('click',e=>{e.stopPropagation();showLightbox(lightboxPos-1)});
document.getElementById('lightbox-next').addEventListener('click',e=>{e.stopPropagation();showLightbox(lightboxPos+1)});
lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox()});
document.addEventListener('keydown',e=>{if(lightbox.hidden)return;if(e.key==='Escape')closeLightbox();if(e.key==='ArrowRight')showLightbox(lightboxPos+1);if(e.key==='ArrowLeft')showLightbox(lightboxPos-1)});

const form=document.getElementById('estimate-form'), formWrap=document.getElementById('form-wrap');
function err(name,msg){const el=form.querySelector(`[data-error="${name}"]`);if(el)el.textContent=msg||'';}
form.addEventListener('submit',e=>{
  e.preventDefault(); ['name','phone','email','address','service'].forEach(n=>err(n,''));
  const fd=new FormData(form), values=Object.fromEntries(fd.entries()); let ok=true;
  if(String(values.name||'').trim().length<2){err('name','Please enter your name');ok=false;}
  if(!/^[\d\s()+.-]{7,20}$/.test(String(values.phone||'').trim())){err('phone','Please enter a valid phone number');ok=false;}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(values.email||'').trim())){err('email','Please enter a valid email');ok=false;}
  if(String(values.address||'').trim().length<5){err('address','Please enter the property address');ok=false;}
  if(!values.service){err('service','Please choose a service');ok=false;}
  if(!ok)return;
  formWrap.innerHTML='<div class="form-success" role="status"><i class="fa-regular fa-circle-check"></i><h3>Thanks! Your estimate request has been received.</h3><p>We\'ll reach out soon using your preferred contact method.</p><button id="another-request" class="btn btn-outline">Submit another request</button></div>';
  document.getElementById('another-request').addEventListener('click',()=>location.reload());
});
