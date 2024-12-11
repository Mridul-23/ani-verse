# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


import re
from scrapy.exceptions import DropItem

import re
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.tag import pos_tag
from nltk.stem import WordNetLemmatizer
from scrapy.exceptions import DropItem

genre_rules = {
    'Action': ['action', 'battle', 'fight', 'combat', 'hero', 'adventure', 'explosive', 'dungeon', 'hunters', 'skirmish', 'war', 'weapon', 'fighting spirit', 'clash', 'bravery', 'martial arts', 'superpowers', 'melee', 'showdown'],
    'Adventure': ['adventure', 'journey', 'quest', 'explore', 'travel', 'discovery', 'epic', 'treasure', 'expedition', 'explorer', 'voyage', 'odyssey', 'thrilling', 'exciting', 'exploration', 'questing', 'quest for adventure', 'wanderlust'],
    'Comedy': ['comedy', 'humor', 'funny', 'laugh', 'comical', 'satire', 'light-hearted', 'parody', 'wit', 'joke', 'hilarious', 'laughter', 'entertaining', 'comic relief', 'whimsical', 'absurd'],
    'Drama': ['drama', 'emotion', 'relationship', 'heartfelt', 'dramatic', 'tearjerker', 'heart break', 'emotional', 'tension', 'touching', 'tragic', 'struggle', 'gripping'],
    'Fantasy': ['fantasy', 'magic', 'mythical', 'magical', 'enchantment', 'fantastical', 'otherworldly', 'elves', 'sorcery', 'wizardry', 'enchanted', 'legend', 'fairy tale', 'mystical beings', 'epic fantasy', 'fantasy world', 'magic spells'],
    'Science Fiction': ['science fiction', 'futuristic', 'space', 'alien', 'cyberpunk', 'dystopian', 'robots', 'future', 'extraterrestrial', 'spacecraft', 'sci-fi', 'interstellar', 'advanced', 'cyborgs', 'virtual reality', 'time travel'],
    'Romance': ['romance', 'love', 'relationship', 'romantic', 'passion', 'heartwarming', 'love triangle', 'affection', 'chemistry', 'flirting', 'bittersweet', 'embrace', 'yearning', 'infatuation', 'soulmate', 'romantic tension', 'unrequited love'],
    'Horror': ['horror', 'fear', 'terror', 'creepy', 'supernatural', 'haunting', 'nightmare', 'horrible', 'chilling', 'spooky', 'ghost', 'terrifying', 'macabre', 'eerie', 'psychological horror', 'gore', 'suspense', 'massacre'],
    'Mystery': ['mystery', 'detective', 'investigation', 'suspense', 'mysterious', 'puzzle', 'cryptic', 'enigma', 'clue', 'secret', 'conspiracy', 'riddle', 'detective work', 'solve the mystery'],
    'Thriller': ['thriller', 'suspenseful', 'intense', 'adrenaline', 'danger', 'action-packed', 'nail-biting', 'suspense', 'excitement', 'climax', 'tension', 'edge-of-your-seat', 'gripping', 'heart-pounding', 'conspiracy thriller', 'cat-and-mouse'],
    'Slice of Life': ['slice of life', 'real-life', 'routine', 'mundane', 'daily life', 'slice-of-life', 'everyday life', 'laid-back', 'unremarkable', 'slice-of-life moments', 'simple', 'domestic'],
    'Supernatural': ['supernatural', 'paranormal', 'occult', 'spiritual', 'mystical', 'otherworldly', 'magic', 'mysterious', 'witch', 'demon', 'sorcerer', 'haunted', 'spirit', 'specter', 'dark magic', 'occult ritual', 'ghostly'],
    'Mecha': ['mecha', 'giant robot', 'pilot', 'mechanical', 'robotic', 'mecha battles', 'robots', 'mech', 'robot suit', 'mechanized', 'mechanism', 'mech pilot', 'robotic warfare', 'mechanical engineering', 'mecha anime', 'robotic uprising'],
    'Shounen': ['shounen', 'young boy', 'teenage protagonist', 'fighting', 'friendship', 'action-packed', 'battle', 'heroic', 'training', 'chivalry', 'aspiring', 'determined', 'ambitious', 'shounen anime', 'young heroes', 'power-ups', 'epic battles', 'rivalry'],
    'Shoujo': ['shoujo', 'young girl', 'teenage protagonist', 'romantic', 'friendship', 'heartwarming', 'romance', 'love', 'emotional', 'drama', 'cute', 'sensitive', 'dreamy', 'affectionate', 'shoujo anime', 'magical girl transformation', 'pure-hearted'],
    'Seinen': ['seinen', 'adult', 'mature themes', 'dark', 'psychological', 'gritty', 'violent', 'brutal', 'hard-hitting', 'realistic', 'complex', 'suspenseful', 'grim', 'seinen anime', 'mature audience', 'adult themes', 'grimdark', 'existential'],
    'Josei': ['josei', 'adult woman', 'mature themes', 'romantic', 'slice of life', 'emotional', 'deep', 'introspective', 'thought-provoking', 'sensual', 'nuanced', 'reflective', 'josei anime', 'mature audience', 'romantic drama', 'life struggles', 'mature romance'],
    'Psychological': ['psychological', 'mind', 'psyche', 'mental', 'mind games', 'trauma', 'inner demons', 'psychological warfare', 'twisted', 'manipulation', 'mental illness', 'psychological thriller', 'psychological drama', 'paranoia', 'psychological horror', 'identity crisis'],
    'Sports': ['sports', 'athletic', 'competition', 'team', 'individual', 'sportsmanship', 'athlete', 'sporting event', 'team spirit', 'training', 'coach', 'victory', 'dedication', 'struggle', 'sports anime', 'athleticism', 'champion', 'sports drama'],
    'Historical': ['historical', 'period', 'era', 'retro', 'vintage', 'historic event', 'past', 'time period', 'historical figure', 'antique', 'classic', 'heritage', 'nostalgic', 'history', 'historical setting', 'period drama', 'historical accuracy', 'historical fiction'],
    'Music': ['music', 'musical', 'band', 'concert', 'performing arts', 'melody', 'singing', 'rhythm', 'instrument', 'song', 'performance', 'harmony', 'musician', 'ensemble', 'music-themed anime', 'rock band', 'pop idol', 'musical journey'],
    'School': ['school', 'high school', 'student', 'classmate', 'teacher', 'teenage', 'academy', 'school life', 'student life', 'classroom', 'school uniform', 'education', 'school setting', 'school club', 'student council', 'academic'],
    'Ecchi': ['ecchi', 'sexual humor', 'fan service', 'provocative', 'sexy', 'lewd', 'perverted', 'erotic', 'adult content', 'teasing', 'stimulating', 'risqué', 'ecchi scenes', 'sexy girls', 'romantic tension', 'ecchi comedy', 'adult humor'],
    'Harem': ['harem', 'multiple love interests', 'romantic rivalry', 'love triangle', 'romantic comedy', 'reverse harem', 'love polygon', 'flirtation', 'harem anime', 'amorous', 'passionate', 'harem fantasy', 'romantic harem', 'harem protagonist', 'harem comedy', 'harem romance'],
    'Isekai': ['isekai', 'other world', 'transported', 'reincarnation', 'fantasy world', 'parallel universe', 'reincarnated', 'isekai anime', 'alternate world', 'isekai fantasy', 'isekai adventure', 'isekai protagonist', 'isekai reincarnation', 'isekai genre', 'isekai journey', 'isekai magic', 'trapped in another world', 'reincarnation'],
    'Cyberpunk': ['cyberpunk', 'high tech', 'low life', 'cyberspace', 'neon lights', 'dystopian', 'cybernetic', 'cyber', 'cyberpunk anime', 'cyberpunk world', 'cybernetic implants', 'cybernetic enhancement', 'cyberpunk society', 'cyberpunk dystopia', 'cyberpunk aesthetic', 'cybernetic society'],
    'Post-Apocalyptic': ['post-apocalyptic', 'apocalypse', 'wasteland', 'survival', 'dystopia', 'rebuilding', 'post-apocalyptic world', 'end of the world', 'nuclear fallout', 'survivor', 'apocalyptic landscape', 'apocalyptic fiction', 'post-apocalyptic society', 'post-apocalyptic anime', 'ruins'],
    'Martial Arts': ['martial arts', 'combat', 'martial artist', 'dojo', 'tournament', 'training', 'fighting tournament', 'martial arts master', 'martial arts school', 'battle', 'martial arts tournament', 'kung fu', 'karate', 'fighting spirit', 'martial arts training', 'combat skills', 'martial arts action'],
    'hentai' : ['hentai', 'adult', 'explicit', 'porn', 'erotic', 'sexual', 'sex', 'fuck', 'intercourse', 'sexual pleasure', 'desires', 'pleasure', 'pleasures', 'loli', 'condoms', 'sexual urges']
}

