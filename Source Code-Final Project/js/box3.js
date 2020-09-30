


// loadTexture Function
function loadTexture(gl, url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Because images have to be download over the internet
  // they might take a moment until they are ready.
  // Until then put a single pixel in the texture so we can
  // use it immediately. When the image has finished downloading
  // we'll update the texture with the contents of the image.
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                width, height, border, srcFormat, srcType,
                pixel);

  const image = new Image();
  image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                  srcFormat, srcType, image);

    // WebGL1 has different requirements for power of 2 images
    // vs non power of 2 images so check if the image is a
    // power of 2 in both dimensions.
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
       // Yes, it's a power of 2. Generate mips.
       gl.generateMipmap(gl.TEXTURE_2D);
    } else {
       // No, it's not a power of 2. Turn off mips and set
       // wrapping to clamp to edge
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  };
  image.src = url;

  return texture;
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}


//Texture drawing function
function drawTexture() {
    webgl.activeTexture(webgl.TEXTURE0);
    webgl.bindTexture(webgl.TEXTURE_2D, this.texture);

    webgl.bindBuffer(webgl.ARRAY_BUFFER, this.poBuf);
    webgl.vertexAttribPointer(aPosition, 3, webgl.FLOAT, false, 0, 0);

    webgl.bindBuffer(webgl.ARRAY_BUFFER, this.coBuf);
    webgl.vertexAttribPointer(aColor, 3, webgl.FLOAT, false, 0, 0);
    // webgl.vertexAttrib4f(aColor, 0.2, 0, 0, 1);

    webgl.bindBuffer(webgl.ARRAY_BUFFER, this.tcBuf);
    webgl.vertexAttribPointer(aTexCoord, 2, webgl.FLOAT, false, 0, 0);

    webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, this.indexBuf);
    // webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indexData), webgl.STATIC_DRAW);

    webgl.enableVertexAttribArray(aTexCoord);
    webgl.drawElements(webgl.TRIANGLES, this.length, webgl.UNSIGNED_SHORT, 0);
    webgl.disableVertexAttribArray(aTexCoord);

    webgl.bindTexture(webgl.TEXTURE_2D, null);
}

