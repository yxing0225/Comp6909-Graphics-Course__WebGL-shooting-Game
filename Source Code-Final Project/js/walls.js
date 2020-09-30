


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

function drawTexture() {
    webgl.activeTexture(webgl.TEXTURE0);
    webgl.bindTexture(webgl.TEXTURE_2D, this.texture);

    webgl.bindBuffer(webgl.ARRAY_BUFFER, this.poBuf);
    webgl.vertexAttribPointer(aPosition, 3, webgl.FLOAT, false, 0, 0);

    webgl.bindBuffer(webgl.ARRAY_BUFFER, this.coBuf);
    webgl.vertexAttribPointer(aColor, 3, webgl.FLOAT, false, 0, 0);

    webgl.bindBuffer(webgl.ARRAY_BUFFER, this.tcBuf);
    webgl.vertexAttribPointer(aTexCoord, 2, webgl.FLOAT, false, 0, 0);

    webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, this.indexBuf);


    webgl.enableVertexAttribArray(aTexCoord);
    webgl.drawElements(webgl.TRIANGLES, this.length, webgl.UNSIGNED_SHORT, 0);
    webgl.disableVertexAttribArray(aTexCoord);

    webgl.bindTexture(webgl.TEXTURE_2D, null);
}


function drawColor(){
    webgl.bindBuffer(webgl.ARRAY_BUFFER, this.poBuf);
    webgl.vertexAttribPointer(aPosition, 3, webgl.FLOAT, false, 0, 0);

    webgl.bindBuffer(webgl.ARRAY_BUFFER, this.coBuf);
    webgl.vertexAttribPointer(aColor, 3, webgl.FLOAT, false, 0, 0);
    webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, this.indexBuf);

    webgl.drawElements(webgl.TRIANGLES, this.length, webgl.UNSIGNED_SHORT, 0);
}

