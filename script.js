/* =====================================================================
   THE FUNNY PEOPLE FACTORY -- script.js
   =====================================================================
   HOW THE CHARACTER IS BUILT
   The character is a single SVG (see index.html) with one empty <g> per
   swappable feature: #part-hair, #part-eyes, #part-glasses, #part-facial,
   #part-mouth, #part-shirt, #part-pants, #part-shoes.

   Below, each feature has an array of options. Every option is just:
     { name: "Label shown in the UI", svg: `...SVG markup...` }
   render() looks up the currently-selected option for each feature and
   drops its `svg` string straight into the matching <g> as innerHTML.

   SHARED COORDINATE SYSTEM
   Every snippet is drawn against the same 320x490 canvas (the character
   SVG's viewBox), so options from different arrays always line up:
     - Head: circle centered at (160, 144), radius 72
     - Eyes: left eye ~(130, 130), right eye ~(190, 130)
     - Mouth: centered around (160, 188)
     - Torso/shirt: rounded rect from (90, 222) to (230, 348)
     - Legs/pants: left leg x=108-152, right leg x=168-212, y=345-435
     - Feet/shoes: left ~x=130, right ~x=190, roughly y=428-465
   Colors reuse a few hex values by convention: #201530 for outlines,
   #E8B48A for skin, plus #FBF3E4/cream, #FF5A5F/coral, #FFC93C/marigold
   and #2EC4B6/teal, matching the palette defined in style.css.
   ===================================================================== */

// ---- EYES: left eye ~(130,130), right eye ~(190,130) ----
const EYES = [
    // Cross-eyed: big white circles, each pupil offset in a different direction
  { name:"Googly", svg:`
    <circle cx="130" cy="130" r="19" fill="#fff" stroke="#201530" stroke-width="3"/>
    <circle cx="190" cy="130" r="19" fill="#fff" stroke="#201530" stroke-width="3"/>
    <circle cx="123" cy="134" r="7" fill="#201530"/>
    <circle cx="198" cy="124" r="7" fill="#201530"/>
  `},
    // Left eye closed (a curved line), right eye open with a pupil
  { name:"Wink", svg:`
    <path d="M112 130 Q130 142 148 130" fill="none" stroke="#201530" stroke-width="5" stroke-linecap="round"/>
    <circle cx="190" cy="128" r="17" fill="#fff" stroke="#201530" stroke-width="3"/>
    <circle cx="192" cy="128" r="7" fill="#201530"/>
  `},
    // Concentric rings stand in for a dizzy, hypnotized spiral
  { name:"Hypno spiral", svg:`
    <circle cx="130" cy="130" r="18" fill="#fff" stroke="#201530" stroke-width="3"/>
    <circle cx="130" cy="130" r="11" fill="none" stroke="#201530" stroke-width="2.5"/>
    <circle cx="130" cy="130" r="5" fill="none" stroke="#201530" stroke-width="2.5"/>
    <circle cx="190" cy="130" r="18" fill="#fff" stroke="#201530" stroke-width="3"/>
    <circle cx="190" cy="130" r="11" fill="none" stroke="#201530" stroke-width="2.5"/>
    <circle cx="190" cy="130" r="5" fill="none" stroke="#201530" stroke-width="2.5"/>
  `},
    // Sparkle shapes instead of pupils
  { name:"Starstruck", svg:`
    <polygon points="130,110 136,124 150,130 136,136 130,150 124,136 110,130 124,124" fill="#FFC93C" stroke="#201530" stroke-width="2"/>
    <polygon points="190,110 196,124 210,130 196,136 190,150 184,136 170,130 184,124" fill="#FFC93C" stroke="#201530" stroke-width="2"/>
  `},
    // Half-closed eyelids, plus two floating "z" marks for a nap
  { name:"Sleepy", svg:`
    <path d="M111 128 Q130 119 149 128 L149 135 Q130 128 111 135 Z" fill="#201530"/>
    <path d="M171 128 Q190 119 209 128 L209 135 Q190 128 171 135 Z" fill="#201530"/>
    <text x="222" y="108" font-family="'Space Grotesk',sans-serif" font-size="17" fill="rgba(32,21,48,.45)" font-weight="700">z</text>
    <text x="234" y="94" font-family="'Space Grotesk',sans-serif" font-size="12" fill="rgba(32,21,48,.35)" font-weight="700">z</text>
  `},
    // Huge whites with tiny pupils, and eyebrows raised high
  { name:"Shocked", svg:`
    <circle cx="130" cy="130" r="22" fill="#fff" stroke="#201530" stroke-width="3"/>
    <circle cx="190" cy="130" r="22" fill="#fff" stroke="#201530" stroke-width="3"/>
    <circle cx="130" cy="130" r="4" fill="#201530"/>
    <circle cx="190" cy="130" r="4" fill="#201530"/>
    <path d="M107 100 Q130 89 151 100" fill="none" stroke="#201530" stroke-width="4" stroke-linecap="round"/>
    <path d="M169 100 Q190 89 213 100" fill="none" stroke="#201530" stroke-width="4" stroke-linecap="round"/>
  `}
];


