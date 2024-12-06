# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class Crawler2Item(scrapy.Item):
    
    # the fields for item:
    # Commented the fields on the requirements
    # (current active fields are for img_crawler.py )

    name_english = scrapy.Field()
    name = scrapy.Field()
    characters = scrapy.Field()
    pics = scrapy.Field()
    cover_img = scrapy.Field()
    score = scrapy.Field()
    ranked = scrapy.Field()
    popularity = scrapy.Field()
    members = scrapy.Field()
    synopsis = scrapy.Field()
    synonyms = scrapy.Field()
    type_of = scrapy.Field()
    total_episodes = scrapy.Field()
    premiered = scrapy.Field()
    studios = scrapy.Field()
    genres = scrapy.Field()
    demographic = scrapy.Field()
    duration_per_ep = scrapy.Field()
    rating = scrapy.Field()
    scored_by = scrapy.Field()
    favorites = scrapy.Field()
    aired = scrapy.Field()
    source = scrapy.Field()
    watching = scrapy.Field()
    completed = scrapy.Field()
    on_hold = scrapy.Field()
    dropped = scrapy.Field()
    plan_to_watch = scrapy.Field()
    total= scrapy.Field()
    scored_10_by = scrapy.Field()
    scored_9_by = scrapy.Field()
    scored_8_by = scrapy.Field()
    scored_7_by = scrapy.Field()
    scored_6_by = scrapy.Field()
    scored_5_by = scrapy.Field()
    scored_4_by = scrapy.Field()
    scored_3_by = scrapy.Field()
    scored_2_by = scrapy.Field()
    scored_1_by = scrapy.Field()