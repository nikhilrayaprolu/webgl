var canvas,gl,program;
var textCtx, canvasText;
var x,y;
var camtype=0;
var models = {};
var zposx=0;
var zposz=0;
var cpos=0;
var ang=0;
var cameraPosition=[];

grey = {r:168.0/255.0,g:168.0/255.0,b:168.0/255.0};
gold = {r:218.0/255.0,g:165.0/255.0,b:32.0/255.0};
coingold = {r:255.0/255.0,g:223.0/255.0,b:0.0/255.0};
red = {r:255.0/255.0,g:51.0/255.0,b:51.0/255.0};
lightgreen = {r:57/255.0,g:230/255.0,b:0/255.0};
darkgreen = {r:51/255.0,g:102/255.0,b:0/255.0};
black = {r:30/255.0,g:30/255.0,b:21/255.0};
blue = {r:0,g:0,b:1};
darkbrown = {r:46/255.0,g:46/255.0,b:31/255.0};
lightbrown = {r:95/255.0,g:63/255.0,b:32/255.0};
brown1 = {r:117/255.0,g:78/255.0,b:40/255.0};
brown2 = {r:134/255.0,g:89/255.0,b:40/255.0};
brown3 = {r:46/255.0,g:46/255.0,b:31/255.0};
cratebrown = {r:153/255.0,g:102/255.0,b:0/255.0};
cratebrown1 = {r:121/255.0,g:85/255.0,b:0/255.0};
cratebrown2 = {r:102/255.0,g:68/255.0,b:0/255.0};
skyblue2 = {r:113/255.0,g:185/255.0,b:209/255.0};
skyblue1 = {r:123/255.0,g:201/255.0,b:227/255.0};
skyblue = {r:132/255.0,g:217/255.0,b:245/255.0};
cloudwhite = {r:229/255.0,g:255/255.0,b:255/255.0};
cloudwhite1 = {r:204/255.0,g:255/255.0,b:255/255.0};
lightpink = {r:255/255.0,g:122/255.0,b:173/255.0};
darkpink = {r:255/255.0,g:51/255.0,b:119/255.0};
white = {r:255/255.0,g:255/255.0,b:255/255.0};
yellow = {r:255/255.0,g:215/255.0,b:0/255.0};
orange = {r:255/255.0,g:140/255.0,b:0/255.0};


var pfish;
var cpos=0;
var ang=0;
var angle=0;
var cameraPosition=[];
var index=0;
var fisharr=['fish0','fish1','fish2','fish3','fish4','fish5','fish6','fish7','fish8','fish9'];
var rotflag=[1,1,1,1,1,1,1,1,1,1];
var revdir=[0,0,0,0,0,0,0,0,0,0];

function initViewport(gl, canvas)
{
  gl.viewport(0, 0, canvas.width, canvas.height);
}

function compileShader(gl, shaderSource, shaderType) {
  // Create the shader object
  var shader = gl.createShader(shaderType);

  // Set the shader source code.
  gl.shaderSource(shader, shaderSource);

  // Compile the shader
  gl.compileShader(shader);

  // Check if it compiled
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    // Something went wrong during compilation; get the error
    throw "could not compile shader:" + gl.getShaderInfoLog(shader);
  }

  return shader;
}
////////////
function createShaderFromScriptTag(gl, scriptId, opt_shaderType) {
// look up the script tag by id.
var shaderScript = document.getElementById(scriptId);
if (!shaderScript) {
  throw("*** Error: unknown script element" + scriptId);
}

// extract the contents of the script tag.
var shaderSource = shaderScript.text;

// If we didn't pass in a type, use the 'type' from
// the script tag.
if (!opt_shaderType) {
  if (shaderScript.type == "x-shader/x-vertex") {
   opt_shaderType = gl.VERTEX_SHADER;
 } 
 else if (shaderScript.type == "x-shader/x-fragment") {
   opt_shaderType = gl.FRAGMENT_SHADER;
 }
 else if (!opt_shaderType) {
   throw("*** Error: shader type not set");
 }
}
return compileShader(gl, shaderSource, opt_shaderType);
};
/////////////////
function createProgram(gl, vertexShader, fragmentShader) {
  // create a program.
  var program = gl.createProgram();

  // attach the shaders.
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // link the program.
  gl.linkProgram(program);

  // Check if it linked.
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
      // something went wrong with the link
      throw ("program filed to link:" + gl.getProgramInfoLog (program));
    }

    return program;
  };