// ---- MOUTHS: centered around (160,188), just below the eyes ----
const MOUTHS = [
    // Open smile with two front teeth and a visible gap between them
  { name:"Gap-tooth grin", svg:`
    <path d="M126 184 Q160 208 194 184 Q160 202 126 184 Z" fill="#7A2E3A"/>
    <path d="M126 184 Q160 208 194 184" fill="none" stroke="#201530" stroke-width="4" stroke-linecap="round"/>
    <rect x="146" y="184" width="12" height="14" rx="2" fill="#fff" stroke="#201530" stroke-width="1.5"/>
    <rect x="164" y="184" width="12" height="14" rx="2" fill="#fff" stroke="#201530" stroke-width="1.5"/>
  `},
    // Smile with a pink tongue poking out to one side
  { name:"Tongue out", svg:`
    <path d="M132 182 Q160 204 188 182" fill="none" stroke="#201530" stroke-width="5" stroke-linecap="round"/>
    <ellipse cx="168" cy="196" rx="14" ry="10" fill="#FF7A8A" stroke="#201530" stroke-width="2"/>
    <line x1="168" y1="188" x2="168" y2="204" stroke="#E15B6D" stroke-width="1.5"/>
  `},
    // Closed smirk with a single tooth poking over the lip
  { name:"Snaggletooth", svg:`
    <path d="M130 188 Q160 198 190 182" fill="none" stroke="#201530" stroke-width="5" stroke-linecap="round"/>
    <polygon points="172,188 180,188 176,200" fill="#fff" stroke="#201530" stroke-width="1.5"/>
  `},
    // Small round "o" mouth with a music note floating beside it
  { name:"Whistling", svg:`
    <circle cx="160" cy="190" r="9" fill="#7A2E3A" stroke="#201530" stroke-width="3"/>
    <text x="188" y="176" font-size="16" fill="rgba(32,21,48,.5)">♪</text>
  `},
    // Open mouth with a drip hanging below it
  { name:"Drooling", svg:`
    <ellipse cx="160" cy="188" rx="20" ry="12" fill="#7A2E3A" stroke="#201530" stroke-width="3"/>
    <path d="M182 194 Q188 204 182 214 Q176 204 182 194 Z" fill="#8FD3E8" stroke="#3AA0BD" stroke-width="1.5"/>
  `},
    // Wide open grin showing four teeth
  { name:"Big happy grin", svg:`
    <path d="M120 180 Q160 224 200 180 Q160 198 120 180 Z" fill="#7A2E3A"/>
    <path d="M120 180 Q160 224 200 180" fill="none" stroke="#201530" stroke-width="5" stroke-linecap="round"/>
    <rect x="134" y="182" width="14" height="12" fill="#fff" stroke="#201530" stroke-width="1.2"/>
    <rect x="150" y="182" width="14" height="12" fill="#fff" stroke="#201530" stroke-width="1.2"/>
    <rect x="166" y="182" width="14" height="12" fill="#fff" stroke="#201530" stroke-width="1.2"/>
    <rect x="182" y="182" width="14" height="12" fill="#fff" stroke="#201530" stroke-width="1.2"/>
  `}
];


