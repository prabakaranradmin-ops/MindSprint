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

  stageConfigs: {
    math: [
      { type:'count',      skill:'math.count_to_5',        label:'Count the Apples!', instruction:'How many apples do you see?',        maxCount:5 },
      { type:'count',      skill:'math.count_to_9',        label:'More Apples!',      instruction:'Count carefully — how many apples?', maxCount:9 },
      { type:'addition',   skill:'math.addition_within_8', label:'Apple Addition! ➕', instruction:'How many apples altogether?' },
      { type:'subtraction',skill:'math.subtraction_within_8', label:'Take Away! ➖',   instruction:'Some fell down — how many are left?' },
      { type:'compare',    skill:'math.compare',           label:'More or Fewer? 🤔', instruction:'Tap the tree with MORE apples!' },
    ],
    words: [
      { type:'phonics', skill:'words.initial_sound', label:'Letter Sounds! 🔤',   instruction:'Which picture starts with this letter?' },
      { type:'phonics', skill:'words.initial_sound', label:'More Sounds! 🔤',     instruction:'Find the word that starts with this sound!' },
      { type:'phonics', skill:'words.initial_sound', label:'Sound Expert! 🌟',    instruction:"You're getting so good! Find the match!" },
      { type:'wordpic', skill:'words.word_picture',  label:'Word & Picture! 🖼️',  instruction:'Tap the picture that matches the word!' },
      { type:'phonics', skill:'words.initial_sound', label:'Champion Sounds! 🏆', instruction:'Last challenge — find the right sound!' },
    ],
    science: [
      { type:'livingmix', skill:'science.living_nonliving', label:'Sort it Out! 🌱',     instruction:'Tap the right group!' },
      { type:'sinkfloat', skill:'science.sink_float',       label:'Sink or Float? 💧',   instruction:'Drop it in water — does it sink or float?' },
      { type:'hotcold',   skill:'science.hot_cold',         label:'Hot or Cold? 🔥❄️',   instruction:'Is it hot or cold? Tap the right zone!' },
      { type:'habitat',   skill:'science.habitats',         label:'Animal Homes! 🏠',    instruction:'Where does this animal live? Tap its home!' },
      { type:'lifecycle', skill:'science.lifecycle',        label:'What Comes Next? 🔄', instruction:'Look at the lifecycle — what comes next?' },
    ],
  },

  skillLabels: {
    'math.count_to_5': 'Counting to 5', 'math.count_to_9': 'Counting to 9',
    'math.addition_within_8': 'Addition', 'math.subtraction_within_8': 'Subtraction',
    'math.compare': 'Comparing amounts',
    'words.initial_sound': 'Letter sounds', 'words.word_picture': 'Word reading',
    'science.living_nonliving': 'Living things', 'science.size': 'Big & small',
    'science.sink_float': 'Sink or float', 'science.hot_cold': 'Hot & cold',
    'science.habitats': 'Animal homes', 'science.lifecycle': 'Life cycles',
  },

  phonics: [
    { id:'ph-s', letter:'S', difficulty:1, opts:[{w:'Sun',e:'☀️',ok:true},{w:'Dog',e:'🐕',ok:false},{w:'Hat',e:'🎩',ok:false}] },
    { id:'ph-b', letter:'B', difficulty:2, opts:[{w:'Bear',e:'🐻',ok:true},{w:'Fish',e:'🐟',ok:false},{w:'Egg',e:'🥚',ok:false}] },
    { id:'ph-c', letter:'C', difficulty:2, opts:[{w:'Cake',e:'🎂',ok:true},{w:'Frog',e:'🐸',ok:false},{w:'Kite',e:'🪁',ok:false}] },
    { id:'ph-f', letter:'F', difficulty:1, opts:[{w:'Fox',e:'🦊',ok:true},{w:'Rain',e:'🌧️',ok:false},{w:'Ball',e:'⚽',ok:false}] },
    { id:'ph-m', letter:'M', difficulty:1, opts:[{w:'Moon',e:'🌙',ok:true},{w:'Tree',e:'🌲',ok:false},{w:'Sock',e:'🧦',ok:false}] },
    { id:'ph-t', letter:'T', difficulty:1, opts:[{w:'Tiger',e:'🐯',ok:true},{w:'Bee',e:'🐝',ok:false},{w:'Leaf',e:'🍃',ok:false}] },
    { id:'ph-r', letter:'R', difficulty:2, opts:[{w:'Rock',e:'🪨',ok:true},{w:'Lamp',e:'💡',ok:false},{w:'Wing',e:'🪽',ok:false}] },
    { id:'ph-p', letter:'P', difficulty:2, opts:[{w:'Pizza',e:'🍕',ok:true},{w:'Shoe',e:'👟',ok:false},{w:'Star',e:'⭐',ok:false}] },
    { id:'ph-d', letter:'D', difficulty:2, opts:[{w:'Duck',e:'🦆',ok:true},{w:'Map',e:'🗺️',ok:false},{w:'Cup',e:'🥤',ok:false}] },
    { id:'ph-h', letter:'H', difficulty:2, opts:[{w:'Horse',e:'🐴',ok:true},{w:'Bird',e:'🐦',ok:false},{w:'Cake',e:'🎂',ok:false}] },
    { id:'ph-n', letter:'N', difficulty:2, opts:[{w:'Nest',e:'🪺',ok:true},{w:'Cat',e:'🐱',ok:false},{w:'Ball',e:'🎾',ok:false}] },
    { id:'ph-w', letter:'W', difficulty:2, opts:[{w:'Whale',e:'🐳',ok:true},{w:'Apple',e:'🍎',ok:false},{w:'Fire',e:'🔥',ok:false}] },
  ],

  wordpic: [
    { id:'wp-cat',  word:'CAT',  difficulty:1, opts:[{e:'🐱',ok:true},{e:'🐶',ok:false},{e:'🐰',ok:false}] },
    { id:'wp-fish', word:'FISH', difficulty:1, opts:[{e:'🐟',ok:true},{e:'🦅',ok:false},{e:'🐢',ok:false}] },
    { id:'wp-star', word:'STAR', difficulty:1, opts:[{e:'⭐',ok:true},{e:'🌙',ok:false},{e:'☀️',ok:false}] },
    { id:'wp-tree', word:'TREE', difficulty:1, opts:[{e:'🌲',ok:true},{e:'🌸',ok:false},{e:'🍄',ok:false}] },
    { id:'wp-cake', word:'CAKE', difficulty:2, opts:[{e:'🎂',ok:true},{e:'🍕',ok:false},{e:'🍦',ok:false}] },
    { id:'wp-bird', word:'BIRD', difficulty:2, opts:[{e:'🐦',ok:true},{e:'🐛',ok:false},{e:'🦋',ok:false}] },
    { id:'wp-frog', word:'FROG', difficulty:2, opts:[{e:'🐸',ok:true},{e:'🐍',ok:false},{e:'🐢',ok:false}] },
    { id:'wp-ship', word:'SHIP', difficulty:2, opts:[{e:'🚢',ok:true},{e:'✈️',ok:false},{e:'🚂',ok:false}] },
  ],

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
  ],

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
  ],
};