//////////////////////////
function createProgramFromScripts(gl, vertexShaderId, fragmentShaderId) {
  var vertexShader = createShaderFromScriptTag(gl, vertexShaderId);
  var fragmentShader = createShaderFromScriptTag(gl, fragmentShaderId);
  return createProgram(gl, vertexShader, fragmentShader);
}
function Initialize()
{
    var audio = new Audio('ocean.mp3');
    audio.volume=0.3
    audio.play();

    canvas = document.getElementById("canvas");

  gl = canvas.getContext("experimental-webgl");
  initViewport(gl, canvas);
  // setup a GLSL program
  program = createProgramFromScripts(gl,"2d-vertex-shader", "2d-fragment-shader");
  gl.useProgram(program);
  //glClearColor(1,1,0,1);

//makeModel('aqua', 0, 0, 0, 1.0, 1.0, 1.0, 0, 0, 0, 'aqua.data', 0);
//makeModel('aqua1', 4, 4, 4, 1.0, 1.0, 1.0, 0, 0, 0, 'cube.data', 0);
/*var grarr= new Array(1000);
fishposx[0]=0;
fishposy[0]=0;
fishposz[0]=10;
fishposx[1]=39;
fishposy[1]=-2;
fishposz[1]=30;
fishposx[2]=34;
fishposy[2]=3;
fishposz[2]=70;
fishposx[3]=18;
fishposy[3]=13;
fishposz[3]=50;
fishposx[4]=-27;
fishposy[4]=14;
fishposz[4]=30;
fishposx[5]=-14;
fishposy[5]=-2;
fishposz[5]=20;
fishposx[6]=24;
fishposy[6]=13;
fishposz[6]=20;
fishposx[7]=15;
fishposy[7]=-2;
fishposz[7]=40;
fishposx[8]=-4;
fishposy[8]=14;
fishposz[8]=60;
fishposx[9]=-5;
fishposy[9]=-3;
fishposz[9]=80;*/

makeModel('aqua', 0, 0, -900, 1800.0, 900.5, 2400.0, 0, 0, 0, 'aqua.data', -1,skyblue1);
//makeModel('bed', 1, -3.8 , 10, 400.0, 0.1, 4.0, 0, 0, 0, 'aqua1.data', 0);
makeModel(fisharr[0], 0, 0, 10, 1, 1, 1, 0, 0, 0.5, 'fish.data', 0,yellow);
makeModel(fisharr[1], 39, -2, 30, 0.5, 0.5, 0.5, 0, 0, 0.5, 'fish.data', 1,orange);

makeModel(fisharr[2], 34, 3, 70, 70, 70, 70, 0, 0, 0.5, 'gfish.data', 2,darkpink);
makeModel(fisharr[3], 18, 13, 50, 70, 70, 70, 0, 0, 0.5, 'gfish.data', 3,lightpink);

makeModel(fisharr[4], -27, 14, 30, 70, 70, 70, 0, 0, 0.5, 'gfish.data', 4,red);
makeModel(fisharr[5], -14, -2, 20, 70, 70, 70, 0, 0, 0.5, 'gfish.data', 5,red);


makeModel('rock1', 10, -10, 20, 1, 1, 1, 0, 0, 0, 'RockSet.data', -1,lightbrown);
makeModel('rock2', 13, -10, 20, 1, 1, 1, 0, 0, 0, 'RockSet.data', -1,lightbrown);
makeModel('rock0', 16, -10, 20, 1, 1, 1, 0, 0, 0, 'RockSet.data', -1,lightbrown);
makeModel('rock7', 19, -10, 20, 1, 1, 1, 0, 0, 0, 'RockSet.data', -1,lightbrown);

makeModel('rock3', -15, -10, 40, 1, 1, 1, 0, 0, 0, 'RockSet.data', -1,lightbrown);
makeModel('rock4', -17, -10, 40, 1, 1, 1, 0, 0, 0, 'RockSet.data', -1,lightbrown);
makeModel('rock5', 10, -10, 60, 1, 1, 1, 0, 0, 0, 'RockSet.data', -1,lightbrown);
makeModel('rock6', 12, -10, 60, 1, 1, 1, 0, 0, 0, 'RockSet.data', -1,lightbrown);

for(var i=0;i<100;i++){
  makeModel(i, 1, -14, -200+i*10, 50, 5, 5, 0, 0, 0, 'Grass_01.data', -1,lightgreen);

}
for(var i=100;i<200;i++){
  makeModel(i, 60, -14, -200+(i-100)*10, 50, 5, 5, 0, 0, 0, 'Grass_01.data', -1,lightgreen);

}
for(var i=200;i<300;i++){
  makeModel(i, -50, -14, -200+(i-200)*10, 50, 5, 5, 0, 0, 0, 'Grass_01.data', -1,lightgreen);

}
for(var i=300;i<400;i++){
  makeModel(i, -100, -14, -200+(i-300)*10, 50, 5, 5, 0, 0, 0, 'Grass_01.data', -1,lightgreen);

}
for(var i=400;i<500;i++){
  makeModel(i, -150, -14, -200+(i-400)*10, 50, 5, 5, 0, 0, 0, 'Grass_01.data', -1,lightgreen);

}
for(var i=500;i<600;i++){
  makeModel(i, 110, -14, -200+(i-500)*10, 50, 5, 5, 0, 0, 0, 'Grass_01.data', -1,lightgreen);

}
for(var i=600;i<700;i++){
  makeModel(i, 165, -14, -200+(i-600)*10, 50, 5, 5, 0, 0, 0, 'Grass_01.data', -1,lightgreen);

}

makeModel(fisharr[6], 24, 13, 20, 0.2, 0.2, 0.2, 0, 0, 0.5, 'ORCA.data', 6,orange);
makeModel(fisharr[7], 15, -2, 40, 0.2, 0.2, 0.2, 0, 0, 0.5, 'ORCA.data', 7,orange);
makeModel(fisharr[8], -4, 14, 60, 0.2, 0.2, 0.2, 0, 0, 0.5, 'ORCA.data', 8,yellow);
makeModel(fisharr[9], -5, -3,70, 0.2, 0.2, 0.2, 0, 0, 0.5, 'ORCA.data', 9,yellow);
    makeModel('bubble', 0, 0, 20, 0.05, 0.05, 0.05, 0, 0, 0, 'bubble.obj', 10,cloudwhite);
    makeModel('food', 0, 0, 20, 0.05, 0.05, 0.05, 0, 0, 0, 'food.obj',11,yellow);


    bubble_exists=0;
    food_exists=0;
document.onkeydown = handleKeyDown;
document.onmousedown = handlemouse;
 setInterval(drawScene, 10); //(1000/15) fps
 //drawScene();


}



