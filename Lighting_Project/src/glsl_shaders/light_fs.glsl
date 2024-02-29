// this is the fragment (or pixel) shader
// Most code gotten from example 8.3 of the book source code
// The main changes we made were to get rid of the light array as we want the 
// light renderable class to handle that aspect

precision mediump float; 
    // sets the precision for floating point computation

// The object that fetches data from texture.
// Must be set outside the shader.
uniform sampler2D uSampler;

// Color of pixel
uniform vec4 uPixelColor;  
uniform vec4 uGlobalAmbientColor; // this is shared globally
uniform float uGlobalAmbientIntensity;

// Light information

struct Light  {
    vec2 Position;   // in pixel space!
    vec4 Color;
    float Near;     // distance in pixel space
    float Far;     // distance in pixel space
    float Intensity;
};
uniform Light uLight;  // Light source

// The "varying" keyword is for signifying that the texture coordinate will be
// interpolated and thus varies. 
varying vec2 vTexCoord;


vec4 LightEffect(Light lgt)
{
    vec4 result = vec4(0);
    float strength = 0.0;
    float dist = length(lgt.Position.xy - gl_FragCoord.xy);
    if (dist <= lgt.Far) {
        if (dist <= lgt.Near)
            strength = 1.0;  //  no attenuation
        else {
            // simple quadratic drop off
            float n = dist - lgt.Near;
            float d = lgt.Far - lgt.Near;
            strength = smoothstep(0.0, 1.0, 1.0-(n*n)/(d*d)); // blended attenuation
        }   
    }
    result = strength * lgt.Intensity * lgt.Color;
    return result;
}

void main(void)  {
    // simple tint based on uPixelColor setting
    vec4 textureMapColor = texture2D(uSampler, vec2(vTexCoord.s, vTexCoord.t));
    vec4 lgtResults = uGlobalAmbientIntensity * uGlobalAmbientColor;

    // now decide if we should illuminate by the light
    lgtResults +=  LightEffect(uLight);
    lgtResults *= textureMapColor;

    // tint the textured area, and leave transparent area as defined by the texture
    vec3 r = vec3(lgtResults) * (1.0-uPixelColor.a) + vec3(uPixelColor) * uPixelColor.a;
    vec4 result = vec4(r, textureMapColor.a);

    gl_FragColor = result;
}