// ---- HAIRS: positioned on/above the head (head spans roughly x88-232, y72-216) ----
const HAIRS = [
    // One zig-zag polygon makes a spiked strip down the center
  { name:"Mohawk", svg:`
    <polygon points="140,95 148,45 156,70 164,28 172,70 180,95" fill="#FF3D7F" stroke="#201530" stroke-width="3" stroke-linejoin="round"/>
  `},
    // A faint shine ellipse plus a single curly strand
  { name:"Bald + one strand", svg:`
    <ellipse cx="160" cy="100" rx="66" ry="32" fill="#F4C97A" opacity=".2"/>
    <path d="M158 74 Q154 54 164 48 Q170 56 162 74" fill="none" stroke="#5C3A21" stroke-width="4" stroke-linecap="round"/>
  `},
    // A ring of overlapping circles traces the afro's outline -- deliberately
  // NOT a filled blob, so the face underneath stays visible
  { name:"Giant afro", svg:`
    <g fill="#3B2A22" stroke="#201530" stroke-width="2.5">
      <circle cx="96" cy="116" r="26"/>
      <circle cx="120" cy="78" r="28"/>
      <circle cx="152" cy="58" r="30"/>
      <circle cx="186" cy="58" r="30"/>
      <circle cx="218" cy="78" r="28"/>
      <circle cx="242" cy="116" r="26"/>
      <circle cx="90" cy="163" r="18"/>
      <circle cx="248" cy="163" r="18"/>
    </g>
  `},
    // A bun plus three leaf-shaped triangles sticking out the top
  { name:"Pineapple", svg:`
    <ellipse cx="160" cy="92" rx="24" ry="18" fill="#8B5E34" stroke="#201530" stroke-width="3"/>
    <polygon points="160,48 172,82 148,82" fill="#4C9A2A" stroke="#201530" stroke-width="2.5"/>
    <polygon points="140,53 158,84 132,77" fill="#4C9A2A" stroke="#201530" stroke-width="2.5"/>
    <polygon points="180,53 162,84 188,77" fill="#4C9A2A" stroke="#201530" stroke-width="2.5"/>
  `},
    // Three thin curved strokes swept across an otherwise bare scalp
  { name:"Combover", svg:`
    <path d="M94 128 Q140 88 222 116" fill="none" stroke="#5C4033" stroke-width="7" stroke-linecap="round"/>
    <path d="M94 138 Q140 100 218 128" fill="none" stroke="#5C4033" stroke-width="6" stroke-linecap="round"/>
    <path d="M94 148 Q140 112 212 140" fill="none" stroke="#5C4033" stroke-width="5" stroke-linecap="round"/>
  `},
    // Triangles radiating outward from points around the head's edge
  { name:"Mad scientist", svg:`
    <g stroke="#201530" stroke-width="2.5" fill="#8ED6E8">
      <polygon points="100,90 90,48 114,78"/>
      <polygon points="122,66 110,24 136,56"/>
      <polygon points="147,56 140,14 164,44"/>
      <polygon points="173,56 180,14 156,44"/>
      <polygon points="198,66 210,24 184,56"/>
      <polygon points="220,90 232,48 206,78"/>
      <polygon points="88,120 58,106 96,142"/>
      <polygon points="232,120 262,106 224,142"/>
    </g>
  `}
];