function openFile(name, x_pos, y_pos, z_pos, x_scale, y_scale, z_scale, speed_x, speed_y, speed_z, filename, iscoin,color){
  var datastring;
  $.ajax({
    url : filename,
    dataType: "text",
    success : function (data) {
      datastring = data;
      createModel(name, x_pos, y_pos, z_pos, x_scale, y_scale, z_scale, speed_x, speed_y, speed_z, datastring, filename, iscoin,color);
    }
  });
}

function makeModel(name, x_pos, y_pos, z_pos, x_scale, y_scale, z_scale, speed_x, speed_y, speed_z, filename, iscoin,color){
  openFile(name, x_pos, y_pos, z_pos, x_scale, y_scale, z_scale, speed_x, speed_y, speed_z, filename, iscoin,color);
}

function createModel(name, x_pos, y_pos, z_pos, x_scale, y_scale, z_scale, speed_x, speed_y, speed_z, filedata, filename, iscoin,color) //Create object from blender
{
  if(!models[name]){
    var vertex_buffer_data = [];

    var color_buffer_data = [];
    var points = [];
    var len=0;
    var line;
    var a,b,c;
    var start=0;
    var lines = filedata.split('\n');
    for (var j=0; j<lines.length; j++){
      var words = lines[j].split(' ');
      if(words[0] == "v"){

        var cur_point = {};
        cur_point['x']=parseFloat(words[1]);
        cur_point['y']=parseFloat(words[2]);
        cur_point['z']=parseFloat(words[3]);
          //console.log(words);
          points.push(cur_point);
        }
      }
    //console.log(color);
    var temp;
    var lines = filedata.split('\n');
    for (var jj=0; jj<lines.length; jj++){
      var words = lines[jj].split(' ');
      if(words[0] == "f"){

        var t = [];
        var linemod = lines[jj].substring(1);
        var j,ans=0,tt=0,state=0;
        for(j=0;j<linemod.length;j++){
          if(linemod[j]==' '){
            ans=0;
            state=1;
          }
          else if(linemod[j]=='/' && ans!=0 && state==1){
            t.push(ans);
            state=0;
          }
          else if(linemod[j]!='/'){
            ans=ans*10+linemod.charCodeAt(j)-'0'.charCodeAt(0);
          }
        }
        t.push(ans);
        var my_triangle = {};
        my_triangle['p1'] = t[0]-1;
        my_triangle['p2'] = t[1]-1;
        my_triangle['p3'] = t[2]-1;
        vertex_buffer_data.push(points[my_triangle['p1']]['x']*x_scale );
        vertex_buffer_data.push(points[my_triangle['p1']]['y']*y_scale );
        vertex_buffer_data.push(points[my_triangle['p1']]['z']*z_scale );
        vertex_buffer_data.push(points[my_triangle['p2']]['x']*x_scale );
        vertex_buffer_data.push(points[my_triangle['p2']]['y']*y_scale );
        vertex_buffer_data.push(points[my_triangle['p2']]['z']*z_scale );
        vertex_buffer_data.push(points[my_triangle['p3']]['x']*x_scale );
        vertex_buffer_data.push(points[my_triangle['p3']]['y']*y_scale );
        vertex_buffer_data.push(points[my_triangle['p3']]['z']*z_scale );
      }
      /*if(words[0] == 'c'){

        var r1,g1,b1,r2,g2,b2,r3,g3,b3;
        r1 = words[1]; g1 = words[2]; b1 = words[3];
        r2 = words[4]; g2 = words[5]; b2 = words[6];
        r3 = words[7]; g3 = words[8]; b3 = words[9];      
        color_buffer_data.push(r1/255.0);
        color_buffer_data.push(g1/255.0);
        color_buffer_data.push(b1/255.0);
        color_buffer_data.push(1.0);
        color_buffer_data.push(r2/255.0);
        color_buffer_data.push(g2/255.0);
        color_buffer_data.push(b2/255.0);
        color_buffer_data.push(1.0);
        color_buffer_data.push(r3/255.0);
        color_buffer_data.push(g3/255.0);
        color_buffer_data.push(b3/255.0);
        color_buffer_data.push(1.0);
      }*/
    }
      for(var i=0;i<vertex_buffer_data.length/3;i++){

          var r1,g1,b1,r2,g2,b2,r3,g3,b3;
          r1 = color.r*255.0; g1 = color.g*255.0; b1 = color.b*255.0;
          r2 = color.r*255.0; g2 = color.g*255.0; b2 = color.b*255.0;
          r3 = color.r*255.0; g3 = color.g*255.0; b3 = color.b*255.0;
          color_buffer_data.push(r1/255.0);
          color_buffer_data.push(g1/255.0);
          color_buffer_data.push(b1/255.0);
          color_buffer_data.push(1.0);
      }
     var mymodel = {'center':[x_pos,y_pos,z_pos], 'scale':[x_scale,y_scale,z_scale], 'speed':[speed_x, speed_y, speed_z], 'name':name, 'filedata':filedata, 'filename':filename, 'iscoin':iscoin,'vertexdata':vertex_buffer_data,'colordata':color_buffer_data};
   models[name] = mymodel;
  }
  else{
    vertex_buffer_data=models[name].vertexdata;
    color_buffer_data=models[name].colordata;
     
  }
  if(index==0)
    pfish='fish0';
  if(index==1)
    pfish='fish1';
  if(index==2)
    pfish='fish2';
  if(index==3)
    pfish='fish3';
  if(index==4)
    pfish='fish4';
  if(index==5)
    pfish='fish5';
  if(index==6)
    pfish='fish6';
  if(index==7)
    pfish='fish7';
  if(index==8)
    pfish='fish8';
  if(index==9)
    pfish='fish9';

   gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  var vertexColor = gl.getAttribLocation(program, "a_color");
  var colorbuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorbuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color_buffer_data), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(vertexColor);
  gl.vertexAttribPointer(vertexColor, 4, gl.FLOAT, false, 0, 0);
  
  var positionLocation = gl.getAttribLocation(program, "a_position");
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex_buffer_data), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

  var u_matrix = gl.getUniformLocation(program, "u_matrix");
  
  

 // console.log(models[name].speed[0]);
  if(iscoin>=0){
     //console.log(x_pos);
     for(var i=0;i<10;i++){
     if(name==fisharr[i])
       break;
     }
     gl.uniformMatrix4fv(u_matrix, false, getCamera(false));
     var p_matrix = gl.getUniformLocation(program, "p_matrix");
     angle=0;
     if(rotflag[i]==-1)
     angle=Math.PI;
     gl.uniformMatrix4fv(p_matrix, false, matrixMultiply(makeYRotation(angle),makeTranslation(x_pos,y_pos,z_pos)));

   }
   else{

    gl.uniformMatrix4fv(u_matrix, false, getCamera(false));
var p_matrix = gl.getUniformLocation(program, "p_matrix");
    gl.uniformMatrix4fv(p_matrix, false, makeTranslation(x_pos,y_pos,z_pos));
}
   gl.drawArrays(gl.TRIANGLES, 0, vertex_buffer_data.length/3);
  
}
function randomInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}
 function drawScene(){
     if(bubble_exists) {

         models["bubble"].center[1] += 0.02;
         var model=models["bubble"];
         createModel(model['name'], model['center'][0],model['center'][1] , 3, model['scale'][0], model['scale'][1], model['scale'][2], model['speed'][0], model['speed'][1], model['speed'][2], model['filedata'], model['filename'], model['iscoin'], cloudwhite);
         if (models["bubble"].center[1] > 1) {
             var audio = new Audio('bubble.mp3');
             audio.play();

             bubble_exists = 0;
             model['center'][1]=-1;
         }
     }
     if(food_exists) {
         console.log("entered frod exists")
         models["food"].center[1] -= 0.02;
         var model=models["food"];
         console.log(model);
         createModel(model['name'], model['center'][0], model['center'][1] ,3, model['scale'][0], model['scale'][1], model['scale'][2], model['speed'][0], model['speed'][1], model['speed'][2], model['filedata'], model['filename'], model['iscoin'], yellow);
         if (models["food"].center[1] < -1) {
             food_exists = 0;
             model['center'][1]=1;
         }
     }

for(var key in models){
  var model = models[key];
  for(var i=0;i<10;i++){
  if(model['name']==fisharr[i]){
    model['center'][0]+=(rotflag[i]*model['speed'][0]);
    model['center'][1]+=(rotflag[i]*model['speed'][1]);
    model['center'][2]+=(rotflag[i]*model['speed'][2]);
    break;
  }
}
    if(i<10){
      console.log(model['center'][2]);
    if(model['center'][0]>40 || model['center'][1]>40 || Math.abs(model['center'][2]-40)>40){
      rotflag[i]=-1*rotflag[i];
      if(rotflag[i]==-1)
        revdir[i]=1;
        if(rotflag[i]==1)
          revdir[i]=0;
        
      //if(camtype==1 && i==index)
        //cpos-=8;
    }
    //else if(model['center'][0]<0 || model['center'][1]<0 || model['center'][2]<0)
      //rotflag[i]=1;
  }
 // console.log(model['name']);
 // console.log(model['center'][0],model['center'][1],model['center'][2])
    if(model['name'] == 'food' || model['name']== 'bubble')
        continue;
  createModel(model['name'], model['center'][0], model['center'][1], model['center'][2], model['scale'][0],  model['scale'][1],  model['scale'][2], model['speed'][0], model['speed'][1], model['speed'][2], model['filedata'], model['filename'], model['iscoin']);
}

  }