//Box 3 is composed of four sides of front, back, left and right
//Each side includes vertex position data + color data + texture coordinates data + index data
var Box3 = function(webgl) {
    var box_3_back = {
        poData: [],
        poBuf: webgl.createBuffer(),

        coData: [],
        coBuf: webgl.createBuffer(),

        tcData: [],
        tcBuf: webgl.createBuffer(),

        indexData: [],
        indexBuf: webgl.createBuffer(),
        length: 0,

        translate: {
            x: 0,
            y: -75,
            z: -150 
        },

       texture: loadTexture(webgl, "box3.jpg"),
       draw: drawTexture,
    };





    var box_3_front = {
        poData: [],
        poBuf: webgl.createBuffer(),

        coData: [],
        coBuf: webgl.createBuffer(),

        tcData: [],
        tcBuf: webgl.createBuffer(),

        indexData: [],
        indexBuf: webgl.createBuffer(),

        length: 0,
        translate: {
            x: 0,
            y: -75,
            z: -100
        },
        texture: loadTexture(webgl, "box3.jpg"),
        draw: drawTexture,
    };

   var box_3_left = {
        poData: [],
        poBuf: webgl.createBuffer(),

        coData: [],
        coBuf: webgl.createBuffer(),

        tcData: [],
        tcBuf: webgl.createBuffer(),

        indexData: [],
        indexBuf: webgl.createBuffer(),
        length: 0,
        translate: {
            x: 50,
            y: -75,
            z: -50
        },
        texture: loadTexture(webgl, "box3.jpg"),
        draw: drawTexture,
    };

var box_3_right = {
        poData: [],
        poBuf: webgl.createBuffer(),

        coData: [],
        coBuf: webgl.createBuffer(),

        tcData: [],
        tcBuf: webgl.createBuffer(),

        indexData: [],
        indexBuf: webgl.createBuffer(),
        length: 0,
        translate: {
            x: 100,
            y: -75,
            z: 0
        },
        texture: loadTexture(webgl, "box3.jpg"),
        draw: drawTexture,
    };




    var box3 = {
        back: box_3_back,
        front: box_3_front,
        left: box_3_left,
        right: box_3_right,
        component: [box_3_back,box_3_front,box_3_left,box_3_right],
        scale: 15,
        draw: function() {
            


           if(rotating){theta[0] +=0.1;theta[1] += 0.1;theta[2] += 0.1;}

            u_Model_Mat = mat4();
            u_Model_Mat = mult(u_Model_Mat, rotate(theta[0], [1, 0, 0] ));
            u_Model_Mat = mult(u_Model_Mat, rotate(theta[2], [0, 0, 1] ));
            u_Model_Mat = mult(u_Model_Mat, rotate(theta[1],[0,1,0]));
            
            webgl.uniformMatrix4fv(webgl.getUniformLocation(program, 'u_Model_Matrix'),false,flatten(u_Model_Mat));
        

            webgl.uniformMatrix4fv(u_View_Matrix, false, camera.toMatrix());

            this.component.forEach(function(item) {
                item.draw();
            });
        }
    };

    tmp = [];
    s = 0;


    // Caculate box Back side

    (function() {
        box_3_back.poData.push(-50/2+80, box_3_back.translate.y, box_3_back.translate.z+300);//底边左顶点
        box_3_back.poData.push(50/2+80, box_3_back.translate.y, box_3_back.translate.z+300);//底边右顶点

        box_3_back.poData.push(50/2+80, 50+box_3_back.translate.y+40, box_3_back.translate.z+300);//顶边右顶点
        box_3_back.poData.push(-50/2+80, 50+box_3_back.translate.y+40, box_3_back.translate.z+300);//顶边左顶点

        box_3_back.coData.push(0, 0, 0);
        box_3_back.coData.push(0, 0, 0);
        box_3_back.coData.push(0, 0, 0);
        box_3_back.coData.push(0, 0, 0);

        box_3_back.tcData.push(0.0, 0.0);
        box_3_back.tcData.push(0.0, 1.0);
        box_3_back.tcData.push(1.0, 1.0);
        box_3_back.tcData.push(1.0, 0.0);

        box_3_back.indexData.push(s, s+1, s+2, s, s+2, s+3);
        box_3_back.length += 6;

        webgl.bindBuffer(webgl.ARRAY_BUFFER, box_3_back.poBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(box_3_back.poData), webgl.STATIC_DRAW);

        webgl.bindBuffer(webgl.ARRAY_BUFFER, box_3_back.coBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(box_3_back.coData), webgl.STATIC_DRAW);

        webgl.bindBuffer(webgl.ARRAY_BUFFER, box_3_back.tcBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(box_3_back.tcData), webgl.STATIC_DRAW);

        webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, box_3_back.indexBuf);
        webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(box_3_back.indexData), webgl.STATIC_DRAW);
    })();

    tmp = [];
    s = 0;

      // Caculate box front side

    (function() {
        box_3_front.poData.push(-50/2+80, box_3_front.translate.y, box_3_front.translate.z+300);//左下角
        box_3_front.poData.push(50/2+80, box_3_front.translate.y, box_3_front.translate.z+300);//右下角

        box_3_front.poData.push(50/2+80, 50+box_3_front.translate.y+40, box_3_front.translate.z+300);//右上角
        box_3_front.poData.push(-50/2+80, 50+box_3_front.translate.y+40, box_3_front.translate.z+300);//左上角

        box_3_front.coData.push(0, 0, 0);
        box_3_front.coData.push(0, 0, 0);
        box_3_front.coData.push(0, 0, 0);
        box_3_front.coData.push(0, 0, 0);

        box_3_front.tcData.push(0.0, 0.0);
        box_3_front.tcData.push(0.0, 1.0);
        box_3_front.tcData.push(1.0, 1.0);
        box_3_front.tcData.push(1.0, 0.0);

        box_3_front.indexData.push(s, s+1, s+2, s, s+2, s+3);
        box_3_front.length += 6;

        webgl.bindBuffer(webgl.ARRAY_BUFFER, box_3_front.poBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(box_3_front.poData), webgl.STATIC_DRAW);

        webgl.bindBuffer(webgl.ARRAY_BUFFER, box_3_front.coBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(box_3_front.coData), webgl.STATIC_DRAW);

         webgl.bindBuffer(webgl.ARRAY_BUFFER, box_3_front.tcBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(box_3_front.tcData), webgl.STATIC_DRAW);

        webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, box_3_front.indexBuf);
        webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(box_3_front.indexData), webgl.STATIC_DRAW);
    })();

    tmp = [];
    s = 0;
    

    // Caculate box left side

    (function() { 
        box_3_left.poData.push(-50/2+80, 50+box_3_left.translate.y+40, 150);//前上 +  控制前后位置
        box_3_left.poData.push(-50/2+80, 50+box_3_left.translate.y+40, 200);//后上 -

        box_3_left.poData.push(-50/2+80, box_3_left.translate.y, 200);//-
        box_3_left.poData.push(-50/2+80, box_3_left.translate.y, 150);//+

        box_3_left.coData.push(0, 0, 0);
        box_3_left.coData.push(0, 0, 0);
        box_3_left.coData.push(0, 0, 0);
        box_3_left.coData.push(0, 0, 0);

        box_3_left.tcData.push(0.0, 0.0);
        box_3_left.tcData.push(0.0, 1.0);
        box_3_left.tcData.push(1.0, 1.0);
        box_3_left.tcData.push(1.0, 0.0);

        box_3_left.indexData.push(s, s+1, s+2, s, s+2, s+3);
        box_3_left.length += 6;

        webgl.bindBuffer(webgl.ARRAY_BUFFER, box_3_left.poBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(box_3_left.poData), webgl.STATIC_DRAW);

        webgl.bindBuffer(webgl.ARRAY_BUFFER, box_3_left.coBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(box_3_left.coData), webgl.STATIC_DRAW);

        webgl.bindBuffer(webgl.ARRAY_BUFFER, box_3_left.tcBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(box_3_left.tcData), webgl.STATIC_DRAW);

        webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, box_3_left.indexBuf);
        webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(box_3_left.indexData), webgl.STATIC_DRAW);
    })();

    tmp = [];
    s = 0;


     // Caculate box Back side

    (function() {
        box_3_right.poData.push(50/2+80, 50+box_3_right.translate.y+40, 150);
        box_3_right.poData.push(50/2+80, 50+box_3_right.translate.y+40, 200);

        box_3_right.poData.push(50/2+80, box_3_right.translate.y, 200);
        box_3_right.poData.push(50/2+80, box_3_right.translate.y, 150);

        box_3_right.coData.push(0, 0, 0);
        box_3_right.coData.push(0, 0, 0);
        box_3_right.coData.push(0, 0, 0);
        box_3_right.coData.push(0, 0, 0);

        box_3_right.tcData.push(0.0, 0.0);
        box_3_right.tcData.push(0.0, 1.0);
        box_3_right.tcData.push(1.0, 1.0);
        box_3_right.tcData.push(1.0, 0.0);

        box_3_right.indexData.push(s, s+1, s+2, s, s+2, s+3);
        box_3_right.length += 6;

        webgl.bindBuffer(webgl.ARRAY_BUFFER, box_3_right.poBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(box_3_right.poData), webgl.STATIC_DRAW);

        webgl.bindBuffer(webgl.ARRAY_BUFFER, box_3_right.coBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(box_3_right.coData), webgl.STATIC_DRAW);

        webgl.bindBuffer(webgl.ARRAY_BUFFER, box_3_right.tcBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(box_3_right.tcData), webgl.STATIC_DRAW);

        webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, box_3_right.indexBuf);
        webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(box_3_right.indexData), webgl.STATIC_DRAW);
    })();

    tmp = [];
    s = 0;


    return box3;
};