// ---- FACIALS: mustaches sit just above the mouth, beards/chops run down the jaw ----
const FACIALS = [
    // Empty on purpose -- this is the "no facial hair" option
  { name:"Clean shaven", svg:`` },
    // Two symmetrical curled paths above the mouth
  { name:"Handlebar mustache", svg:`
    <path d="M120 176 Q140 166 158 174 Q140 170 128 184 Q118 190 108 182 Q112 174 120 176 Z" fill="#3B2A22" stroke="#201530" stroke-width="2"/>
    <path d="M200 176 Q180 166 162 174 Q180 170 192 184 Q202 190 212 182 Q208 174 200 176 Z" fill="#3B2A22" stroke="#201530" stroke-width="2"/>
  `},
    // One big path from ear to ear down past the chin. Its inward curve
  // leaves the mouth peeking through rather than hiding it completely
  { name:"Lumberjack beard", svg:`
    <path d="M92 160 Q88 226 130 248 Q160 258 190 248 Q232 226 228 160 Q228 196 200 202 Q160 212 120 202 Q92 196 92 160 Z" fill="#5C4033" stroke="#201530" stroke-width="3"/>
  `},
    // Small triangular patch just below the mouth
  { name:"Goatee", svg:`
    <path d="M144 206 Q160 234 176 206 Q160 218 144 206 Z" fill="#3B2A22" stroke="#201530" stroke-width="2"/>
  `},
    // Two side patches along the jaw that don't connect across the chin
  { name:"Mutton chops", svg:`
    <path d="M90 138 Q82 188 106 214 Q116 198 108 158 Q104 143 90 138 Z" fill="#4A3323" stroke="#201530" stroke-width="2"/>
    <path d="M230 138 Q238 188 214 214 Q204 198 212 158 Q216 143 230 138 Z" fill="#4A3323" stroke="#201530" stroke-width="2"/>
  `}
];


// ---- GLASSES: reuses the same left/right eye positions as EYES, so any
// frame style lines up with any eye style underneath ----
const GLASSES = [
    // Empty on purpose -- this is the "no glasses" option
  { name:"None", svg:`` },
    // Thick rectangular frames with tape at the bridge
  { name:"Nerd glasses", svg:`
    <rect x="106" y="112" width="48" height="36" rx="4" fill="none" stroke="#201530" stroke-width="6"/>
    <rect x="166" y="112" width="48" height="36" rx="4" fill="none" stroke="#201530" stroke-width="6"/>
    <line x1="154" y1="128" x2="166" y2="128" stroke="#201530" stroke-width="6"/>
    <rect x="156" y="124" width="8" height="6" fill="#C7C2CC"/>
    <line x1="106" y1="124" x2="80" y2="116" stroke="#201530" stroke-width="5" stroke-linecap="round"/>
    <line x1="214" y1="124" x2="240" y2="116" stroke="#201530" stroke-width="5" stroke-linecap="round"/>
  `},
    // Star-shaped outlines only (fill="none"), so whatever the eyes are doing underneath still shows through
  { name:"Star glasses", svg:`
    <polygon points="130,100 137,116 154,120 138,128 141,146 130,136 119,146 122,128 106,120 123,116" fill="none" stroke="#FF3D7F" stroke-width="4" stroke-linejoin="round"/>
    <polygon points="190,100 197,116 214,120 198,128 201,146 190,136 179,146 182,128 166,120 183,116" fill="none" stroke="#FF3D7F" stroke-width="4" stroke-linejoin="round"/>
    <line x1="154" y1="120" x2="166" y2="120" stroke="#FF3D7F" stroke-width="4"/>
  `},
    // Solid dark lenses with a small highlight glint
  { name:"Sunglasses", svg:`
    <rect x="104" y="114" width="52" height="30" rx="15" fill="#201530"/>
    <rect x="164" y="114" width="52" height="30" rx="15" fill="#201530"/>
    <line x1="156" y1="126" x2="164" y2="126" stroke="#201530" stroke-width="5"/>
    <path d="M118 120 Q128 116 136 122" stroke="rgba(255,255,255,.5)" stroke-width="3" fill="none" stroke-linecap="round"/>
  `},
    // White frames with a squiggly "hypnotized" pattern inside each lens
  { name:"Joke spiral specs", svg:`
    <circle cx="130" cy="130" r="24" fill="#fff" stroke="#201530" stroke-width="4"/>
    <circle cx="190" cy="130" r="24" fill="#fff" stroke="#201530" stroke-width="4"/>
    <path d="M130 130 m-14,0 a14,14 0 1,0 28,0 a10,10 0 1,1 -20,0 a6,6 0 1,0 12,0" fill="none" stroke="#201530" stroke-width="2"/>
    <path d="M190 130 m-14,0 a14,14 0 1,0 28,0 a10,10 0 1,1 -20,0 a6,6 0 1,0 12,0" fill="none" stroke="#201530" stroke-width="2"/>
    <line x1="154" y1="130" x2="166" y2="130" stroke="#201530" stroke-width="4"/>
  `}
];