lemmatizer = WordNetLemmatizer()


def preprocess(text):
    tokens = word_tokenize(text)
    stop_words = set(stopwords.words("english"))
    filtered_tokens = [
        lemmatizer.lemmatize(word.lower())
        for word in tokens
        if word.lower() not in stop_words and re.match(r"\w+", word)
    ]
    return filtered_tokens


def infer_genres(synopsis, current_genre):
    tokens = preprocess(synopsis)
    tagged_tokens = pos_tag(tokens)
    keywords = [
        word
        for word, tag in tagged_tokens
        if tag.startswith("NN") or tag.startswith("JJ")
    ]

    matched_genres = set()

    for keyword in keywords:
        for genre, rules in genre_rules.items():
            if any(rule in keyword for rule in rules):
                matched_genres.add(genre)

    if isinstance(current_genre, str):
        current_genre = [current_genre]
    elif not isinstance(current_genre, list):
        current_genre = []

    current_genre_set = set(current_genre)
    return list(matched_genres.union(current_genre_set))



class CleanAnimeDataPipeline:
    def process_item(self, item, spider):
        # Clean name_english if available
        if 'name_english' in item and item['name_english'] is not None:
            item['name_english'] = item['name_english'].strip()


        # Clean name
        if 'name' in item and item['name'] is not None:
            item['name'] = item['name'].strip()
            item['name'] = item['name'].strip('"').strip("'").replace('\"', '').replace("\'", '')

        # Clean cover_img
        if 'cover_img' in item and item['cover_img'] is not None:
           item['cover_img'] = item['cover_img'].strip()
        
                
        # Clean score
        if 'score' in item and item['score'] is not None:
            item['score'] = item['score'].strip()
        

        # Clean ranked
        if 'ranked' in item and item['ranked'] is not None :
            item['ranked'] = int((item['ranked'].strip()).replace('#',''))
        

        # Clean popularity
        if 'popularity' in item and item['popularity'] is not None:
            item['popularity'] = int((item['popularity'].strip()).replace('#',''))
        

        # Clean members
        if 'members' in item and item['members'] is not None:
            item['members'] = item['members'].replace(',', '').strip()
        

        # Clean synopsis
        if 'synopsis' in item and item['synopsis'] is not None:
            item['synopsis'] = [re.sub(r'\s+', ' ', syn.strip()) for syn in item['synopsis']]
            item['synopsis'] = " ".join(item['synopsis'])
            item['synopsis'] = item['synopsis'].replace("\"", "")

            pattern = r'[\[\(][^\[\(]*[\]\)]$'
            synopsis = item['synopsis'].strip()
            
            if synopsis == "No synopsis information has been added to this title. Help improve our database by adding a synopsis .":
                raise DropItem(f"Skipping item due to placeholder synopsis: {item}")
            
            if synopsis.endswith(']') or synopsis.endswith(')'):
                synopsis = re.sub(pattern, '', synopsis)
            
            if len(synopsis) <= 100:
                raise DropItem(f"Skipping item due to short synopsis: {item}")
            
            item['synopsis'] = synopsis.strip()
        else:
            raise DropItem(f"Skipping item due to missing synopsis: {item}")
        

        # Clean synonyms
        if 'synonyms' in item and item['synonyms'] is not None:
            # Fill empty synonyms directly with the name
            if item['synonyms'] == "":
                item['synonyms'] = item['name'].strip()
            else:
                item['synonyms'] = item['synonyms'].strip()

        
        # Clean total_episodes
        if 'total_episodes' in item and item['total_episodes'] is not None:
            item['total_episodes'] = re.sub(r'\s+', ' ', item['total_episodes'].strip())
        

        # Clean premiered
        if 'premiered' in item and item['premiered'] is not None:
            item['premiered'] = item['premiered'].strip()
        

        # Clean studios
        if 'studios' in item and item['studios'] is not None:
            item['studios'] = item['studios'].strip()
        

        # Clean genres
        if 'genres' in item and item['genres'] is not None:
            item['genres'] = [genre.strip() for genre in item['genres']]
        

        # Clean demographic
        if 'demographic' in item and item['demographic'] is not None:
            item['demographic'] = item['demographic'].strip()
        

        # Clean duration_per_ep
        if 'duration_per_ep' in item and item['duration_per_ep'] is not None:
            item['duration_per_ep'] = re.sub(r'\s+', ' ', item['duration_per_ep'].strip())


        # Clean type_of
        if 'type_of' in item and item['type_of'] is None:
            item['type_of'] = "TV"
        else:
            item['type_of'] = item['type_of'].strip()

        
        # Clean rating
        if 'rating' in item and item['rating'] is not None:
            item['rating'] = item['rating'].strip()
        

        # Clean scored_by
        if 'scored_by' in item and item['scored_by'] is not None:
            item['scored_by'] = item['scored_by'].strip()
        

        # Clean favorites
        if 'favorites' in item and item['favorites'] is not None:
            item['favorites'] = item['favorites'].replace(',', '').strip()
        

        # Clean aired
        if 'aired' in item and item['aired'] is not None:
            item['aired'] = re.sub(r'\s+', ' ', item['aired'].strip())


        # Clean source
        if 'source' in item and item['source'] is not None:
            item['source'] = item['source'].strip()
        

        # Clean themes
        if 'themes' in item and item['themes'] is not None:
            item['themes'] = [theme.strip() for theme in item['themes']]
            

        # Clean watching
        if 'watching' in item:
            if item['watching'] is None or item['watching'] == "":
                item['watching'] = "0"
            else:
                item['watching'] = item['watching'].strip()
                item['watching'] = int(item['watching'].replace(",", ""))
        

        # Clean completed
        if 'completed' in item:
            if item['completed'] is None or item['completed'] == "":
                item['completed'] = "0"
            else:
                item['completed'] = item['completed'].strip()
                item['completed'] = int(item['completed'].replace(",", ""), 0)


        # Clean on_hold
        if 'on_hold' in item:
            if item['on_hold'] is None or item['on_hold'] == "":
                item['on_hold'] = "0"
            else:
                item['on_hold'] = item['on_hold'].strip()
                item['on_hold'] = int(item['on_hold'].replace(",", ""))
        

        # Clean dropped
        if 'dropped' in item :
            if item['dropped'] is None or item['dropped'] == "":
                item['dropped'] = "0"
            else:
                item['dropped'] = item['dropped'].strip()
                item['dropped'] = int(item['dropped'].replace(",", ""))
        

        # Clean plan_to_watch
        if 'plan_to_watch' in item:
            if item['plan_to_watch'] is None or item['plan_to_watch'] == "":
                item['plan_to_watch'] = "0"
            else:
                item['plan_to_watch'] = item['plan_to_watch'].strip()
                item['plan_to_watch'] = int(item['plan_to_watch'].replace(",", ""))
        

        # Clean total
        if 'total' in item:
            if item['total'] is None or item['total'] == "":
                item['total'] = "0"
            else:
                item['total'] = item['total'].strip()
                item['total'] = int(item['total'].replace(",", ""))


        # clean votes (scored_(x)_by)
        for i in range(10, 0, -1):
            key = f'scored_{i}_by'
            if key in item:
                if item[key] is not None:
                    numerical_data = re.findall(r'\((\d+)\s+votes\)', item[key])
                    if numerical_data:
                        item[key] = int(numerical_data[0])
                    else:
                        item[key] = 0
                else:
                    item[key] = 0
        

        # Clean characters
        if 'characters' in item and item['characters'] is not None:
            if isinstance(item['characters'], dict):
                for role, names in item['characters'].items():
                    item['characters'][role] = [name[2:].strip() for name in names if name.strip() and (name.lower().startswith('m_') or name.lower().startswith('s_'))]

        return item
        

class GenresPipeline:

    def process_item(self, item, spider):
        genres = item.get("genres", [])
        synopsis = item.get("synopsis", "")

        if not genres:
            genres = []

        item["genres"] = infer_genres(synopsis, genres)
        return item
