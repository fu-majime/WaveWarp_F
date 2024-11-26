#version 460 core
#define TAU 6.28318530718

in vec2 TexCoord;

layout(location = 0) out vec4 FragColor;

uniform sampler2D texture0;
uniform vec2 resolution;
uniform float time;
uniform float height;
uniform float width;
uniform float rot;
uniform mat2 rot1;
uniform mat2 rot2;
uniform float period;
uniform int shape;
uniform float phase;
uniform int mirror;
uniform int fix;

float SetEdgeFix(int fix);
float waveFunction(float a, float A);

void main() {
    vec2 TexCoord_1 = ((TexCoord - 0.5) * resolution * rot1) / resolution + 0.5;
    vec2 warpedTexCoord;
    float edgeFix = SetEdgeFix(fix);
    float wave = waveFunction(TexCoord_1.x, resolution.x);
    if (mirror == 1) {
        float scalingFactor = height / (resolution.x * abs(sin(rot)) + resolution.y * abs(cos(rot)));
        warpedTexCoord = TexCoord_1 + edgeFix * vec2(0,
            (1.0 - 2.0 * TexCoord_1.y) *  scalingFactor * ((2.0 / scalingFactor - 1) * wave - 1) / (3.0 * wave - 5.0 + 2.0 / scalingFactor));
    } else {
        float scalingFactor = height/resolution.y;
        warpedTexCoord = TexCoord_1 + edgeFix * vec2(0,
            scalingFactor * wave);  
    }
    vec2 TexCoord_2 = ((warpedTexCoord - 0.5) * resolution * rot2) / resolution + 0.5;
    FragColor = texture(texture0, TexCoord_2);
}

float SetEdgeFix(int fix) {
    if (fix == 1) {
        return 1;
    } else if (fix == 2) {
        return smoothstep(0.0, 0.2, TexCoord.y) * smoothstep(1.0, 0.8, TexCoord.y) * 
                  smoothstep(0.0, 0.2, TexCoord.x) * smoothstep(1.0, 0.8, TexCoord.x);
    } else if (fix == 3) {
        return smoothstep(0.0, 0.2, TexCoord.y) * smoothstep(1.0, 0.8, TexCoord.y);
    } else if (fix == 4) {
        return smoothstep(0.0, 0.2, TexCoord.x) * smoothstep(1.0, 0.8, TexCoord.x);
    } else if (fix == 5) {
        return smoothstep(0.0, 0.2, TexCoord.y);
    } else if (fix == 6) {
        return smoothstep(1.0, 0.8, TexCoord.y);
    } else if (fix == 7) {
        return smoothstep(0.0, 0.2, TexCoord.x);
    } else if (fix == 8) {
        return smoothstep(1.0, 0.8, TexCoord.x);
    }
    return 1;
}

float waveFunction(float a, float A) {
    float base = (a - 0.5) * A / width + phase;
    if (period > 0) {
        base += time / period;
    }

    if (shape == 1) { // サイン
        return sin(TAU * base);
    } else if (shape == 2) { // 矩形
        return sign(sin(TAU * base));
    } else if (shape == 3) { // 三角形
        return (1.0 - 4.0 * abs(0.5 - fract(base + 0.25)));
    } else if (shape == 4) { // のこぎり(正)
        return 2.0 * fract(base) - 1.0;
    } else if (shape == 5) { // のこぎり(負)
        return 1.0 - 2.0 * fract(base);
    } else if (shape == 6) { // 円形
        float r = fract(base);
        return max(sqrt(-16.0 * r * r + 8.0 * r), -sqrt(-16.0 * r * r + 24.0 * r - 8.0));
    } else if (shape == 7) { // 半円形(正)
        float r = fract(base);
        return sqrt(-16.0 * r * r + 16.0 * r) - 1;
    } else if (shape == 8) { // 半円形(負)
        float r = fract(base);
        return 1 - sqrt(-16.0 * r * r + 16.0 * r);
    }
    return 0;
}