// ---- SHIRTS: one shared torso rectangle, x=90-230, y=222-348 ----
const SHIRTS = [
    // Teal base, a V-neck collar triangle, and clusters of dots as simple flowers
  { name:"Hawaiian", svg:`
    <rect x="90" y="222" width="140" height="126" rx="28" fill="#2EC4B6"/>
    <polygon points="160,222 178,246 142,246" fill="#FBF3E4"/>
    <g fill="#FFC93C" stroke="#201530" stroke-width="1">
      <circle cx="115" cy="260" r="5"/><circle cx="108" cy="270" r="4"/><circle cx="122" cy="272" r="4"/><circle cx="115" cy="278" r="4"/>
      <circle cx="205" cy="270" r="5"/><circle cx="198" cy="280" r="4"/><circle cx="212" cy="282" r="4"/><circle cx="205" cy="288" r="4"/>
      <circle cx="150" cy="312" r="5"/><circle cx="143" cy="322" r="4"/><circle cx="157" cy="324" r="4"/><circle cx="150" cy="330" r="4"/>
      <circle cx="185" cy="300" r="5"/><circle cx="178" cy="310" r="4"/><circle cx="192" cy="312" r="4"/><circle cx="185" cy="318" r="4"/>
    </g>
  `},
    // A <clipPath> keeps the stripes from poking outside the shirt's rounded corners
  { name:"Bold stripes", svg:`
    <rect x="90" y="222" width="140" height="126" rx="28" fill="#FBF3E4"/>
    <clipPath id="stripeClip"><rect x="90" y="222" width="140" height="126" rx="28"/></clipPath>
    <g clip-path="url(#stripeClip)" fill="#FF5A5F">
      <rect x="90" y="222" width="140" height="18"/>
      <rect x="90" y="258" width="140" height="18"/>
      <rect x="90" y="294" width="140" height="18"/>
      <rect x="90" y="330" width="140" height="18"/>
    </g>
  `},
    // Coral base with a staggered grid of dots
  { name:"Polka dot", svg:`
    <rect x="90" y="222" width="140" height="126" rx="28" fill="#FF5A5F"/>
    <g fill="#FBF3E4">
      <circle cx="112" cy="244" r="7"/><circle cx="148" cy="238" r="7"/><circle cx="184" cy="244" r="7"/><circle cx="210" cy="238" r="7"/>
      <circle cx="100" cy="272" r="7"/><circle cx="130" cy="268" r="7"/><circle cx="166" cy="272" r="7"/><circle cx="200" cy="268" r="7"/><circle cx="222" cy="276" r="7"/>
      <circle cx="112" cy="300" r="7"/><circle cx="148" cy="296" r="7"/><circle cx="184" cy="300" r="7"/><circle cx="210" cy="296" r="7"/>
      <circle cx="100" cy="328" r="7"/><circle cx="130" cy="324" r="7"/><circle cx="166" cy="328" r="7"/><circle cx="200" cy="324" r="7"/>
    </g>
  `},
    // Small cape triangles peek out from behind the shoulders, plus a sparkle emblem
  { name:"Wannabe superhero", svg:`
    <rect x="90" y="222" width="140" height="126" rx="28" fill="#2E4A9E"/>
    <polygon points="90,232 60,222 90,260" fill="#1B3070"/>
    <polygon points="230,232 260,222 230,260" fill="#1B3070"/>
    <polygon points="160,252 168,276 192,284 168,292 160,316 152,292 128,284 152,276" fill="#FFC93C" stroke="#201530" stroke-width="2"/>
  `},
    // Cream shirt with two vertical suspender stripes and button dots
  { name:"Suspenders", svg:`
    <rect x="90" y="222" width="140" height="126" rx="28" fill="#FBF3E4"/>
    <rect x="118" y="222" width="14" height="126" fill="#3B2A22"/>
    <rect x="188" y="222" width="14" height="126" fill="#3B2A22"/>
    <circle cx="125" cy="290" r="5" fill="#201530"/>
    <circle cx="195" cy="290" r="5" fill="#201530"/>
  `}
];