var Wall = function(webgl) {


    var front_wall = {
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
            z: 500
        },
        texture: loadTexture(webgl, "walls.png"),
        draw: drawTexture,
    };

    var back_wall = {
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
            z: -500 
        },
        texture: loadTexture(webgl, "walls2.png"),
        draw: drawTexture,
    };

    var left_wall = {
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
            x: -500,
            y: -75,
            z: 0
        },
        texture: loadTexture(webgl, "walls3.jpg"),
        draw: drawTexture,
    };

    var right_wall = {
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
            x: 500,
            y: -75,
            z: 0
        },
        texture: loadTexture(webgl, "walls4.jpg"),
        draw: drawTexture,
    };

    var floor = {
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
            z: 0
        },
        texture: loadTexture(webgl, "floor.jpg"),
        draw: drawTexture,
    };

    var ceiling = {
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
            y: 100,
            z: 0
        },
        texture: loadTexture(webgl, "sky.jpg"),
        draw: drawTexture,
    };

    var walls = {
        front: front_wall,
        back: back_wall,
        left: left_wall,
        right: right_wall,
        floor: floor,
        ceiling: ceiling,
        component: [front_wall, back_wall, left_wall, right_wall, floor, ceiling],
        scale: 15,
        draw: function() {

            u_Model_Mat = mat4();
            webgl.uniformMatrix4fv(webgl.getUniformLocation(program, 'u_Model_Matrix'),false,flatten(u_Model_Mat));
        

            webgl.uniformMatrix4fv(u_View_Matrix, false, camera.toMatrix());

            this.component.forEach(function(item) {
                item.draw();
            });
        }
    };

    tmp = [];
    s = 0;



     //front_wall

    (function() {
        front_wall.poData.push(-500, front_wall.translate.y, front_wall.translate.z);
        front_wall.poData.push(500, front_wall.translate.y, front_wall.translate.z);

        front_wall.poData.push(500, 500+front_wall.translate.y+100, front_wall.translate.z);
        front_wall.poData.push(-500, 500+front_wall.translate.y+100, front_wall.translate.z);

        front_wall.coData.push(0,0,0);
        front_wall.coData.push(0,0,0);
        front_wall.coData.push(0,0,0);
        front_wall.coData.push(0,0,0);

        front_wall.tcData.push(0.0, 0.0);
        front_wall.tcData.push(0.0, 1.0);
        front_wall.tcData.push(1.0, 1.0);
        front_wall.tcData.push(1.0, 0.0);

        front_wall.indexData.push(s, s+1, s+2, s, s+2, s+3);
        front_wall.length += 6;

        webgl.bindBuffer(webgl.ARRAY_BUFFER, front_wall.poBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(front_wall.poData), webgl.STATIC_DRAW);

        webgl.bindBuffer(webgl.ARRAY_BUFFER, front_wall.coBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(front_wall.coData), webgl.STATIC_DRAW);

        webgl.bindBuffer(webgl.ARRAY_BUFFER, front_wall.tcBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(front_wall.tcData), webgl.STATIC_DRAW);

        webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, front_wall.indexBuf);

        webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(front_wall.indexData), webgl.STATIC_DRAW);
    })();

    tmp = [];
    s = 0;

    //back_wall

    (function() {
        back_wall.poData.push(-500, back_wall.translate.y, back_wall.translate.z);//底边左顶点
        back_wall.poData.push(500, back_wall.translate.y, back_wall.translate.z);//底边右顶点

        back_wall.poData.push(500, 500+back_wall.translate.y+100, back_wall.translate.z);//顶边右顶点
        back_wall.poData.push(-500, 500+back_wall.translate.y+100, back_wall.translate.z);//顶边左顶点

        back_wall.coData.push(0,0,0);
        back_wall.coData.push(0,0,0);;
        back_wall.coData.push(0,0,0);;
        back_wall.coData.push(0,0,0);;

        back_wall.tcData.push(0.0, 0.0);
        back_wall.tcData.push(0.0, 1.0);
        back_wall.tcData.push(1.0, 1.0);
        back_wall.tcData.push(1.0, 0.0);

        back_wall.indexData.push(s, s+1, s+2, s, s+2, s+3);
        back_wall.length += 6;

        webgl.bindBuffer(webgl.ARRAY_BUFFER, back_wall.poBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(back_wall.poData), webgl.STATIC_DRAW);

        webgl.bindBuffer(webgl.ARRAY_BUFFER, back_wall.coBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(back_wall.coData), webgl.STATIC_DRAW);

        webgl.bindBuffer(webgl.ARRAY_BUFFER, back_wall.tcBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(back_wall.tcData), webgl.STATIC_DRAW);

        webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, back_wall.indexBuf);
        webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(back_wall.indexData), webgl.STATIC_DRAW);
    })();

    tmp = [];
    s = 0;

    //left_wall

    (function() {
        left_wall.poData.push(left_wall.translate.x, 600+left_wall.translate.y, -500);//+
        left_wall.poData.push(left_wall.translate.x, 600+left_wall.translate.y, 500);//-


        left_wall.poData.push(left_wall.translate.x, left_wall.translate.y, 500);//-
        left_wall.poData.push(left_wall.translate.x, left_wall.translate.y, -500);//+

        left_wall.coData.push(0, 0, 0);
        left_wall.coData.push(0, 0, 0);
        left_wall.coData.push(0, 0, 0);
        left_wall.coData.push(0, 0, 0);


        left_wall.tcData.push(0.0, 0.0);
        left_wall.tcData.push(0.0, 1.0);
        left_wall.tcData.push(1.0, 1.0);
        left_wall.tcData.push(1.0, 0.0);

        left_wall.indexData.push(s, s+1, s+2, s, s+2, s+3);
        left_wall.length += 6;

        webgl.bindBuffer(webgl.ARRAY_BUFFER, left_wall.poBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(left_wall.poData), webgl.STATIC_DRAW);

        webgl.bindBuffer(webgl.ARRAY_BUFFER, left_wall.coBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(left_wall.coData), webgl.STATIC_DRAW);

        webgl.bindBuffer(webgl.ARRAY_BUFFER, left_wall.tcBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(left_wall.tcData), webgl.STATIC_DRAW);

        webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, left_wall.indexBuf);
        webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(left_wall.indexData), webgl.STATIC_DRAW);
    })();
    tmp = [];
    s = 0;

    //right_wall

    (function() {
        right_wall.poData.push(right_wall.translate.x, 600+right_wall.translate.y, -500);//左上
        right_wall.poData.push(right_wall.translate.x, 600+right_wall.translate.y, 500);//右上
        right_wall.poData.push(right_wall.translate.x, right_wall.translate.y, 500);//右下
        right_wall.poData.push(right_wall.translate.x, right_wall.translate.y, -500);//左下

        right_wall.coData.push(0, 0, 0);
        right_wall.coData.push(0, 0, 0);
        right_wall.coData.push(0, 0, 0);
        right_wall.coData.push(0, 0, 0);

        right_wall.tcData.push(0.0, 0.0);
        right_wall.tcData.push(0.0, 1.0);
        right_wall.tcData.push(1.0, 1.0);
        right_wall.tcData.push(1.0, 0.0);

        right_wall.indexData.push(s, s+1, s+2, s, s+2, s+3);
        right_wall.length += 6;

        webgl.bindBuffer(webgl.ARRAY_BUFFER, right_wall.poBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(right_wall.poData), webgl.STATIC_DRAW);

        webgl.bindBuffer(webgl.ARRAY_BUFFER, right_wall.coBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(right_wall.coData), webgl.STATIC_DRAW);

        webgl.bindBuffer(webgl.ARRAY_BUFFER, right_wall.tcBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(right_wall.tcData), webgl.STATIC_DRAW);

        webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, right_wall.indexBuf);
        webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(right_wall.indexData), webgl.STATIC_DRAW);
    })();

    tmp = [];
    s = 0;




     //floor

    (function() {
        floor.poData.push(-500, -75, 500);
        floor.poData.push(500, -75, 500);
        floor.poData.push(500, -75, -500);
        floor.poData.push(-500, -75, -500);

        floor.coData.push(0.3, 0.3, 0.3);
        floor.coData.push(0.3, 0.3, 0.3);
        floor.coData.push(0.3, 0.3, 0.3);
        floor.coData.push(0.3, 0.3, 0.3);

        floor.tcData.push(0.0, 0.0);
        floor.tcData.push(0.0, 1.0);
        floor.tcData.push(1.0, 1.0);
        floor.tcData.push(1.0, 0.0);

        floor.indexData.push(s, s+1, s+2, s, s+2, s+3);
        floor.length += 6;

        webgl.bindBuffer(webgl.ARRAY_BUFFER, floor.poBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(floor.poData), webgl.STATIC_DRAW);

        webgl.bindBuffer(webgl.ARRAY_BUFFER, floor.coBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(floor.coData), webgl.STATIC_DRAW);

        webgl.bindBuffer(webgl.ARRAY_BUFFER, floor.tcBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(floor.tcData), webgl.STATIC_DRAW);

        webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, floor.indexBuf);
        webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(floor.indexData), webgl.STATIC_DRAW);
    })();

    //ceiling

    (function() {
        ceiling.poData.push(-500, -75+600, 500);
        ceiling.poData.push(500, -75+600, 500);
        ceiling.poData.push(500, -75+600, -500);
        ceiling.poData.push(-500, -75+600, -500);

        ceiling.coData.push(0.3, 0.3, 0.3);
        ceiling.coData.push(0.3, 0.3, 0.3);
        ceiling.coData.push(0.3, 0.3, 0.3);
        ceiling.coData.push(0.3, 0.3, 0.3);

        ceiling.tcData.push(0.0, 0.0);
        ceiling.tcData.push(0.0, 1.0);
        ceiling.tcData.push(1.0, 1.0);
        ceiling.tcData.push(1.0, 0.0);

        ceiling.indexData.push(s, s+1, s+2, s, s+2, s+3);
        ceiling.length += 6;

        webgl.bindBuffer(webgl.ARRAY_BUFFER, ceiling.poBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(ceiling.poData), webgl.STATIC_DRAW);

        webgl.bindBuffer(webgl.ARRAY_BUFFER, ceiling.coBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(ceiling.coData), webgl.STATIC_DRAW);

        webgl.bindBuffer(webgl.ARRAY_BUFFER, ceiling.tcBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(ceiling.tcData), webgl.STATIC_DRAW);

        webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, ceiling.indexBuf);
        webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(ceiling.indexData), webgl.STATIC_DRAW);
    })();

    return walls;
};