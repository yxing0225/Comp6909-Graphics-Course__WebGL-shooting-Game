


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

var FB = 1;
var LR = -0.5;
var step = 0.1;

// Control the gun's navigation
window.addEventListener("keydown", function(){
          switch(event.keyCode){
           case 87: // W   Move forward
             FB += step;
             break;
           case 65: // A   Move to left side
             LR -= step;
             break;
           case 83: // S   Move backward
             FB -= step;
             break;
           case 68: // D  Move to right side
             LR += step;
             break;
   }
 });



var Gun = function(webgl) {
   
    var gunBarrel = {
        
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
            y: 0,
            z: 0
        },

        scale: 20,

        texture: loadTexture(webgl, "gun3.png"),
        draw: drawTexture,
    };



    var gunPipe = {
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
            x: 1,
            y: -1.2,
            z: 1
        },
        scale: 10,
        texture: loadTexture(webgl, "gun.png"),
        draw: drawTexture,
    };

    var gunWheel = {
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
            x: 1,
            y: -2,
            z: 1
        },
        scale: 10,
        texture: loadTexture(webgl, "gun4.jpg"),
        draw: drawTexture,
    };

    var gunHat = {
        poData: [],
        poBuf: webgl.createBuffer(),

        coData: [],
        coBuf: webgl.createBuffer(),

        indexData: [],
        indexBuf: webgl.createBuffer(),

        length: 0,
        translate: {
            x: 0,
            y: 0.1,
            z: 0
        },
        scale: 10,
        draw: function() {
            webgl.bindBuffer(webgl.ARRAY_BUFFER, this.poBuf);
            webgl.vertexAttribPointer(aPosition, 3, webgl.FLOAT, false, 0, 0);

            webgl.bindBuffer(webgl.ARRAY_BUFFER, this.coBuf);
            webgl.vertexAttribPointer(aColor, 3, webgl.FLOAT, false, 0, 0);

            webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, this.indexBuf);
            // webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indexData), webgl.STATIC_DRAW);


            webgl.drawElements(webgl.TRIANGLES, this.length, webgl.UNSIGNED_SHORT, 0);
        }
    };

    var gunButt = {
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
            y: -3.7,
            z: 0
        },
        scale: 10,
        texture: loadTexture(webgl, "gun5.jpg"),
        draw: drawTexture,
    };

    var gunTrigger = {
        poData: [],
        poBuf: webgl.createBuffer(),

        coData: [],
        coBuf: webgl.createBuffer(),

        indexData: [],
        indexBuf: webgl.createBuffer(),

        length: 0,
        translate: {
            x: 0,
            y: 0,
            z: 0
        },
        scale: 10,
        draw: function() {
            webgl.bindBuffer(webgl.ARRAY_BUFFER, this.poBuf);
            webgl.vertexAttribPointer(aPosition, 3, webgl.FLOAT, false, 0, 0);

            webgl.bindBuffer(webgl.ARRAY_BUFFER, this.coBuf);
            webgl.vertexAttribPointer(aColor, 3, webgl.FLOAT, false, 0, 0);

            webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, this.indexBuf);
            // webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indexData), webgl.STATIC_DRAW);

            webgl.drawElements(webgl.TRIANGLES, this.length, webgl.UNSIGNED_SHORT, 0);
        }
    };

    var gunBack = {
        poData: [],
        poBuf: webgl.createBuffer(),

        tcData: [],
        tcBuf: webgl.createBuffer(),

        coData: [],
        coBuf: webgl.createBuffer(),

        indexData: [],
        indexBuf: webgl.createBuffer(),

        length: 0,
        translate: {
            x: 0,
            y: 0,
            z: 0
        },
        scale: 10,
        
        texture: loadTexture(webgl, "gun2.png"),
        draw: drawTexture,
    };

    var gunAim = {
        poData: [],
        poBuf: webgl.createBuffer(),

        coData: [],
        coBuf: webgl.createBuffer(),

        length: 0,
        translate: {
            x: 0,
            y: 0,
            z: 0
        },
        scale: 10,
        draw: function() {
            var sx = Math.sin(camera.ry);
            var cx = Math.cos(camera.ry);
            var sy = Math.sin(-camera.rx);
            var cy = Math.cos(-camera.rx);

            webgl.uniformMatrix4fv(
                u_Model_Matrix, false, [
                    1/15,0,0,0,
                    0,1/15,0,0,
                    0,0,1/15,0,
                    0,0,-400/15,1
                ]
            );
            webgl.bindBuffer(webgl.ARRAY_BUFFER, this.poBuf);
            webgl.vertexAttribPointer(aPosition, 3, webgl.FLOAT, false, 0, 0);

            webgl.bindBuffer(webgl.ARRAY_BUFFER, this.coBuf);
            webgl.vertexAttribPointer(aColor, 3, webgl.FLOAT, false, 0, 0);


            webgl.drawArrays(webgl.LINES, 0, 4);
        }
    };



    var gun = {
        component: [gunBarrel, gunPipe, gunWheel, gunHat, gunButt, gunTrigger, gunBack],
        angleY: -1.57,
        angleX: 0,
        gunSinY: 0.8414,
        gunCosY: 0.5403,
        scale: 15,
        
        draw: function() {

            var s1 = Math.sin(this.angleX);
            var c1 = Math.cos(this.angleX);
            var s2 = Math.sin(this.angleY);
            var c2 = Math.cos(this.angleY);
            var scale = this.scale;
            
            
            webgl.uniformMatrix4fv(
                u_Model_Matrix, false, [
                    c2/scale, s1*s2/scale,-c1*s2/scale, 2/scale,
                    0, c1/scale, s1/scale, 1/scale,
                    s2/scale, -s1*c2/scale, c1*c2/scale, 0,
                    0.3, -0.15, -0.8, 1
                ]
            );
            
            webgl.uniformMatrix4fv(
                u_View_Matrix, false, [LR,0,0,0, 0,1,0,0, 0,0,FB,0, 0,0,0,1] 
            );

            this.component.forEach(function(item) {
                item.draw();
            });
        },
        fire: function() {
            this.angleX = 0.3;
            this.firing = true;
            boom = true;

            audio.boom();

            setTimeout(function() {
                this.angleX = 0;
                this.firing = false;
            }.bind(this), 160);
        }
    };

    var tmp = [];
    var s = 0;

    //gunBarrel

    (function() {
        for(j = 0; j < 21; j++) {
            angle = 2 * Math.PI * (j / 20);

            tmp.push({
                y: Math.cos(angle),
                z: Math.sin(angle)
            });
        }

        for(i = -5; i < 3; i++) {
            for(j = 0; j < 20; j++) {
                gunBarrel.poData.push(i, tmp[j].y, tmp[j].z*0.9);
                gunBarrel.poData.push(i+1, tmp[j].y, tmp[j].z*0.9);

                gunBarrel.poData.push(i+1, tmp[j+1].y, tmp[j+1].z*0.9);
                gunBarrel.poData.push(i, tmp[j+1].y, tmp[j+1].z*0.9);

                gunBarrel.coData.push(0, 0, 0);
                gunBarrel.coData.push(0, 0, 0);
                gunBarrel.coData.push(0, 0, 0);
                gunBarrel.coData.push(0, 0, 0);

                gunBarrel.tcData.push(0.0, 0.0);
                gunBarrel.tcData.push(0.0, 1.0);
                gunBarrel.tcData.push(1.0, 1.0);
                gunBarrel.tcData.push(1.0, 0.0);

                gunBarrel.indexData.push(s, s+1, s+2, s, s+2, s+3);

                s += 4;

                gunBarrel.length += 6;
            }
        }

        i = -5;
        for(j = 0; j < 20; j++) {
            gunBarrel.poData.push(i, 0, 0);
            gunBarrel.poData.push(i, tmp[j].y, tmp[j].z*0.9);
            gunBarrel.poData.push(i, tmp[j+1].y, tmp[j+1].z*0.9);

            gunBarrel.coData.push(0, 0, 0);
            gunBarrel.coData.push(0, 0, 0);
            gunBarrel.coData.push(0, 0, 0);

            gunBarrel.tcData.push(0.0, 0.0);
            gunBarrel.tcData.push(0.0, 1.0);
            gunBarrel.tcData.push(1.0, 1.0);
            gunBarrel.tcData.push(1.0, 0.0);

            gunBarrel.indexData.push(s, s+1, s+2);

            s += 3;

            gunBarrel.length += 3;
        }

        i = 3;
        for(j = 0; j < 20; j++) {
            gunBarrel.poData.push(i, 0, 0);
            gunBarrel.poData.push(i, tmp[j].y, tmp[j].z*0.9);
            gunBarrel.poData.push(i, tmp[j+1].y, tmp[j+1].z*0.9);

            gunBarrel.coData.push(0, 0, 0);
            gunBarrel.coData.push(0, 0, 0);
            gunBarrel.coData.push(0, 0, 0);

            gunBarrel.tcData.push(0.0, 0.0);
            gunBarrel.tcData.push(0.0, 1.0);
            gunBarrel.tcData.push(1.0, 1.0);
            gunBarrel.tcData.push(1.0, 0.0);

            gunBarrel.indexData.push(s, s+1, s+2);

            s += 3;

            gunBarrel.length += 3;
        }

        var tmpJ;
        var k;
        tmp = [];

        for(j = 0; j < 81; j++) {
            angle = 2 * Math.PI * (j / 80);

            tmp.push({
                y: Math.cos(angle),
                z: Math.sin(angle)
            });
        }

        for(i = 3; i < 5; i++) {
            for(j = -20; j < 21; j++) {
                if(j < 0) {
                    tmpJ = j + 80;
                } else {
                    tmpJ = j;
                }

                k = 1 - (Math.abs(j) / 20);

                gunBarrel.poData.push(i-k, tmp[tmpJ].y, tmp[tmpJ].z*0.63);
                gunBarrel.poData.push(i+1-k, tmp[tmpJ].y, tmp[tmpJ].z*0.63);

                gunBarrel.poData.push(i+1-k, tmp[tmpJ+1].y, tmp[tmpJ+1].z*0.63);
                gunBarrel.poData.push(i-k, tmp[tmpJ+1].y, tmp[tmpJ+1].z*0.63);

                gunBarrel.coData.push(0, 0, 0);
                gunBarrel.coData.push(0, 0, 0);
                gunBarrel.coData.push(0, 0, 0);
                gunBarrel.coData.push(0, 0, 0);

                gunBarrel.tcData.push(0.0, 0.0);
                gunBarrel.tcData.push(0.0, 1.0);
                gunBarrel.tcData.push(1.0, 1.0);
                gunBarrel.tcData.push(1.0, 0.0);

                gunBarrel.indexData.push(s, s+1, s+2, s, s+2, s+3);

                s += 4;

                gunBarrel.length += 6;
            }
        }

        i = 5;
        var k1, k2;
        for(j = -20; j < 21; j++) {
            if(j < 0) {
                tmpJ = j + 80;
            } else {
                tmpJ = j;
            }

            k1 = 1 - (Math.abs(j) / 20);
            k2 = 1 - (Math.abs(j+1) / 20);

            gunBarrel.poData.push(i-k1, tmp[tmpJ].y, tmp[tmpJ].z*0.65);
            gunBarrel.poData.push(i-k2, tmp[tmpJ+1].y, tmp[tmpJ+1].z*0.65);
            gunBarrel.poData.push(4.5, 0.5, 0);

            gunBarrel.coData.push(0, 0, 0);
            gunBarrel.coData.push(0, 0, 0);
            gunBarrel.coData.push(0, 0, 0);

            gunBarrel.tcData.push(0.0, 0.0);
            gunBarrel.tcData.push(0.0, 1.0);
            gunBarrel.tcData.push(1.0, 1.0);
            gunBarrel.tcData.push(1.0, 0.0);

            gunBarrel.indexData.push(s, s+1, s+2);

            s += 3;

            gunBarrel.length += 3;
        }

        gunBarrel.poData.push(4, tmp[0].y, tmp[0].z*0.63);
        gunBarrel.poData.push(5, tmp[60].y, tmp[60].z*0.63);
        gunBarrel.poData.push(4.5, 0.5, 0);
        gunBarrel.coData.push(0, 0, 0);
        gunBarrel.coData.push(0, 0, 0);
        gunBarrel.coData.push(0, 0, 0);
        gunBarrel.tcData.push(0.0, 0.0);
        gunBarrel.tcData.push(0.0, 1.0);
        gunBarrel.tcData.push(1.0, 1.0);
        gunBarrel.tcData.push(1.0, 0.0);
        gunBarrel.indexData.push(s, s+1, s+2);
        s += 3;
        gunBarrel.length += 3;

        gunBarrel.poData.push(4, tmp[0].y, tmp[0].z*0.63);
        gunBarrel.poData.push(5, tmp[20].y, tmp[20].z*0.63);
        gunBarrel.poData.push(4.5, 0.5, 0);
        gunBarrel.coData.push(0, 0, 0);
        gunBarrel.coData.push(0, 0, 0);
        gunBarrel.coData.push(0, 0, 0);
        gunBarrel.tcData.push(0.0, 0.0);
        gunBarrel.tcData.push(0.0, 1.0);
        gunBarrel.tcData.push(1.0, 1.0);
        gunBarrel.tcData.push(1.0, 0.0);
        gunBarrel.indexData.push(s, s+1, s+2);
        s += 3;
        gunBarrel.length += 3;

        gunBarrel.poData.push(i, tmp[20].y, tmp[20].z*0.63);
        gunBarrel.poData.push(i, tmp[60].y, tmp[60].z*0.63);
        gunBarrel.poData.push(4.5, 0.5, 0);
        gunBarrel.coData.push(0, 0, 0);
        gunBarrel.coData.push(0, 0, 0);
        gunBarrel.coData.push(0, 0, 0);
        gunBarrel.tcData.push(0.0, 0.0);
        gunBarrel.tcData.push(0.0, 1.0);
        gunBarrel.tcData.push(1.0, 1.0);
        gunBarrel.tcData.push(1.0, 0.0);
        gunBarrel.indexData.push(s, s+1, s+2);
        s += 3;
        gunBarrel.length += 3;

        tmp = [];

        for(j = 0; j < 41; j++) {
            angle = 2 * Math.PI * (j / 40);

            tmp.push({
                y: Math.cos(angle),
                z: Math.sin(angle)
            });
        }

        
        gunBarrel.poData.push(3, 0, tmp[35].z*0.9);
        gunBarrel.poData.push(4.99, 0, tmp[35].z*0.9);
        gunBarrel.poData.push(4.99, tmp[35].y-2, tmp[35].z);
        gunBarrel.poData.push(3, tmp[35].y-2, tmp[35].z);
        gunBarrel.coData.push(0, 0, 0);
        gunBarrel.coData.push(0, 0, 0);
        gunBarrel.coData.push(0, 0, 0);
        gunBarrel.coData.push(0, 0, 0);
        gunBarrel.tcData.push(0.0, 0.0);
        gunBarrel.tcData.push(0.0, 1.0);
        gunBarrel.tcData.push(1.0, 1.0);
        gunBarrel.tcData.push(1.0, 0.0);
        gunBarrel.indexData.push(s, s+1, s+2, s, s+2, s+3);
        s += 4;
        gunBarrel.length += 6;
        
        gunBarrel.poData.push(3, 0, tmp[5].z*0.9);
        gunBarrel.poData.push(4.99, 0, tmp[5].z*0.9);
        gunBarrel.poData.push(4.99, tmp[5].y-2, tmp[5].z);
        gunBarrel.poData.push(3, tmp[5].y-2, tmp[5].z);
        gunBarrel.coData.push(0, 0, 0);
        gunBarrel.coData.push(0, 0, 0);
        gunBarrel.coData.push(0, 0, 0);
        gunBarrel.coData.push(0, 0, 0);
        gunBarrel.tcData.push(0.0, 0.0);
        gunBarrel.tcData.push(0.0, 1.0);
        gunBarrel.tcData.push(1.0, 1.0);
        gunBarrel.tcData.push(1.0, 0.0);
        gunBarrel.indexData.push(s, s+1, s+2, s, s+2, s+3);
        s += 4;
        gunBarrel.length += 6;
        
        var tmp1, tmp2;
        for(j = -5; j < 5; j++) {
            if(j < 0) {
                tmp1 = j + 40;
            } else {
                tmp1 = j;
            }

            tmp2 = j / 10 * 20;

            if(tmp2 < 0) {
                tmp2 = tmp2 + 40;
            }

            gunBarrel.poData.push(4.99, 0, tmp[tmp1].z);
            gunBarrel.poData.push(4.99, 0, tmp[tmp1+1].z);
            gunBarrel.poData.push(4.99, tmp[tmp1+1].y-2, tmp[tmp1+1].z);
            gunBarrel.poData.push(4.99, tmp[tmp1].y-2, tmp[tmp1].z);
            gunBarrel.coData.push(0, 0, 0);
            gunBarrel.coData.push(0, 0, 0);
            gunBarrel.coData.push(0, 0, 0);
            gunBarrel.coData.push(0, 0, 0);
            gunBarrel.tcData.push(0.0, 0.0);
            gunBarrel.tcData.push(0.0, 1.0);
            gunBarrel.tcData.push(1.0, 1.0);
            gunBarrel.tcData.push(1.0, 0.0);
            gunBarrel.indexData.push(s, s+1, s+2, s, s+2, s+3);
            s += 4;
            gunBarrel.length += 6;
        }

        webgl.bindBuffer(webgl.ARRAY_BUFFER, gunBarrel.poBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(gunBarrel.poData), webgl.STATIC_DRAW);

        webgl.bindBuffer(webgl.ARRAY_BUFFER, gunBarrel.coBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(gunBarrel.coData), webgl.STATIC_DRAW);

        webgl.bindBuffer(webgl.ARRAY_BUFFER, gunBarrel.tcBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(gunBarrel.tcData), webgl.STATIC_DRAW);

        webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, gunBarrel.indexBuf);
        webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(gunBarrel.indexData), webgl.STATIC_DRAW);
    })();


    tmp = [];
    s = 0;




   //gunPipe
    (function() {
        for(j = 0; j < 21; j++) {
            angle = 2 * Math.PI * (j / 20);

            tmp.push({
                y: Math.cos(angle),
                z: Math.sin(angle)
            });
        }

        for(i = -4.9; i < 3; i++) {
            for(j = 0; j < 20; j++) {
                gunPipe.poData.push(i, tmp[j].y * 0.8 + gunPipe.translate.y, tmp[j].z * 0.6);
                gunPipe.poData.push(i+1, tmp[j].y * 0.8 + gunPipe.translate.y, tmp[j].z * 0.6);

                gunPipe.poData.push(i+1, tmp[j+1].y * 0.8 + gunPipe.translate.y, tmp[j+1].z * 0.6);
                gunPipe.poData.push(i, tmp[j+1].y * 0.8 + gunPipe.translate.y, tmp[j+1].z * 0.6);

                gunPipe.coData.push(0, 0, 0);
                gunPipe.coData.push(0, 0, 0);
                gunPipe.coData.push(0, 0, 0);
                gunPipe.coData.push(0, 0, 0);

                gunPipe.tcData.push(0.0, 0.0);
                gunPipe.tcData.push(0.0, 1.0);
                gunPipe.tcData.push(1.0, 1.0);
                gunPipe.tcData.push(1.0, 0.0);

                gunPipe.indexData.push(s, s+1, s+2, s, s+2, s+3);

                s += 4;

                gunPipe.length += 6;
            }
        }

        i = -4.9;
        for(j = 0; j < 20; j++) {
            gunPipe.poData.push(i, gunPipe.translate.y, 0);
            gunPipe.poData.push(i, tmp[j].y * 0.8 + gunPipe.translate.y, tmp[j].z * 0.6);
            gunPipe.poData.push(i, tmp[j+1].y * 0.8 + gunPipe.translate.y, tmp[j+1].z * 0.6);

            gunPipe.coData.push(0, 0, 0);
            gunPipe.coData.push(0, 0, 0);
            gunPipe.coData.push(0, 0, 0);

            gunPipe.tcData.push(0.0, 0.0);
            gunPipe.tcData.push(0.0, 1.0);
            gunPipe.tcData.push(1.0, 1.0);
            gunPipe.tcData.push(1.0, 0.0);

            gunPipe.indexData.push(s, s+1, s+2);

            s += 3;

            gunPipe.length += 3;
        }

        i = 3;
        for(j = 0; j < 20; j++) {
            gunPipe.poData.push(i, gunPipe.translate.y, 0);
            gunPipe.poData.push(i, tmp[j].y * 0.8 + gunPipe.translate.y, tmp[j].z * 0.6);
            gunPipe.poData.push(i, tmp[j+1].y * 0.8 + gunPipe.translate.y, tmp[j+1].z * 0.6);

            gunPipe.coData.push(0, 0, 0);
            gunPipe.coData.push(0, 0, 0);
            gunPipe.coData.push(0, 0, 0);

            gunPipe.tcData.push(0.0, 0.0);
            gunPipe.tcData.push(0.0, 1.0);
            gunPipe.tcData.push(1.0, 1.0);
            gunPipe.tcData.push(1.0, 0.0);

            gunPipe.indexData.push(s, s+1, s+2);

            s += 3;

            gunPipe.length += 3;
        }

        webgl.bindBuffer(webgl.ARRAY_BUFFER, gunPipe.poBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(gunPipe.poData), webgl.STATIC_DRAW);

        webgl.bindBuffer(webgl.ARRAY_BUFFER, gunPipe.coBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(gunPipe.coData), webgl.STATIC_DRAW);

        webgl.bindBuffer(webgl.ARRAY_BUFFER, gunPipe.tcBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(gunPipe.tcData), webgl.STATIC_DRAW);

        webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, gunPipe.indexBuf);
        webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(gunPipe.indexData), webgl.STATIC_DRAW);
    })();



    tmp = [];
    s = 0;



    //gunWheel
    (function() {
        for(j = 0; j < 41; j++) {
            angle = 2 * Math.PI * (j / 40);

            tmp.push({
                y: Math.cos(angle),
                z: Math.sin(angle)
            });
        }

        var color1;
        var color2;

        for(i = 3; i < 5; i+=0.2) {
            for(j = 0; j < 40; j++) {
                color1 = (i - 3) * 0.24;
                color2 = (i + 0.2 - 3) * 0.24;

                gunWheel.poData.push(i, tmp[j].y + gunWheel.translate.y, tmp[j].z);
                gunWheel.poData.push(i+0.2, tmp[j].y + gunWheel.translate.y, tmp[j].z);

                gunWheel.poData.push(i+0.2, tmp[j+1].y + gunWheel.translate.y, tmp[j+1].z);
                gunWheel.poData.push(i, tmp[j+1].y + gunWheel.translate.y, tmp[j+1].z);

                gunWheel.coData.push(color1, color1, color1);
                gunWheel.coData.push(color2, color2, color2);
                gunWheel.coData.push(color2, color2, color2);
                gunWheel.coData.push(color1, color1, color1);

                 gunWheel.tcData.push(0.0, 0.0);
                 gunWheel.tcData.push(0.0, 1.0);
                 gunWheel.tcData.push(1.0, 1.0);
                 gunWheel.tcData.push(1.0, 0.0);


                gunWheel.indexData.push(s, s+1, s+2, s, s+2, s+3);

                s += 4;

                gunWheel.length += 6;
            }
        }

        i = 3;
        for(j = 0; j < 40; j++) {
            gunWheel.poData.push(i, gunWheel.translate.y, 0);
            gunWheel.poData.push(i, tmp[j].y + gunWheel.translate.y, tmp[j].z);
            gunWheel.poData.push(i, tmp[j+1].y + gunWheel.translate.y, tmp[j+1].z);

            gunWheel.coData.push(0, 0, 0);
            gunWheel.coData.push(0, 0, 0);
            gunWheel.coData.push(0, 0, 0);

            gunWheel.tcData.push(0.0, 0.0);
            gunWheel.tcData.push(0.0, 1.0);
            gunWheel.tcData.push(1.0, 1.0);
            gunWheel.tcData.push(1.0, 0.0);

            gunWheel.indexData.push(s, s+1, s+2);

            s += 3;

            gunWheel.length += 3;
        }

        i = 5;
        for(j = 0; j < 40; j++) {
            gunWheel.poData.push(i, gunWheel.translate.y, 0);
            gunWheel.poData.push(i, tmp[j].y + gunWheel.translate.y, tmp[j].z);
            gunWheel.poData.push(i, tmp[j+1].y + gunWheel.translate.y, tmp[j+1].z);

            gunWheel.coData.push(0.29, 0.29, 0.29);
            gunWheel.coData.push(0.29, 0.29, 0.29);
            gunWheel.coData.push(0.29, 0.29, 0.29);

            gunWheel.tcData.push(0.0, 0.0);
            gunWheel.tcData.push(0.0, 1.0);
            gunWheel.tcData.push(1.0, 1.0);
            gunWheel.tcData.push(1.0, 0.0);

            gunWheel.indexData.push(s, s+1, s+2);

            s += 3;

            gunWheel.length += 3;
        }

        webgl.bindBuffer(webgl.ARRAY_BUFFER, gunWheel.poBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(gunWheel.poData), webgl.STATIC_DRAW);

        webgl.bindBuffer(webgl.ARRAY_BUFFER, gunWheel.coBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(gunWheel.coData), webgl.STATIC_DRAW);


        webgl.bindBuffer(webgl.ARRAY_BUFFER, gunWheel.tcBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(gunWheel.tcData), webgl.STATIC_DRAW);

        webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, gunWheel.indexBuf);
        webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(gunWheel.indexData), webgl.STATIC_DRAW);
    })();


    tmp = [];
    s = 0;


    //gunHat
    (function() {
        [9, 0, 1].forEach(function(item) {
            angle = 2 * Math.PI * (item / 10);

            tmp.push({
                y: Math.cos(angle),
                z: Math.sin(angle)
            });
        });

        for(i = -5; i < -3; i++) {
            for(j = 0; j < 2; j++) {
                gunHat.poData.push(i, tmp[j].y, tmp[j].z*0.9);
                gunHat.poData.push(i+1, tmp[j].y, tmp[j].z*0.9);

                gunHat.poData.push(i+1, tmp[j+1].y, tmp[j+1].z*0.9);
                gunHat.poData.push(i, tmp[j+1].y, tmp[j+1].z*0.9);

                gunHat.coData.push(0, 0, 0);
                gunHat.coData.push(0, 0, 0);
                gunHat.coData.push(0, 0, 0);
                gunHat.coData.push(0, 0, 0);

                gunHat.indexData.push(s, s+1, s+2, s, s+2, s+3);

                s += 4;

                gunHat.length += 6;
            }
        }

        for(i = -5; i < -3; i++) {
            for(j = 0; j < 2; j++) {
                gunHat.poData.push(i, tmp[j].y + gunHat.translate.y, tmp[j].z*0.9);
                gunHat.poData.push(i+1, tmp[j].y + gunHat.translate.y, tmp[j].z*0.9);

                gunHat.poData.push(i+1, tmp[j+1].y + gunHat.translate.y, tmp[j+1].z*0.9);
                gunHat.poData.push(i, tmp[j+1].y + gunHat.translate.y, tmp[j+1].z*0.9);

                gunHat.coData.push(0, 0, 0);
                gunHat.coData.push(0, 0, 0);
                gunHat.coData.push(0, 0, 0);
                gunHat.coData.push(0, 0, 0);

                gunHat.indexData.push(s, s+1, s+2, s, s+2, s+3);

                s += 4;

                gunHat.length += 6;
            }
        }

        gunHat.poData.push(-4.6, tmp[1].y + 0.4, 0);
        gunHat.poData.push(-4, tmp[1].y + 0.4, 0);

        gunHat.poData.push(-4, tmp[1].y, 0);
        gunHat.poData.push(-4.6, tmp[1].y, 0);

        gunHat.coData.push(0, 0, 0);
        gunHat.coData.push(0, 0, 0);
        gunHat.coData.push(0, 0, 0);
        gunHat.coData.push(0, 0, 0);

        gunHat.indexData.push(s, s+1, s+2, s, s+2, s+3);

        s += 4;

        gunHat.length += 6;


        webgl.bindBuffer(webgl.ARRAY_BUFFER, gunHat.poBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(gunHat.poData), webgl.STATIC_DRAW);
        webgl.bindBuffer(webgl.ARRAY_BUFFER, gunHat.coBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(gunHat.coData), webgl.STATIC_DRAW);
        webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, gunHat.indexBuf);
        webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(gunHat.indexData), webgl.STATIC_DRAW);
    })();


    tmp = [];
    s = 0;


    //gunButt
    (function() {
        i = 5;
        var z = 0.9;


        gunButt.poData.push(i, 1 + gunButt.translate.y, z*0.6);
        gunButt.poData.push(i+1.6, 1 + gunButt.translate.y, z*0.6);
        gunButt.poData.push(i+1.6, 1 + gunButt.translate.y, -z*0.6);
        gunButt.poData.push(i, 1 + gunButt.translate.y, -z*0.6);

        gunButt.coData.push(0, 0, 0);
        gunButt.coData.push(0, 0, 0);
        gunButt.coData.push(0, 0, 0);
        gunButt.coData.push(0, 0, 0);

        gunButt.tcData.push(0.0, 0.0);
        gunButt.tcData.push(0.0, 1.0);
        gunButt.tcData.push(1.0, 1.0);
        gunButt.tcData.push(1.0, 0.0);

        gunButt.indexData.push(s, s+1, s+2, s, s+2, s+3);
        s += 4;
        gunButt.length += 6;


        gunButt.poData.push(i+0.7, -2.3 + gunButt.translate.y, z*0.6);
        gunButt.poData.push(i+1.6, -2.3 + gunButt.translate.y, z*0.6);
        gunButt.poData.push(i+1.6, -2.3 + gunButt.translate.y, -z*0.6);
        gunButt.poData.push(i+0.7, -2.3 + gunButt.translate.y, -z*0.6);

        gunButt.coData.push(0, 0, 0);
        gunButt.coData.push(0, 0, 0);
        gunButt.coData.push(0, 0, 0);
        gunButt.coData.push(0, 0, 0);

        gunButt.tcData.push(0.0, 0.0);
        gunButt.tcData.push(0.0, 1.0);
        gunButt.tcData.push(1.0, 1.0);
        gunButt.tcData.push(1.0, 0.0);

        gunButt.indexData.push(s, s+1, s+2, s, s+2, s+3);
        s += 4;
        gunButt.length += 6;


        gunButt.poData.push(i, 1 + gunButt.translate.y, -z*0.6);
        gunButt.poData.push(i, 1 + gunButt.translate.y, z*0.6);
        gunButt.poData.push(i+0.7, -2.3 + gunButt.translate.y, z*0.6);
        gunButt.poData.push(i+0.7, -2.3 + gunButt.translate.y, -z*0.6);

        gunButt.coData.push(0, 0, 0);
        gunButt.coData.push(0, 0, 0);
        gunButt.coData.push(0, 0, 0);
        gunButt.coData.push(0, 0, 0);

        gunButt.tcData.push(0.0, 0.0);
        gunButt.tcData.push(0.0, 1.0);
        gunButt.tcData.push(1.0, 1.0);
        gunButt.tcData.push(1.0, 0.0);

        gunButt.indexData.push(s, s+1, s+2, s, s+2, s+3);
        s += 4;
        gunButt.length += 6;


        gunButt.poData.push(i+1.6, 1 + gunButt.translate.y, z*0.6);
        gunButt.poData.push(i+1.6, 1 + gunButt.translate.y, -z*0.6);
        gunButt.poData.push(i+2.3, -2.3 + gunButt.translate.y, -z*0.6);
        gunButt.poData.push(i+2.3, -2.3 + gunButt.translate.y, z*0.6);

        gunButt.coData.push(0, 0, 0);
        gunButt.coData.push(0, 0, 0);
        gunButt.coData.push(0, 0, 0);
        gunButt.coData.push(0, 0, 0);

        gunButt.tcData.push(0.0, 0.0);
        gunButt.tcData.push(0.0, 1.0);
        gunButt.tcData.push(1.0, 1.0);
        gunButt.tcData.push(1.0, 0.0);

        gunButt.indexData.push(s, s+1, s+2, s, s+2, s+3);
        s += 4;
        gunButt.length += 6;


        gunButt.poData.push(i, 1 + gunButt.translate.y, z*0.6);
        gunButt.poData.push(i+1.6, 1 + gunButt.translate.y, z*0.6);
        gunButt.poData.push(i+2.3, -2.3 + gunButt.translate.y, z*0.6);
        gunButt.poData.push(i+0.7, -2.3 + gunButt.translate.y, z*0.6);

        gunButt.coData.push(0, 0, 0);
        gunButt.coData.push(0, 0, 0);
        gunButt.coData.push(0, 0, 0);
        gunButt.coData.push(0, 0, 0);

        gunButt.tcData.push(0.0, 0.0);
        gunButt.tcData.push(0.0, 1.0);
        gunButt.tcData.push(1.0, 1.0);
        gunButt.tcData.push(1.0, 0.0);

        gunButt.indexData.push(s, s+1, s+2, s, s+2, s+3);
        s += 4;
        gunButt.length += 6;

        gunButt.poData.push(i, 1 + gunButt.translate.y, -z*0.6);
        gunButt.poData.push(i+1.6, 1 + gunButt.translate.y, -z*0.6);
        gunButt.poData.push(i+2.3, -2.3 + gunButt.translate.y, -z*0.6);
        gunButt.poData.push(i+0.7, -2.3 + gunButt.translate.y, -z*0.6);

        gunButt.coData.push(0, 0, 0);
        gunButt.coData.push(0, 0, 0);
        gunButt.coData.push(0, 0, 0);
        gunButt.coData.push(0, 0, 0);

        gunButt.tcData.push(0.0, 0.0);
        gunButt.tcData.push(0.0, 1.0);
        gunButt.tcData.push(1.0, 1.0);
        gunButt.tcData.push(1.0, 0.0);

        gunButt.indexData.push(s, s+1, s+2, s, s+2, s+3);
        s += 4;
        gunButt.length += 6;

        webgl.bindBuffer(webgl.ARRAY_BUFFER, gunButt.poBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(gunButt.poData), webgl.STATIC_DRAW);

        webgl.bindBuffer(webgl.ARRAY_BUFFER, gunButt.coBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(gunButt.coData), webgl.STATIC_DRAW);

        webgl.bindBuffer(webgl.ARRAY_BUFFER, gunButt.tcBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(gunButt.tcData), webgl.STATIC_DRAW);

        webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, gunButt.indexBuf);
        webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(gunButt.indexData), webgl.STATIC_DRAW);

    })();


    tmp = [];
    s = 0;

    //gunTrigger
    (function() {
        var x = 3.3;
        var y = -2.2;
        var z1 = 0.2;
        var z2 = -0.2;
        var k = 0;
        var angle;


        for(k = 0; k < 5; k++) {
            angle = Math.PI/2 * (k/5);

            tmp.push({
                x: 2 - 2 * Math.sin(angle),
                y: -2 * Math.cos(angle)
            });
        }

        for(k = 0; k < 4; k++) {
            gunTrigger.poData.push(x+tmp[k].x, y+tmp[k].y, z2);
            gunTrigger.poData.push(x+tmp[k].x, y+tmp[k].y, z1);

            gunTrigger.poData.push(x+tmp[k+1].x, y+tmp[k+1].y, z1);
            gunTrigger.poData.push(x+tmp[k+1].x, y+tmp[k+1].y, z2);

            gunTrigger.coData.push(0, 0, 0);
            gunTrigger.coData.push(0, 0, 0);
            gunTrigger.coData.push(0, 0, 0);
            gunTrigger.coData.push(0, 0, 0);

            gunTrigger.indexData.push(s, s+1, s+2, s, s+2, s+3);

            s += 4;

            gunTrigger.length += 6;
        }

        for(k = 0; k < 5; k++) {
            angle = Math.PI/2 * (k/5);

            tmp.push({
                x: 2.1 - 2.1 * Math.sin(angle),
                y: -2.1 * Math.cos(angle)
            });
        }

        for(k = 0; k < 4; k++) {
            gunTrigger.poData.push(x+tmp[k+5].x - 0.1, y+tmp[k+5].y, z2);
            gunTrigger.poData.push(x+tmp[k+5].x - 0.1, y+tmp[k+5].y, z1);

            gunTrigger.poData.push(x+tmp[k+5+1].x - 0.1, y+tmp[k+5+1].y, z1);
            gunTrigger.poData.push(x+tmp[k+5+1].x - 0.1, y+tmp[k+5+1].y, z2);

            gunTrigger.coData.push(0, 0, 0);
            gunTrigger.coData.push(0, 0, 0);
            gunTrigger.coData.push(0, 0, 0);
            gunTrigger.coData.push(0, 0, 0);

            gunTrigger.indexData.push(s, s+1, s+2, s, s+2, s+3);

            s += 4;

            gunTrigger.length += 6;
        }


        for(k = 0; k < 4; k++) {
            gunTrigger.poData.push(x+tmp[k+5].x - 0.1, y+tmp[k+5].y, z1);
            gunTrigger.poData.push(x+tmp[k].x, y+tmp[k].y, z1);

            gunTrigger.poData.push(x+tmp[k+1].x, y+tmp[k+1].y, z1);
            gunTrigger.poData.push(x+tmp[k+5+1].x - 0.1, y+tmp[k+5+1].y, z1);

            gunTrigger.coData.push(0, 0, 0);
            gunTrigger.coData.push(0, 0, 0);
            gunTrigger.coData.push(0, 0, 0);
            gunTrigger.coData.push(0, 0, 0);

            gunTrigger.indexData.push(s, s+1, s+2, s, s+2, s+3);

            s += 4;

            gunTrigger.length += 6;
        }

        for(k = 0; k < 4; k++) {
            gunTrigger.poData.push(x+tmp[k+5].x - 0.1, y+tmp[k+5].y, z2);
            gunTrigger.poData.push(x+tmp[k].x, y+tmp[k].y, z2);

            gunTrigger.poData.push(x+tmp[k+1].x, y+tmp[k+1].y, z2);
            gunTrigger.poData.push(x+tmp[k+5+1].x - 0.1, y+tmp[k+5+1].y, z2);

            gunTrigger.coData.push(0, 0, 0);
            gunTrigger.coData.push(0, 0, 0);
            gunTrigger.coData.push(0, 0, 0);
            gunTrigger.coData.push(0, 0, 0);

            gunTrigger.indexData.push(s, s+1, s+2, s, s+2, s+3);

            s += 4;

            gunTrigger.length += 6;
        }


        gunTrigger.poData.push(x+tmp[2].x - 0.1, y+tmp[2].y, z1);
        gunTrigger.poData.push(x+tmp[0].x + 0.1, y+tmp[0].y, z1);
        gunTrigger.poData.push(x+tmp[0].x + 0.1, y+tmp[0].y-0.5, z1);

        gunTrigger.coData.push(0, 0, 0);
        gunTrigger.coData.push(0, 0, 0);
        gunTrigger.coData.push(0, 0, 0);
        
        gunTrigger.indexData.push(s, s+1, s+2);
        s += 3;
        gunTrigger.length += 3;

        gunTrigger.poData.push(x+tmp[2].x - 0.1, y+tmp[2].y, z2);
        gunTrigger.poData.push(x+tmp[0].x + 0.1, y+tmp[0].y, z2);
        gunTrigger.poData.push(x+tmp[0].x + 0.1, y+tmp[0].y-0.5, z2);

        gunTrigger.coData.push(0, 0, 0);
        gunTrigger.coData.push(0, 0, 0);
        gunTrigger.coData.push(0, 0, 0);
        
        gunTrigger.indexData.push(s, s+1, s+2);
        s += 3;
        gunTrigger.length += 3;

        gunTrigger.poData.push(x+tmp[2].x - 0.1, y+tmp[2].y, z2);
        gunTrigger.poData.push(x+tmp[2].x - 0.1, y+tmp[2].y, z1);
        gunTrigger.poData.push(x+tmp[0].x + 0.1, y+tmp[0].y-0.5, z1);
        gunTrigger.poData.push(x+tmp[0].x + 0.1, y+tmp[0].y-0.5, z2);

        gunTrigger.coData.push(0, 0, 0);
        gunTrigger.coData.push(0, 0, 0);
        gunTrigger.coData.push(0, 0, 0);
        gunTrigger.coData.push(0, 0, 0);
        
        gunTrigger.indexData.push(s, s+1, s+2, s, s+2, s+3);
        s += 4;
        gunTrigger.length += 6;

        webgl.bindBuffer(webgl.ARRAY_BUFFER, gunTrigger.poBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(gunTrigger.poData), webgl.STATIC_DRAW);
        webgl.bindBuffer(webgl.ARRAY_BUFFER, gunTrigger.coBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(gunTrigger.coData), webgl.STATIC_DRAW);
        webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, gunTrigger.indexBuf);
        webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(gunTrigger.indexData), webgl.STATIC_DRAW);
    })();



    tmp = [];
    s = 0;






    (function() {
        gunBack.poData.push(3, 1, 0.5);
        gunBack.poData.push(6.6, 1.2, 0.5);

        gunBack.poData.push(6.6, 1.2, -0.5);
        gunBack.poData.push(3, 1, -0.5);

        gunBack.coData.push(0, 0, 0);
        gunBack.coData.push(0, 0, 0);
        gunBack.coData.push(0, 0, 0);
        gunBack.coData.push(0, 0, 0);

        gunBack.tcData.push(0.0, 0.0);
        gunBack.tcData.push(0.0, 1.0);
        gunBack.tcData.push(1.0, 1.0);
        gunBack.tcData.push(1.0, 0.0);

        gunBack.indexData.push(s, s+1, s+2, s, s+2, s+3);
        s += 4;
        gunBack.length += 6;

        gunBack.poData.push(3, 1.2, 0.5);
        gunBack.poData.push(3, 1, 0.5);
        gunBack.poData.push(4.2, 1, 0.35);

        gunBack.coData.push(0, 0, 0);
        gunBack.coData.push(0, 0, 0);
        gunBack.coData.push(0, 0, 0);

        gunBack.tcData.push(0.0, 0.0);
        gunBack.tcData.push(0.0, 1.0);
        gunBack.tcData.push(1.0, 1.0);
        gunBack.tcData.push(1.0, 0.0);

        gunBack.indexData.push(s, s+1, s+2);
        s += 3;
        gunBack.length += 3;

        gunBack.poData.push(3, 1.2, -0.5);
        gunBack.poData.push(3, 1, -0.5);
        gunBack.poData.push(4.2, 1, -0.35);

        gunBack.coData.push(0, 0, 0);
        gunBack.coData.push(0, 0, 0);
        gunBack.coData.push(0, 0, 0);

        gunBack.tcData.push(0.0, 0.0);
        gunBack.tcData.push(0.0, 1.0);
        gunBack.tcData.push(1.0, 1.0);
        gunBack.tcData.push(1.0, 0.0);

        gunBack.indexData.push(s, s+1, s+2);
        s += 3;
        gunBack.length += 3;

        gunBack.poData.push(6.6, 1.2, 0.5);
        gunBack.poData.push(5, 0.0, 0.5);
        gunBack.poData.push(4.2, 1.07, 0.5);

        gunBack.coData.push(0, 0, 0);
        gunBack.coData.push(0, 0, 0);
        gunBack.coData.push(0, 0, 0);

        gunBack.tcData.push(0.0, 0.0);
        gunBack.tcData.push(0.0, 1.0);
        gunBack.tcData.push(1.0, 1.0);
        gunBack.tcData.push(1.0, 0.0);

        gunBack.indexData.push(s, s+1, s+2);
        s += 3;
        gunBack.length += 3;

        gunBack.poData.push(6.6, 1.2, -0.5);
        gunBack.poData.push(5, 0.0, -0.5);
        gunBack.poData.push(4.2, 1.07, -0.5);

        gunBack.coData.push(0, 0, 0);
        gunBack.coData.push(0, 0, 0);
        gunBack.coData.push(0, 0, 0);

        gunBack.tcData.push(0.0, 0.0);
        gunBack.tcData.push(0.0, 1.0);
        gunBack.tcData.push(1.0, 1.0);
        gunBack.tcData.push(1.0, 0.0);

        gunBack.indexData.push(s, s+1, s+2);
        s += 3;
        gunBack.length += 3;

        gunBack.poData.push(6.6, 1.2, 0.5);
        gunBack.poData.push(6, 0, 0.5);
        gunBack.poData.push(5, 0, 0.5);

        gunBack.coData.push(0, 0, 0);
        gunBack.coData.push(0, 0, 0);
        gunBack.coData.push(0, 0, 0);

        gunBack.tcData.push(0.0, 0.0);
        gunBack.tcData.push(0.0, 1.0);
        gunBack.tcData.push(1.0, 1.0);
        gunBack.tcData.push(1.0, 0.0);

        gunBack.indexData.push(s, s+1, s+2);
        s += 3;
        gunBack.length += 3;

        gunBack.poData.push(6.6, 1.2, -0.5);
        gunBack.poData.push(6, 0, -0.5);
        gunBack.poData.push(5, 0, -0.5);

        gunBack.coData.push(0, 0, 0);
        gunBack.coData.push(0, 0, 0);
        gunBack.coData.push(0, 0, 0);

        gunBack.tcData.push(0.0, 0.0);
        gunBack.tcData.push(0.0, 1.0);
        gunBack.tcData.push(1.0, 1.0);
        gunBack.tcData.push(1.0, 0.0);

        gunBack.indexData.push(s, s+1, s+2);
        s += 3;
        gunBack.length += 3;

        gunBack.poData.push(6.6, 1.2, 0.5);
        gunBack.poData.push(6.6, 1.2, -0.5);
        gunBack.poData.push(6, 0, -0.5);
        gunBack.poData.push(6, 0, 0.5);

        gunBack.coData.push(1, 0, 0);
        gunBack.coData.push(0.6, 0, 0);
        gunBack.coData.push(0, 0, 0);
        gunBack.coData.push(0, 0, 0);

        gunBack.tcData.push(0.0, 0.0);
        gunBack.tcData.push(0.0, 1.0);
        gunBack.tcData.push(1.0, 1.0);
        gunBack.tcData.push(1.0, 0.0);

        gunBack.indexData.push(s, s+1, s+2, s, s+2, s+3);
        s += 4;
        gunBack.length += 6;


        gunBack.poData.push(5, 0, 0.5);
        gunBack.poData.push(6, 0, 0.5);
        gunBack.poData.push(6.4, -2.7, 0.5);
        gunBack.poData.push(5, -2.7, 0.5);

        gunBack.coData.push(0, 0, 0);
        gunBack.coData.push(0, 0, 0);
        gunBack.coData.push(0, 0, 0);
        gunBack.coData.push(0, 0, 0);

        gunBack.tcData.push(0.0, 0.0);
        gunBack.tcData.push(0.0, 1.0);
        gunBack.tcData.push(1.0, 1.0);
        gunBack.tcData.push(1.0, 0.0);

        gunBack.indexData.push(s, s+1, s+2, s, s+2, s+3);
        s += 4;
        gunBack.length += 6;


        gunBack.poData.push(5, 0, -0.5);
        gunBack.poData.push(6, 0, -0.5);
        gunBack.poData.push(6.4, -2.7, -0.5);
        gunBack.poData.push(5, -2.7, -0.5);

        gunBack.coData.push(0, 0, 0);
        gunBack.coData.push(0, 0, 0);
        gunBack.coData.push(0, 0, 0);
        gunBack.coData.push(0, 0, 0);

        gunBack.tcData.push(0.0, 0.0);
        gunBack.tcData.push(0.0, 1.0);
        gunBack.tcData.push(1.0, 1.0);
        gunBack.tcData.push(1.0, 0.0);

        gunBack.indexData.push(s, s+1, s+2, s, s+2, s+3);
        s += 4;
        gunBack.length += 6;
        

        gunBack.poData.push(6, 0, 0.5);
        gunBack.poData.push(6, 0, -0.5);
        gunBack.poData.push(6.4, -2.7, -0.5);
        gunBack.poData.push(6.4, -2.7, 0.5);
     
        gunBack.coData.push(1, 0, 0);
        gunBack.coData.push(0, 0, 0);
        gunBack.coData.push(0, 0, 0);
        gunBack.coData.push(0, 0, 0);

        gunBack.tcData.push(0.0, 0.0);
        gunBack.tcData.push(0.0, 1.0);
        gunBack.tcData.push(1.0, 1.0);
        gunBack.tcData.push(1.0, 0.0);

        gunBack.indexData.push(s, s+1, s+2, s, s+2, s+3);
        s += 4;
        gunBack.length += 6;

        webgl.bindBuffer(webgl.ARRAY_BUFFER, gunBack.poBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(gunBack.poData), webgl.STATIC_DRAW);

        webgl.bindBuffer(webgl.ARRAY_BUFFER, gunBack.coBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(gunBack.coData), webgl.STATIC_DRAW);


        webgl.bindBuffer(webgl.ARRAY_BUFFER, gunBack.tcBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(gunBack.tcData), webgl.STATIC_DRAW);

        webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, gunBack.indexBuf);
        webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(gunBack.indexData), webgl.STATIC_DRAW);
    })();


    tmp = [];
    s = 0;

    //gunAim

    (function() {
        gunAim.poData.push(-5, 0, 0);
        gunAim.poData.push(5, 0, 0);
        gunAim.poData.push(0, -5, 0);
        gunAim.poData.push(0, 5, 0);

        gunAim.coData.push(1, 1, 1);
        gunAim.coData.push(1, 1, 1);
        gunAim.coData.push(1, 1, 1);
        gunAim.coData.push(1, 1, 1);

        gunAim.length = 4;

        webgl.bindBuffer(webgl.ARRAY_BUFFER, gunAim.poBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(gunAim.poData), webgl.STATIC_DRAW);
        webgl.bindBuffer(webgl.ARRAY_BUFFER, gunAim.coBuf);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(gunAim.coData), webgl.STATIC_DRAW);
    })();

    return gun;
};
    