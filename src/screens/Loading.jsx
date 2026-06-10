cat > /home/claude/rastro/src/screens/Loading.jsx << 'ENDOFFILE'
import IMG from '../lib/images'
import{C}from'../lib/utils'
export function Loading(){
return(<div style={{height:'100dvh',display:'flex',alignItems:'center',justifyContent:'center',background:C.paper}}>
<img src={IMG.icon} alt="Rastro" style={{width:80,height:80,borderRadius:20,opacity:0.8}}/>
</div>)}
export function Splash({onStart}){
return(<div style={{height:'100dvh',display:'flex',flexDirection:'column',background:C.paper,position:'relative',overflow:'hidden'}}>
<img src={IMG.cliffs} alt="" style={{position:'absolute',top:0,left:0,right:0,bottom:0,width:'100%',height:'100%',objectFit:'cover',opacity:0.15}}/>
<div style={{position:'relative',flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:16,padding:32}}>
<img src={IMG.icon} alt="Rastro" style={{width:100,height:100,borderRadius:24}}/>
<div style={{textAlign:'center'}}>
<div style={{fontSize:13,color:C.textMid,marginBottom:4,letterSpacing:1}}>Bem-vinda, Adriana</div>
<div style={{fontFamily:'Playfair Display',fontSize:36,color:C.olive,fontWeight:700}}>Rastro</div>
<div style={{fontSize:14,color:C.textMid,marginTop:6}}>suas viagens, sua história</div>
</div>
</div>
<div style={{position:'relative',padding:'0 32px',paddingBottom:'max(40px, env(safe-area-inset-bottom, 40px))'}}>
<button onClick={onStart} style={{width:'100%',padding:'16px',borderRadius:16,background:C.olive,color:'#fff',border:'none',fontSize:16,fontWeight:700,cursor:'pointer',letterSpacing:0.5}}>
Começar</button>
</div>
</div>)}
