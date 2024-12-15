const frag = `

  precision mediump float;

  uniform float u_time;
  uniform vec2 u_resolution;
  uniform float strength;
  uniform float dpi; // this helps make images more "responsive" throughout different devices

  uniform sampler2D image;

  varying vec2 v_textcoord;

  vec4 sampleColor(vec2 uv) {
      vec4 color = texture2D(image, uv);
      
      // The following if basically "turns off" all of the color channels, and also the alpha channel, creating this wobbling effect on the edges of the image as well
      if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
          color = vec4(0.0);
      }
      
      return color;
  }

	${includes}

  void main(void)
{
    vec2 uv = (gl_FragCoord.xy - (100.0 * dpi)) / (u_resolution.xy - (200.0 * dpi));
    
    // uv.y = 1.0 - uv.y; only needed on kodeLife
    
    vec2 distortion = 0.04 * pow(strength, 0.5) * vec2(
        sin(u_time + uv.x * 8.0 + uv.y * 5.0), // results in a value between -1 and +1
        cos(u_time + uv.x * 6.0 + uv.y * 8.0)
    ); // again, sin and cos together with time makes things move in circle
    
    distortion *= mix(0.9, 1.1, rand(uv)); // adds grain effect, rand returns numbers between 0 and 1, but we use the mix function to change the output and to weaken the effect
    
    vec4 blackChannel = sampleColor(uv + distortion * rotation2d(4.0)); // this basically adds a black square background to the images
    blackChannel.r = 0.0;
    blackChannel.g = 0.0;
    blackChannel.b = 0.0;

    // Color shift
    
    vec4 redChannel = sampleColor(uv + distortion * rotation2d(1.0));
    redChannel.g = 0.0;
    redChannel.b = 0.0;
    redChannel.a = redChannel.r; // this enables a kind of "see through" effect, but in this case it would only work if the image has red on it
    
    vec4 greenChannel = sampleColor(uv + distortion * rotation2d(2.0));
    greenChannel.r = 0.0;
    greenChannel.b = 0.0;
    greenChannel.a = greenChannel.g;
    
    vec4 blueChannel = sampleColor(uv - distortion * rotation2d(3.0));
    blueChannel.r = 0.0;
    blueChannel.g = 0.0;
    blueChannel.a = blueChannel.b;
    
    vec4 color = blackChannel + redChannel + greenChannel + blueChannel;
    
    gl_FragColor = color;
}

`;
