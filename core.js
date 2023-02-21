let COMMAND_LINE=[],COMMAND="",PAINT_STATE=[],PAINT_AREA=[];
let VRAM;
let PC=0,X=0,Y=0,X1,Y1,X2,Y2,COLOR,BORDER,TCOLOR1,TCOLOR2,DX,DY;

function INIT(){
  VRAM=new LPDLOP_VRAM(px_w,px_h,disp_x,disp_y);
}
function RUN(comm){
  COMMAND_LINE=comm;
  if(COMMAND_LINE.length>0){COMMAND="";PC=0;VRAM.cls();setTimeout(FETCH,0);}
}
function FETCH(){
  if(COMMAND==""){
    let cl=interpret(COMMAND_LINE[PC]);
    switch(cl['command']){
    case 'LINE':
      COMMAND=cl['command'];
      X1=cl['x1'];Y1=cl['y1'];
      X2=cl['x2'];Y2=cl['y2'];
      COLOR=cl['color'];
      X=X1;Y=Y1;
      DX=X2-X1;DY=Y2-Y1;
      if(Math.abs(DX)>Math.abs(DY)){
        DY=DY/Math.abs(DX);DX=DX/Math.abs(DX);
      }else{
        DX=DX/Math.abs(DY);DY=DY/Math.abs(DY);
      }
      setTimeout(doLine,0);
      break;
    case 'BOX':
      X1=cl['x1'];Y=Y1=cl['y1'];X2=cl['x2'];Y2=cl['y2'];
      DX=(X2-X1)/Math.abs(X2-X1);DY=(Y2-Y1)/Math.abs(Y2-Y1);
      COMMAND=cl['command'];
      COLOR=cl['color'];
      if('fill' in cl){
        BORDER=cl['color'];
        COLOR=cl['fill'];
        COMMAND='BOXFILL';
        if(COLOR>7){TCOLOR1=TILE[cl['fill']]["L"];TCOLOR2=TILE[cl['fill']]["R"];COMMAND='TBOXFILL';}
      }
      setTimeout(doBox,0);
      break;
    case 'PAINT':
      COLOR=cl['color'];
      if(COLOR>7){TCOLOR1=TILE[cl['color']]["L"];TCOLOR2=TILE[cl['color']]["R"];}
      BORDER=cl['border'];
      X=cl['x'];Y=cl['y'];
      if(!VRAM.peekColor(X,Y,BORDER)){
        COMMAND=cl['command'];
        if(COLOR>7) COMMAND='TPAINT';
        PAINT_STATE=[];
        PAINT_AREA=[];
        setTimeout(doPAINT,0,cl['x'],cl['y']);
      }
      break;
    }
    PC++;
  }
  if(COMMAND_LINE.length>PC) setTimeout(FETCH,0);
}

