// list from https://gist.github.com/nickgrealy/f3f27874d306a5d5048f02f0d3e14c07

const emojis = [
  '+1',
  '-1',
  '100',
  '1234',
  '8ball',
  'ab',
  'abc',
  'abcd',
  'accept',
  'adult',
  'aerial_tramway',
  'airplane_arriving',
  'airplane_departure',
  'alarm_clock',
  'alien',
  'ambulance',
  'amphora',
  'anchor',
  'angel',
  'anger',
  'angry',
  'anguished',
  'ant',
  'apple',
  'aquarius',
  'aries',
  'arrow_double_down',
  'arrow_double_up',
  'arrow_down_small',
  'arrow_up_small',
  'arrows_clockwise',
  'arrows_counterclockwise',
  'art',
  'articulated_lorry',
  'astonished',
  'athletic_shoe',
  'atm',
  'avocado',
  'baby',
  'baby_bottle',
  'baby_chick',
  'baby_symbol',
  'back',
  'bacon',
  'badminton_racquet_and_shuttlecock',
  'baggage_claim',
  'baguette_bread',
  'balloon',
  'bamboo',
  'banana',
  'bank',
  'bar_chart',
  'barber',
  'baseball',
  'basketball',
  'bat',
  'bath',
  'bathtub',
  'battery',
  'bear',
  'bearded_person',
  'bee',
  'beer',
  'beers',
  'beetle',
  'beginner',
  'bell',
  'bento',
  'bicyclist',
  'bike',
  'bikini',
  'billed_cap',
  'bird',
  'birthday',
  'black_circle',
  'black_heart',
  'black_joker',
  'black_large_square',
  'black_medium_small_square',
  'black_square_button',
  'blossom',
  'blowfish',
  'blue_book',
  'blue_car',
  'blue_heart',
  'blush',
  'boar',
  'boat',
  'bomb',
  'book',
  'bookmark',
  'bookmark_tabs',
  'books',
  'boom',
  'boot',
  'bouquet',
  'bow',
  'bow_and_arrow',
  'bowl_with_spoon',
  'bowling',
  'boxing_glove',
  'boy',
  'brain',
  'bread',
  'breast-feeding',
  'bride_with_veil',
  'bridge_at_night',
  'briefcase',
  'broccoli',
  'broken_heart',
  'bug',
  'bulb',
  'bullettrain_front',
  'bullettrain_side',
  'burrito',
  'bus',
  'busstop',
  'bust_in_silhouette',
  'busts_in_silhouette',
  'butterfly',
  'cactus',
  'cake',
  'calendar',
  'call_me_hand',
  'calling',
  'camel',
  'camera',
  'camera_with_flash',
  'cancer',
  'candy',
  'canned_food',
  'canoe',
  'capital_abcd',
  'capricorn',
  'car',
  'card_index',
  'carousel_horse',
  'carrot',
  'cat',
  'cat2',
  'cd',
  'champagne',
  'chart',
  'chart_with_downwards_trend',
  'chart_with_upwards_trend',
  'checkered_flag',
  'cheese_wedge',
  'cherries',
  'cherry_blossom',
  'chestnut',
  'chicken',
  'child',
  'children_crossing',
  'chocolate_bar',
  'chopsticks',
  'christmas_tree',
  'church',
  'cinema',
  'circus_tent',
  'city_sunrise',
  'city_sunset',
  'cl',
  'clap',
  'clapper',
  'clinking_glasses',
  'clipboard',
  'clock1',
  'clock10',
  'clock1030',
  'clock11',
  'clock1130',
  'clock12',
  'clock1230',
  'clock130',
  'clock2',
  'clock230',
  'clock3',
  'clock330',
  'clock4',
  'clock430',
  'clock5',
  'clock530',
  'clock6',
  'clock630',
  'clock7',
  'clock730',
  'clock8',
  'clock830',
  'clock9',
  'clock930',
  'closed_book',
  'closed_lock_with_key',
  'closed_umbrella',
  'clown_face',
  'coat',
  'cocktail',
  'coconut',
  'coffee',
  'cold_sweat',
  'collision',
  'computer',
  'confetti_ball',
  'confounded',
  'confused',
  'construction',
  'construction_worker',
  'convenience_store',
  'cookie',
  'cooking',
  'cool',
  'cop',
  'corn',
  'couple',
  'couple_with_heart',
  'couplekiss',
  'cow',
  'cow2',
  'crab',
  'credit_card',
  'crescent_moon',
  'cricket',
  'cricket_bat_and_ball',
  'crocodile',
  'croissant',
  'crossed_fingers',
  'crossed_flags',
  'crown',
  'cry',
  'crying_cat_face',
  'crystal_ball',
  'cucumber',
  'cup_with_straw',
  'cupid',
  'curling_stone',
  'curly_loop',
  'currency_exchange',
  'curry',
  'custard',
  'customs',
  'cut_of_meat',
  'cyclone',
  'dancer',
  'dancers',
  'dango',
  'dart',
  'dash',
  'date',
  'deciduous_tree',
  'deer',
  'department_store',
  'diamond_shape_with_a_dot_inside',
  'disappointed',
  'disappointed_relieved',
  'dizzy',
  'dizzy_face',
  'do_not_litter',
  'dog',
  'dog2',
  'dollar',
  'dolls',
  'dolphin',
  'door',
  'doughnut',
  'dragon',
  'dragon_face',
  'dress',
  'dromedary_camel',
  'drooling_face',
  'droplet',
  'drum_with_drumsticks',
  'duck',
  'dumpling',
  'dvd',
  'e-mail',
  'eagle',
  'ear',
  'ear_of_rice',
  'earth_africa',
  'earth_americas',
  'earth_asia',
  'egg',
  'eggplant',
  'electric_plug',
  'elephant',
  'elf',
  'end',
  'envelope_with_arrow',
  'euro',
  'european_castle',
  'european_post_office',
  'evergreen_tree',
  'exclamation',
  'exploding_head',
  'expressionless',
  'eyeglasses',
  'eyes',
  'face_palm',
  'face_vomiting',
  'face_with_cowboy_hat',
  'face_with_finger_covering_closed_lips',
  'face_with_hand_over_mouth',
  'face_with_head_bandage',
  'face_with_monocle',
  'face_with_one_eyebrow_raised',
  'face_with_open_mouth_vomiting',
  'face_with_raised_eyebrow',
  'face_with_rolling_eyes',
  'face_with_symbols_on_mouth',
  'face_with_thermometer',
  'facepunch',
  'factory',
  'fairy',
  'fallen_leaf',
  'family',
  'fast_forward',
  'fax',
  'fearful',
  'feet',
  'fencer',
  'ferris_wheel',
  'field_hockey_stick_and_ball',
  'file_folder',
  'fire',
  'fire_engine',
  'fireworks',
  'first_place_medal',
  'first_quarter_moon',
  'first_quarter_moon_with_face',
  'fish',
  'fish_cake',
  'fishing_pole_and_fish',
  'fist',
  'flags',
  'flashlight',
  'flipper',
  'floppy_disk',
  'flower_playing_cards',
  'flushed',
  'flying_saucer',
  'foggy',
  'football',
  'footprints',
  'fork_and_knife',
  'fortune_cookie',
  'fountain',
  'four_leaf_clover',
  'fox_face',
  'free',
  'fried_egg',
  'fried_shrimp',
  'fries',
  'frog',
  'frowning',
  'fuelpump',
  'full_moon',
  'full_moon_with_face',
  'game_die',
  'gem',
  'gemini',
  'genie',
  'ghost',
  'gift',
  'gift_heart',
  'giraffe_face',
  'girl',
  'glass_of_milk',
  'globe_with_meridians',
  'gloves',
  'goal_net',
  'goat',
  'golf',
  'gorilla',
  'grapes',
  'green_apple',
  'green_book',
  'green_heart',
  'green_salad',
  'grey_exclamation',
  'grey_question',
  'grimacing',
  'grin',
  'grinning',
  'grinning_face_with_one_large_and_one_small_eye',
  'grinning_face_with_star_eyes',
  'guardsman',
  'guitar',
  'gun',
  'haircut',
  'hamburger',
  'hammer',
  'hamster',
  'hand',
  'hand_with_index_and_middle_fingers_crossed',
  'handbag',
  'handball',
  'handshake',
  'hankey',
  'hatched_chick',
  'hatching_chick',
  'headphones',
  'hear_no_evil',
  'heart_decoration',
  'heart_eyes',
  'heart_eyes_cat',
  'heartbeat',
  'heartpulse',
  'heavy_division_sign',
  'heavy_dollar_sign',
  'heavy_exclamation_mark',
  'heavy_minus_sign',
  'heavy_plus_sign',
  'hedgehog',
  'helicopter',
  'herb',
  'hibiscus',
  'high_brightness',
  'high_heel',
  'hocho',
  'honey_pot',
  'honeybee',
  'horse',
  'horse_racing',
  'hospital',
  'hotdog',
  'hotel',
  'hourglass',
  'hourglass_flowing_sand',
  'house',
  'house_with_garden',
  'hugging_face',
  'hushed',
  'i_love_you_hand_sign',
  'ice_cream',
  'ice_hockey_stick_and_puck',
  'icecream',
  'id',
  'ideograph_advantage',
  'imp',
  'inbox_tray',
  'incoming_envelope',
  'information_desk_person',
  'innocent',
  'iphone',
  'izakaya_lantern',
  'jack_o_lantern',
  'japan',
  'japanese_castle',
  'japanese_goblin',
  'japanese_ogre',
  'jeans',
  'joy',
  'joy_cat',
  'juggling',
  'kaaba',
  'key',
  'keycap_ten',
  'kimono',
  'kiss',
  'kissing',
  'kissing_cat',
  'kissing_closed_eyes',
  'kissing_heart',
  'kissing_smiling_eyes',
  'kiwifruit',
  'knife',
  'koala',
  'koko',
  'lantern',
  'large_blue_circle',
  'large_blue_diamond',
  'large_orange_diamond',
  'last_quarter_moon',
  'last_quarter_moon_with_face',
  'laughing',
  'leaves',
  'ledger',
  'left-facing_fist',
  'left_luggage',
  'lemon',
  'leo',
  'leopard',
  'libra',
  'light_rail',
  'link',
  'lion_face',
  'lips',
  'lipstick',
  'lizard',
  'lock',
  'lock_with_ink_pen',
  'lollipop',
  'loop',
  'loud_sound',
  'loudspeaker',
  'love_hotel',
  'love_letter',
  'low_brightness',
  'lying_face',
  'mag',
  'mag_right',
  'mage',
  'mahjong',
  'mailbox',
  'mailbox_closed',
  'mailbox_with_mail',
  'mailbox_with_no_mail',
  'man',
  'man-woman-boy',
  'man_and_woman_holding_hands',
  'man_dancing',
  'man_in_tuxedo',
  'man_with_gua_pi_mao',
  'man_with_turban',
  'mans_shoe',
  'maple_leaf',
  'martial_arts_uniform',
  'mask',
  'massage',
  'meat_on_bone',
  'mega',
  'melon',
  'memo',
  'menorah_with_nine_branches',
  'mens',
  'merperson',
  'metro',
  'microphone',
  'microscope',
  'middle_finger',
  'milky_way',
  'minibus',
  'minidisc',
  'mobile_phone_off',
  'money_mouth_face',
  'money_with_wings',
  'moneybag',
  'monkey',
  'monkey_face',
  'monorail',
  'moon',
  'mortar_board',
  'mosque',
  'mother_christmas',
  'motor_scooter',
  'mount_fuji',
  'mountain_bicyclist',
  'mountain_cableway',
  'mountain_railway',
  'mouse',
  'mouse2',
  'movie_camera',
  'moyai',
  'mrs_claus',
  'muscle',
  'mushroom',
  'musical_keyboard',
  'musical_note',
  'musical_score',
  'mute',
  'nail_care',
  'name_badge',
  'nauseated_face',
  'necktie',
  'negative_squared_cross_mark',
  'nerd_face',
  'neutral_face',
  'new',
  'new_moon',
  'new_moon_with_face',
  'newspaper',
  'ng',
  'night_with_stars',
  'no_bell',
  'no_bicycles',
  'no_entry',
  'no_entry_sign',
  'no_good',
  'no_mobile_phones',
  'no_mouth',
  'no_pedestrians',
  'no_smoking',
  'non-potable_water',
  'nose',
  'notebook',
  'notebook_with_decorative_cover',
  'notes',
  'nut_and_bolt',
  'o',
  'ocean',
  'octagonal_sign',
  'octopus',
  'oden',
  'office',
  'ok',
  'ok_hand',
  'ok_woman',
  'older_adult',
  'older_man',
  'older_woman',
  'on',
  'oncoming_automobile',
  'oncoming_bus',
  'oncoming_police_car',
  'oncoming_taxi',
  'open_book',
  'open_file_folder',
  'open_hands',
  'open_mouth',
  'ophiuchus',
  'orange_book',
  'orange_heart',
  'outbox_tray',
  'owl',
  'ox',
  'package',
  'page_facing_up',
  'page_with_curl',
  'pager',
  'palm_tree',
  'palms_up_together',
  'pancakes',
  'panda_face',
  'paperclip',
  'partly_sunny',
  'passport_control',
  'paw_prints',
  'peach',
  'peanuts',
  'pear',
  'pencil',
  'penguin',
  'pensive',
  'performing_arts',
  'persevere',
  'person_climbing',
  'person_doing_cartwheel',
  'person_frowning',
  'person_in_lotus_position',
  'person_in_steamy_room',
  'person_with_blond_hair',
  'person_with_headscarf',
  'person_with_pouting_face',
  'pie',
  'pig',
  'pig2',
  'pig_nose',
  'pill',
  'pineapple',
  'pisces',
  'pizza',
  'place_of_worship',
  'point_down',
  'point_left',
  'point_right',
  'point_up_2',
  'police_car',
  'poodle',
  'poop',
  'popcorn',
  'post_office',
  'postal_horn',
  'postbox',
  'potable_water',
  'potato',
  'pouch',
  'poultry_leg',
  'pound',
  'pouting_cat',
  'pray',
  'prayer_beads',
  'pregnant_woman',
  'pretzel',
  'prince',
  'princess',
  'punch',
  'purple_heart',
  'purse',
  'pushpin',
  'put_litter_in_its_place',
  'question',
  'rabbit',
  'rabbit2',
  'racehorse',
  'radio',
  'radio_button',
  'rage',
  'railway_car',
  'rainbow',
  'raised_back_of_hand',
  'raised_hand',
  'raised_hands',
  'raising_hand',
  'ram',
  'ramen',
  'rat',
  'red_car',
  'red_circle',
  'relieved',
  'repeat',
  'repeat_one',
  'restroom',
  'reversed_hand_with_middle_finger_extended',
  'revolving_hearts',
  'rewind',
  'rhinoceros',
  'ribbon',
  'rice',
  'rice_ball',
  'rice_cracker',
  'rice_scene',
  'right-facing_fist',
  'ring',
  'robot_face',
  'rocket',
  'roller_coaster',
  'rolling_on_the_floor_laughing',
  'rooster',
  'rose',
  'rotating_light',
  'round_pushpin',
  'rowboat',
  'rugby_football',
  'runner',
  'running',
  'running_shirt_with_sash',
  'sagittarius',
  'sailboat',
  'sake',
  'sandal',
  'sandwich',
  'santa',
  'satellite_antenna',
  'satisfied',
  'sauropod',
  'saxophone',
  'scarf',
  'school',
  'school_satchel',
  'scooter',
  'scorpion',
  'scorpius',
  'scream',
  'scream_cat',
  'scroll',
  'seat',
  'second_place_medal',
  'see_no_evil',
  'seedling',
  'selfie',
  'serious_face_with_symbols_covering_mouth',
  'shallow_pan_of_food',
  'shark',
  'shaved_ice',
  'sheep',
  'shell',
  'ship',
  'shirt',
  'shit',
  'shocked_face_with_exploding_head',
  'shoe',
  'shopping_trolley',
  'shower',
  'shrimp',
  'shrug',
  'shushing_face',
  'sign_of_the_horns',
  'signal_strength',
  'six_pointed_star',
  'ski',
  'skin-tone-2',
  'skin-tone-3',
  'skin-tone-4',
  'skin-tone-5',
  'skin-tone-6',
  'skull',
  'sled',
  'sleeping',
  'sleeping_accommodation',
  'sleepy',
  'slightly_frowning_face',
  'slightly_smiling_face',
  'slot_machine',
  'small_blue_diamond',
  'small_orange_diamond',
  'small_red_triangle',
  'small_red_triangle_down',
  'smile',
  'smile_cat',
  'smiley',
  'smiley_cat',
  'smiling_face_with_smiling_eyes_and_hand_covering_mouth',
  'smiling_imp',
  'smirk',
  'smirk_cat',
  'smoking',
  'snail',
  'snake',
  'sneezing_face',
  'snowboarder',
  'snowman_without_snow',
  'sob',
  'soccer',
  'socks',
  'soon',
  'sos',
  'sound',
  'space_invader',
  'spaghetti',
  'sparkler',
  'sparkles',
  'sparkling_heart',
  'speak_no_evil',
  'speaker',
  'speech_balloon',
  'speedboat',
  'spock-hand',
  'spoon',
  'sports_medal',
  'squid',
  'star',
  'star-struck',
  'star2',
  'stars',
  'station',
  'statue_of_liberty',
  'steam_locomotive',
  'stew',
  'straight_ruler',
  'strawberry',
  'stuck_out_tongue',
  'stuck_out_tongue_closed_eyes',
  'stuck_out_tongue_winking_eye',
  'stuffed_flatbread',
  'sun_with_face',
  'sunflower',
  'sunglasses',
  'sunrise',
  'sunrise_over_mountains',
  'surfer',
  'sushi',
  'suspension_railway',
  'sweat',
  'sweat_drops',
  'sweat_smile',
  'sweet_potato',
  'swimmer',
  'symbols',
  'synagogue',
  'syringe',
  't-rex',
  'table_tennis_paddle_and_ball',
  'taco',
  'tada',
  'takeout_box',
  'tanabata_tree',
  'tangerine',
  'taurus',
  'taxi',
  'tea',
  'telephone_receiver',
  'telescope',
  'tennis',
  'tent',
  'the_horns',
  'thinking_face',
  'third_place_medal',
  'thought_balloon',
  'thumbsdown',
  'thumbsup',
  'ticket',
  'tiger',
  'tiger2',
  'tired_face',
  'toilet',
  'tokyo_tower',
  'tomato',
  'tongue',
  'top',
  'tophat',
  'tractor',
  'traffic_light',
  'train',
  'train2',
  'tram',
  'triangular_flag_on_post',
  'triangular_ruler',
  'trident',
  'triumph',
  'trolleybus',
  'trophy',
  'tropical_drink',
  'tropical_fish',
  'truck',
  'trumpet',
  'tshirt',
  'tulip',
  'tumbler_glass',
  'turkey',
  'turtle',
  'tv',
  'twisted_rightwards_arrows',
  'two_hearts',
  'two_men_holding_hands',
  'two_women_holding_hands',
  'u5272',
  'u5408',
  'u55b6',
  'u6307',
  'u6709',
  'u6e80',
  'u7121',
  'u7533',
  'u7981',
  'u7a7a',
  'umbrella_with_rain_drops',
  'unamused',
  'underage',
  'unicorn_face',
  'unlock',
  'up',
  'upside_down_face',
  'vampire',
  'vertical_traffic_light',
  'vhs',
  'vibration_mode',
  'video_camera',
  'video_game',
  'violin',
  'virgo',
  'volcano',
  'volleyball',
  'vs',
  'walking',
  'waning_crescent_moon',
  'waning_gibbous_moon',
  'watch',
  'water_buffalo',
  'water_polo',
  'watermelon',
  'wave',
  'waving_black_flag',
  'waxing_crescent_moon',
  'waxing_gibbous_moon',
  'wc',
  'weary',
  'wedding',
  'whale',
  'whale2',
  'wheelchair',
  'white_check_mark',
  'white_circle',
  'white_flower',
  'white_large_square',
  'white_medium_small_square',
  'white_square_button',
  'wilted_flower',
  'wind_chime',
  'wine_glass',
  'wink',
  'wolf',
  'woman',
  'womans_clothes',
  'womans_hat',
  'womens',
  'worried',
  'wrench',
  'wrestlers',
  'x',
  'yellow_heart',
  'yen',
  'yum',
  'zany_face',
  'zap',
  'zebra_face',
  'zipper_mouth_face',
  'zombie',
  'zzz',
];

export default emojis;
