uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
uniform sampler2D img1;
uniform float waveLength;
uniform float ratio;
varying vec2 vUv;
varying vec4 vPosition;

void main()	{
	vec2 p = 7.68*(gl_FragCoord.xy/resolution.xy - vec2(0.5,1.0)) - vec2(mouse.x,-15);
	vec2 i = p;

	float c = 0.;
		for(int n = 0; n<4; n++){
			float t = ( 1.0 - ( 10.0 / float( n + 10 ) ) ) * time*0.3;
			float ix = i.x + mouse.x;
			float iy = i.y + mouse.y;
			i = vec2( cos( t - ix ) + sin( t + iy ), sin( t - iy ) + cos( t + ix ) ) + p;
			c += float( n ) / length( vec2( p.x / ( sin( t + i.x ) / 1.1 ), p.y / ( cos( t + i.y ) / 1.1 ) ) ) * 20.0;
		}
		
		c /= 190.;
		c = 1.8 - sqrt( c );


		vec4 tx = texture2D( img1, vec2(vUv.s + 0.015, vUv.t + 0.015)) * 
		texture2D( img1, vec2( vUv.s + cos(c) * mouse.x * 0.5, vUv.t + cos(c) * mouse.y * 0.5 ) ) 
		* 0.25;
		vec4 newTx = vec4(tx.rgb, tx.a * ratio);
		vec4 ct = c * c * c * newTx;
		gl_FragColor = texture2D( img1, vec2( vUv.s + c*mouse.x * 0.75, vUv.t +  c*mouse.y * 0.75 ) );
		gl_FragColor = (ct - newTx * newTx - vec4( tx.rgb * 0.5, tx.a * vPosition.z ))*ratio;


}