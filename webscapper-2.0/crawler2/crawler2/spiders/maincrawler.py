import scrapy
from crawler2.items import Crawler2Item
import re


class MaincrawlerSpider(scrapy.Spider):
    name = "maincrawler"
    allowed_domains = ["myanimelist.net"]
    start_urls = [f"https://myanimelist.net/topanime.php?limit={50*i}" for i in range(501, 554)]
    
    custom_settings = {
        'CONCURRENT_REQUESTS': 2,
        'DOWNLOAD_DELAY': 1,
        'FEEDS' : {
            'ani_data_full.json' : {'format' : 'json', 'overwrite' : False}
        }
    }

    def parse(self, response):
        page_anime = response.xpath("//table[@class='top-ranking-table']//tr[@class='ranking-list']//td[2]/a/@href").getall()
        
        
        for anime in page_anime:
            meta_data = {'stats_url': anime + '/stats', 'char_url': anime + '/characters', 'image_url': anime + '/pics'}
            yield scrapy.Request(url=anime, callback=self.parseAnimePage, meta=meta_data)


    def parseAnimePage(self, response):
        item = Crawler2Item()

        item['name_english'] = response.xpath("//div[@id='contentWrapper']//div[@class='spaceit_pad']//span[text()='English:']/following-sibling::text()").get() or\
                               response.xpath("//div[@id='contentWrapper']//h1[@class='title-name h1_bold_none']/strong/text()").get()

        item['name'] = response.xpath("//div[@id='contentWrapper']//h1[@class='title-name h1_bold_none']/strong/text()").get()

        item['cover_img'] = response.xpath('//div[@class="di-b mt4 mb8 ac"]/preceding-sibling::div/a/img/@data-src').get() or\
                            response.xpath('//div[@class="profileRows pb0"]/preceding-sibling::div/a/img/@data-src').get()

        item['score'] = response.xpath("//div[@id='contentWrapper']//div[@id='content']//div[@class='stats-block po-r clearfix']/div/div/text()").get()

        item['ranked'] = response.xpath("//div[@id='contentWrapper']//div[@id='content']//div[@class='stats-block po-r clearfix']//div[@class='di-ib ml12 pl20 pt8']/span/strong/text()").get()

        item['popularity'] = response.xpath("//div[@id='contentWrapper']//div[@id='content']//div[@class='stats-block po-r clearfix']//div[@class='di-ib ml12 pl20 pt8']/span[2]/strong/text()").get()

        item['members'] = response.xpath("//div[@id='contentWrapper']//div[@id='content']//div[@class='stats-block po-r clearfix']//div[@class='di-ib ml12 pl20 pt8']/span[3]/strong/text()").get()

        synopsis = response.xpath("//div[@id='contentWrapper']//div[@id='content']//p[@itemprop='description']/text()[normalize-space()]").getall()
        if synopsis:
            synopsis = [re.sub(r'\s+', ' ', syn.strip()) for syn in synopsis]
            synopsis = " ".join(synopsis).strip()
            synopsis = synopsis.replace("\"", "")

            # Check for placeholder or invalid synopsis
            placeholder_synopsis = "No synopsis information has been added to this title. Help improve our database by adding a synopsis ."
            if synopsis == placeholder_synopsis:
                self.logger.info(f"Dropping item due to placeholder synopsis: {response.url}")
                return None

            # Remove trailing brackets/parentheses
            pattern = r'[\[\(][^\[\(]*[\]\)]$'
            if synopsis.endswith(']') or synopsis.endswith(')'):
                synopsis = re.sub(pattern, '', synopsis)

            # Check for short synopsis
            if len(synopsis) <= 100:
                self.logger.info(f"Dropping item due to short synopsis: {response.url}")
                return None

            item['synopsis'] = synopsis
        else:
            self.logger.info(f"Dropping item due to missing synopsis: {response.url}")
            return None

        item['synonyms'] = response.xpath("//div[@id='content']/table//td[@class='borderClass']//div[@class='spaceit_pad']/span/following-sibling::text()").get()

        meta_data = response.meta
        meta_data['item'] = item

        yield scrapy.Request(url=response.meta.get('image_url'), callback=self.parse_anime_pics, meta=meta_data)


    def parse_anime_pics(self, response):
        item = response.meta.get('item')

        item['pics'] = response.xpath("//div[@class='picSurround']//a//img//@data-src").getall()

        meta_data = response.meta
        meta_data['item'] = item

        char_url = response.meta.get('char_url', None)
        yield response.follow(url=char_url, callback=self.parse_anime_characters, meta=meta_data)

    def parse_anime_characters(self, response):
        item = response.meta['item']
        
        characters = response.xpath("//div[@class='js-chara-roll-and-name']//text()").getall()

        full_characters = {'m': [], 's': []}
        current_role = None
        for char in characters:
            char = char.strip()
            if char.lower().startswith('m'):
                current_role = 'm'
            elif char.lower().startswith('s'):
                current_role = 's'
            if current_role:
                full_characters[current_role].append(char)

        item['characters'] = full_characters

        yield response.follow(url=response.meta.get('stats_url'), callback=self.parse_anime_stats, meta={'item': item, 'stats_url': response.meta.get('stats_url')})

    def parse_anime_stats(self, response):

        item = response.meta['item']

        item['type_of'] = response.xpath(" //div[@class='spaceit_pad']//span[text()='Type:']/parent::div//a/text()").get()

        item['total_episodes'] = response.xpath("//div[@class='spaceit_pad']//span[text()='Episodes:']/following-sibling::text()").get()

        item['premiered'] = response.xpath("//div[@class='spaceit_pad']//span[text()='Premiered:']/parent::div//a/text()").get(default='Unknown')

        item['studios'] = response.xpath("//div[@class='spaceit_pad']//span[text()='Studios:']/parent::div//a/text()").get()

        item['genres'] = response.xpath("//div[@class='spaceit_pad']//span[text()='Genres:']/parent::div//a/text()").getall()

        item['demographic'] = response.xpath("//div[@class='spaceit_pad']//span[text()='Demographic:']/parent::div//a/text()").get()

        item['duration_per_ep'] = response.xpath("//div[@class='spaceit_pad']//span[text()='Duration:']/following-sibling::text()").get(default='Unknown')

        item['rating'] = response.xpath("//div[@class='spaceit_pad']//span[text()='Rating:']/following-sibling::text()").get()

        item['scored_by'] = response.xpath("//div//span[text()='Score:']/parent::div//span[@itemprop='ratingCount']/text()").get()

        item['favorites'] = response.xpath("//div[@class='spaceit_pad']/span[text()='Favorites:']/following-sibling::text()").get()

        item['aired'] = response.xpath("//div[@class='spaceit_pad']//span[text()='Aired:']/following-sibling::text()").get()

        item['source'] = response.xpath("//div[@class='spaceit_pad']//span[text()='Source:']/following-sibling::a/text()").get() or\
                         response.xpath("//div[@class='spaceit_pad']//span[text()='Source:']/following-sibling::text()").get()
        
        item['themes'] =  response.xpath("//div[@class='spaceit_pad']//span[text()='Theme:']/following-sibling::a/text()").getall() or\
                          response.xpath("//div[@class='spaceit_pad']//span[text()='Themes:']/following-sibling::a/text()").getall()

        item['watching'] = response.xpath("//div[@class='spaceit_pad']//span[text()='Watching:']/following-sibling::text()").get()

        item['completed'] = response.xpath("//div[@class='spaceit_pad']//span[text()='Completed:']/following-sibling::text()").get()

        item['on_hold'] = response.xpath("//div[@class='spaceit_pad']//span[text()='On-Hold:']/following-sibling::text()").get()

        item ['dropped'] = response.xpath("//div[@class='spaceit_pad']//span[text()='Dropped:']/following-sibling::text()").get()

        item['plan_to_watch'] = response.xpath("//div[@class='spaceit_pad']//span[text()='Plan to Watch:']/following-sibling::text()").get()

        item['total'] = response.xpath("//div[@class='spaceit_pad']//span[text()='Total:']/following-sibling::text()").get()

        item['scored_10_by'] = response.xpath("//h2[text()='Score Stats']/following-sibling::table/tr[1]//small/text()").get()

        item['scored_9_by'] = response.xpath("//h2[text()='Score Stats']/following-sibling::table/tr[2]//small/text()").get()

        item['scored_8_by'] = response.xpath("//h2[text()='Score Stats']/following-sibling::table/tr[3]//small/text()").get()

        item['scored_7_by'] = response.xpath("//h2[text()='Score Stats']/following-sibling::table/tr[4]//small/text()").get()

        item['scored_6_by'] = response.xpath("//h2[text()='Score Stats']/following-sibling::table/tr[5]//small/text()").get()

        item['scored_5_by'] = response.xpath("//h2[text()='Score Stats']/following-sibling::table/tr[6]//small/text()").get()

        item['scored_4_by'] = response.xpath("//h2[text()='Score Stats']/following-sibling::table/tr[7]//small/text()").get()

        item['scored_3_by'] = response.xpath("//h2[text()='Score Stats']/following-sibling::table/tr[8]//small/text()").get()

        item['scored_2_by'] = response.xpath("//h2[text()='Score Stats']/following-sibling::table/tr[9]//small/text()").get()

        item['scored_1_by'] = response.xpath("//h2[text()='Score Stats']/following-sibling::table/tr[10]//small/text()").get()

        yield item

        