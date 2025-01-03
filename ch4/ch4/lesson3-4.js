main();

function main() {
  /*========== Create a WebGL Context ==========*/
  const canvas = document.querySelector("#c");
  const gl = canvas.getContext('webgl');
  if (!gl) {
      console.log('WebGL unavailable');
  } else {
      console.log('WebGL is good to go');
  }

  /*========== Define and Store the Geometry ==========*/
  const squares = [
      // front face
      -0.3 , -0.3, -0.3,
        0.3, -0.3, -0.3,
        0.3, 0.3, -0.3,  

      -0.3, -0.3, -0.3,
      -0.3, 0.3, -0.3,
        0.3, 0.3, -0.3,                  

      // back face
      -0.2, -0.2, 0.3,
      0.4, -0.2, 0.3,
      0.4, 0.4, 0.3, 

      -0.2, -0.2, 0.3,
      -0.2, 0.4, 0.3,
      0.4, 0.4, 0.3, 
      
      // top face
      -0.3, 0.3, -0.3,
      0.3, 0.3, -0.3,
      -0.2, 0.4, 0.3,

      0.4, 0.4, 0.3,
      0.3, 0.3, -0.3,
      -0.2, 0.4, 0.3,

      // bottom face
      -0.3, -0.3, -0.3,
      0.3, -0.3, -0.3,
      -0.2, -0.2, 0.3,

      0.4, -0.2, 0.3,
      0.3, -0.3, -0.3,
      -0.2, -0.2, 0.3,

      // left face
      -0.3, -0.3, -0.3,
      -0.3, 0.3, -0.3,
      -0.2, -0.2, 0.3,

      -0.2, 0.4, 0.3,
      -0.3, 0.3, -0.3,
      -0.2, -0.2, 0.3,

      // right face
      0.3, -0.3, -0.3,
      0.3, 0.3, -0.3,
      0.4, -0.2, 0.3,

      0.4, 0.4, 0.3,
      0.3, 0.3, -0.3,
      0.4, -0.2, 0.3
  ];
    
  // buffer
  const origBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, origBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squares), gl.STATIC_DRAW);

  const squareColors = [
    0.0,  0.0,  1.0,  1.0,  // front face
    0.0,  0.0,  1.0,  1.0,
    0.0,  0.0,  1.0,  1.0,
    0.0,  0.0,  1.0,  1.0,
    0.0,  0.0,  1.0,  1.0,
    0.0,  0.0,  1.0,  1.0,
    
    1.0,  0.0,  0.0,  1.0,  // back face
    1.0,  0.0,  0.0,  1.0,
    1.0,  0.0,  0.0,  1.0,
    1.0,  0.0,  0.0,  1.0,
    1.0,  0.0,  0.0,  1.0,
    1.0,  0.0,  0.0,  1.0,
    
    0.0,  1.0,  0.0,  1.0,  // top face
    0.0,  1.0,  0.0,  1.0,
    0.0,  1.0,  0.0,  1.0,
    0.0,  1.0,  0.0,  1.0,
    0.0,  1.0,  0.0,  1.0,
    0.0,  1.0,  0.0,  1.0,

    1.0,  1.0,  0.0,  1.0,  // bottom face
    1.0,  1.0,  0.0,  1.0,
    1.0,  1.0,  0.0,  1.0,
    1.0,  1.0,  0.0,  1.0,
    1.0,  1.0,  0.0,  1.0,
    1.0,  1.0,  0.0,  1.0,

    1.0,  0.0,  1.0,  1.0,  // left face
    1.0,  0.0,  1.0,  1.0,
    1.0,  0.0,  1.0,  1.0,
    1.0,  0.0,  1.0,  1.0,
    1.0,  0.0,  1.0,  1.0,
    1.0,  0.0,  1.0,  1.0,

    0.0,  1.0,  1.0,  1.0,  // right face
    0.0,  1.0,  1.0,  1.0,
    0.0,  1.0,  1.0,  1.0,
    0.0,  1.0,  1.0,  1.0,
    0.0,  1.0,  1.0,  1.0,
    0.0,  1.0,  1.0,  1.0
  ];
    
  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squareColors), gl.STATIC_DRAW);

  /*========== Shaders ==========*/

  const vsSource = `
    attribute vec4 aPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aPosition;
      vColor = aVertexColor;
  }
  `;

  const fsSource = `
      varying lowp vec4 vColor;

      void main() {
          gl_FragColor = vColor;
  }
  `;

  //create shaders
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(vertexShader, vsSource);
  gl.shaderSource(fragmentShader, fsSource);

  // compile shaders
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(vertexShader));
      gl.deleteShader(vertexShader);
      return null;
    }
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(fragmentShader));
    gl.deleteShader(fragmentShader);
    return null;
  }

  // create program
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // link program
  gl.linkProgram(program);
  gl.useProgram(program);
  
  let cubeRotation = 0.0;
  let rotateRight = false;

  // Add keyboard event listener to detect "Enter" key press
  window.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      rotateRight = true;
    }
  });

  window.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
      rotateRight = false;
    }
  });

  /*========== Connect the attribute with the vertex shader ==========*/
  function render(now){       
    now *= 0.001;
    const deltaTime = now;

    const posAttribLocation = gl.getAttribLocation(program, "aPosition");
    gl.bindBuffer(gl.ARRAY_BUFFER, origBuffer);
    gl.vertexAttribPointer(posAttribLocation, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posAttribLocation);

    const colorAttribLocation = gl.getAttribLocation(program, "aVertexColor");
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(colorAttribLocation, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorAttribLocation);

    
    const modelMatrixLocation = gl.getUniformLocation(program, 'uModelViewMatrix');
    const projMatrixLocation = gl.getUniformLocation(program, 'uProjectionMatrix');
    
    const fieldOfView = 45 * Math.PI / 180;   // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
  
    mat4.perspective(projectionMatrix,
                     fieldOfView,
                     aspect,
                     zNear,
                     zFar);
    
    const modelViewMatrix = mat4.create();
    
    mat4.translate(modelViewMatrix,     // destination matrix
      modelViewMatrix,     // matrix to translate
      [-0.0, 0.0, -2.0]);  // amount to translate
    mat4.rotate(modelViewMatrix,  // destination matrix
          modelViewMatrix,  // matrix to rotate
          cubeRotation,     // amount to rotate in radians
          [0, 0, 1]);       // axis to rotate around (Z)
    mat4.rotate(modelViewMatrix,  // destination matrix
          modelViewMatrix,  // matrix to rotate
          cubeRotation,// amount to rotate in radians
          [0, 1, 0]);       // axis to rotate around (X)
    
    gl.uniformMatrix4fv(projMatrixLocation, false, projectionMatrix);
    gl.uniformMatrix4fv(modelMatrixLocation, false, modelViewMatrix);
            
    /*========== Drawing ========== */
    gl.clearColor(1, 1, 1, 1);
    
    gl.enable(gl.DEPTH_TEST);
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // Draw the points on the screen
    const mode = gl.TRIANGLES;
    const first = 0;
    const count = 36;  // 6 faces * 2 triangles per face * 3 vertices per triangle
    gl.drawArrays(mode, first, count);   

    // If "Enter" is pressed, rotate to the right
    if (rotateRight) {
      cubeRotation += deltaTime; // Rotate to the right
    }
    
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}