function handleKeyDown(event) {
        //currentlyPressedKeys[event.keyCode] = true;
        //alert('hi');
        if (event.keyCode == 38 && camtype==2) {
          //alert('hi');
          for(var key in models){
            var model = models[key];
            if(model['name']==pfish){
              zposx+=0.1;
              zposz+=0.1;
              if(revdir[index]==0)
              model['center'][2]+=0.3;
              if(revdir[index]==1)
              model['center'][2]-=0.3;
              
              cpos+=0.3;
            }
          }
        }
         if (event.keyCode == 38 && camtype==1) {
          //alert('hi');
          for(var key in models){
            var model = models[key];
            if(model['name']==pfish){
              zposx+=0.1;
              zposz+=0.1;
              cpos+=0.1;
            }
          }
        }
         if (event.keyCode == 38 && camtype==0) {
              cpos+=0.1;
        }

        if(event.keyCode == 70){
          for(var i=0;i<10;i++)
            models[fisharr[i]].speed[2]=0.5;
          cpos=0;
          camtype=0;
        }
        if(event.keyCode == 69){
          for(var i=0;i<10;i++)
            models[fisharr[i]].speed[2]=0.5;
          //models[fisharr[index]].speed[2]=0;
          camtype=1;
        }
        if(event.keyCode == 72){
          models[fisharr[index]].speed[2]=0;

          camtype=2;
        }
        if(event.keyCode == 65) {
          //camtype=2;
          ang+=1;
        }
        if(event.keyCode == 68){
          //camtype=2;
          ang-=1;
        }
        if(event.keyCode==37 && camtype==1){
          index--;
          if(index<0)
            index+=100;
          index=index%10;
        }
        if(event.keyCode==39 && camtype==1){
          index++;
          index=index%10;
        }
    if(event.keyCode == 83){
        var dataURL = canvas.toDataURL();
        console.log(dataURL)

        document.getElementById("download").href=dataURL;
        $('#download').show()
    }

}


      function handlemouse(event) {
        //currentlyPressedKeys[event.keyCode] = true;
        //alert('hi');

        // x=event.clientX;
        // y=event.clientY;
       // console.log(x);
        //console.log(y);
          switch (event.which) {
              case 1://left
                  console.log("entered here");
                  if(!bubble_exists)
                  {var fcenx = randomInterval(cameraPosition[0]-1,cameraPosition[0]+1);
                      models["bubble"].center[0]=fcenx;
                      models["bubble"].center[1]=cameraPosition[1]-1;}
                  bubble_exists=1;
                  console.log("left pressed")


                  break;
              case 3://right
                  if(!food_exists)
                  {var fcenx =randomInterval(cameraPosition[0]-1,cameraPosition[0]+1);
                      models["food"].center[0]=fcenx;
                      models["food"].center[1]=cameraPosition[1]+1;
                  }
                  food_exists=1;
                  console.log("right pressed")
                  break;
              default:
                  break;
          };

      }

      function makeScale(sx, sy, sz) {
        return [
        sx, 0,  0,  0,
        0, sy,  0,  0,
        0,  0, sz,  0,
        0,  0,  0,  1,
        ];
      }
      function makeTranslation(tx, ty, tz) {
        return [
        1,  0,  0,  0,
        0,  1,  0,  0,
        0,  0,  1,  0,
        tx, ty, tz, 1
        ];
      }
      function makePerspective(fieldOfViewInRadians, aspect, near, far) {
        var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
        var rangeInv = 1.0 / (near - far);

        return [
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (near + far) * rangeInv, -1,
        0, 0, near * far * rangeInv * 2, 0
        ];
      };

      function matrixMultiply(mat1, mat2){
        return [
        mat1[0]*mat2[0]+mat1[1]*mat2[4]+mat1[2]*mat2[8]+mat1[3]*mat2[12],
        mat1[0]*mat2[1]+mat1[1]*mat2[5]+mat1[2]*mat2[9]+mat1[3]*mat2[13],
        mat1[0]*mat2[2]+mat1[1]*mat2[6]+mat1[2]*mat2[10]+mat1[3]*mat2[14],
        mat1[0]*mat2[3]+mat1[1]*mat2[7]+mat1[2]*mat2[11]+mat1[3]*mat2[15],
        mat1[4]*mat2[0]+mat1[5]*mat2[4]+mat1[6]*mat2[8]+mat1[7]*mat2[12],
        mat1[4]*mat2[1]+mat1[5]*mat2[5]+mat1[6]*mat2[9]+mat1[7]*mat2[13],
        mat1[4]*mat2[2]+mat1[5]*mat2[6]+mat1[6]*mat2[10]+mat1[7]*mat2[14],
        mat1[4]*mat2[3]+mat1[5]*mat2[7]+mat1[6]*mat2[11]+mat1[7]*mat2[15],
        mat1[8]*mat2[0]+mat1[9]*mat2[4]+mat1[10]*mat2[8]+mat1[11]*mat2[12],
        mat1[8]*mat2[1]+mat1[9]*mat2[5]+mat1[10]*mat2[9]+mat1[11]*mat2[13],
        mat1[8]*mat2[2]+mat1[9]*mat2[6]+mat1[10]*mat2[10]+mat1[11]*mat2[14],
        mat1[8]*mat2[3]+mat1[9]*mat2[7]+mat1[10]*mat2[11]+mat1[11]*mat2[15],
        mat1[12]*mat2[0]+mat1[13]*mat2[4]+mat1[14]*mat2[8]+mat1[15]*mat2[12],
        mat1[12]*mat2[1]+mat1[13]*mat2[5]+mat1[14]*mat2[9]+mat1[15]*mat2[13],
        mat1[12]*mat2[2]+mat1[13]*mat2[6]+mat1[14]*mat2[10]+mat1[15]*mat2[14],
        mat1[12]*mat2[3]+mat1[13]*mat2[7]+mat1[14]*mat2[11]+mat1[15]*mat2[15]
        ];
      }

      function getCamera(isdottedline){
 /* var cameraMatrix = makeScale(1, 1, 1);
  cameraMatrix = matrixMultiply(cameraMatrix, makeScale(0.1, 0.1, 0.1));
   cameraMatrix = matrixMultiply(cameraMatrix, makeXRotation(-90 * (Math.PI/180)));
cameraMatrix = matrixMultiply(cameraMatrix, makeYRotation(0 * (Math.PI/180)));
 cameraMatrix = matrixMultiply(cameraMatrix, makeZRotation(0 * (Math.PI/180)));
 cameraMatrix = matrixMultiply(cameraMatrix, makeTranslation(0,0,0));
 */
 var aspect = gl.canvas.width / gl.canvas.height;
 var zNear = 0.1;
 var zFar = 2300;
 var fieldOfViewRadians=1.5;
 var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);
    // Compute the position of the first F
    var radius=0;
    var fPosition = [1000 * Math.sin(ang*Math.PI/180), 0, 1000*Math.cos(ang*Math.PI/180)];
    // Use matrix math to compute a position on a circle where
    // the camera is
    var cameraAngleRadians=0;
    var cameraMatrix = m4.yRotation(cameraAngleRadians);
    cameraMatrix = m4.translate(cameraMatrix, 0, 0, radius * 1.5);
    // Get the camera's postion from the matrix we computed

    if(camtype==0){

     cameraPosition = [
    1.3+cpos*Math.sin(ang*Math.PI/180),0,2+cpos*Math.cos(ang*Math.PI/180)
    ];
     presentcameraposition=cameraPosition
  }
    if(camtype==1){
        if(revdir[index]==1)
    fPosition = [-1000 * Math.sin(ang*Math.PI/180), 0, -1000*Math.cos(ang*Math.PI/180)];

       cameraPosition = [
       models[fisharr[index]].center[0],models[fisharr[index]].center[1],3+models[fisharr[index]].center[2]
    //fishposx[index]+cpos*Math.sin(ang*Math.PI/180),0,fishposz[index]+4+cpos*Math.cos(ang*Math.PI/180)
    ];
    if(revdir[index]==1){
        cameraPosition = [
       models[fisharr[index]].center[0],models[fisharr[index]].center[1],-3+models[fisharr[index]].center[2]
    //fishposx[index]+cpos*Math.sin(ang*Math.PI/180),0,fishposz[index]+4+cpos*Math.cos(ang*Math.PI/180)
    ];
    }

    }
    if (camtype==2){
      if(revdir[index]==1)
    fPosition = [-1000 * Math.sin(ang*Math.PI/180), 0, -1000*Math.cos(ang*Math.PI/180)];
       cameraPosition = [
       1.2+models[fisharr[index]].center[0],models[fisharr[index]].center[1],-8+models[fisharr[index]].center[2]
    //cpos*Math.sin(ang*Math.PI/180),0,2+cpos*Math.cos(ang*Math.PI/180)
    ];
    if(revdir[index]==1){
        cameraPosition = [
      -1.2+ models[fisharr[index]].center[0],models[fisharr[index]].center[1],8+models[fisharr[index]].center[2]
    //fishposx[index]+cpos*Math.sin(ang*Math.PI/180),0,fishposz[index]+4+cpos*Math.cos(ang*Math.PI/180)
    ];
    }

    }
   // console.log(cameraPosition);
   var up = [0, 1, 0];
    // Compute the camera's matrix using look at.
    var cameraMatrix = m4.lookAt(cameraPosition, fPosition, up);
    // Make a view matrix from the camera matrix
    var viewMatrix = m4.inverse(cameraMatrix);
    // Compute a view projection matrix
    var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);
     //viewProjectionMatrix = m4.multiply(viewProjectionMatrix, cammat);


    return viewProjectionMatrix;
  }
  function makeXRotation(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [
    1, 0, 0, 0,
    0, c, s, 0,
    0, -s, c, 0,
    0, 0, 0, 1
    ];
  };

  function makeYRotation(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [
    c, 0, -s, 0,
    0, 1, 0, 0,
    s, 0, c, 0,
    0, 0, 0, 1
    ];
  };

  function makeZRotation(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [
    c, s, 0, 0,
    -s, c, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
    ];
  }
  function normalize(v) {
    var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  // make sure we don't divide by 0.
  if (length > 0.00001) {
    return [v[0] / length, v[1] / length, v[2] / length];
  } else {
    return [0, 0, 0];
  }
}