function doLine(){
  for(i=0;i<32;i++){
    if(COMMAND=='LINE'){
      VRAM.poke(Math.round(X),Math.round(Y),COLOR);X+=DX;Y+=DY;
      if(Math.round(X)==X2 && Math.round(Y)==Y2) COMMAND="";
    }
  }
  if(COMMAND=='LINE') setTimeout(doLine,0);
}
function doBox(){
  let i=0;
  while(i<8){
    let j=X1;
    if(COMMAND=='BOX'){
      if(Y==Y1 || Y==Y2){
        while(j!=X2){
          VRAM.poke(j,Y,COLOR);j+=DX;
        }
        VRAM.poke(j,Y,COLOR);
        if(Y==Y2) COMMAND="";
      }else{
        VRAM.poke(X1,Y,COLOR);VRAM.poke(X2,Y,COLOR);
      }
      Y+=DY;
    }else if(COMMAND=='BOXFILL' || COMMAND=='TBOXFILL'){
      while(j!=X2){
        if(j==X1 || Y==Y1 || Y==Y2){
          VRAM.poke(j,Y,BORDER);
        }else{
          if(COMMAND=='TBOXFILL'){
            if(((Y1-Y) % 2==0 && (X1-j) % 2!=0) || ((Y1-Y) % 2!=0 && (X1-j) % 2==0)){
              VRAM.poke(j,Y,TCOLOR2,COLOR);
            }else{
              VRAM.poke(j,Y,TCOLOR1,COLOR);
            }
          }else{
            VRAM.poke(j,Y,COLOR);
          }
        }
        j+=DX;
      }
      VRAM.poke(j,Y,BORDER);
      if(Y==Y2) COMMAND="";
      Y+=DY;
    }
    i++;
  }
  if(COMMAND=='BOX' || COMMAND=='BOXFILL' || COMMAND=='TBOXFILL') setTimeout(doBox,0);
}
function doBoxfill(){
  let i=0;
  while(i<8){
    if(COMMAND=='BOXFILL' || COMMAND=='TBOXFILL'){
      let j=X1;
      while(j!=X2){
        if(j==X1 || Y==Y1 || Y==Y2){
          VRAM.poke(j,Y,BORDER);
        }else{
          if(COMMAND=='TBOXFILL'){
            if(((Y1-Y) % 2==0 && (X1-j) % 2!=0) || ((Y1-Y) % 2!=0 && (X1-j) % 2==0)){
              VRAM.poke(j,Y,TCOLOR2,COLOR);
            }else{
              VRAM.poke(j,Y,TCOLOR1,COLOR);
            }
          }else{
            VRAM.poke(j,Y,COLOR);
          }
        }
        j+=DX;
      }
      VRAM.poke(j,Y,BORDER);
      if(Y==Y2) COMMAND="";
      Y+=DY;
    }
    i++;
  }
  if(COMMAND=='BOXFILL' || COMMAND=='TBOXFILL') setTimeout(doBoxfill,0);
}
function doPAINT(x,y){
  for(i=0;i<32;i++){
    if(COMMAND=='PAINT' || COMMAND=='TPAINT'){
      if(COMMAND=='TPAINT'){
        if(((Y-y) % 2==0 && (X-x) % 2!=0) || ((Y-y) % 2!=0 && (X-x) % 2==0)){
          VRAM.poke(x,y,TCOLOR2,COLOR);
        }else{
          VRAM.poke(x,y,TCOLOR1,COLOR);
        }
      }else{
        VRAM.poke(x,y,COLOR);
      }
      PAINT_AREA[x+"_"+y]=1;
      if(x>0 && !((x-1)+"_"+y in PAINT_AREA) && !VRAM.peekColor((x-1),y,BORDER)){
        PAINT_STATE.push({"x":x,"y":y});x-=1;
      }else if(x<disp_x-1 && !((x+1)+"_"+y in PAINT_AREA) && !VRAM.peekColor((x+1),y,BORDER)){
        PAINT_STATE.push({"x":x,"y":y});x+=1;
      }else if(y<disp_y-1 && !(x+"_"+(y+1) in PAINT_AREA) && !VRAM.peekColor(x,(y+1),BORDER)){
        PAINT_STATE.push({"x":x,"y":y});y+=1;
      }else if(y>0 && !(x+"_"+(y-1) in PAINT_AREA) && !VRAM.peekColor(x,(y-1),BORDER)){
        PAINT_STATE.push({"x":x,"y":y});y-=1;
      }else{
        if(PAINT_STATE.length==0){
          COMMAND="";
        }else{
          back=PAINT_STATE.pop();x=back["x"];y=back["y"];
        }
      }
    }
  }
  if(COMMAND=='PAINT' || COMMAND=='TPAINT') setTimeout(doPAINT,0,x,y);
}

function interpret(c){
  let cl={};
  let test=c.split('(');
  cl['command']=test[0].trim().toUpperCase();
  let param=test[1].split(')')[0].split(',');
  switch(cl['command']){
  case "LINE": //{"command":"LINE","x1":120,"y1":15 ,"x2":180,"y2":15 ,"color":2}
    if(0 in param) cl['x1']=parseInt(param[0].trim(),10);
    if(1 in param) cl['y1']=parseInt(param[1].trim(),10);
    if(2 in param) cl['x2']=parseInt(param[2].trim(),10);
    if(3 in param) cl['y2']=parseInt(param[3].trim(),10);
    if(4 in param) cl['color']=parseInt(param[4].trim(),10);
    break;
  case "BOX": //{"command":"BOX","x1":105,"y1":10 ,"x2":195,"y2":135 ,"color":2,'fill':11}
    if(0 in param) cl['x1']=parseInt(param[0].trim(),10);
    if(1 in param) cl['y1']=parseInt(param[1].trim(),10);
    if(2 in param) cl['x2']=parseInt(param[2].trim(),10);
    if(3 in param) cl['y2']=parseInt(param[3].trim(),10);
    if(4 in param) cl['color']=parseInt(param[4].trim(),10);
    if(5 in param) cl['fill']=parseInt(param[5].trim(),10);
    break;
  case "PAINT": //{"command":"_PAINT","x":150,"y":70 ,"color":0,"border":29}
    if(0 in param) cl['x']=parseInt(param[0].trim(),10);
    if(1 in param) cl['y']=parseInt(param[1].trim(),10);
    if(2 in param) cl['color']=parseInt(param[2].trim(),10);
    if(3 in param) cl['border']=parseInt(param[3].trim(),10);
    break;
  }
  return cl;
}
