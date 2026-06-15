const fitLabels = ['tight','slim','regular','relaxed','oversized'];
const sleeveLabels = ['sleeveless','short','elbow','three-quarter','long'];
const hemLabels = ['cropped','short','normal','long','longline'];
const state = { garmentType:'hoodie', color:'#f97316', fit:2, sleeve:4, hem:2, open:false, tucked:false, inner:false, lastPatch:'initial render' };
const $ = id => document.getElementById(id);
const els = ['garmentType','color','fit','sleeve','hem'].reduce((o,id)=>(o[id]=$(id),o),{});
function pathTorso(){ const width=[-10,-4,0,8,16][state.fit]; const hem=[-48,-24,0,28,52][state.hem]; const drop=[-6,-2,0,8,18][state.fit]; return `M${132-width} ${199+drop} C150 190 ${210} 190 ${228+width} ${199+drop} C${242+width} 256 ${244+width} 334 ${232+width} ${428+hem} C210 ${440+hem} 150 ${440+hem} ${128-width} ${428+hem} C${116-width} 334 ${118-width} 256 ${132-width} ${199+drop}Z`; }
function sleevePath(side){ if(state.sleeve===0) return ''; const long=[245,315,360,390,409][state.sleeve]; const loose=[-2,0,2,6,12][state.fit]; if(side==='left') return `M132 205 C${104-loose} 242 ${96-loose} 318 ${101-loose} ${long} C108 ${long+11} 122 ${long+11} 128 ${long} C128 341 141 273 155 214Z`; return `M228 205 C${256+loose} 242 ${264+loose} 318 ${259+loose} ${long} C252 ${long+11} 238 ${long+11} 232 ${long} C232 341 219 273 205 214Z`; }
function applyType(){ const t=state.garmentType; $('zip').style.display = (t==='hoodie'||t==='jacket'||t==='shirt')?'block':'none'; $('collar').style.display = (t==='tee')?'none':'block'; if(t==='jacket') state.open=true; }
function render(reason='token patch'){
  applyType();
  const color=state.color; ['torso','leftSleeve','rightSleeve'].forEach(id=>$(id).setAttribute('fill',color));
  $('torso').setAttribute('d', pathTorso());
  $('foldOverlay').setAttribute('d', pathTorso());
  $('leftSleeve').setAttribute('d', sleevePath('left'));
  $('rightSleeve').setAttribute('d', sleevePath('right'));
  $('leftSleeve').style.display = state.sleeve===0?'none':'block';
  $('rightSleeve').style.display = state.sleeve===0?'none':'block';
  $('innerTee').classList.toggle('hidden', !state.inner);
  $('zip').setAttribute('stroke-width', state.open ? '18' : '4');
  $('zip').setAttribute('opacity', state.open ? '.45' : '1');
  $('torso').setAttribute('opacity', state.open ? '.82' : '1');
  $('fitLabel').textContent=fitLabels[state.fit]; $('sleeveLabel').textContent=sleeveLabels[state.sleeve]; $('hemLabel').textContent=hemLabels[state.hem];
  const codec={BodyCodec:{id:'user_demo',pose:'front_standing',anchors:['neck_base','left_shoulder','right_shoulder','armpits','waist'],preserve:['face','hair','hands'],surface:'dense_body_atlas_v0'},GarmentCodec:{type:state.garmentType,color:state.color,panels:['front','back','left_sleeve','right_sleeve','collar'],material:state.garmentType==='jacket'?'denim_medium':'cotton_fleece',fit:fitLabels[state.fit],sleeve:sleeveLabels[state.sleeve],hem:hemLabels[state.hem]},WearState:{attach:['collar->neck_base','shoulders->shoulder_anchors'],wrap:['front->torso_front','sleeves->arms'],clearance:`q0${state.fit+2}`,open_state:state.open?'q06_open':'q00_closed',tuck:state.tucked?'front_tucked':'untucked',layer:state.inner?'outer_over_inner_tee':'above_skin',recompute:'only affected garment regions'}};
  $('tokenView').textContent=JSON.stringify(codec,null,2);
  $('patchView').textContent=JSON.stringify({op:'local_update',reason,changed_at:new Date().toLocaleTimeString(),no_regeneration:['face','hair','hands','background','body_shape']},null,2);
}
els.garmentType.onchange=e=>{state.garmentType=e.target.value; render('garment type changed: compile new GarmentCodec + WearState');};
els.color.oninput=e=>{state.color=e.target.value; render('color changed: albedo token only');};
els.fit.oninput=e=>{state.fit=+e.target.value; render('fit changed: clearance + shoulder/hem warp tokens');};
els.sleeve.oninput=e=>{state.sleeve=+e.target.value; render('sleeve length changed: sleeve panels only');};
els.hem.oninput=e=>{state.hem=+e.target.value; render('hem length changed: torso hem panel only');};
$('openToggle').onclick=()=>{state.open=!state.open; render('open/close changed: front placket state only');};
$('tuckToggle').onclick=()=>{state.tucked=!state.tucked; state.hem=state.tucked?1:2; els.hem.value=state.hem; render('tuck changed: hem visibility + waistband attachment');};
$('layerToggle').onclick=()=>{state.inner=!state.inner; render('layer changed: inner tee visible under outer garment');};
render();