function subtractVectors(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}
function cross(a, b) {
  return [a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0]];
}

var m4 = {
  lookAt: function(cameraPosition, target, up) {
    var zAxis = normalize(
      subtractVectors(cameraPosition, target));
    var xAxis = cross(up, zAxis);
    var yAxis = cross(zAxis, xAxis);
    return [
    xAxis[0], xAxis[1], xAxis[2], 0,
    yAxis[0], yAxis[1], yAxis[2], 0,
    zAxis[0], zAxis[1], zAxis[2], 0,
    cameraPosition[0],
    cameraPosition[1],
    cameraPosition[2],
    1,
    ];
  },
  perspective: function(fieldOfViewInRadians, aspect, near, far) {
    var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
    var rangeInv = 1.0 / (near - far);
    return [
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (near + far) * rangeInv, -1,
    0, 0, near * far * rangeInv * 2, 0
    ];
  },
  projection: function(width, height, depth) {
    // Note: This matrix flips the Y axis so 0 is at the top.
    return [
    2 / width, 0, 0, 0,
    0, -2 / height, 0, 0,
    0, 0, 2 / depth, 0,
    -1, 1, 0, 1,
    ];
  },
  multiply: function(a, b) {
    var a00 = a[0 * 4 + 0];
    var a01 = a[0 * 4 + 1];
    var a02 = a[0 * 4 + 2];
    var a03 = a[0 * 4 + 3];
    var a10 = a[1 * 4 + 0];
    var a11 = a[1 * 4 + 1];
    var a12 = a[1 * 4 + 2];
    var a13 = a[1 * 4 + 3];
    var a20 = a[2 * 4 + 0];
    var a21 = a[2 * 4 + 1];
    var a22 = a[2 * 4 + 2];
    var a23 = a[2 * 4 + 3];
    var a30 = a[3 * 4 + 0];
    var a31 = a[3 * 4 + 1];
    var a32 = a[3 * 4 + 2];
    var a33 = a[3 * 4 + 3];
    var b00 = b[0 * 4 + 0];
    var b01 = b[0 * 4 + 1];
    var b02 = b[0 * 4 + 2];
    var b03 = b[0 * 4 + 3];
    var b10 = b[1 * 4 + 0];
    var b11 = b[1 * 4 + 1];
    var b12 = b[1 * 4 + 2];
    var b13 = b[1 * 4 + 3];
    var b20 = b[2 * 4 + 0];
    var b21 = b[2 * 4 + 1];
    var b22 = b[2 * 4 + 2];
    var b23 = b[2 * 4 + 3];
    var b30 = b[3 * 4 + 0];
    var b31 = b[3 * 4 + 1];
    var b32 = b[3 * 4 + 2];
    var b33 = b[3 * 4 + 3];
    return [
    b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
    b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
    b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
    b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
    b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
    b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
    b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
    b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
    b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
    b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
    b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
    b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
    b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
    b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
    b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
    b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
    ];
  },
  translation: function(tx, ty, tz) {
    return [
    1,  0,  0,  0,
    0,  1,  0,  0,
    0,  0,  1,  0,
    tx, ty, tz, 1,
    ];
  },
  xRotation: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
    return [
    1, 0, 0, 0,
    0, c, s, 0,
    0, -s, c, 0,
    0, 0, 0, 1,
    ];
  },
  yRotation: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
    return [
    c, 0, -s, 0,
    0, 1, 0, 0,
    s, 0, c, 0,
    0, 0, 0, 1,
    ];
  },
  zRotation: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
    return [
    c, s, 0, 0,
    -s, c, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
    ];
  },
  scaling: function(sx, sy, sz) {
    return [
    sx, 0,  0,  0,
    0, sy,  0,  0,
    0,  0, sz,  0,
    0,  0,  0,  1,
    ];
  },
  translate: function(m, tx, ty, tz) {
    return m4.multiply(m, m4.translation(tx, ty, tz));
  },
  xRotate: function(m, angleInRadians) {
    return m4.multiply(m, m4.xRotation(angleInRadians));
  },
  yRotate: function(m, angleInRadians) {
    return m4.multiply(m, m4.yRotation(angleInRadians));
  },
  zRotate: function(m, angleInRadians) {
    return m4.multiply(m, m4.zRotation(angleInRadians));
  },
  scale: function(m, sx, sy, sz) {
    return m4.multiply(m, m4.scaling(sx, sy, sz));
  },
  inverse: function(m) {
    var m00 = m[0 * 4 + 0];
    var m01 = m[0 * 4 + 1];
    var m02 = m[0 * 4 + 2];
    var m03 = m[0 * 4 + 3];
    var m10 = m[1 * 4 + 0];
    var m11 = m[1 * 4 + 1];
    var m12 = m[1 * 4 + 2];
    var m13 = m[1 * 4 + 3];
    var m20 = m[2 * 4 + 0];
    var m21 = m[2 * 4 + 1];
    var m22 = m[2 * 4 + 2];
    var m23 = m[2 * 4 + 3];
    var m30 = m[3 * 4 + 0];
    var m31 = m[3 * 4 + 1];
    var m32 = m[3 * 4 + 2];
    var m33 = m[3 * 4 + 3];
    var tmp_0  = m22 * m33;
    var tmp_1  = m32 * m23;
    var tmp_2  = m12 * m33;
    var tmp_3  = m32 * m13;
    var tmp_4  = m12 * m23;
    var tmp_5  = m22 * m13;
    var tmp_6  = m02 * m33;
    var tmp_7  = m32 * m03;
    var tmp_8  = m02 * m23;
    var tmp_9  = m22 * m03;
    var tmp_10 = m02 * m13;
    var tmp_11 = m12 * m03;
    var tmp_12 = m20 * m31;
    var tmp_13 = m30 * m21;
    var tmp_14 = m10 * m31;
    var tmp_15 = m30 * m11;
    var tmp_16 = m10 * m21;
    var tmp_17 = m20 * m11;
    var tmp_18 = m00 * m31;
    var tmp_19 = m30 * m01;
    var tmp_20 = m00 * m21;
    var tmp_21 = m20 * m01;
    var tmp_22 = m00 * m11;
    var tmp_23 = m10 * m01;
    var t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
    (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
    var t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
    (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
    var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
    (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
    var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
    (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);
    var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);
    return [
    d * t0,
    d * t1,
    d * t2,
    d * t3,
    d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
      (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
    d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
      (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
    d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
      (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
    d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
      (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
    d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
      (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
    d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
      (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
    d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
      (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
    d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
      (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
    d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
      (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
    d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
      (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
    d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
      (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
    d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
      (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))
    ];
  },
  vectorMultiply: function(v, m) {
    var dst = [];
    for (var i = 0; i < 4; ++i) {
      dst[i] = 0.0;
      for (var j = 0; j < 4; ++j)
        dst[i] += v[j] * m[j * 4 + i];
    }
    return dst;
  },
};