// ---- PANTS: left leg x=108-152, right leg x=168-212, both y=345-435 ----
const PANTS = [
    // Blue base with a lighter rectangular patch on each knee
  { name:"Patched denim", svg:`
    <rect x="108" y="345" width="44" height="90" rx="10" fill="#3B5BA5"/>
    <rect x="168" y="345" width="44" height="90" rx="10" fill="#3B5BA5"/>
    <rect x="114" y="375" width="20" height="18" fill="#5C7FC4" stroke="#201530" stroke-width="1.5"/>
    <rect x="182" y="392" width="20" height="18" fill="#5C7FC4" stroke="#201530" stroke-width="1.5"/>
  `},
    // Trapezoids that flare outward toward the ankle, plus big polka dots
  { name:"Clown pants", svg:`
    <polygon points="120,345 140,345 155,435 95,435" fill="#FFC93C"/>
    <polygon points="180,345 200,345 225,435 165,435" fill="#FFC93C"/>
    <g fill="#FF5A5F">
      <circle cx="120" cy="382" r="6"/><circle cx="138" cy="404" r="6"/><circle cx="110" cy="418" r="6"/>
      <circle cx="200" cy="382" r="6"/><circle cx="182" cy="404" r="6"/><circle cx="210" cy="418" r="6"/>
    </g>
  `},
    // A grid of light lines over a dark base
  { name:"Loud plaid", svg:`
    <rect x="108" y="345" width="44" height="90" fill="#7A2E3A"/>
    <rect x="168" y="345" width="44" height="90" fill="#7A2E3A"/>
    <g stroke="#FBF3E4" stroke-width="3">
      <line x1="108" y1="365" x2="152" y2="365"/><line x1="108" y1="395" x2="152" y2="395"/><line x1="108" y1="425" x2="152" y2="425"/>
      <line x1="122" y1="345" x2="122" y2="435"/><line x1="138" y1="345" x2="138" y2="435"/>
      <line x1="168" y1="365" x2="212" y2="365"/><line x1="168" y1="395" x2="212" y2="395"/><line x1="168" y1="425" x2="212" y2="425"/>
      <line x1="182" y1="345" x2="182" y2="435"/><line x1="198" y1="345" x2="198" y2="435"/>
    </g>
  `},
    // Soft color, small dot "stars", and a drawstring bow at the waist
  { name:"Pajama pants", svg:`
    <rect x="108" y="345" width="44" height="90" rx="14" fill="#B79CE0"/>
    <rect x="168" y="345" width="44" height="90" rx="14" fill="#B79CE0"/>
    <g fill="#FBF3E4">
      <circle cx="122" cy="376" r="4"/><circle cx="140" cy="398" r="4"/><circle cx="118" cy="416" r="4"/>
      <circle cx="198" cy="376" r="4"/><circle cx="180" cy="398" r="4"/><circle cx="202" cy="416" r="4"/>
    </g>
    <rect x="140" y="342" width="40" height="10" rx="5" fill="#8B6FC7"/>
  `}
];


