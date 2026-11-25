'use strict';
const cropDialog=document.getElementById('cropDialog'), cropCanvas=document.getElementById('cropCanvas'), cropCtx=cropCanvas.getContext('2d'), cropZoom=document.getElementById('cropZoom'), cropStatus=document.getElementById('cropStatus');
let cropState=null, cropDrag=null;
async function openCrop(file,kind,fromEdit=false,onResult=null){
 if(!file.type.startsWith('image/')||file.size>20000000){alert('Selecciona una imagen de hasta 20 MB');return;}
 const url=URL.createObjectURL(file), img=new Image();
 try{img.src=url;await img.decode();if(!img.naturalWidth)throw Error();
 const hero=document.getElementById('artistHero');const ratio=kind==='photo'||kind==='post'?1:Math.max(1.2,Math.min(3,hero?hero.clientWidth/hero.clientHeight:1.8));
 cropCanvas.width=kind==='photo'?512:1200;cropCanvas.height=Math.round(cropCanvas.width/ratio);
 cropState={img,kind,fromEdit,onResult,angle:0,x:0,y:0,zoom:1};cropZoom.value=1;cropStatus.textContent='';
 document.getElementById('cropTitle').textContent=kind==='photo'?'Ajustar foto de perfil':'Ajustar portada';
 document.getElementById('cropFrame').classList.toggle('roundCrop',kind==='photo');
 if(kind!=='post')document.getElementById(kind==='photo'?'photoDialog':'coverDialog').close();cropDialog.showModal();drawCrop();
 }catch(e){alert('No se pudo abrir la imagen. Prueba con JPG, PNG o WebP.')}finally{URL.revokeObjectURL(url)}
}
function drawCrop(){if(!cropState)return;const s=cropState,w=cropCanvas.width,h=cropCanvas.height,swap=s.angle%180!==0,iw=s.img.naturalWidth,ih=s.img.naturalHeight,rw=swap?ih:iw,rh=swap?iw:ih,k=Math.max(w/rw,h/rh)*s.zoom;
 s.x=Math.max(-(rw*k-w)/2,Math.min((rw*k-w)/2,s.x));s.y=Math.max(-(rh*k-h)/2,Math.min((rh*k-h)/2,s.y));
 cropCtx.clearRect(0,0,w,h);cropCtx.fillStyle='#fff';cropCtx.fillRect(0,0,w,h);cropCtx.save();cropCtx.translate(w/2+s.x,h/2+s.y);cropCtx.rotate(s.angle*Math.PI/180);cropCtx.drawImage(s.img,-iw*k/2,-ih*k/2,iw*k,ih*k);cropCtx.restore();}
cropZoom.oninput=()=>{if(cropState){cropState.zoom=Number(cropZoom.value);drawCrop()}};
cropCanvas.onpointerdown=e=>{if(!cropState)return;cropCanvas.setPointerCapture(e.pointerId);cropDrag={id:e.pointerId,x:e.clientX,y:e.clientY};};
cropCanvas.onpointermove=e=>{if(!cropDrag||cropDrag.id!==e.pointerId||!cropState)return;const r=cropCanvas.getBoundingClientRect();cropState.x+=(e.clientX-cropDrag.x)*cropCanvas.width/r.width;cropState.y+=(e.clientY-cropDrag.y)*cropCanvas.height/r.height;cropDrag.x=e.clientX;cropDrag.y=e.clientY;drawCrop()};
cropCanvas.onpointerup=cropCanvas.onpointercancel=cropCanvas.onlostpointercapture=()=>{cropDrag=null};
cropCanvas.onkeydown=e=>{if(!cropState||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();cropState.x+=e.key==='ArrowLeft'?-12:e.key==='ArrowRight'?12:0;cropState.y+=e.key==='ArrowUp'?-12:e.key==='ArrowDown'?12:0;drawCrop()};
document.getElementById('cropRotate').onclick=()=>{if(cropState){cropState.angle=(cropState.angle+90)%360;cropState.x=cropState.y=0;drawCrop()}};
document.getElementById('cropReset').onclick=()=>{if(cropState){Object.assign(cropState,{angle:0,x:0,y:0,zoom:1});cropZoom.value=1;drawCrop()}};
document.getElementById('cropCancel').onclick=()=>cropDialog.close();cropDialog.addEventListener('close',()=>{cropState=null;cropDrag=null});
document.getElementById('cropSave').onclick=()=>{if(!cropState)return;try{let result=cropCanvas.toDataURL('image/jpeg',.88);if(result.length>1000000)result=cropCanvas.toDataURL('image/jpeg',.65);if(cropState.onResult){cropState.onResult(result);cropDialog.close();return;}const next={...profile,[cropState.kind]:result};accountStorage.setItem('stageone-profile',JSON.stringify(next));profile=next;const fromEdit=cropState.fromEdit;cropDialog.close();if(fromEdit){const form=document.getElementById('edit');const name=form.elements.name.value,bio=form.elements.bio.value,role=form.elements.role.value;editProfile();document.getElementById('edit').elements.name.value=name;document.getElementById('edit').elements.bio.value=bio;document.getElementById('edit').elements.role.value=role;}else refreshPage()}catch(e){cropStatus.textContent='No se pudo guardar. El almacenamiento local podría estar lleno.'}};
