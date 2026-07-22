/* ═══════════════════════════════════════════════════════════════════
   Bopplebee — CONTENT FILE (REQUIREMENTS §15.1 content model)
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
    'math.word_problems': 'Word problems', 'words.comprehension': 'Reading comprehension',
    'science.forces_motion': 'Forces & motion', 'science.life_cycles_traits': 'Life cycles & traits',
    'science.weather_climate': 'Weather & climate', 'science.matter_states': 'States of matter',
    'science.energy_transfer': 'Energy transfer', 'science.ecosystems': 'Ecosystems & food webs',
    'science.earth_systems': 'Earth systems',
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
    'math.word_problems': "Turn a recipe or shopping trip into a word problem out loud — \"if 3 friends split 12 cookies evenly, how many does each get?\"",
    'words.comprehension': "After reading a book or article together, ask them to explain what happened in their own words, and why a character made a choice.",
    'science.forces_motion': "Push a toy car on carpet, then on a smooth floor, and talk about why it slows down differently — that's friction at work.",
    'science.life_cycles_traits': "Look at photos of family members and talk about which traits (eye color, height, curly vs. straight hair) seem to run in the family.",
    'science.weather_climate': "Check the weather forecast together for a week and talk about how that's different from the region's overall climate.",
    'science.matter_states': "Watch an ice cube melt and then boil the resulting water, talking through solid → liquid → gas at each step.",
    'science.energy_transfer': "Trace a meal back to its source together — where did the energy in tonight's dinner originally come from?",
    'science.ecosystems': "On a walk, talk about who eats whom in a local food chain — bugs, birds, and the plants they all depend on.",
    'science.earth_systems': "After it rains, talk about where the water on the ground actually goes next — into the soil, a drain, a river, and eventually back to the sky.",
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

  /* ═══════════════════════════════════════════════════════════════════
     AGE-TIER EXPANSION (REQUIREMENTS §26, decision O8) — ages 8–12.
     Tier is a pure function of profile.age (§26.1): Junior 5–7 (existing,
     above), Middle 8–9, Senior 10–12. Middle/Senior reuse the same 4
     subjects (math/words/science/music) rather than the design mock's
     illustrative placeholder subjects (Fractions/Geography/Logic/History
     have no content banks and were never meant literally — §26.4 flagged
     this as an open question; reusing real subjects was the resolution).
     ═══════════════════════════════════════════════════════════════════ */

  /* §26.4 XP/level economy — separate currency from Junior's stars/coins,
     not a replacement. Both persist on a profile so a child aging between
     tiers never loses anything (§14 progress-is-additive, extended by §26.3
     to apply across all tiers). Leveling curve: 400 XP per level flat,
     simple and predictable rather than a steepening curve — a 10–12 year
     old should be able to do the mental math on "how close to next level". */
  xpPerLevel: 400,
  quizSpeedBonusXp: 15,   // §26.3: bonus-only, never a penalty or fail state
  quizBaseXp: 40,         // per correct answer in a Senior/Middle timed quiz

  /* Word problems — Senior/Middle typed-answer mechanic (screens-i.jsx #33).
     Free-text numeric/fraction entry via on-screen keypad, not multiple
     choice. `answer` is the canonical string form checkAnswer() compares
     against after normalizing (whitespace, leading zeros, "1/2" vs "0.5"
     handled by acceptEquivalents). difficulty gates which tier sees which
     problems: Middle (8-9) gets 1, Senior (10-12) gets 1-3. */
  wordProblems: [
    { id:'wp-mult-1', skill:'math.word_problems', difficulty:1,
      prompt:'A box holds 6 crayons. How many crayons are in 4 boxes?',
      unit:'crayons', answer:'24', acceptEquivalents:['24'],
      hint:'Multiply the number in one box by the number of boxes: 6 × 4.' },
    { id:'wp-mult-2', skill:'math.word_problems', difficulty:1,
      prompt:'Each shelf holds 8 books. How many books fit on 5 shelves?',
      unit:'books', answer:'40', acceptEquivalents:['40'],
      hint:'Multiply books per shelf by the number of shelves: 8 × 5.' },
    { id:'wp-div-1', skill:'math.word_problems', difficulty:1,
      prompt:'24 stickers are shared equally among 6 friends. How many stickers does each friend get?',
      unit:'stickers', answer:'4', acceptEquivalents:['4'],
      hint:'Divide the total by the number of friends: 24 ÷ 6.' },
    { id:'wp-frac-1', skill:'math.word_problems', difficulty:2,
      prompt:'A recipe needs ¾ cup of flour per batch. How many cups are needed for 3 batches?',
      unit:'cups', answer:'2.25', acceptEquivalents:['2.25','2 1/4','9/4'],
      hint:"Multiply the fraction by the number of batches: ¾ × 3. Convert to a decimal if that's easier." },
    { id:'wp-frac-2', skill:'math.word_problems', difficulty:2,
      prompt:'Mia ran ⅝ of a mile, then walked ⅛ of a mile more. How far did she go in total, as a fraction of a mile?',
      unit:'miles', answer:'3/4', acceptEquivalents:['3/4','0.75'],
      hint:'Add the two fractions — they already share a denominator: ⅝ + ⅛.' },
    { id:'wp-pct-1', skill:'math.word_problems', difficulty:2,
      prompt:'A shirt costs $20. It goes on sale for 25% off. What is the sale price in dollars?',
      unit:'dollars', answer:'15', acceptEquivalents:['15','15.00'],
      hint:'25% of $20 is $5 off. Subtract that from the original price.' },
    { id:'wp-ratio-1', skill:'math.word_problems', difficulty:3,
      prompt:'A recipe uses 2 cups of flour for every 3 cups of sugar. How many cups of flour are needed for 9 cups of sugar?',
      unit:'cups', answer:'6', acceptEquivalents:['6'],
      hint:'The ratio 2:3 scales by 3 to reach 9 cups of sugar (3×3=9), so flour scales by 3 too (2×3).' },
    { id:'wp-area-1', skill:'math.word_problems', difficulty:3,
      prompt:'A rectangular garden is 7 meters long and 4 meters wide. What is its area in square meters?',
      unit:'sq meters', answer:'28', acceptEquivalents:['28'],
      hint:'Area of a rectangle is length × width: 7 × 4.' },

    /* §15.1-style bank growth (2026-07-22): 8 → 20 items, spread across all
       three difficulty tiers so every stageConfigsMiddle/Senior minTier-
       maxTier range keeps real variety instead of repeating the same 1-3
       items every stage. Same conventions as the original 8: universal
       objects/settings, no gendered nouns, hint never gives the final
       answer away (§14 hints never penalize, but they still teach). */
    { id:'wp-mult-3', skill:'math.word_problems', difficulty:1,
      prompt:'A classroom has 5 rows of desks with 6 desks in each row. How many desks are there in total?',
      unit:'desks', answer:'30', acceptEquivalents:['30'],
      hint:'Multiply the number of rows by the number of desks per row: 5 × 6.' },
    { id:'wp-add-1', skill:'math.word_problems', difficulty:1,
      prompt:'A library has 128 picture books and 97 chapter books. How many books does it have altogether?',
      unit:'books', answer:'225', acceptEquivalents:['225'],
      hint:'Add the two totals together: 128 + 97.' },
    { id:'wp-sub-1', skill:'math.word_problems', difficulty:1,
      prompt:'A jar starts with 84 marbles. 29 are given away. How many marbles are left?',
      unit:'marbles', answer:'55', acceptEquivalents:['55'],
      hint:'Subtract the marbles given away from the starting amount: 84 − 29.' },
    { id:'wp-div-2', skill:'math.word_problems', difficulty:1,
      prompt:'45 chairs need to be set up in equal rows of 9. How many rows will there be?',
      unit:'rows', answer:'5', acceptEquivalents:['5'],
      hint:'Divide the total chairs by the number per row: 45 ÷ 9.' },
    { id:'wp-time-1', skill:'math.word_problems', difficulty:1,
      prompt:'A movie starts at 2:15 and lasts 1 hour and 45 minutes. What time does it end?',
      unit:'', answer:'4:00', acceptEquivalents:['4:00','4:00pm','4pm','16:00'],
      hint:'Add 1 hour 45 minutes to 2:15 — try adding the hour first, then the extra 45 minutes.' },
    { id:'wp-frac-3', skill:'math.word_problems', difficulty:2,
      prompt:'A pizza is cut into 8 equal slices. If 3 slices are eaten, what fraction of the pizza is left?',
      unit:'', answer:'5/8', acceptEquivalents:['5/8','0.625'],
      hint:'5 of the original 8 slices remain — write that as a fraction.' },
    { id:'wp-pct-2', skill:'math.word_problems', difficulty:2,
      prompt:'A class of 30 students has 40% who walk to school. How many students walk to school?',
      unit:'students', answer:'12', acceptEquivalents:['12'],
      hint:'40% of 30 is the same as 0.4 × 30.' },
    { id:'wp-avg-1', skill:'math.word_problems', difficulty:2,
      prompt:'Over 4 days, a runner logged 3, 5, 4, and 4 miles. What was the average number of miles per day?',
      unit:'miles', answer:'4', acceptEquivalents:['4'],
      hint:'Add all four distances, then divide by 4.' },
    { id:'wp-ratio-2', skill:'math.word_problems', difficulty:2,
      prompt:'Paint is mixed in a ratio of 3 parts blue to 2 parts yellow. How many parts blue are needed for 10 parts yellow?',
      unit:'parts', answer:'15', acceptEquivalents:['15'],
      hint:'10 parts yellow is 5 times 2, so scale the blue side by 5 too: 3 × 5.' },
    { id:'wp-perimeter-1', skill:'math.word_problems', difficulty:2,
      prompt:'A rectangular field is 12 meters long and 8 meters wide. What is its perimeter in meters?',
      unit:'meters', answer:'40', acceptEquivalents:['40'],
      hint:'Perimeter of a rectangle is 2 × (length + width).' },
    { id:'wp-rate-1', skill:'math.word_problems', difficulty:3,
      prompt:'A car travels 180 miles in 3 hours at a steady speed. How many miles does it travel in 5 hours at that same speed?',
      unit:'miles', answer:'300', acceptEquivalents:['300'],
      hint:'Find the speed first (180 ÷ 3), then multiply that speed by 5 hours.' },
    { id:'wp-volume-1', skill:'math.word_problems', difficulty:3,
      prompt:'A rectangular box is 5 cm long, 4 cm wide, and 3 cm tall. What is its volume in cubic centimeters?',
      unit:'cubic cm', answer:'60', acceptEquivalents:['60'],
      hint:'Volume of a rectangular box is length × width × height.' },
  ],

  /* Reading comprehension passages — Senior/Middle mechanic (screens-i.jsx
     #34). Short passage + 3 paired questions, one correct option each.
     Middle tier gets the shorter/easier passages (difficulty 1), Senior
     gets the full range. Universal settings/characters, no gendered
     assumptions in the surrounding text, consistent with the §10.4
     diversity/neutrality convention already used for the Junior banks. */
  comprehensionPassages: [
    { id:'cp-lighthouse', title:'The Lighthouse Keeper', difficulty:2, level:5,
      paragraphs: [
        "Every evening, Mara climbed the ninety-seven steps to the top of the lighthouse. Her grandfather had kept the light for forty years, and now the task was hers.",
        "The lamp had to be lit before the sun dropped below the horizon. Sailors far out at sea depended on its steady beam to steer clear of the jagged rocks that ringed the bay.",
        "One stormy night, the power failed. Mara did not panic. She remembered her grandfather's oil lantern, stored in the cellar for exactly this kind of emergency, and carried it up the winding stairs.",
      ],
      questions: [
        { id:'cp-lh-q1', prompt:'Why did Mara stay calm when the power failed?',
          opts:[
            { t:'She knew a backup oil lantern was stored in the cellar.', ok:true },
            { t:'The sailors told her what to do over the radio.', ok:false },
            { t:'The storm stopped before it got dark.', ok:false },
            { t:'Her grandfather climbed the stairs to help her.', ok:false },
          ], hint:'Find the sentence that proves it.' },
        { id:'cp-lh-q2', prompt:'How many steps does Mara climb to reach the top of the lighthouse?',
          opts:[ { t:'Ninety-seven', ok:true }, { t:'Forty', ok:false }, { t:'A hundred', ok:false }, { t:'The passage does not say', ok:false } ],
          hint:'The number is stated in the first sentence.' },
        { id:'cp-lh-q3', prompt:'Who kept the lighthouse light before Mara?',
          opts:[ { t:'Her grandfather', ok:true }, { t:'A sailor', ok:false }, { t:'Her mother', ok:false }, { t:'No one — it was new', ok:false } ],
          hint:'Reread the first paragraph.' },
      ] },
    { id:'cp-desert', title:'Water in the Desert', difficulty:1, level:4,
      paragraphs: [
        "A camel can go for many days without drinking water. It does not store water in its hump, as many people believe — the hump is actually made of fat.",
        "When food is scarce, a camel's body slowly turns that fat into energy and a small amount of water. This is one reason camels survive so well in the desert.",
        "Wide, tough feet also help. They spread out on the sand so the camel does not sink, much like a person wearing snowshoes in deep snow.",
      ],
      questions: [
        { id:'cp-de-q1', prompt:'What is actually stored in a camel’s hump?',
          opts:[ { t:'Fat', ok:true }, { t:'Water', ok:false }, { t:'Sand', ok:false }, { t:'Air', ok:false } ],
          hint:'The second sentence corrects a common myth.' },
        { id:'cp-de-q2', prompt:'Why do camels have wide feet?',
          opts:[ { t:'So they don’t sink into the sand', ok:true }, { t:'To run faster', ok:false }, { t:'To carry more water', ok:false }, { t:'To stay cool', ok:false } ],
          hint:'Compare it to the snowshoes example.' },
        { id:'cp-de-q3', prompt:'What does the passage compare a camel’s feet to?',
          opts:[ { t:'Snowshoes', ok:true }, { t:'Boots', ok:false }, { t:'Flippers', ok:false }, { t:'Tires', ok:false } ],
          hint:'It’s in the last sentence.' },
      ] },
    { id:'cp-orchestra', title:'The Missing Instrument', difficulty:3, level:6,
      paragraphs: [
        "Before the concert, Jun counted the instrument cases lined up backstage: violins, cellos, a single harp, and a row of brass. One case was missing — the oboe.",
        "The conductor asked everyone to check under their chairs and behind the curtains, but there was no sign of it. Jun remembered that the oboist, Priya, had left early that afternoon for a dentist appointment.",
        "Jun called Priya, who laughed with relief — she had taken her oboe home by mistake, packed inside her backpack instead of leaving it in its usual case. She was only ten minutes away and turned around immediately.",
      ],
      questions: [
        { id:'cp-or-q1', prompt:'Why couldn’t anyone find the oboe backstage?',
          opts:[ { t:'Priya had accidentally taken it home in her backpack.', ok:true }, { t:'It had never arrived at the concert hall.', ok:false }, { t:'Someone hid it as a prank.', ok:false }, { t:'It was left at the dentist’s office.', ok:false } ],
          hint:'The answer is revealed in the phone call.' },
        { id:'cp-or-q2', prompt:'Why had Priya left early that afternoon?',
          opts:[ { t:'She had a dentist appointment.', ok:true }, { t:'She felt sick.', ok:false }, { t:'She forgot the concert time.', ok:false }, { t:'She was practicing at home.', ok:false } ],
          hint:'Jun remembers the reason in the second paragraph.' },
        { id:'cp-or-q3', prompt:'How did Priya react when Jun called her?',
          opts:[ { t:'With relief, and she laughed', ok:true }, { t:'With anger at the conductor', ok:false }, { t:'She didn’t answer the phone', ok:false }, { t:'She was too far away to return', ok:false } ],
          hint:'Look at the start of the final paragraph.' },
      ] },

    /* §15.1-style bank growth (2026-07-22): 3 → 8 passages, keeping the
       existing universal/no-gendered-assumption convention (characters and
       settings are generic — a lighthouse, a desert, an orchestra, a
       garden, a bakery, a library, a beach, a workshop — not tied to any
       one culture or region) and the difficulty spread (1 = Middle-tier
       easier band, 2-3 = full Senior range). */
    { id:'cp-garden', title:'The Community Garden', difficulty:1, level:3,
      paragraphs: [
        "Every Saturday, the neighbors met at the community garden behind the old brick building. Some grew tomatoes, others grew flowers, and one plot was covered entirely in pumpkins.",
        "In autumn, the garden held a harvest festival. Everyone brought a dish made from something they had grown, and the youngest gardeners handed out ribbons for the biggest pumpkin and the prettiest flower.",
        "This year, a plot that had been empty all summer suddenly filled with sunflowers taller than anyone had ever grown before — nobody could agree on whose plot it actually was, so they decided it belonged to the whole garden.",
      ],
      questions: [
        { id:'cp-ga-q1', prompt:'What happens at the garden every Saturday?',
          opts:[ { t:'Neighbors meet to tend their plots.', ok:true }, { t:'A farmers market is held.', ok:false }, { t:'The garden is closed for cleaning.', ok:false }, { t:'New plots are assigned.', ok:false } ],
          hint:'The first sentence says exactly what happens.' },
        { id:'cp-ga-q2', prompt:'What happens at the harvest festival?',
          opts:[ { t:'Everyone brings a dish and ribbons are given out.', ok:true }, { t:'New seeds are planted.', ok:false }, { t:'The garden is expanded.', ok:false }, { t:'Neighbors vote on new rules.', ok:false } ],
          hint:'Reread the second paragraph.' },
        { id:'cp-ga-q3', prompt:'Why did the neighbors decide the sunflower plot belonged to everyone?',
          opts:[ { t:'No one could agree on whose plot it was.', ok:true }, { t:'It was the biggest plot in the garden.', ok:false }, { t:'The sunflowers were planted by the whole group together.', ok:false }, { t:'It was the only plot left empty.', ok:false } ],
          hint:'The last sentence explains the reasoning.' },
      ] },
    { id:'cp-bakery', title:'The Bread That Wouldn’t Rise', difficulty:1, level:4,
      paragraphs: [
        "Every morning before sunrise, Theo opened the bakery and started the day's first batch of bread dough. For years, the recipe had never failed.",
        "One winter morning, the dough sat flat and refused to rise, no matter how long Theo waited. Customers were already lining up outside for their usual warm loaves.",
        "Theo finally realized the yeast packet was old — it had lost its power to make the dough grow. A fresh packet from the shelf below fixed the problem, and by midday, the ovens were full again.",
      ],
      questions: [
        { id:'cp-ba-q1', prompt:'What was wrong with the dough that morning?',
          opts:[ { t:'It would not rise.', ok:true }, { t:'It was burned.', ok:false }, { t:'It was too salty.', ok:false }, { t:'It was mixed in the wrong bowl.', ok:false } ],
          hint:'The second paragraph describes the problem directly.' },
        { id:'cp-ba-q2', prompt:'What was the actual cause of the problem?',
          opts:[ { t:'The yeast packet was old.', ok:true }, { t:'The oven was too cold.', ok:false }, { t:'Theo forgot the sugar.', ok:false }, { t:'The flour had gone bad.', ok:false } ],
          hint:'Look at the final paragraph.' },
        { id:'cp-ba-q3', prompt:'How was the problem finally solved?',
          opts:[ { t:'A fresh yeast packet was used instead.', ok:true }, { t:'The customers were sent home.', ok:false }, { t:'The dough was thrown away.', ok:false }, { t:'Theo baked a different recipe.', ok:false } ],
          hint:'The last sentence names the fix.' },
      ] },
    { id:'cp-tidepool', title:'Life in a Tide Pool', difficulty:2, level:5,
      paragraphs: [
        "At low tide, rocky pools along the shoreline become tiny, self-contained worlds. Sea stars cling to the rocks, hermit crabs scuttle between shells, and anemones wave their arms in the shallow water.",
        "These creatures survive twice-daily floods and droughts as the tide rises and falls. A hermit crab that outgrows its shell must find a bigger one quickly, or a rival crab may claim the new shell first.",
        "Scientists study tide pools because they show, in miniature, how animals adapt to a constantly changing environment — lessons that apply just as well to deserts or mountaintops as they do to the edge of the sea.",
      ],
      questions: [
        { id:'cp-td-q1', prompt:'What happens to tide pools twice a day?',
          opts:[ { t:'They flood and then dry out as the tide rises and falls.', ok:true }, { t:'They freeze overnight.', ok:false }, { t:'They fill with fresh rainwater.', ok:false }, { t:'They are cleaned by researchers.', ok:false } ],
          hint:'The second paragraph explains the daily cycle.' },
        { id:'cp-td-q2', prompt:'What must a hermit crab do if it outgrows its shell?',
          opts:[ { t:'Find a bigger shell quickly.', ok:true }, { t:'Grow a new shell on its own.', ok:false }, { t:'Stay in the same shell permanently.', ok:false }, { t:'Move to a different tide pool.', ok:false } ],
          hint:'Look at the second paragraph.' },
        { id:'cp-td-q3', prompt:'Why do scientists study tide pools?',
          opts:[ { t:'They show in miniature how animals adapt to change.', ok:true }, { t:'They contain rare minerals.', ok:false }, { t:'They are the only ocean habitat left.', ok:false }, { t:'They are easier to visit than the open ocean.', ok:false } ],
          hint:'The final sentence gives the reason.' },
      ] },
    { id:'cp-inventor', title:'The Accidental Invention', difficulty:2, level:5,
      paragraphs: [
        "In a small workshop, an engineer named Sam was trying to develop a super-strong glue for use in aircraft parts. Batch after batch turned out too weak to hold anything together.",
        "One failed batch was so weak that anything stuck to it could be peeled off cleanly, without leaving a mark or residue behind. Most people would have thrown it away.",
        "Instead, Sam kept the odd, weak glue on a shelf for years, until a colleague needed something that would stick a bookmark to a page without damaging it. That weak glue became the basis for a now-famous reusable sticky note.",
      ],
      questions: [
        { id:'cp-in-q1', prompt:'What was Sam originally trying to invent?',
          opts:[ { t:'A super-strong glue for aircraft parts.', ok:true }, { t:'A new kind of paper.', ok:false }, { t:'A stronger workshop tool.', ok:false }, { t:'A cleaning solution.', ok:false } ],
          hint:'The first sentence states the original goal.' },
        { id:'cp-in-q2', prompt:'What was unusual about the failed batch that Sam kept?',
          opts:[ { t:'It peeled off cleanly without leaving a mark.', ok:true }, { t:'It dried instantly.', ok:false }, { t:'It changed color over time.', ok:false }, { t:'It smelled unusual.', ok:false } ],
          hint:'The second paragraph describes the odd batch.' },
        { id:'cp-in-q3', prompt:'What did the failed glue eventually become useful for?',
          opts:[ { t:'A reusable sticky note.', ok:true }, { t:'A new type of paint.', ok:false }, { t:'Repairing aircraft parts after all.', ok:false }, { t:'A tool for cleaning workshops.', ok:false } ],
          hint:'The last sentence explains what it became.' },
      ] },
    { id:'cp-marathon', title:'The Runner Who Almost Quit', difficulty:3, level:6,
      paragraphs: [
        "By mile twenty of the marathon, Kai's legs felt like they belonged to someone else. Every runner who passed made the finish line feel further away, not closer.",
        "A volunteer at the water station recognized the look on Kai's face — the same look she'd worn during her own first marathon years earlier. She said only one thing: \"The wall breaks before you do.\"",
        "Kai didn't remember most of the next six miles, only that the legs kept moving anyway. Crossing the finish line felt less like a triumph and more like proof that the volunteer had been right all along.",
      ],
      questions: [
        { id:'cp-ma-q1', prompt:'How did Kai feel by mile twenty?',
          opts:[ { t:'Exhausted, as if the finish line was getting further away.', ok:true }, { t:'Confident and full of energy.', ok:false }, { t:'Ready to sprint the rest of the race.', ok:false }, { t:'Unaware of how far there was left to go.', ok:false } ],
          hint:'The first paragraph describes the feeling directly.' },
        { id:'cp-ma-q2', prompt:'Why did the volunteer say "the wall breaks before you do"?',
          opts:[ { t:'She recognized the same struggle from her own first marathon.', ok:true }, { t:'She was a doctor checking on runners.', ok:false }, { t:'She wanted Kai to stop running.', ok:false }, { t:'It was a rule posted at the water station.', ok:false } ],
          hint:'The second paragraph explains her own experience.' },
        { id:'cp-ma-q3', prompt:'How did crossing the finish line feel to Kai?',
          opts:[ { t:'Like proof the volunteer had been right.', ok:true }, { t:'Like a complete surprise.', ok:false }, { t:'Disappointing compared to expectations.', ok:false }, { t:'Exactly like every other race before it.', ok:false } ],
          hint:'The final sentence describes the feeling.' },
      ] },
  ],

  /* §26.12/O11: real Middle/Senior science content, resolving the finding
     that Science reused Junior's exact emoji-sort banks (living/non-living,
     sink/float, hot/cold, habitats, lifecycle) at every tier with zero
     scaling — a 12-year-old saw the identical content a 6-year-old did,
     just under relabeled stage titles, and the curriculum tags on those
     relabeled stages were themselves wrong (e.g. a stage labeled "Forces &
     Energy" mapped to NGSS 5-LS2, an ecosystems standard, tagged onto the
     `hotcold` sorting mechanic — neither the label nor the standard matched
     what the stage actually taught).
     Same schema as comprehensionPassages' inner questions (id, prompt,
     opts:[{t,ok}], hint) so the existing assertSingleCorrectOpt schema-test
     helper applies unchanged. difficulty 1-2 = Middle (grade-3 NGSS:
     3-PS2 forces, 3-LS1 life cycles/traits, 3-LS4 habitats/adaptation,
     3-ESS2 weather/climate), difficulty 2-3 = Senior (grade-5 NGSS: 5-PS1
     matter, 5-PS3 energy, 5-LS2 ecosystems/food webs, 5-ESS2/3 Earth
     systems). Real curriculum-accurate content, not Junior's banks reused. */
  scienceQuiz: [
    { id:'sq-force-1', skill:'science.forces_motion', curriculum:'NGSS 3-PS2-1', difficulty:1,
      prompt:'A soccer ball is sitting still on the grass. What is needed to make it start moving?',
      opts:[ { t:'A push or a pull (a force)', ok:true }, { t:'Nothing — it will move on its own', ok:false }, { t:'Sunlight', ok:false }, { t:'Time', ok:false } ],
      hint:'Think about what you actually do to a ball to get it rolling.' },
    { id:'sq-force-2', skill:'science.forces_motion', curriculum:'NGSS 3-PS2-2', difficulty:2,
      prompt:'Two toy cars are pushed with the same force. Car A is heavier than Car B. Which car speeds up faster?',
      opts:[ { t:'Car B, the lighter one', ok:true }, { t:'Car A, the heavier one', ok:false }, { t:'They speed up exactly the same', ok:false }, { t:'Neither moves at all', ok:false } ],
      hint:'A lighter object needs less force to change its speed by the same amount.' },
    { id:'sq-traits-1', skill:'science.life_cycles_traits', curriculum:'NGSS 3-LS3-1', difficulty:1,
      prompt:'A litter of puppies from the same parents all look a little different from each other. What best explains this?',
      opts:[ { t:'Offspring inherit a mix of traits from both parents, so siblings vary', ok:true }, { t:'Only the first puppy born gets its parents\' traits', ok:false }, { t:'Puppies choose what they look like as they grow', ok:false }, { t:'All puppies from the same litter are identical clones', ok:false } ],
      hint:'Think about how siblings in any family can look different, even with the same parents.' },
    { id:'sq-adapt-1', skill:'science.habitats', curriculum:'NGSS 3-LS4-3', difficulty:2,
      prompt:'A cactus has thick, waxy skin and stores water in its stem. Which environment does this best suit it for?',
      opts:[ { t:'A hot, dry desert', ok:true }, { t:'A cold arctic tundra', ok:false }, { t:'A rainy tropical forest', ok:false }, { t:'The deep ocean', ok:false } ],
      hint:'Think about which environment would make storing water and reducing water loss most useful.' },
    { id:'sq-adapt-2', skill:'science.habitats', curriculum:'NGSS 3-LS4-2', difficulty:2,
      prompt:'Over many generations, a population of moths became darker in color after tree bark in their forest turned sooty from pollution. What best explains this change?',
      opts:[ { t:'Darker moths were harder for predators to spot and survived more often', ok:true }, { t:'The moths chose to change their own color', ok:false }, { t:'Pollution directly dyed the moths\' wings darker', ok:false }, { t:'Lighter moths turned dark as individuals over their lifetime', ok:false } ],
      hint:'This is about which moths survived and reproduced, not about any one moth changing itself.' },
    { id:'sq-weather-1', skill:'science.weather_climate', curriculum:'NGSS 3-ESS2-1', difficulty:1,
      prompt:'What is the difference between weather and climate?',
      opts:[ { t:'Weather is day-to-day conditions; climate is the average pattern over many years', ok:true }, { t:'Weather and climate mean exactly the same thing', ok:false }, { t:'Climate changes every few hours; weather stays the same for years', ok:false }, { t:'Weather only happens in winter, climate only in summer', ok:false } ],
      hint:'Think about the difference between "what\'s it like outside today" and "what\'s this region usually like."' },
    { id:'sq-weather-2', skill:'science.weather_climate', curriculum:'NGSS 3-ESS2-2', difficulty:2,
      prompt:'A region has hot, dry summers and mild, rainy winters every single year. This repeating pattern describes the region\'s —',
      opts:[ { t:'climate', ok:true }, { t:'weather', ok:false }, { t:'longitude', ok:false }, { t:'population', ok:false } ],
      hint:'A single day\'s conditions are weather; the long-term repeating pattern is something else.' },
    { id:'sq-matter-1', skill:'science.matter_states', curriculum:'NGSS 3-PS2 (informal, states of matter)', difficulty:1,
      prompt:'Ice, liquid water, and steam are all made of the same substance. What causes water to change between these states?',
      opts:[ { t:'A change in temperature (heat added or removed)', ok:true }, { t:'A change in color', ok:false }, { t:'Mixing it with air', ok:false }, { t:'The container it is placed in', ok:false } ],
      hint:'Think about what happens when you heat ice or freeze liquid water.' },
    { id:'sq-force-3', skill:'science.forces_motion', curriculum:'NGSS 3-PS2-1', difficulty:2,
      prompt:'A book resting on a table isn\'t moving even though gravity is pulling it down. What is balancing gravity\'s pull?',
      opts:[ { t:'The table pushes back up on the book with an equal force', ok:true }, { t:'Gravity turns off when an object touches a surface', ok:false }, { t:'The book has no weight while it is on the table', ok:false }, { t:'Air pressure holds the book up', ok:false } ],
      hint:'Two forces can be present and still result in no motion if they balance out.' },
    { id:'sq-lifecycle-1', skill:'science.life_cycles_traits', curriculum:'NGSS 3-LS1-1', difficulty:1,
      prompt:'Which of these is true for every animal\'s life cycle, from an insect to a mammal?',
      opts:[ { t:'It includes being born (or hatching), growing, reproducing, and dying', ok:true }, { t:'It must include a stage where the animal cannot move at all', ok:false }, { t:'Every animal life cycle has exactly four stages', ok:false }, { t:'Only insects have a life cycle; mammals do not', ok:false } ],
      hint:'Think about what stages ALL living things share, not the specific stages of any one animal.' },
    { id:'sq-energy-1', skill:'science.energy_transfer', curriculum:'NGSS 5-PS3-1', difficulty:2,
      prompt:'A plant converts sunlight into stored chemical energy through photosynthesis. Where does that energy go when a rabbit eats the plant?',
      opts:[ { t:'It transfers to the rabbit, which uses and stores it', ok:true }, { t:'It disappears completely once the plant is eaten', ok:false }, { t:'It stays in the ground where the plant grew', ok:false }, { t:'It converts back into sunlight', ok:false } ],
      hint:'Energy moves through a food chain — it doesn\'t vanish when one organism eats another.' },
    { id:'sq-energy-2', skill:'science.energy_transfer', curriculum:'NGSS 5-PS3-1', difficulty:3,
      prompt:'In a food chain of grass → grasshopper → frog → snake, which organism has the LEAST energy available to it, and why?',
      opts:[ { t:'The snake — energy is lost as heat at each step up the chain', ok:true }, { t:'The grass — it makes the least energy of anything in the chain', ok:false }, { t:'The grasshopper — it eats the least food', ok:false }, { t:'All four organisms have exactly equal energy', ok:false } ],
      hint:'Energy decreases at each link because organisms use some of what they eat just to stay alive.' },
    { id:'sq-ecosystem-1', skill:'science.ecosystems', curriculum:'NGSS 5-LS2-1', difficulty:2,
      prompt:'In a forest ecosystem, what role do mushrooms and other fungi mainly play?',
      opts:[ { t:'Decomposers — they break down dead plants and animals, returning nutrients to the soil', ok:true }, { t:'Producers — they make their own food from sunlight like plants do', ok:false }, { t:'Top predators — they hunt other animals for food', ok:false }, { t:'They play no role in the ecosystem', ok:false } ],
      hint:'Think about what happens to a fallen log or a dead animal over time.' },
    { id:'sq-ecosystem-2', skill:'science.ecosystems', curriculum:'NGSS 5-LS2-1', difficulty:3,
      prompt:'If a disease wiped out most of the wolves in a forest ecosystem, what would most likely happen next?',
      opts:[ { t:'The deer population would likely grow, then overgraze the plants they eat', ok:true }, { t:'Nothing would change — predators don\'t affect other populations', ok:false }, { t:'All the plants in the forest would immediately die', ok:false }, { t:'The deer population would also shrink at the same time', ok:false } ],
      hint:'Think about what wolves normally keep in check, and what happens when that control is removed.' },
    { id:'sq-matter-2', skill:'science.matter_states', curriculum:'NGSS 5-PS1-1', difficulty:2,
      prompt:'A drop of food coloring spreads through a glass of water until the whole glass is evenly tinted. What best explains this?',
      opts:[ { t:'Matter is made of particles too small to see, and they spread out to fill the space', ok:true }, { t:'The food coloring disappears and new color is created in the water', ok:false }, { t:'Water pushes the color to the surface only', ok:false }, { t:'The glass itself changes color, not the water', ok:false } ],
      hint:'Think about matter at a very small scale — smaller than you can see with just your eyes.' },
    { id:'sq-matter-3', skill:'science.matter_states', curriculum:'NGSS 5-PS1-3', difficulty:3,
      prompt:'A student dissolves salt in water, then lets the water evaporate over several days. What happens to the salt?',
      opts:[ { t:'The salt remains behind as solid crystals — it did not disappear, only the water left', ok:true }, { t:'The salt evaporates along with the water and is gone for good', ok:false }, { t:'The salt turns into a new substance called saltwater gas', ok:false }, { t:'The salt is destroyed and stops existing', ok:false } ],
      hint:'Dissolving isn\'t the same as disappearing — think about what evaporation actually removes.' },
    { id:'sq-earth-1', skill:'science.earth_systems', curriculum:'NGSS 5-ESS2-1', difficulty:2,
      prompt:'Which of these best describes how Earth\'s water cycle keeps water moving between the ocean, air, and land?',
      opts:[ { t:'Water evaporates into the air, forms clouds, falls as rain, and flows back to the ocean', ok:true }, { t:'The same water molecules stay in the ocean forever and never move', ok:false }, { t:'New water is created by the sun every day', ok:false }, { t:'Water only moves during a rainstorm and is still the rest of the year', ok:false } ],
      hint:'Trace one water droplet\'s journey: ocean, sky, ground, and back again.' },
    { id:'sq-earth-2', skill:'science.earth_systems', curriculum:'NGSS 5-ESS3-1', difficulty:3,
      prompt:'A city gets its drinking water from a river that also receives runoff from nearby farms. Why might the city need to treat that water carefully?',
      opts:[ { t:'Farm runoff can carry fertilizer, soil, and other substances into the river that affect water quality', ok:true }, { t:'Rivers near farms always run completely dry by summer', ok:false }, { t:'Farms make river water taste better without any treatment needed', ok:false }, { t:'Water from rivers is never used for drinking anywhere', ok:false } ],
      hint:'Think about what could wash off of farmland and into a nearby river when it rains.' },
    { id:'sq-force-4', skill:'science.forces_motion', curriculum:'NGSS 3-PS2-1', difficulty:1,
      prompt:'You kick a soccer ball and it rolls across a grass field, slowing down until it stops. What force causes it to slow down?',
      opts:[ { t:'Friction between the ball and the grass', ok:true }, { t:'Gravity pulling it sideways', ok:false }, { t:'The ball running out of its own energy source', ok:false }, { t:'Magnetism from the ground', ok:false } ],
      hint:'Think about the rubbing/resistance between two surfaces in contact.' },
    { id:'sq-force-5', skill:'science.forces_motion', curriculum:'NGSS 3-PS2-1', difficulty:1,
      prompt:'A ball dropped from a hand always falls toward the ground. What force makes this happen?',
      opts:[ { t:'Gravity', ok:true }, { t:'Friction', ok:false }, { t:'Magnetism', ok:false }, { t:'Air pressure', ok:false } ],
      hint:'This is the same pull that keeps your feet on the ground.' },
    { id:'sq-force-6', skill:'science.forces_motion', curriculum:'NGSS 3-PS2-1', difficulty:1,
      prompt:'Two students push on opposite sides of the same box with equal force, and the box does not move. What best explains this?',
      opts:[ { t:'The two pushes balance each other out', ok:true }, { t:'The box has no forces acting on it', ok:false }, { t:'Only one push counts, so the box should move', ok:false }, { t:'The box is using its own force to resist', ok:false } ],
      hint:'When forces are equal and opposite, they cancel out.' },
    { id:'sq-weather-3', skill:'science.weather_climate', curriculum:'NGSS 3-ESS2-2', difficulty:1,
      prompt:'A weather reporter says it will be sunny and 75°F today. Is this describing weather or climate?',
      opts:[ { t:'Weather — it describes today\'s short-term conditions', ok:true }, { t:'Climate — it describes long-term average conditions', ok:false }, { t:'Both mean exactly the same thing', ok:false }, { t:'Neither — it is describing the season', ok:false } ],
      hint:'Weather is what\'s happening right now; climate is the long-term pattern.' },
    { id:'sq-weather-4', skill:'science.weather_climate', curriculum:'NGSS 3-ESS2-1', difficulty:1,
      prompt:'Which set of tools would best help you record and compare weather patterns over a whole month?',
      opts:[ { t:'A thermometer, rain gauge, and daily log', ok:true }, { t:'A single photo taken once', ok:false }, { t:'A map with no dates on it', ok:false }, { t:'A guess based on how the sky looks today', ok:false } ],
      hint:'Spotting a pattern takes repeated measurements over time, not a one-time look.' },
    { id:'sq-weather-5', skill:'science.weather_climate', curriculum:'NGSS 3-ESS2-2', difficulty:2,
      prompt:'A desert region gets very little rain all year, every year. This describes the region\'s —',
      opts:[ { t:'climate', ok:true }, { t:'weather', ok:false }, { t:'season only', ok:false }, { t:'forecast for tomorrow', ok:false } ],
      hint:'A pattern that holds true "every year" is describing the long-term average, not one day.' },
    { id:'sq-weather-6', skill:'science.weather_climate', curriculum:'NGSS 3-ESS2-1', difficulty:1,
      prompt:'Dark, heavy clouds are gathering and the wind is picking up. What is the most likely weather coming soon?',
      opts:[ { t:'Rain or a storm', ok:true }, { t:'A heatwave with no clouds', ok:false }, { t:'A snowstorm in summer', ok:false }, { t:'No change at all', ok:false } ],
      hint:'Dark clouds and wind are classic signs of an approaching storm.' },
    { id:'sq-matter-4', skill:'science.matter_states', curriculum:'NGSS 5-PS1-1', difficulty:1,
      prompt:'A puddle of water slowly disappears on a warm, sunny day even though no one touched it. What happened to the water?',
      opts:[ { t:'It evaporated into water vapor in the air', ok:true }, { t:'It was destroyed and no longer exists', ok:false }, { t:'It turned into ice', ok:false }, { t:'It soaked into the sun\'s rays', ok:false } ],
      hint:'Liquid water can change into a gas — it doesn\'t vanish.' },
    { id:'sq-matter-5', skill:'science.matter_states', curriculum:'NGSS 5-PS1-1', difficulty:1,
      prompt:'Which of these is an example of a solid changing into a liquid?',
      opts:[ { t:'An ice cube melting on the counter', ok:true }, { t:'Water boiling into steam', ok:false }, { t:'Steam forming droplets on a cold window', ok:false }, { t:'Juice freezing into ice pops', ok:false } ],
      hint:'Melting always goes from solid to liquid.' },
    { id:'sq-matter-8', skill:'science.matter_states', curriculum:'NGSS 5-PS1-1', difficulty:1,
      prompt:'Which of these is an example of a gas changing into a liquid?',
      opts:[ { t:'Steam forming water droplets on a cold window', ok:true }, { t:'An ice cube melting on the counter', ok:false }, { t:'Water boiling away in a kettle', ok:false }, { t:'Juice freezing into ice pops', ok:false } ],
      hint:'This is the opposite of evaporation — going from vapor back to liquid.' },
    { id:'sq-matter-6', skill:'science.matter_states', curriculum:'NGSS 5-PS1-3', difficulty:2,
      prompt:'You mix sand and water in a cup, then pour the mixture through a coffee filter. What best explains why the sand stays behind?',
      opts:[ { t:'Sand does not dissolve in water, so it stays as separate solid particles the filter can catch', ok:true }, { t:'The sand chemically reacts with the filter', ok:false }, { t:'Water always weighs less than sand', ok:false }, { t:'The filter magnetically attracts the sand', ok:false } ],
      hint:'Think about whether sand actually dissolves, the way salt or sugar would.' },
    { id:'sq-matter-7', skill:'science.matter_states', curriculum:'NGSS 5-PS1-3', difficulty:3,
      prompt:'A sealed jar holds 100g of ice. After the ice fully melts and then evaporates into water vapor (still sealed), what is the mass of matter in the jar?',
      opts:[ { t:'Still 100g — matter is conserved even when it changes state', ok:true }, { t:'More than 100g, since gases weigh more than solids', ok:false }, { t:'Less than 100g, since some matter is used up changing states', ok:false }, { t:'0g, since the ice no longer exists', ok:false } ],
      hint:'Changing state (solid→liquid→gas) doesn\'t create or destroy matter in a sealed container.' },
    { id:'sq-energy-3', skill:'science.energy_transfer', curriculum:'NGSS 5-PS3-1', difficulty:2,
      prompt:'A wind-up toy car stores energy in its twisted spring, then releases that energy to move across the floor. What kind of energy transfer is this?',
      opts:[ { t:'Stored (potential) energy converting into motion (kinetic) energy', ok:true }, { t:'Light energy converting into sound energy', ok:false }, { t:'The car creating brand-new energy from nothing', ok:false }, { t:'Heat energy converting into electrical energy', ok:false } ],
      hint:'Think about what kind of energy is "saved up" in a twisted spring before it\'s released.' },
    { id:'sq-energy-4', skill:'science.energy_transfer', curriculum:'NGSS 5-PS3-1', difficulty:3,
      prompt:'A solar panel on a calculator converts sunlight into electricity to run the display. Which best describes this chain of energy?',
      opts:[ { t:'Light energy is converted into electrical energy', ok:true }, { t:'Electrical energy is converted into light energy', ok:false }, { t:'Sound energy is converted into light energy', ok:false }, { t:'The calculator creates its own energy with no outside source', ok:false } ],
      hint:'A solar panel\'s whole job is to change one form of energy (from the sun) into another.' },
    { id:'sq-energy-5', skill:'science.energy_transfer', curriculum:'NGSS 5-PS3-1', difficulty:2,
      prompt:'In the food chain grass → rabbit → fox, where does the energy in the fox\'s body ultimately come from?',
      opts:[ { t:'The Sun, passed along through the grass and then the rabbit', ok:true }, { t:'The fox creates its own energy internally', ok:false }, { t:'The soil the grass grew in, directly', ok:false }, { t:'The rabbit\'s energy is new and unrelated to the grass', ok:false } ],
      hint:'Trace the energy chain back to its very first source.' },
    { id:'sq-ecosystem-3', skill:'science.ecosystems', curriculum:'NGSS 5-LS2-1', difficulty:2,
      prompt:'In a pond ecosystem, algae are eaten by small fish, which are eaten by larger fish. What role do the algae play?',
      opts:[ { t:'Producer — they make their own food and start the food chain', ok:true }, { t:'Decomposer — they break down dead material', ok:false }, { t:'Predator — they hunt the fish', ok:false }, { t:'They play no role in the food chain', ok:false } ],
      hint:'Which organism in this chain makes its own food using sunlight?' },
    { id:'sq-ecosystem-4', skill:'science.ecosystems', curriculum:'NGSS 5-LS2-1', difficulty:3,
      prompt:'A new species of fish is introduced to a lake and eats the same food as the native fish. What is the most likely effect on the ecosystem?',
      opts:[ { t:'Competition for food increases, which may reduce the native fish population', ok:true }, { t:'The lake\'s water automatically becomes cleaner', ok:false }, { t:'Nothing changes, since ecosystems never respond to new species', ok:false }, { t:'The native fish will immediately produce more offspring', ok:false } ],
      hint:'Two species relying on the same limited food source usually end up competing for it.' },
    { id:'sq-ecosystem-5', skill:'science.ecosystems', curriculum:'NGSS 5-LS2-1', difficulty:2,
      prompt:'Earthworms break down dead leaves and other decaying matter in the soil. What role does this make them in an ecosystem?',
      opts:[ { t:'Decomposers', ok:true }, { t:'Producers', ok:false }, { t:'Predators', ok:false }, { t:'Prey only', ok:false } ],
      hint:'Think about what happens to nutrients when something breaks dead matter back down.' },
  ],

  /* Middle (8–9) and Senior (10–12) stage lineups — reuse the existing
     generator engine (count/addition/subtraction/compare/phonics/etc.) at
     a higher adaptive baseline (§9.2 already seeds difficulty from age),
     plus the tier-specific mechanics above (word problems, comprehension,
     science quiz). Five stages per subject, same shape as Junior's
     stageConfigs so ActivityScreen's existing per-type switch (app.html)
     only needs new cases added per mechanic, not a parallel engine. */
  stageConfigsMiddle: {
    math: [
      { type:'addition',    skill:'math.addition_within_8', curriculum:'CCSS 3.OA', label:'Warm-Up Math', instruction:'How many blocks altogether?' },
      { type:'subtraction', skill:'math.subtraction_within_8', curriculum:'CCSS 3.OA', label:'Take-Away Practice', instruction:'Some fell down — how many are left?' },
      { type:'compare',     skill:'math.compare', curriculum:'CCSS 3.NBT', label:'Sharp Eyes', instruction:'Tap the tree with MORE apples!' },
      { type:'wordproblem', skill:'math.word_problems', curriculum:'CCSS 3.OA.A.3', label:'Word Problems', instruction:'Read carefully, then type your answer.', minTier:1, maxTier:1 },
      { type:'pattern',     skill:'math.patterns', curriculum:'CCSS 3.OA (patterns)', label:'Pattern Practice', instruction:'What comes next?' },
    ],
    words: [
      { type:'wordbuild',     skill:'words.word_building', curriculum:'CCSS RF.3', label:'Word Builder', instruction:'Build the word — put the letters in order!' },
      { type:'pairs',         skill:'words.word_picture', curriculum:'CCSS RF.3.3', label:'Matching Pairs', instruction:'Find the matching pairs!' },
      { type:'comprehension', skill:'words.comprehension', curriculum:'CCSS RL.3.1', label:'Story Time', instruction:'Read the passage, then answer.', minTier:1, maxTier:1 },
      { type:'phonics',       skill:'words.initial_sound', curriculum:'CCSS RF.3.3', label:'Sound Check', instruction:'Which picture starts with this letter?' },
      { type:'comprehension', skill:'words.comprehension', curriculum:'CCSS RL.3.1', label:'Another Story', instruction:'Read the passage, then answer.', minTier:1, maxTier:1 },
    ],
    /* §26.12/O11 fix: previously 5 stages of pure emoji-sort mechanics
       (sinkfloat/hotcold/livingmix) reused verbatim from Junior with no
       scaling. habitat/lifeorder kept — habitat/adaptation and life-cycle
       sequencing are genuinely real content at any age, just presented via
       an emoji-icon UI, and both curriculum tags were already accurate.
       The 3 stages that were pure Junior-level sorting (sink/float,
       hot/cold, living-vs-nonliving) are replaced with real grade-3 NGSS
       content via the new scienceQuiz mechanic, minTier 1 (Middle's band). */
    science: [
      { type:'habitat',     skill:'science.habitats', curriculum:'NGSS 3-LS4', label:'Animal Homes', instruction:'Where does this animal live? Tap its home!' },
      { type:'lifeorder',   skill:'science.lifecycle', curriculum:'NGSS 3-LS1', label:'Growing Up', instruction:'Put the cards in order — how does it grow?' },
      { type:'scienceQuiz', skill:'science.forces_motion', curriculum:'NGSS 3-PS2', label:'Forces & Motion', instruction:'Read carefully, then pick your answer.', minTier:1, maxTier:1 },
      { type:'scienceQuiz', skill:'science.weather_climate', curriculum:'NGSS 3-ESS2', label:'Weather & Climate', instruction:'Read carefully, then pick your answer.', minTier:1, maxTier:1 },
      { type:'scienceQuiz', skill:'science.matter_states', curriculum:'NGSS 3-PS1', label:'States of Matter', instruction:'Read carefully, then pick your answer.', minTier:1, maxTier:1 },
    ],
    music: [
      { type:'rhythm', skill:'music.rhythm', curriculum:'NCAS MU:Pr', label:'Beat Builder', instruction:'Follow the falling notes and tap along!', patternLen:5 },
      { type:'rhythm', skill:'music.rhythm', curriculum:'NCAS MU:Pr', label:'Echo Time', instruction:'Listen closely and echo the tune!', patternLen:5 },
      { type:'rhythm', skill:'music.rhythm', curriculum:'NCAS MU:Pr', label:'Longer Tunes', instruction:'A longer tune — tap it back!', patternLen:6 },
      { type:'rhythm', skill:'music.rhythm', curriculum:'NCAS MU:Pr', label:'Beat Builder Two', instruction:'Follow the falling notes and tap along!', patternLen:6 },
      { type:'rhythm', skill:'music.rhythm', curriculum:'NCAS MU:Pr', label:'Big Concert', instruction:'The big show — echo the whole tune!', patternLen:7 },
    ],
  },
  stageConfigsSenior: {
    math: [
      { type:'wordproblem', skill:'math.word_problems', curriculum:'CCSS 5.NF', label:'Fractions & Ratios', instruction:'Read carefully, then type your answer.', minTier:1, maxTier:3 },
      { type:'wordproblem', skill:'math.word_problems', curriculum:'CCSS 6.RP', label:'Ratios & Rates', instruction:'Read carefully, then type your answer.', minTier:2, maxTier:3 },
      { type:'compare',     skill:'math.compare', curriculum:'CCSS 5.NBT', label:'Number Sense', instruction:'Tap the tree with MORE apples!' },
      { type:'wordproblem', skill:'math.word_problems', curriculum:'CCSS 6.G', label:'Area & Geometry', instruction:'Read carefully, then type your answer.', minTier:1, maxTier:3 },
      { type:'pattern',     skill:'math.patterns', curriculum:'CCSS 5.OA (patterns)', label:'Patterns & Logic', instruction:'What comes next?' },
    ],
    words: [
      { type:'comprehension', skill:'words.comprehension', curriculum:'CCSS RL.5.1', label:'Reading & Grammar', instruction:'Read the passage, then answer.', minTier:1, maxTier:3 },
      { type:'comprehension', skill:'words.comprehension', curriculum:'CCSS RL.5.1', label:'Deeper Reading', instruction:'Read the passage, then answer.', minTier:2, maxTier:3 },
      { type:'wordbuild',     skill:'words.word_building', curriculum:'CCSS L.5', label:'Word Builder', instruction:'Build the word — put the letters in order!' },
      { type:'comprehension', skill:'words.comprehension', curriculum:'CCSS RL.5.1', label:'Challenge Passage', instruction:'Read the passage, then answer.', minTier:2, maxTier:3 },
      { type:'pairs',         skill:'words.word_picture', curriculum:'CCSS L.5', label:'Vocabulary Match', instruction:'Find the matching pairs!' },
    ],
    /* §26.12/O11 fix: previously the stage LABELS and curriculum tags
       promised real grade-5 concepts ("Forces & Energy", "Energy Transfer")
       but the actual MECHANIC underneath was still a Junior emoji-sort game
       (habitat, hotcold) with a mismatched curriculum citation (e.g. "Forces
       & Energy" tagged NGSS 5-LS2, an ecosystems standard, not physics).
       habitat/lifeorder kept (see Middle's version of this comment above —
       genuinely real content at this age too); the 3 stages that were
       label/tag-mismatched sorting games are replaced with real grade-5
       NGSS content via scienceQuiz, minTier 2 (Senior's band, difficulty
       2-3 items only). */
    science: [
      { type:'habitat',     skill:'science.habitats', curriculum:'NGSS 5-LS2', label:'Adaptation & Habitats', instruction:'Where does this animal live? Tap its home!' },
      { type:'lifeorder',   skill:'science.lifecycle', curriculum:'NGSS 5-LS1', label:'Life Cycles', instruction:'Put the cards in order — how does it grow?' },
      { type:'scienceQuiz', skill:'science.energy_transfer', curriculum:'NGSS 5-PS3', label:'Energy Transfer', instruction:'Read carefully, then pick your answer.', minTier:2, maxTier:3 },
      { type:'scienceQuiz', skill:'science.ecosystems', curriculum:'NGSS 5-LS2', label:'Ecosystems & Food Webs', instruction:'Read carefully, then pick your answer.', minTier:2, maxTier:3 },
      { type:'scienceQuiz', skill:'science.matter_states', curriculum:'NGSS 5-PS1', label:'Matter & Its Properties', instruction:'Read carefully, then pick your answer.', minTier:2, maxTier:3 },
    ],
    music: [
      { type:'rhythm', skill:'music.rhythm', curriculum:'NCAS MU:Pr', label:'Advanced Rhythm', instruction:'Follow the falling notes and tap along!', patternLen:6 },
      { type:'rhythm', skill:'music.rhythm', curriculum:'NCAS MU:Pr', label:'Echo Encore', instruction:'Listen closely and echo the tune!', patternLen:6 },
      { type:'rhythm', skill:'music.rhythm', curriculum:'NCAS MU:Pr', label:'Even Longer Tunes', instruction:'A longer tune — tap it back!', patternLen:7 },
      { type:'rhythm', skill:'music.rhythm', curriculum:'NCAS MU:Pr', label:'Beat Builder Pro', instruction:'Follow the falling notes and tap along!', patternLen:7 },
      { type:'rhythm', skill:'music.rhythm', curriculum:'NCAS MU:Pr', label:'Grand Concert', instruction:'The biggest show yet — echo the whole tune!', patternLen:8 },
    ],
  },
};