// ---- SHOES: left foot ~x=130, right foot ~x=190, roughly y=428-465 ----
const SHOES = [
    // Oversized ovals with a round pale toe cap
  { name:"Clown shoes", svg:`
    <ellipse cx="118" cy="446" rx="38" ry="18" fill="#FF3D7F" stroke="#201530" stroke-width="3"/>
    <ellipse cx="202" cy="446" rx="38" ry="18" fill="#FF3D7F" stroke="#201530" stroke-width="3"/>
    <circle cx="140" cy="446" r="9" fill="#FBF3E4" stroke="#201530" stroke-width="2"/>
    <circle cx="180" cy="446" r="9" fill="#FBF3E4" stroke="#201530" stroke-width="2"/>
  `},
    // Left foot is a rounded sneaker with laces, right foot is a totally different boot shape/color
  { name:"Mismatched", svg:`
    <rect x="98" y="430" width="56" height="26" rx="10" fill="#2EC4B6" stroke="#201530" stroke-width="2.5"/>
    <line x1="110" y1="430" x2="106" y2="456" stroke="#201530" stroke-width="2"/>
    <line x1="122" y1="430" x2="120" y2="456" stroke="#201530" stroke-width="2"/>
    <ellipse cx="192" cy="446" rx="30" ry="20" fill="#7A2E3A" stroke="#201530" stroke-width="2.5"/>
    <rect x="176" y="424" width="32" height="16" rx="4" fill="#7A2E3A" stroke="#201530" stroke-width="2.5"/>
  `},
    // A shoe base plus two wheel circles underneath
  { name:"Roller skates", svg:`
    <rect x="102" y="430" width="48" height="20" rx="6" fill="#FFC93C" stroke="#201530" stroke-width="2.5"/>
    <circle cx="112" cy="456" r="7" fill="#201530"/><circle cx="140" cy="456" r="7" fill="#201530"/>
    <rect x="170" y="430" width="48" height="20" rx="6" fill="#FFC93C" stroke="#201530" stroke-width="2.5"/>
    <circle cx="180" cy="456" r="7" fill="#201530"/><circle cx="208" cy="456" r="7" fill="#201530"/>
  `},
    // A flat sole ellipse with a simple V-shaped strap
  { name:"Flip-flops", svg:`
    <ellipse cx="130" cy="444" rx="30" ry="12" fill="#F4C97A" stroke="#201530" stroke-width="2.5"/>
    <path d="M130 432 L118 444 M130 432 L142 444" stroke="#201530" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="190" cy="444" rx="30" ry="12" fill="#F4C97A" stroke="#201530" stroke-width="2.5"/>
    <path d="M190 432 L178 444 M190 432 L202 444" stroke="#201530" stroke-width="3" stroke-linecap="round"/>
  `}
];


// =========================================================================
// APP STATE
// PARTS maps each category name to its options array (defined above).
// ORDER controls both the SVG paint order and the order rows appear in the
// control panel. state[category] holds the *index* of the option currently
// showing for that category (e.g. state.hair === 2 means HAIRS[2]).
// =========================================================================
const PARTS = { hair:HAIRS, eyes:EYES, glasses:GLASSES, facial:FACIALS, mouth:MOUTHS, shirt:SHIRTS, pants:PANTS, shoes:SHOES };
const ORDER = ['hair','eyes','glasses','facial','mouth','shirt','pants','shoes'];
const state = {};
ORDER.forEach(k => state[k] = 0);


// Re-reads `state` and updates the DOM to match it: swaps every part's SVG
// into its <g>, and refreshes each control row's label ("Googly") and
// count ("1 / 6"). Called after any change to `state` -- there's no other
// place the DOM gets updated, so the screen can't drift out of sync with it.
function render(){
  ORDER.forEach(k=>{
    const opt = PARTS[k][state[k]];
    document.getElementById('part-'+k).innerHTML = opt.svg;
    document.getElementById('label-'+k).textContent = opt.name;
    document.getElementById('count-'+k).textContent = (state[k]+1) + ' / ' + PARTS[k].length;
  });
}


// Moves one category forward/back by `dir` (+1 or -1), wrapping at the
// ends: adding `n` before the modulo keeps the result positive even when
// dir is -1 (plain JS % can return negative numbers). Bound to the
// (Prev)/(Next) chip buttons in index.html.
function step(cat, dir){
  const n = PARTS[cat].length;
  state[cat] = (state[cat] + dir + n) % n;
  render();
}


