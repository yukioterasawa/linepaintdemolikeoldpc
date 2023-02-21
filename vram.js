class LPDLOP_VRAM{
  VRAM=[];
  X=0;
  Y=0;
  constructor(px_w,px_h,disp_x,disp_y){
    this.X=disp_x;this.Y=disp_y;
    let disp=document.getElementById('disp');
    disp.style.width=(px_w*this.X)+'px';
    disp.style.height=(px_h*this.Y)+'px';
    for(let y=0;y<this.Y;y++){
      for(let x=0;x<this.X;x++){
        let px=document.createElement('div');
        px.style.width=px_w+'px';
        px.style.height=px_h+'px';
        this.pokeCore(px,0,0);
        this.VRAM[x+'_'+y]=px;
        disp.appendChild(px);
      }
    }
  }
  cls(){
    for(let y=0;y<this.Y;y++){
      for(let x=0;x<this.X;x++){
        this.poke(x,y,0,0);
      }
    }
  }
  poke(x,y,c,a=null){
    if(a==null) a=c;
    let px=this.peek(x,y);
    return this.pokeCore(px,c,a);
  }
  pokeCore(px,c,a){
    px.setAttribute('color',a);
    px.classList.remove('color_0','color_1','color_2','color_3','color_4','color_5','color_6','color_7');
    px.classList.add('color_'+c);
    return px;
  }
  peek(x,y){
    return this.VRAM[x+'_'+y];
  }
  peekColor(x,y,c){
    if(this.peek(x,y).getAttribute('color')==c) return true;
    return false;
  }
}
