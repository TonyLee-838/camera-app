import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { Camera } from 'expo-camera';
import { fromTexture } from '@tensorflow/tfjs-react-native';
import * as tf from '@tensorflow/tfjs';

const vertShaderSource = `#version 300 es
precision highp float;
in vec2 position;
out vec2 uv;
void main() {
  uv = position;
  gl_Position = vec4(1.0 - 2.0 * position, 0, 1);
}`;
const fragShaderSource = `#version 300 es
precision highp float;
uniform sampler2D cameraTexture;
in vec2 uv;
out vec4 fragColor;
void main() {
  fragColor = texture(cameraTexture, uv);
}`;

let cameraTexture;
let _gl: WebGL2RenderingContext;

const GLCameraScreen = forwardRef((props, ref) => {
  const cameraRef = useRef<Camera>(null!);
  const glViewRef = useRef<GLView>(null!);
  // let camera;
  // let glView;

  const targetDims = {
    height: 1500,
    width: 750,
    depth: 3,
  };
  let textureDims;
  if (Platform.OS === 'ios') {
    textureDims = {
      height: 1920,
      width: 1080,
      depth: 3,
    };
  } else {
    textureDims = {
      height: 1200,
      width: 1600,
      depth: 3,
    };
  }

  useImperativeHandle(ref, () => ({
    captureImage,
    getRealTimeImage,
  }));

  const captureImage = async () => {
    if (!cameraRef.current) return null;
    const image = await cameraRef.current.takePictureAsync();
    return image;
  };

  const getRealTimeImage = () => {
    return tf.tidy(() => {
      return fromTexture(_gl, cameraTexture, textureDims, targetDims);
    });
  };

  const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    _gl = gl;
    cameraTexture = await glViewRef.current.createCameraTextureAsync(cameraRef.current);
    // cameraTexture = await glView.createCameraTextureAsync(camera);

    const vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, vertShaderSource);
    gl.compileShader(vertShader);
    const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fragShaderSource);
    gl.compileShader(fragShader);
    const program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    gl.validateProgram(program);
    gl.useProgram(program);
    const positionAttrib = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionAttrib);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    const verts = new Float32Array([-2, 0, 0, -2, 2, 2]);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
    gl.vertexAttribPointer(positionAttrib, 2, gl.FLOAT, false, 0, 0);
    gl.uniform1i(gl.getUniformLocation(program, 'cameraTexture'), 0);
    const loop = () => {
      requestAnimationFrame(loop);
      gl.clearColor(0, 0, 1, 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.bindTexture(gl.TEXTURE_2D, cameraTexture);
      gl.drawArrays(gl.TRIANGLES, 0, verts.length / 2);
      gl.endFrameEXP();
    };
    loop();
  };

  return (
    <View style={styles.container}>
      <Camera style={{ width: '100%', height: '100%' }} ref={cameraRef} defaultOnFocusComponent={true} />
      <GLView
        style={{ width: '100%', height: '100%' }}
        onContextCreate={onContextCreate}
        ref={glViewRef}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default GLCameraScreen;
