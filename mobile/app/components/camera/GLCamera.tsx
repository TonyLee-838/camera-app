import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
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
//计算顶点位置 提供坐标值

const fragShaderSource = `#version 300 es
precision highp float;
uniform sampler2D cameraTexture;
in vec2 uv;
out vec4 fragColor;
void main() {
  fragColor = texture(cameraTexture, uv);
}`;
// 使用纹理形式的数据获取方式 能使着色程序任意读取（数据的序列）

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
    cameraTexture = await glViewRef.current.createCameraTextureAsync(
      cameraRef.current
    );
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

    const positionAttrib = gl.getAttribLocation(program, 'position'); // 得到position 变量的位置
    gl.enableVertexAttribArray(positionAttrib); // 顶点着色器能访问到Buffer

    const buffer = gl.createBuffer(); // 创建缓冲对象来保存顶点的数据 放到ArrayBuffer之中
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    const verts = new Float32Array([
      // 三角形三点坐标
      -2, 0, 0, -2, 2, 2,
    ]); // 使用Float32Array 传送数据到GPU
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

    gl.vertexAttribPointer(
      positionAttrib, //顶点在哪
      2, //2D
      gl.FLOAT, //数据类型
      false,
      0, // step
      0 //offset
    ); // 从Buffer之中得到数据
    gl.uniform1i(gl.getUniformLocation(program, 'cameraTexture'), 0);

    const loop = () => {
      requestAnimationFrame(loop);
      gl.clearColor(0, 0, 1, 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.bindTexture(gl.TEXTURE_2D, cameraTexture);
      gl.drawArrays(gl.TRIANGLES, 0, verts.length / 2); // 三角模式画图、由0开始 使用（verts.length / 2 ）=== 3 个点
      gl.endFrameEXP();
    };
    loop();
  };

  return (
    <View style={styles.container}>
      <Camera
        style={{ width: '100%', height: '100%' }}
        ref={cameraRef}
        defaultOnFocusComponent={true}
      />
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
