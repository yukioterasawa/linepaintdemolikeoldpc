let list=[
"BOX(105,10,195,135,2,11)",
"LINE(120,15 ,180,15 ,2)",
"LINE(180,15 ,190,25 ,2)",
"LINE(190,25 ,190,60 ,2)",
"LINE(190,60 ,180,70 ,2)",
"LINE(180,70 ,170,70 ,2)",
"LINE(170,70 ,170,75 ,2)",
"LINE(170,75 ,180,75 ,2)",
"LINE(180,75 ,190,85 ,2)",
"LINE(190,85 ,190,120,2)",
"LINE(190,120,180,130,2)",
"LINE(180,130,120,130,2)",
"LINE(120,130,110,120,2)",
"LINE(110,120,110,85 ,2)",
"LINE(110,85 ,120,75 ,2)",
"LINE(120,75 ,130,75 ,2)",
"LINE(130,75 ,130,70 ,2)",
"LINE(130,70 ,120,70 ,2)",
"LINE(120,70 ,110,60 ,2)",
"LINE(110,60 ,110,25 ,2)",
"LINE(110,25 ,120,15 ,2)",
"LINE(130,25 ,170,25 ,2)",
"LINE(170,25 ,175,40 ,2)",
"LINE(175,40 ,175,50 ,2)",
"LINE(175,50 ,170,65 ,2)",
"LINE(170,65 ,130,65 ,2)",
"LINE(130,65 ,125,50 ,2)",
"LINE(125,50 ,125,40 ,2)",
"LINE(125,40 ,130,25 ,2)",
"LINE(130,80 ,170,80 ,2)",
"LINE(170,80 ,175,95 ,2)",
"LINE(175,95 ,175,105,2)",
"LINE(175,105,170,120,2)",
"LINE(170,120,130,120,2)",
"LINE(130,120,125,105,2)",
"LINE(125,105,125,95 ,2)",
"LINE(125,95 ,130,80 ,2)",
"PAINT(155,40 ,0,2)",
"PAINT(145,100,0,2)",
"PAINT(110,15 ,0,2)",
"BOX(105,10 ,195,135 ,0)"
];
window.addEventListener('load',function(){
  INIT();
  document.getElementById('commandline').value=list.join("\n");
  document.getElementById('run').addEventListener('click',function(){
    let c=document.getElementById('commandline').value.trim().split(/\n/);
    RUN(c);
    return false;
  });
});
