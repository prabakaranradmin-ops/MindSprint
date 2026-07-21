/* ═══════════════════════════════════════════════════════════════════
   Bloom Academy — CONTENT FILE (REQUIREMENTS §15.1 content model)
   Question banks + stage lineups live here as data, editable without
   touching game code. Every bank item carries:
     id         stable unique id (freshness tracking, §15.1)
     skill      skill ID it practices (§9.1)
     difficulty 1–3 tier (adaptive filtering, §8.3/§9.2)
   Loaded via <script> tag → works offline and without a bundler.
═══════════════════════════════════════════════════════════════════ */
window.BLOOM_CONTENT = {

  /* §15.3 phoneme audio sprites: isolated letter/digraph sounds must be
     pre-recorded, never TTS (synthesis mis-teaches phonemes). This is the
     full manifest of clip IDs the sprite player (audio-manager.jsx →
     AudioMgr.phonics) looks for at assets/phonemes/{id}.wav|.mp3 — 26
     letters + the common early-phonics digraphs. Only the letters actually
     used by the `phonics`/`traceLetters` banks below are load-bearing today;
     the rest are here so growing those banks (§15.1 target: 40 sets) never
     needs a second manifest migration. Real recordings replace the silent
     placeholder clips under these exact IDs — no code changes required. */
  phonemeIds: [
    'a','b','c','d','e','f','g','h','i','j','k','l','m',
    'n','o','p','q','r','s','t','u','v','w','x','y','z',
    'sh','ch','th','wh','ng','ee','oo',
  ],

  /* §14 economy constants — moved out of app.html 2026-07-21 so §19.1's
     "shop prices and unlock thresholds live in config" claim is actually
     true; tunable without touching game code. Pricing rule (§14): small
     items 60–100 coins, premium 150–250. */
  shopItems: [
    { id:'sunhat',  icon:'👒', name:'Sun hat',   price:40 },
    { id:'bow',     icon:'🎀', name:'Bow',       price:40 },
    { id:'glasses', icon:'🤓', name:'Glasses',   price:60 },
    { id:'crown',   icon:'👑', name:'Crown',     price:150 },
    { id:'cape',    icon:'🦸', name:'Cape',      price:120 },
    { id:'wand',    icon:'🪄', name:'Wand',      price:200 },
    { id:'tophat',  icon:'🎩', name:'Top hat',   price:90 },
    { id:'chick',   icon:'🐤', name:'Pet chick', price:250 },
  ],
  musicUnlockStars: 30,

  stageConfigs: {
    math: [
      { type:'count',      skill:'math.count_to_5', curriculum:'CCSS K.CC.B.4',        label:'Count the Apples!', instruction:'How many apples do you see?',        maxCount:5 },
      { type:'pattern',    skill:'math.patterns', curriculum:'CCSS K.OA (patterns)',          label:'Pattern Party! 🔷', instruction:'What comes next?' },
      { type:'addition',   skill:'math.addition_within_8', curriculum:'CCSS K.OA.A.2', label:'Block Addition! ➕', instruction:'How many blocks altogether?' },
      { type:'subtraction',skill:'math.subtraction_within_8', curriculum:'CCSS K.OA.A.2', label:'Take Away! ➖',   instruction:'Some fell down — how many are left?' },
      { type:'compare',    skill:'math.compare', curriculum:'CCSS K.CC.C.6',           label:'More or Fewer? 🤔', instruction:'Tap the tree with MORE apples!' },
    ],
    words: [
      { type:'phonics', skill:'words.initial_sound', curriculum:'CCSS RF.K.2.D', label:'Letter Sounds! 🔤',   instruction:'Which picture starts with this letter?' },
      { type:'trace',   skill:'words.letter_formation', curriculum:'CCSS L.K.1.A', label:'Trace It! ✍️',    instruction:'Follow the dots to write the letter!' },
      { type:'pairs',   skill:'words.word_picture', curriculum:'CCSS RF.K.3.C',  label:'Matching Pairs! 🃏',  instruction:'Find the matching pairs!' },
      { type:'wordbuild', skill:'words.word_building', curriculum:'CCSS RF.K.3', label:'Word Builder! 🔨', instruction:'Build the word — put the letters in order!' },
      { type:'phonics', skill:'words.initial_sound', curriculum:'CCSS RF.K.2.D', label:'Champion Sounds! 🏆', instruction:'Last challenge — find the right sound!' },
    ],
    science: [
      { type:'livingmix', skill:'science.living_nonliving', curriculum:'NGSS K-LS1-1', label:'Sort it Out! 🌱',     instruction:'Tap the right group!' },
      { type:'sinkfloat', skill:'science.sink_float', curriculum:'NGSS K-PS2 (informal)',       label:'Sink or Float? 💧',   instruction:'Drop it in water — does it sink or float?' },
      { type:'hotcold',   skill:'science.hot_cold', curriculum:'NGSS K-PS3 (informal)',         label:'Hot or Cold? 🔥❄️',   instruction:'Is it hot or cold? Tap the right zone!' },
      { type:'habitat',   skill:'science.habitats', curriculum:'NGSS K-ESS3-1',         label:'Animal Homes! 🏠',    instruction:'Where does this animal live? Tap its home!' },
      { type:'lifeorder', skill:'science.lifecycle', curriculum:'NGSS 2-LS4 / K-LS1-1',        label:'Growing Up! 🔄',      instruction:'Put the cards in order — how does it grow?' },
    ],
    music: [
      { type:'rhythm', skill:'music.rhythm', curriculum:'NCAS MU:Pr (informal)', label:'First Beats! 🥁',  instruction:'Watch the notes fall, then tap the same beat!', patternLen:3 },
      { type:'rhythm', skill:'music.rhythm', curriculum:'NCAS MU:Pr (informal)', label:'Echo Time! 🎶',    instruction:'Listen closely and echo the tune!',            patternLen:3 },
      { type:'rhythm', skill:'music.rhythm', curriculum:'NCAS MU:Pr (informal)', label:'Longer Tunes! 🎵', instruction:'A longer tune — tap it back!',                 patternLen:4 },
      { type:'rhythm', skill:'music.rhythm', curriculum:'NCAS MU:Pr (informal)', label:'Beat Builder! 🎹', instruction:'Follow the falling notes and tap along!',      patternLen:4 },
      { type:'rhythm', skill:'music.rhythm', curriculum:'NCAS MU:Pr (informal)', label:'Star Concert! 🌟', instruction:'The big show — echo the whole tune!',          patternLen:5 },
    ],
  },

  /* World 2 stage lineups (D2, §3.2/§7 — "world 2 authored before P2 launch").
     CONTENT ONLY, not yet wired to any UI: STAGE_CONFIGS[subject][stageIndex]
     is read in exactly 3 places in app.html, all treating it as a flat
     5-stage array for the single existing world — there is no world-switcher,
     no purchase gate (§14.1 requires real platform IAP, which only exists in
     a native P2 build), and CUR_WORLD is a hardcoded 0 everywhere. This key
     is kept entirely separate from `stageConfigs` so authoring it carries
     zero risk to the shipped game; P2 wiring reads it once the world-switcher
     and IAP entitlement flow exist.

     Real limitation found while authoring this (2026-07-21): question
     difficulty tier is driven entirely by the runtime adaptive system (age +
     rolling accuracy, §9.2), not by which stage/world a question belongs to.
     Only two generators expose a genuine stage-level difficulty knob today:
     `count` (maxCount) and `rhythm` (patternLen) — both used below to make
     World 2 actually harder in a way the current code can express. Every
     other stage reuses its World 1 skill's generator, which will only reach
     for tier-3 bank content once the adaptive system independently decides
     the child is ready — so these stages are framed as review/reinforcement
     of the same skill against a much larger bank (all banks grown to 25+
     items, §15.1), not as a claim of fixed harder difficulty. A stage-level
     minTier parameter would need a small, real generator change to fix this
     properly — flagged in REQUIREMENTS.md §3.2, not built here per scope. */
  stageConfigsWorld2: {
    math: [
      { type:'count',      skill:'math.count_to_9', curriculum:'CCSS K.CC.B.5', label:'Count Higher! 🔢', instruction:'How many apples do you see this time?', maxCount:9 },
      { type:'pattern',    skill:'math.patterns', curriculum:'CCSS K.OA (patterns)', label:'Trickier Patterns! 🔷', instruction:'What comes next in the pattern?' },
      { type:'addition',   skill:'math.addition_within_8', curriculum:'CCSS K.OA.A.2', label:'Addition Again! ➕', instruction:'Add the blocks together — how many altogether?' },
      { type:'subtraction',skill:'math.subtraction_within_8', curriculum:'CCSS K.OA.A.2', label:'Take Away Challenge! ➖', instruction:'Some fell down again — how many are left this time?' },
      { type:'compare',    skill:'math.compare', curriculum:'CCSS K.CC.C.6', label:'Sharp Eyes! 🤔', instruction:'Tap the tree with MORE — look closely!' },
    ],
    words: [
      { type:'phonics', skill:'words.initial_sound', curriculum:'CCSS RF.K.2.D', label:'Sound Detective! 🔤', instruction:'Which picture starts with this letter?' },
      { type:'trace',   skill:'words.letter_formation', curriculum:'CCSS L.K.1.A', label:'Trace More Letters! ✍️', instruction:'Follow the dots to write the letter!' },
      { type:'pairs',   skill:'words.word_picture', curriculum:'CCSS RF.K.3.C', label:'Memory Master! 🃏', instruction:'Find the matching pairs — can you remember them all?' },
      { type:'wordbuild', skill:'words.word_building', curriculum:'CCSS RF.K.3', label:'Word Builder Two! 🔨', instruction:'Build the word — put the letters in order!' },
      { type:'phonics', skill:'words.initial_sound', curriculum:'CCSS RF.K.2.D', label:'Grand Champion! 🏆', instruction:'Last challenge — find the right sound!' },
    ],
    science: [
      { type:'livingmix', skill:'science.living_nonliving', curriculum:'NGSS K-LS1-1', label:'Sort it Out Again! 🌱', instruction:'Tap the right group!' },
      { type:'sinkfloat', skill:'science.sink_float', curriculum:'NGSS K-PS2 (informal)', label:'Splash Zone! 💧', instruction:'Drop it in water — does it sink or float?' },
      { type:'hotcold',   skill:'science.hot_cold', curriculum:'NGSS K-PS3 (informal)', label:'Temperature Check! 🔥❄️', instruction:'Is it hot or cold? Tap the right zone!' },
      { type:'habitat',   skill:'science.habitats', curriculum:'NGSS K-ESS3-1', label:'More Animal Homes! 🏠', instruction:'Where does this animal live? Tap its home!' },
      { type:'lifeorder', skill:'science.lifecycle', curriculum:'NGSS 2-LS4 / K-LS1-1', label:'Growing Up Two! 🔄', instruction:'Put the cards in order — how does it grow?' },
    ],
    music: [
      { type:'rhythm', skill:'music.rhythm', curriculum:'NCAS MU:Pr (informal)', label:'Bigger Beats! 🥁', instruction:'Watch the notes fall, then tap the same beat!', patternLen:5 },
      { type:'rhythm', skill:'music.rhythm', curriculum:'NCAS MU:Pr (informal)', label:'Echo Encore! 🎶', instruction:'Listen closely and echo the tune!', patternLen:5 },
      { type:'rhythm', skill:'music.rhythm', curriculum:'NCAS MU:Pr (informal)', label:'Even Longer Tunes! 🎵', instruction:'A longer tune — tap it back!', patternLen:6 },
      { type:'rhythm', skill:'music.rhythm', curriculum:'NCAS MU:Pr (informal)', label:'Beat Builder Two! 🎹', instruction:'Follow the falling notes and tap along!', patternLen:6 },
      { type:'rhythm', skill:'music.rhythm', curriculum:'NCAS MU:Pr (informal)', label:'Grand Concert! 🌟', instruction:'The biggest show yet — echo the whole tune!', patternLen:7 },
    ],
  },

  skillLabels: {
    'math.count_to_5': 'Counting to 5', 'math.count_to_9': 'Counting to 9',
    'math.addition_within_8': 'Addition', 'math.subtraction_within_8': 'Subtraction',
    'math.compare': 'Comparing amounts', 'math.patterns': 'Patterns',
    'words.initial_sound': 'Letter sounds', 'words.word_picture': 'Word reading',
    'science.living_nonliving': 'Living things', 'science.size': 'Big & small',
    'science.sink_float': 'Sink or float', 'science.hot_cold': 'Hot & cold',
    'science.habitats': 'Animal homes', 'science.lifecycle': 'Life cycles',
    'music.rhythm': 'Rhythm & beat', 'words.word_building': 'Word building',
    'words.letter_formation': 'Letter writing',
  },

  /* §13.4 real-world activity suggestions: a concrete, no-screen activity tied
     to the same skill id the "Practice next" recommendation already names
     (§9.3's weakSkill). Hand-authored content, same content-as-data approach
     as the question banks (§15.1) — every skillLabels key has an entry here. */
  realWorldTips: {
    'math.count_to_5': "Next time you're at the grocery store, ask them to help count 5 apples into a bag.",
    'math.count_to_9': "Count stairs together as you climb them, or count out napkins for the table at dinner.",
    'math.addition_within_8': "Ask \"if you have 2 crackers and I give you 3 more, how many is that?\" at snack time.",
    'math.subtraction_within_8': "Start with a small pile of toys or snacks and ask \"if we take 2 away, how many are left?\"",
    'math.compare': "Line up two stacks of blocks or two groups of toys and ask which has more.",
    'math.patterns': "Point out patterns on clothing, tiles, or a fence — \"what color comes next?\"",
    'words.initial_sound': "Play \"I Spy\" using sounds instead of colors — \"I spy something that starts with mmm.\"",
    'words.word_picture': "Point at simple words on cereal boxes or street signs and ask if they recognize any.",
    'science.living_nonliving': "On a walk, take turns pointing at things and asking \"is that alive or not?\"",
    'science.size': "Sort toys or laundry into \"big\" and \"small\" piles together.",
    'science.sink_float': "Bath time is a free experiment — drop in a few safe household items and guess sink or float before trying.",
    'science.hot_cold': "Let them touch (safely) a cold glass of water and a warm (not hot) mug and talk about the difference.",
    'science.habitats': "At a park or on a walk, ask where different animals you see might live.",
    'science.lifecycle': "Planting a seed together and checking on it over days makes lifecycle stages concrete.",
    'music.rhythm': "Clap a simple rhythm and have them clap it back — no instrument needed.",
    'words.word_building': "Use fridge magnet letters (or paper letters) to build their name or a simple word together.",
    'words.letter_formation': "Trace letters in sand, shaving cream, or with a finger on their back for them to guess.",
  },

  /* §15.1 production target: ≥40 letter-option sets covering all 26 letters,
     2–3 sets each. Grown 2026-07-21 from the original 14-letter prototype
     bank to 41 sets across all 26 letters. Distractor proximity (§8.3):
     difficulty 1 items use far/unrelated distractors, difficulty 2 introduce
     nearer categories, difficulty 3 use closer initial-sound confusables. */
  phonics: [
    { id:'ph-s', letter:'S', difficulty:1, opts:[{w:'Sun',e:'☀️',ok:true},{w:'Dog',e:'🐕',ok:false},{w:'Hat',e:'🎩',ok:false}] },
    { id:'ph-s2', letter:'S', difficulty:2, opts:[{w:'Star',e:'⭐',ok:true},{w:'Zebra',e:'🦓',ok:false},{w:'Moon',e:'🌙',ok:false}] },
    { id:'ph-b', letter:'B', difficulty:2, opts:[{w:'Bear',e:'🐻',ok:true},{w:'Fish',e:'🐟',ok:false},{w:'Egg',e:'🥚',ok:false}] },
    { id:'ph-b2', letter:'B', difficulty:1, opts:[{w:'Ball',e:'⚽',ok:true},{w:'Tree',e:'🌳',ok:false},{w:'Cup',e:'🥤',ok:false}] },
    { id:'ph-c', letter:'C', difficulty:2, opts:[{w:'Cake',e:'🎂',ok:true},{w:'Frog',e:'🐸',ok:false},{w:'Kite',e:'🪁',ok:false}] },
    { id:'ph-c2', letter:'C', difficulty:1, opts:[{w:'Cat',e:'🐱',ok:true},{w:'Duck',e:'🦆',ok:false},{w:'Sun',e:'☀️',ok:false}] },
    { id:'ph-f', letter:'F', difficulty:1, opts:[{w:'Fox',e:'🦊',ok:true},{w:'Rain',e:'🌧️',ok:false},{w:'Ball',e:'⚽',ok:false}] },
    { id:'ph-m', letter:'M', difficulty:1, opts:[{w:'Moon',e:'🌙',ok:true},{w:'Tree',e:'🌲',ok:false},{w:'Sock',e:'🧦',ok:false}] },
    { id:'ph-m2', letter:'M', difficulty:2, opts:[{w:'Mouse',e:'🐭',ok:true},{w:'Nest',e:'🪺',ok:false},{w:'Kite',e:'🪁',ok:false}] },
    { id:'ph-t', letter:'T', difficulty:1, opts:[{w:'Tiger',e:'🐯',ok:true},{w:'Bee',e:'🐝',ok:false},{w:'Leaf',e:'🍃',ok:false}] },
    { id:'ph-t2', letter:'T', difficulty:2, opts:[{w:'Turtle',e:'🐢',ok:true},{w:'Duck',e:'🦆',ok:false},{w:'Deer',e:'🦌',ok:false}] },
    { id:'ph-r', letter:'R', difficulty:2, opts:[{w:'Rock',e:'🪨',ok:true},{w:'Lamp',e:'💡',ok:false},{w:'Wing',e:'🪽',ok:false}] },
    { id:'ph-p', letter:'P', difficulty:2, opts:[{w:'Pizza',e:'🍕',ok:true},{w:'Shoe',e:'👟',ok:false},{w:'Star',e:'⭐',ok:false}] },
    { id:'ph-d', letter:'D', difficulty:2, opts:[{w:'Duck',e:'🦆',ok:true},{w:'Map',e:'🗺️',ok:false},{w:'Cup',e:'🥤',ok:false}] },
    { id:'ph-h', letter:'H', difficulty:2, opts:[{w:'Horse',e:'🐴',ok:true},{w:'Bird',e:'🐦',ok:false},{w:'Cake',e:'🎂',ok:false}] },
    { id:'ph-n', letter:'N', difficulty:2, opts:[{w:'Nest',e:'🪺',ok:true},{w:'Cat',e:'🐱',ok:false},{w:'Ball',e:'🎾',ok:false}] },
    { id:'ph-w', letter:'W', difficulty:2, opts:[{w:'Whale',e:'🐳',ok:true},{w:'Apple',e:'🍎',ok:false},{w:'Fire',e:'🔥',ok:false}] },
    { id:'ph-o', letter:'O', difficulty:2, opts:[{w:'Owl',e:'🦉',ok:true},{w:'Cat',e:'🐱',ok:false},{w:'Bee',e:'🐝',ok:false}] },
    { id:'ph-u', letter:'U', difficulty:2, opts:[{w:'Umbrella',e:'☂️',ok:true},{w:'Sun',e:'☀️',ok:false},{w:'Duck',e:'🦆',ok:false}] },
    { id:'ph-a', letter:'A', difficulty:1, opts:[{w:'Apple',e:'🍎',ok:true},{w:'Ball',e:'⚽',ok:false},{w:'Kite',e:'🪁',ok:false}] },
    { id:'ph-a2', letter:'A', difficulty:2, opts:[{w:'Ant',e:'🐜',ok:true},{w:'Egg',e:'🥚',ok:false},{w:'Owl',e:'🦉',ok:false}] },
    { id:'ph-e', letter:'E', difficulty:1, opts:[{w:'Egg',e:'🥚',ok:true},{w:'Sun',e:'☀️',ok:false},{w:'Frog',e:'🐸',ok:false}] },
    { id:'ph-e2', letter:'E', difficulty:2, opts:[{w:'Elephant',e:'🐘',ok:true},{w:'Owl',e:'🦉',ok:false},{w:'Ant',e:'🐜',ok:false}] },
    { id:'ph-g', letter:'G', difficulty:1, opts:[{w:'Goat',e:'🐐',ok:true},{w:'Fish',e:'🐟',ok:false},{w:'Kite',e:'🪁',ok:false}] },
    { id:'ph-g2', letter:'G', difficulty:2, opts:[{w:'Grapes',e:'🍇',ok:true},{w:'Duck',e:'🦆',ok:false},{w:'Cat',e:'🐱',ok:false}] },
    { id:'ph-i', letter:'I', difficulty:1, opts:[{w:'Igloo',e:'🧊',ok:true},{w:'Sun',e:'☀️',ok:false},{w:'Cake',e:'🎂',ok:false}] },
    { id:'ph-i2', letter:'I', difficulty:2, opts:[{w:'Insect',e:'🐛',ok:true},{w:'Egg',e:'🥚',ok:false},{w:'Ant',e:'🐜',ok:false}] },
    { id:'ph-j', letter:'J', difficulty:1, opts:[{w:'Jellyfish',e:'🪼',ok:true},{w:'Whale',e:'🐳',ok:false},{w:'Star',e:'⭐',ok:false}] },
    { id:'ph-j2', letter:'J', difficulty:2, opts:[{w:'Jam',e:'🍯',ok:true},{w:'Goat',e:'🐐',ok:false},{w:'Duck',e:'🦆',ok:false}] },
    { id:'ph-k', letter:'K', difficulty:1, opts:[{w:'Kite',e:'🪁',ok:true},{w:'Ball',e:'⚽',ok:false},{w:'Cake',e:'🎂',ok:false}] },
    { id:'ph-k2', letter:'K', difficulty:2, opts:[{w:'Koala',e:'🐨',ok:true},{w:'Camel',e:'🐪',ok:false},{w:'Goat',e:'🐐',ok:false}] },
    { id:'ph-l', letter:'L', difficulty:1, opts:[{w:'Lion',e:'🦁',ok:true},{w:'Duck',e:'🦆',ok:false},{w:'Ball',e:'⚽',ok:false}] },
    { id:'ph-l2', letter:'L', difficulty:2, opts:[{w:'Leaf',e:'🍃',ok:true},{w:'Nest',e:'🪺',ok:false},{w:'Rock',e:'🪨',ok:false}] },
    { id:'ph-q', letter:'Q', difficulty:2, opts:[{w:'Queen',e:'👑',ok:true},{w:'Star',e:'⭐',ok:false},{w:'Kite',e:'🪁',ok:false}] },
    { id:'ph-v', letter:'V', difficulty:1, opts:[{w:'Violin',e:'🎻',ok:true},{w:'Drum',e:'🥁',ok:false},{w:'Star',e:'⭐',ok:false}] },
    { id:'ph-v2', letter:'V', difficulty:2, opts:[{w:'Vase',e:'🏺',ok:true},{w:'Cup',e:'🥤',ok:false},{w:'Bowl',e:'🥣',ok:false}] },
    { id:'ph-x', letter:'X', difficulty:3, opts:[{w:'X-ray',e:'🩻',ok:true},{w:'Zebra',e:'🦓',ok:false},{w:'Yak',e:'🐂',ok:false}] },
    { id:'ph-y', letter:'Y', difficulty:1, opts:[{w:'Yarn',e:'🧶',ok:true},{w:'Ball',e:'⚽',ok:false},{w:'Cup',e:'🥤',ok:false}] },
    { id:'ph-y2', letter:'Y', difficulty:2, opts:[{w:'Yo-yo',e:'🪀',ok:true},{w:'Kite',e:'🪁',ok:false},{w:'Star',e:'⭐',ok:false}] },
    { id:'ph-z', letter:'Z', difficulty:1, opts:[{w:'Zebra',e:'🦓',ok:true},{w:'Bear',e:'🐻',ok:false},{w:'Horse',e:'🐴',ok:false}] },
    { id:'ph-z2', letter:'Z', difficulty:2, opts:[{w:'Zipper',e:'🤐',ok:true},{w:'Button',e:'🔘',ok:false},{w:'Sock',e:'🧦',ok:false}] },
  ],

  /* Letter tracing (§4 P2 · words stage 2): straight-stroke letters as ordered
     endpoint pairs on a 400×440 canvas (writing guides at 20%/50%/80%). Each
     letter also appears in the phonics bank, tying tracing to its word. */
  traceLetters: [
    { id:'tr-t', letter:'T', difficulty:1, strokes:[[[100,88],[300,88]], [[200,88],[200,352]]] },
    { id:'tr-h', letter:'H', difficulty:1, strokes:[[[110,88],[110,352]], [[290,88],[290,352]], [[110,220],[290,220]]] },
    { id:'tr-f', letter:'F', difficulty:2, strokes:[[[120,88],[120,352]], [[120,88],[300,88]], [[120,220],[260,220]]] },
    { id:'tr-n', letter:'N', difficulty:2, strokes:[[[110,352],[110,88]], [[110,88],[290,352]], [[290,352],[290,88]]] },
    { id:'tr-m', letter:'M', difficulty:3, strokes:[[[90,352],[90,88]], [[90,88],[200,260]], [[200,260],[310,88]], [[310,88],[310,352]]] },
    /* curved letters: strokes with >2 points are dot paths rendered as rounded polylines */
    { id:'tr-c', letter:'C', difficulty:2, strokes:[[[295,140],[210,96],[120,130],[85,220],[120,310],[210,344],[295,300]]] },
    { id:'tr-o', letter:'O', difficulty:2, strokes:[[[200,96],[115,132],[80,220],[115,308],[200,344],[285,308],[320,220],[285,132],[200,96]]] },
    { id:'tr-u', letter:'U', difficulty:2, strokes:[[[110,88],[110,270],[140,332],[200,352],[260,332],[290,270],[290,88]]] },
    { id:'tr-s', letter:'S', difficulty:3, strokes:[[[290,130],[210,94],[130,124],[140,200],[220,236],[295,290],[270,344],[170,350],[105,315]]] },
    /* World 2 additions (2026-07-21), verified by rendering each to a
       screenshot and visually confirming a legible, correctly-proportioned
       letter before shipping — same 400×440 canvas / margin conventions
       as the original set above. */
    { id:'tr-l', letter:'L', difficulty:1, strokes:[[[130,88],[130,352]], [[130,352],[290,352]]] },
    { id:'tr-i', letter:'I', difficulty:1, strokes:[[[130,88],[270,88]], [[200,88],[200,352]], [[130,352],[270,352]]] },
    { id:'tr-e', letter:'E', difficulty:2, strokes:[[[280,88],[130,88]], [[130,88],[130,352]], [[130,220],[250,220]], [[130,352],[280,352]]] },
    { id:'tr-k', letter:'K', difficulty:3, strokes:[[[130,88],[130,352]], [[290,88],[130,220]], [[130,220],[290,352]]] },
  ],

  /* Ordered lifecycle sequences for the drag-timeline (§4 P2 · science stage 5).
     Topics match §8.1: plant, chicken, butterfly. */
  /* §15.1 production target: ≥15 sequences. Grown 2026-07-21 from 4 to 16. */
  lifecycleSeqs: [
    { id:'seq-plant',     topic:'plant',     q:'How does a flower grow?',    stages:[{e:'🌰',l:'Seed'},{e:'🌱',l:'Sprout'},{e:'🌿',l:'Plant'},{e:'🌼',l:'Flower'}] },
    { id:'seq-chicken',   topic:'chicken',   q:'How does a chick grow?',     stages:[{e:'🥚',l:'Egg'},{e:'🐣',l:'Hatching'},{e:'🐤',l:'Chick'},{e:'🐔',l:'Hen'}] },
    { id:'seq-butterfly', topic:'butterfly', q:'How does a butterfly grow?', stages:[{e:'🥚',l:'Egg'},{e:'🐛',l:'Caterpillar'},{e:'🍃',l:'Chrysalis'},{e:'🦋',l:'Butterfly'}] },
    { id:'seq-tree',      topic:'tree',      q:'How does a tree grow?',      stages:[{e:'🌰',l:'Acorn'},{e:'🌱',l:'Seedling'},{e:'🪴',l:'Sapling'},{e:'🌳',l:'Tree'}] },
    { id:'seq-frog',      topic:'frog',      q:'How does a frog grow?',      stages:[{e:'🥚',l:'Egg'},{e:'🐸',l:'Tadpole'},{e:'🐸',l:'Froglet'},{e:'🐸',l:'Frog'}] },
    { id:'seq-sunflower', topic:'sunflower', q:'How does a sunflower grow?', stages:[{e:'🌰',l:'Seed'},{e:'🌱',l:'Seedling'},{e:'🌿',l:'Stem & Leaves'},{e:'🌻',l:'Sunflower'}] },
    { id:'seq-apple',     topic:'apple',     q:'How does an apple tree grow fruit?', stages:[{e:'🌸',l:'Blossom'},{e:'🟢',l:'Small Green Apple'},{e:'🍏',l:'Ripening Apple'},{e:'🍎',l:'Ripe Apple'}] },
    { id:'seq-duck',      topic:'duck',      q:'How does a duckling grow?',  stages:[{e:'🥚',l:'Egg'},{e:'🐣',l:'Hatching'},{e:'🐥',l:'Duckling'},{e:'🦆',l:'Duck'}] },
    { id:'seq-fish',      topic:'fish',      q:'How does a fish grow?',      stages:[{e:'🥚',l:'Eggs'},{e:'🐟',l:'Fry'},{e:'🐠',l:'Young Fish'},{e:'🐟',l:'Adult Fish'}] },
    { id:'seq-turtle',    topic:'turtle',    q:'How does a sea turtle grow?',stages:[{e:'🥚',l:'Egg'},{e:'🐢',l:'Hatchling'},{e:'🐢',l:'Young Turtle'},{e:'🐢',l:'Adult Turtle'}] },
    { id:'seq-ladybug',   topic:'ladybug',   q:'How does a ladybug grow?',   stages:[{e:'🥚',l:'Egg'},{e:'🐛',l:'Larva'},{e:'🫘',l:'Pupa'},{e:'🐞',l:'Ladybug'}] },
    { id:'seq-spider',    topic:'spider',    q:'How does a spider grow?',    stages:[{e:'🥚',l:'Egg Sac'},{e:'🕷️',l:'Spiderling'},{e:'🕷️',l:'Young Spider'},{e:'🕸️',l:'Adult Spider'}] },
    { id:'seq-bean',      topic:'bean',      q:'How does a bean plant grow?',stages:[{e:'🫘',l:'Bean Seed'},{e:'🌱',l:'Sprout'},{e:'🌿',l:'Vine'},{e:'🫛',l:'Pods'}] },
    { id:'seq-pumpkin',   topic:'pumpkin',   q:'How does a pumpkin grow?',   stages:[{e:'🌰',l:'Seed'},{e:'🌱',l:'Sprout'},{e:'🌼',l:'Flower'},{e:'🎃',l:'Pumpkin'}] },
    { id:'seq-cat',       topic:'cat',       q:'How does a kitten grow?',    stages:[{e:'🐱',l:'Newborn Kitten'},{e:'🐱',l:'Kitten'},{e:'🐈',l:'Young Cat'},{e:'🐈',l:'Adult Cat'}] },
    { id:'seq-dog',       topic:'dog',       q:'How does a puppy grow?',     stages:[{e:'🐶',l:'Newborn Puppy'},{e:'🐕',l:'Puppy'},{e:'🐕',l:'Young Dog'},{e:'🐕‍🦺',l:'Adult Dog'}] },
  ],

  /* §15.1 production target: ≥25 words. Grown 2026-07-21 from 8 to 30. */
  wordpic: [
    { id:'wp-cat',  word:'CAT',  difficulty:1, opts:[{e:'🐱',ok:true},{e:'🐶',ok:false},{e:'🐰',ok:false}] },
    { id:'wp-fish', word:'FISH', difficulty:1, opts:[{e:'🐟',ok:true},{e:'🦅',ok:false},{e:'🐢',ok:false}] },
    { id:'wp-star', word:'STAR', difficulty:1, opts:[{e:'⭐',ok:true},{e:'🌙',ok:false},{e:'☀️',ok:false}] },
    { id:'wp-tree', word:'TREE', difficulty:1, opts:[{e:'🌲',ok:true},{e:'🌸',ok:false},{e:'🍄',ok:false}] },
    { id:'wp-cake', word:'CAKE', difficulty:2, opts:[{e:'🎂',ok:true},{e:'🍕',ok:false},{e:'🍦',ok:false}] },
    { id:'wp-bird', word:'BIRD', difficulty:2, opts:[{e:'🐦',ok:true},{e:'🐛',ok:false},{e:'🦋',ok:false}] },
    { id:'wp-frog', word:'FROG', difficulty:2, opts:[{e:'🐸',ok:true},{e:'🐍',ok:false},{e:'🐢',ok:false}] },
    { id:'wp-ship', word:'SHIP', difficulty:2, opts:[{e:'🚢',ok:true},{e:'✈️',ok:false},{e:'🚂',ok:false}] },
    { id:'wp-sun',  word:'SUN',  difficulty:1, opts:[{e:'☀️',ok:true},{e:'🌙',ok:false},{e:'⭐',ok:false}] },
    { id:'wp-moon', word:'MOON', difficulty:1, opts:[{e:'🌙',ok:true},{e:'☀️',ok:false},{e:'☁️',ok:false}] },
    { id:'wp-dog',  word:'DOG',  difficulty:1, opts:[{e:'🐶',ok:true},{e:'🐱',ok:false},{e:'🐹',ok:false}] },
    { id:'wp-cup',  word:'CUP',  difficulty:1, opts:[{e:'🥤',ok:true},{e:'🍽️',ok:false},{e:'🥣',ok:false}] },
    { id:'wp-hat',  word:'HAT',  difficulty:1, opts:[{e:'🎩',ok:true},{e:'👟',ok:false},{e:'🧦',ok:false}] },
    { id:'wp-bee',  word:'BEE',  difficulty:2, opts:[{e:'🐝',ok:true},{e:'🦋',ok:false},{e:'🐞',ok:false}] },
    { id:'wp-egg',  word:'EGG',  difficulty:1, opts:[{e:'🥚',ok:true},{e:'🍳',ok:false},{e:'🧀',ok:false}] },
    { id:'wp-leaf', word:'LEAF', difficulty:2, opts:[{e:'🍃',ok:true},{e:'🌸',ok:false},{e:'🌰',ok:false}] },
    { id:'wp-duck', word:'DUCK', difficulty:2, opts:[{e:'🦆',ok:true},{e:'🐔',ok:false},{e:'🦢',ok:false}] },
    { id:'wp-kite', word:'KITE', difficulty:2, opts:[{e:'🪁',ok:true},{e:'🎈',ok:false},{e:'🪂',ok:false}] },
    { id:'wp-owl',  word:'OWL',  difficulty:2, opts:[{e:'🦉',ok:true},{e:'🦅',ok:false},{e:'🐦',ok:false}] },
    { id:'wp-nest', word:'NEST', difficulty:2, opts:[{e:'🪺',ok:true},{e:'🕸️',ok:false},{e:'🪹',ok:false}] },
    { id:'wp-crab', word:'CRAB', difficulty:2, opts:[{e:'🦀',ok:true},{e:'🦞',ok:false},{e:'🐙',ok:false}] },
    { id:'wp-snail',word:'SNAIL',difficulty:3, opts:[{e:'🐌',ok:true},{e:'🐛',ok:false},{e:'🦋',ok:false}] },
    { id:'wp-goat', word:'GOAT', difficulty:2, opts:[{e:'🐐',ok:true},{e:'🐑',ok:false},{e:'🐄',ok:false}] },
    { id:'wp-lion', word:'LION', difficulty:2, opts:[{e:'🦁',ok:true},{e:'🐯',ok:false},{e:'🐆',ok:false}] },
    { id:'wp-bear', word:'BEAR', difficulty:2, opts:[{e:'🐻',ok:true},{e:'🐨',ok:false},{e:'🦥',ok:false}] },
    { id:'wp-whale',word:'WHALE',difficulty:3, opts:[{e:'🐳',ok:true},{e:'🐬',ok:false},{e:'🦈',ok:false}] },
    { id:'wp-apple',word:'APPLE',difficulty:2, opts:[{e:'🍎',ok:true},{e:'🍊',ok:false},{e:'🍇',ok:false}] },
    { id:'wp-grape',word:'GRAPE',difficulty:3, opts:[{e:'🍇',ok:true},{e:'🍓',ok:false},{e:'🫐',ok:false}] },
    { id:'wp-house',word:'HOUSE',difficulty:2, opts:[{e:'🏠',ok:true},{e:'🏰',ok:false},{e:'⛺',ok:false}] },
    { id:'wp-boat', word:'BOAT', difficulty:2, opts:[{e:'⛵',ok:true},{e:'🚤',ok:false},{e:'🛶',ok:false}] },
  ],

  /* §15.1 production target: ≥25 items per science bank. Grown 2026-07-21
     from 12 to 26, keeping the roughly even living/non-living split. */
  living: [
    { id:'lv-plant', e:'🌱', l:'Plant',    cat:'living',     difficulty:1 },
    { id:'lv-dog',   e:'🐕', l:'Dog',      cat:'living',     difficulty:1 },
    { id:'lv-bfly',  e:'🦋', l:'Butterfly',cat:'living',     difficulty:1 },
    { id:'lv-flwr',  e:'🌸', l:'Flower',   cat:'living',     difficulty:2 },
    { id:'lv-fish',  e:'🐠', l:'Fish',     cat:'living',     difficulty:1 },
    { id:'lv-tree',  e:'🌳', l:'Tree',     cat:'living',     difficulty:2 },
    { id:'lv-rock',  e:'🪨', l:'Rock',     cat:'non-living', difficulty:1 },
    { id:'lv-car',   e:'🚗', l:'Car',      cat:'non-living', difficulty:1 },
    { id:'lv-cloud', e:'☁️', l:'Cloud',    cat:'non-living', difficulty:3 },
    { id:'lv-mtn',   e:'⛰️', l:'Mountain', cat:'non-living', difficulty:2 },
    { id:'lv-water', e:'💧', l:'Water',    cat:'non-living', difficulty:3 },
    { id:'lv-chair', e:'🪑', l:'Chair',    cat:'non-living', difficulty:1 },
    { id:'lv-bird',  e:'🐦', l:'Bird',     cat:'living',     difficulty:1 },
    { id:'lv-cat',   e:'🐱', l:'Cat',      cat:'living',     difficulty:1 },
    { id:'lv-frog',  e:'🐸', l:'Frog',     cat:'living',     difficulty:1 },
    { id:'lv-snail', e:'🐌', l:'Snail',    cat:'living',     difficulty:2 },
    { id:'lv-bee',   e:'🐝', l:'Bee',      cat:'living',     difficulty:2 },
    { id:'lv-mushrm',e:'🍄', l:'Mushroom', cat:'living',     difficulty:3 },
    { id:'lv-ball',  e:'⚽', l:'Ball',     cat:'non-living', difficulty:1 },
    { id:'lv-book',  e:'📖', l:'Book',     cat:'non-living', difficulty:1 },
    { id:'lv-cup',   e:'🥤', l:'Cup',      cat:'non-living', difficulty:1 },
    { id:'lv-sun',   e:'☀️', l:'Sun',      cat:'non-living', difficulty:3 },
    { id:'lv-table', e:'🪵', l:'Wood',     cat:'non-living', difficulty:3 },
    { id:'lv-kite',  e:'🪁', l:'Kite',     cat:'non-living', difficulty:1 },
    { id:'lv-shoe',  e:'👟', l:'Shoe',     cat:'non-living', difficulty:1 },
    { id:'lv-star',  e:'⭐', l:'Star',     cat:'non-living', difficulty:3 },
  ],

  size: [
    { id:'sz-eleph', e:'🐘', l:'Elephant', cat:'big',   difficulty:1 },
    { id:'sz-ant',   e:'🐜', l:'Ant',      cat:'small', difficulty:1 },
    { id:'sz-mtn',   e:'🏔️', l:'Mountain', cat:'big',   difficulty:1 },
    { id:'sz-berry', e:'🍓', l:'Berry',    cat:'small', difficulty:1 },
    { id:'sz-whale', e:'🐳', l:'Whale',    cat:'big',   difficulty:1 },
    { id:'sz-lbug',  e:'🐞', l:'Ladybug',  cat:'small', difficulty:1 },
    { id:'sz-rocket',e:'🚀', l:'Rocket',   cat:'big',   difficulty:2 },
    { id:'sz-beetle',e:'🪲', l:'Beetle',   cat:'small', difficulty:2 },
    { id:'sz-stad',  e:'🏟️', l:'Stadium',  cat:'big',   difficulty:2 },
    { id:'sz-sprout',e:'🌱', l:'Sprout',   cat:'small', difficulty:2 },
    { id:'sz-house', e:'🏠', l:'House',    cat:'big',   difficulty:1 },
    { id:'sz-mouse', e:'🐭', l:'Mouse',    cat:'small', difficulty:1 },
    { id:'sz-truck', e:'🚚', l:'Truck',    cat:'big',   difficulty:1 },
    { id:'sz-bee',   e:'🐝', l:'Bee',      cat:'small', difficulty:1 },
    { id:'sz-bear',  e:'🐻', l:'Bear',     cat:'big',   difficulty:2 },
    { id:'sz-snail', e:'🐌', l:'Snail',    cat:'small', difficulty:2 },
    { id:'sz-ship',  e:'🚢', l:'Ship',     cat:'big',   difficulty:1 },
    { id:'sz-button',e:'🔘', l:'Button',   cat:'small', difficulty:2 },
    { id:'sz-castle',e:'🏰', l:'Castle',   cat:'big',   difficulty:1 },
    { id:'sz-pebble',e:'🪨', l:'Pebble',   cat:'small', difficulty:2 },
    { id:'sz-giraffe',e:'🦒',l:'Giraffe',  cat:'big',   difficulty:2 },
    { id:'sz-seed',  e:'🌰', l:'Seed',     cat:'small', difficulty:2 },
    { id:'sz-hippo', e:'🦛', l:'Hippo',    cat:'big',   difficulty:2 },
    { id:'sz-crumb', e:'🍞', l:'Crumb',    cat:'small', difficulty:3 },
    { id:'sz-bus',   e:'🚌', l:'Bus',      cat:'big',   difficulty:1 },
  ],

  sinkfloat: [
    { id:'sf-rock',  e:'🪨', l:'Rock',      sinks:true,  difficulty:1 },
    { id:'sf-orange',e:'🍊', l:'Orange',    sinks:false, difficulty:3 },
    { id:'sf-anchor',e:'⚓', l:'Anchor',    sinks:true,  difficulty:1 },
    { id:'sf-leaf',  e:'🍃', l:'Leaf',      sinks:false, difficulty:1 },
    { id:'sf-key',   e:'🔑', l:'Metal Key', sinks:true,  difficulty:2 },
    { id:'sf-ball',  e:'⚽', l:'Ball',      sinks:false, difficulty:1 },
    { id:'sf-log',   e:'🪵', l:'Wood Log',  sinks:false, difficulty:2 },
    { id:'sf-magnet',e:'🧲', l:'Magnet',    sinks:true,  difficulty:2 },
    { id:'sf-apple', e:'🍎', l:'Apple',     sinks:false, difficulty:3 },
    { id:'sf-brick', e:'🧱', l:'Brick',     sinks:true,  difficulty:1 },
    { id:'sf-coin',  e:'🪙', l:'Coin',      sinks:true,  difficulty:1 },
    { id:'sf-boat',  e:'⛵', l:'Toy Boat',  sinks:false, difficulty:1 },
    { id:'sf-spoon', e:'🥄', l:'Metal Spoon',sinks:true, difficulty:2 },
    { id:'sf-cork',  e:'🍾', l:'Cork',      sinks:false, difficulty:2 },
    { id:'sf-marble',e:'⚪', l:'Glass Marble',sinks:true,difficulty:2 },
    { id:'sf-feather',e:'🪶',l:'Feather',   sinks:false, difficulty:1 },
    { id:'sf-shell', e:'🐚', l:'Shell',     sinks:true,  difficulty:2 },
    { id:'sf-balloon',e:'🎈',l:'Balloon',   sinks:false, difficulty:1 },
    { id:'sf-hammer',e:'🔨', l:'Hammer',    sinks:true,  difficulty:1 },
    { id:'sf-sponge',e:'🧽', l:'Sponge',    sinks:false, difficulty:2 },
    { id:'sf-scissors',e:'✂️',l:'Scissors', sinks:true,  difficulty:2 },
    { id:'sf-lemon', e:'🍋', l:'Lemon',     sinks:false, difficulty:3 },
    { id:'sf-horseshoe',e:'🐴',l:'Iron Horseshoe',sinks:true,difficulty:3 },
    { id:'sf-duckie',e:'🦆', l:'Rubber Duck',sinks:false,difficulty:1 },
    { id:'sf-stone', e:'🌰', l:'Pebble',    sinks:true,  difficulty:1 },
  ],

  hotcold: [
    { id:'hc-fire',  e:'🔥', l:'Fire',      hot:true,  difficulty:1 },
    { id:'hc-ice',   e:'🧊', l:'Ice Cube',  hot:false, difficulty:1 },
    { id:'hc-sun',   e:'☀️', l:'Sun',       hot:true,  difficulty:1 },
    { id:'hc-snow',  e:'❄️', l:'Snowflake', hot:false, difficulty:1 },
    { id:'hc-cocoa', e:'☕', l:'Hot Cocoa', hot:true,  difficulty:1 },
    { id:'hc-icecr', e:'🍦', l:'Ice Cream', hot:false, difficulty:1 },
    { id:'hc-steam', e:'♨️', l:'Steam',     hot:true,  difficulty:2 },
    { id:'hc-blizz', e:'🌨️', l:'Blizzard',  hot:false, difficulty:2 },
    { id:'hc-volc',  e:'🌋', l:'Volcano',   hot:true,  difficulty:2 },
    { id:'hc-peng',  e:'🐧', l:'Penguin',   hot:false, difficulty:3 },
    { id:'hc-oven',  e:'🍞', l:'Fresh-baked Bread', hot:true, difficulty:2 },
    { id:'hc-igloo', e:'🧊', l:'Igloo',     hot:false, difficulty:2 },
    { id:'hc-soup',  e:'🍲', l:'Hot Soup',  hot:true,  difficulty:1 },
    { id:'hc-popsicle',e:'🍭',l:'Popsicle', hot:false, difficulty:1 },
    { id:'hc-desert',e:'🏜️', l:'Desert Sand',hot:true, difficulty:2 },
    { id:'hc-glacier',e:'🏔️',l:'Glacier',   hot:false, difficulty:2 },
    { id:'hc-candle',e:'🕯️', l:'Candle Flame',hot:true, difficulty:1 },
    { id:'hc-fridge',e:'🥶', l:'Fridge Air',hot:false, difficulty:2 },
    { id:'hc-sand',  e:'🏖️', l:'Sunny Beach Sand',hot:true,difficulty:2 },
    { id:'hc-pond',  e:'🧊', l:'Frozen Pond',hot:false, difficulty:2 },
    { id:'hc-toast', e:'🍞', l:'Toaster',   hot:true,  difficulty:1 },
    { id:'hc-frost', e:'❄️', l:'Frost on Grass',hot:false,difficulty:3 },
    { id:'hc-pan',   e:'🍳', l:'Frying Pan',hot:true,  difficulty:1 },
    { id:'hc-wind',  e:'🌬️', l:'Winter Wind',hot:false, difficulty:2 },
    { id:'hc-lava',  e:'🌋', l:'Lava',      hot:true,  difficulty:1 },
  ],

  habitats: {
    ocean:  { label:'Ocean',  icon:'🌊', bg:'#DCEFFB', border:'#5EB7E8' },
    forest: { label:'Forest', icon:'🌲', bg:'#E8F4D4', border:'#6FCB7F' },
    desert: { label:'Desert', icon:'🏜️', bg:'#FFF3D4', border:'#E2A41B' },
    arctic: { label:'Arctic', icon:'❄️', bg:'#EEF2FF', border:'#8EB4E3' },
    sky:    { label:'Sky',    icon:'☁️', bg:'#F0F8FF', border:'#90C8F0' },
    farm:   { label:'Farm',   icon:'🌾', bg:'#FFF8E8', border:'#C8A040' },
  },

  habitat: [
    { id:'hb-fish',  e:'🐟', l:'Fish',     h:'ocean',  w:['forest','desert'], difficulty:1 },
    { id:'hb-bear',  e:'🐻', l:'Bear',     h:'forest', w:['ocean','arctic'],  difficulty:1 },
    { id:'hb-camel', e:'🐪', l:'Camel',    h:'desert', w:['ocean','forest'],  difficulty:1 },
    { id:'hb-peng',  e:'🐧', l:'Penguin',  h:'arctic', w:['desert','farm'],   difficulty:1 },
    { id:'hb-eagle', e:'🦅', l:'Eagle',    h:'sky',    w:['ocean','farm'],    difficulty:2 },
    { id:'hb-cow',   e:'🐄', l:'Cow',      h:'farm',   w:['ocean','arctic'],  difficulty:1 },
    { id:'hb-shark', e:'🦈', l:'Shark',    h:'ocean',  w:['forest','sky'],    difficulty:1 },
    { id:'hb-fox',   e:'🦊', l:'Fox',      h:'forest', w:['ocean','desert'],  difficulty:2 },
    { id:'hb-scorp', e:'🦂', l:'Scorpion', h:'desert', w:['arctic','ocean'],  difficulty:2 },
    { id:'hb-whale', e:'🐋', l:'Whale',    h:'ocean',  w:['forest','arctic'], difficulty:1 },
    { id:'hb-owl',   e:'🦉', l:'Owl',      h:'forest', w:['ocean','desert'],  difficulty:1 },
    { id:'hb-lion',  e:'🦁', l:'Lion',     h:'desert', w:['arctic','ocean'],  difficulty:2 },
    { id:'hb-seal',  e:'🦭', l:'Seal',     h:'arctic', w:['desert','farm'],   difficulty:1 },
    { id:'hb-butterfly',e:'🦋',l:'Butterfly',h:'sky',  w:['ocean','arctic'],  difficulty:2 },
    { id:'hb-pig',   e:'🐷', l:'Pig',      h:'farm',   w:['sky','arctic'],    difficulty:1 },
    { id:'hb-octopus',e:'🐙',l:'Octopus',  h:'ocean',  w:['farm','desert'],   difficulty:1 },
    { id:'hb-deer',  e:'🦌', l:'Deer',     h:'forest', w:['ocean','sky'],     difficulty:1 },
    { id:'hb-snake', e:'🐍', l:'Snake',    h:'desert', w:['arctic','sky'],    difficulty:2 },
    { id:'hb-polarbear',e:'🐻‍❄️',l:'Polar Bear',h:'arctic', w:['ocean','farm'], difficulty:2 },
    { id:'hb-parrot',e:'🦜', l:'Parrot',   h:'sky',    w:['desert','arctic'], difficulty:2 },
    { id:'hb-horse', e:'🐴', l:'Horse',    h:'farm',   w:['ocean','desert'],  difficulty:1 },
    { id:'hb-crab',  e:'🦀', l:'Crab',     h:'ocean',  w:['farm','sky'],      difficulty:2 },
    { id:'hb-rabbit',e:'🐇', l:'Rabbit',   h:'forest', w:['ocean','farm'],    difficulty:1 },
    { id:'hb-hawk',  e:'🐦‍⬛', l:'Hawk',    h:'sky',    w:['ocean','forest'],  difficulty:2 },
    { id:'hb-chicken',e:'🐔',l:'Chicken',  h:'farm',   w:['arctic','ocean'],  difficulty:1 },
    { id:'hb-lizard',e:'🦎', l:'Lizard',   h:'desert', w:['arctic','sky'],    difficulty:2 },
  ],

  /* §15.1 production target: ≥15 items. Grown 2026-07-21 from 10 to 18,
     adding a Frog topic and rounding out Plant/Chicken/Butterfly. */
  lifecycle: [
    { id:'lc-seed',   stage:'🌰', label:'Seed',        next:{e:'🌱',l:'Sprout'},      wrong:[{e:'🌸',l:'Flower'},{e:'🪴',l:'Plant'}],     topic:'Plant',     difficulty:1 },
    { id:'lc-sprout', stage:'🌱', label:'Sprout',      next:{e:'🪴',l:'Young Plant'}, wrong:[{e:'🌰',l:'Seed'},{e:'🌸',l:'Flower'}],      topic:'Plant',     difficulty:2 },
    { id:'lc-plant',  stage:'🪴', label:'Young Plant', next:{e:'🌸',l:'Flower'},      wrong:[{e:'🌱',l:'Sprout'},{e:'🌰',l:'Seed'}],      topic:'Plant',     difficulty:2 },
    { id:'lc-flower', stage:'🌸', label:'Flower',      next:{e:'🍎',l:'Fruit'},       wrong:[{e:'🌱',l:'Sprout'},{e:'🪴',l:'Plant'}],     topic:'Plant',     difficulty:3 },
    { id:'lc-egg-ch', stage:'🥚', label:'Egg',         next:{e:'🐣',l:'Hatching'},    wrong:[{e:'🐔',l:'Chicken'},{e:'🐤',l:'Chick'}],    topic:'Chicken',   difficulty:1 },
    { id:'lc-hatch',  stage:'🐣', label:'Hatching',    next:{e:'🐤',l:'Chick'},       wrong:[{e:'🥚',l:'Egg'},{e:'🐔',l:'Chicken'}],      topic:'Chicken',   difficulty:1 },
    { id:'lc-chick',  stage:'🐤', label:'Chick',       next:{e:'🐔',l:'Chicken'},     wrong:[{e:'🥚',l:'Egg'},{e:'🐣',l:'Hatching'}],     topic:'Chicken',   difficulty:1 },
    { id:'lc-egg-bf', stage:'🥚', label:'Egg',         next:{e:'🐛',l:'Caterpillar'}, wrong:[{e:'🦋',l:'Butterfly'},{e:'🫘',l:'Cocoon'}], topic:'Butterfly', difficulty:2 },
    { id:'lc-cater',  stage:'🐛', label:'Caterpillar', next:{e:'🫘',l:'Cocoon'},      wrong:[{e:'🦋',l:'Butterfly'},{e:'🥚',l:'Egg'}],    topic:'Butterfly', difficulty:2 },
    { id:'lc-cocoon', stage:'🫘', label:'Cocoon',      next:{e:'🦋',l:'Butterfly'},   wrong:[{e:'🐛',l:'Caterpillar'},{e:'🥚',l:'Egg'}],  topic:'Butterfly', difficulty:2 },
    { id:'lc-frogegg',stage:'🥚', label:'Egg',         next:{e:'🐸',l:'Tadpole'},     wrong:[{e:'🐸',l:'Frog'},{e:'🫘',l:'Cocoon'}],      topic:'Frog',      difficulty:2 },
    { id:'lc-tadpole',stage:'🐸', label:'Tadpole',     next:{e:'🐸',l:'Froglet'},     wrong:[{e:'🥚',l:'Egg'},{e:'🐛',l:'Caterpillar'}],  topic:'Frog',      difficulty:2 },
    { id:'lc-froglet',stage:'🐸', label:'Froglet',     next:{e:'🐸',l:'Frog'},        wrong:[{e:'🥚',l:'Egg'},{e:'🐸',l:'Tadpole'}],      topic:'Frog',      difficulty:2 },
    { id:'lc-acorn',  stage:'🌰', label:'Acorn',       next:{e:'🌱',l:'Seedling'},    wrong:[{e:'🌳',l:'Tree'},{e:'🪴',l:'Sapling'}],     topic:'Tree',      difficulty:1 },
    { id:'lc-seedling',stage:'🌱',label:'Seedling',    next:{e:'🪴',l:'Sapling'},     wrong:[{e:'🌰',l:'Acorn'},{e:'🌳',l:'Tree'}],       topic:'Tree',      difficulty:2 },
    { id:'lc-sapling',stage:'🪴', label:'Sapling',     next:{e:'🌳',l:'Tree'},        wrong:[{e:'🌱',l:'Seedling'},{e:'🌰',l:'Acorn'}],   topic:'Tree',      difficulty:2 },
    { id:'lc-catfull',stage:'🐛', label:'Caterpillar', next:{e:'🫘',l:'Chrysalis'},   wrong:[{e:'🦋',l:'Butterfly'},{e:'🥚',l:'Egg'}],    topic:'Butterfly', difficulty:3 },
    { id:'lc-hen',    stage:'🐔', label:'Hen',         next:{e:'🥚',l:'Egg'},         wrong:[{e:'🐤',l:'Chick'},{e:'🐣',l:'Hatching'}],   topic:'Chicken',   difficulty:3 },
  ],
};