// Picks a random option for every category at once, re-renders, rolls a
// new name/title/stats, and gives the card a little "wiggle". This is what
// the big dice button calls -- and also what runs once automatically at
// the bottom of this file, so the page never loads looking blank/default.
function randomizeAll(){
  ORDER.forEach(k=>{
    state[k] = Math.floor(Math.random() * PARTS[k].length);
  });
  render();
  newIdentity();
  pulseCard();
}


// Replays the .pulse wiggle animation from style.css on demand. Just
// re-adding the class wouldn't restart an already-finished CSS animation,
// so this removes the class, forces the browser to reflow (reading
// offsetWidth makes it recompute layout immediately, "flushing" the
// removal), and only then adds the class back -- which restarts it.
function pulseCard(){
  const badge = document.getElementById('badge');
  badge.classList.remove('pulse');
  void badge.offsetWidth;
  badge.classList.add('pulse');
}


// ---- Silly identity generator ----
// Random first + last name, a random job title, and a random 5-digit
// "badge number" -- purely cosmetic, no relation to the character's look.
const FIRST_NAMES = ["Blorbo","Gustav","Mildred","Chad","Waffles","Dennis","Pickle","Reginald","Gary","Bettina","Cornelius","Nacho","Sprocket","Doris","Bartholomew","Zippy","Hank","Petunia"];
const LAST_NAMES = ["Snacklepants","McGiggleworth","Noodlebottom","Fizzlebean","Gooberstein","Bumblesnatch","Higglesworth","Wobblestein","Puddlejumper","Featherbottom","Cracklebarrel","Dinglehopper","Von Waffle","Sproutley"];
const TITLES = ["Chief Nap Officer","Professional Duck Herder","Senior Couch Potato","Director of Snack Security","Head of Interpretive Dance","VP of Nonsense","Lead Bubble-Wrap Popper","Certified Pillow-Fort Architect","Chief Vibes Officer","Assistant to the Regional Weirdo","Minister of Odd Socks","Full-Time Cloud Watcher","Head Sandwich Taster","Director of Second Breakfast"];


// Rolls a new name, title, and ID number onto the badge, then also rolls
// new stat bars. Called by the "New name & title" button, and as part of
// randomizeAll().
function newIdentity(){
  const name = FIRST_NAMES[Math.floor(Math.random()*FIRST_NAMES.length)] + " " + LAST_NAMES[Math.floor(Math.random()*LAST_NAMES.length)];
  const title = TITLES[Math.floor(Math.random()*TITLES.length)];
  document.getElementById('badge-name').textContent = name;
  document.getElementById('badge-title').textContent = title;
  document.getElementById('badge-id').textContent = 'NO. ' + String(Math.floor(Math.random()*90000)+10000);
  newStats();
}


// Builds 4 random stat bars (Chaos/Style/Charm/Weird, each 30-99) and
// renders them into #stats. Rebuilt from scratch each call rather than
// updated in place, since there's nothing worth preserving between rolls.
function newStats(){
  const defs = [
    {label:'Chaos', color:'var(--coral)'},
    {label:'Style', color:'var(--teal)'},
    {label:'Charm', color:'var(--marigold)'},
    {label:'Weird', color:'var(--coral)'}
  ];
  const container = document.getElementById('stats');
  container.innerHTML = '';
  defs.forEach(d=>{
    const v = Math.floor(Math.random()*70)+30;
    const row = document.createElement('div');
    row.className = 'stat-row';
    row.innerHTML = '<span>'+d.label+'</span><span class="stat-track"><span class="stat-fill" style="width:'+v+'%;background:'+d.color+'"></span></span><span>'+v+'</span>';
    container.appendChild(row);
  });
}

// Run once when the page loads, so there's already a fully-formed (random)
// character, name, and stats before the person touches anything.

randomizeAll();
