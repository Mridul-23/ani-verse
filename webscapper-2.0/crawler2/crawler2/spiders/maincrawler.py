import scrapy
from crawler2.items import Crawler2Item
import random
import time

class MaincrawlerSpider(scrapy.Spider):
    name = "maincrawler"
    allowed_domains = ["myanimelist.net"]
    start_urls = ["https://myanimelist.net/topanime.php?limit=0"]
    

    def parse(self, response):
        page_anime = response.xpath("//table[@class='top-ranking-table']//tr[@class='ranking-list']//td[2]/a/@href").getall()
        
        # Iterating through the extracted anime URLs
        for anime in page_anime:
            meta_data = {'stats_url': anime + '/stats', 'char_url': anime + '/characters', 'image_url': anime + '/pics'}
            yield scrapy.Request(url=anime, callback=self.parseAnimePage, meta=meta_data)


    def parseAnimePage(self, response):
        item = Crawler2Item()

        item['name_english'] = response.xpath("//div[@id='contentWrapper']//div[@class='spaceit_pad']//span[text()='English:']/following-sibling::text()").get()
        item['name'] = response.xpath("//div[@id='contentWrapper']//h1[@class='title-name h1_bold_none']/strong/text()").get()

        item['cover_img']= response.xpath('//div[@class="di-b mt4 mb8 ac"]/preceding-sibling::div/a/img/@data-src').get() or response.xpath('//div[@class="profileRows pb0"]/preceding-sibling::div/a/img/@data-src').get()

        item['score'] = response.xpath("//div[@id='contentWrapper']//div[@id='content']//div[@class='stats-block po-r clearfix']/div/div/text()").get()

        item['ranked'] = response.xpath("//div[@id='contentWrapper']//div[@id='content']//div[@class='stats-block po-r clearfix']//div[@class='di-ib ml12 pl20 pt8']/span/strong/text()").get()

        item['popularity'] = response.xpath("//div[@id='contentWrapper']//div[@id='content']//div[@class='stats-block po-r clearfix']//div[@class='di-ib ml12 pl20 pt8']/span[2]/strong/text()").get()

        item['members'] = response.xpath("//div[@id='contentWrapper']//div[@id='content']//div[@class='stats-block po-r clearfix']//div[@class='di-ib ml12 pl20 pt8']/span[3]/strong/text()").get()

        item['synopsis'] = response.xpath("//div[@id='contentWrapper']//div[@id='content']//p[@itemprop='description']/text()[normalize-space()]").getall()

        item['synonyms'] = response.xpath("//div[@id='content']/table//td[@class='borderClass']//div[@class='spaceit_pad']/span/following-sibling::text()").get()

        print("-----------------------\n", response.meta)

        meta_data = response.meta
        meta_data['item'] = item

        yield scrapy.Request(url=response.meta.get('image_url'), callback=self.parse_anime_pics, meta=meta_data)


    def parse_anime_pics(self, response):
        item = response.meta.get('item')

        item['pics'] = response.xpath("//div[@class='picSurround']//a//img//@data-src").getall()

        meta_data = response.meta
        meta_data['item'] = item

        # Also follow characters URL and pass 'pics_url' in meta
        char_url = response.meta.get('char_url', None)
        if char_url:
            yield response.follow(url=char_url, callback=self.parse_anime_characters, meta=meta_data)

    def parse_anime_characters(self, response):
        item = response.meta['item']
        
        item['characters'] = response.xpath("//div[@class='js-chara-roll-and-name']//text()").getall()

        yield response.follow(url=response.meta.get('stats_url'), callback=self.parse_anime_stats, meta={'item': item, 'stats_url': response.meta.get('stats_url')})

    def parse_anime_stats(self, response):
        item = response.meta['item']

        # Extracting additional stats and handling missing data
        item['type_of'] = response.xpath("//div[@id='content']//div[@class='spaceit_pad']//span[text()='Type:']/parent::div//a/text()").get()
        item['total_episodes'] = response.xpath("//div[@id='content']//div[@class='spaceit_pad']//span[text()='Episodes:']/following-sibling::text()").get()
        item['premiered'] = response.xpath("//div[@id='content']//div[@class='spaceit_pad']//span[text()='Premiered:']/parent::div//a/text()").get()
        item['studios'] = response.xpath("//div[@id='content']//div[@class='spaceit_pad']//span[text()='Studios:']/parent::div//a/text()").get()
        item['genres'] = response.xpath("//div[@id='content']//div[@class='spaceit_pad']//span[text()='Genres:']/parent::div//a/text()").getall()
        item['demographic'] = response.xpath("//div[@id='content']//div[@class='spaceit_pad']//span[text()='Demographic:']/parent::div//a/text()").get()
        item['duration_per_ep'] = response.xpath("//div[@id='content']//div[@class='spaceit_pad']//span[text()='Duration:']/following-sibling::text()").get()
        item['rating'] = response.xpath("//div[@id='content']//div[@class='spaceit_pad']//span[text()='Rating:']/following-sibling::text()").get()
        item['scored_by'] = response.xpath("//div[@id='content']//div//span[text()='Score:']/parent::div//span[@itemprop='ratingCount']/text()").get()
        item['favorites'] = response.xpath("//div[@id='content']//div[@class='spaceit_pad']/span[text()='Favorites:']/following-sibling::text()").get()
        item['aired'] = response.xpath("//div[@id='content']//div[@class='spaceit_pad']//span[text()='Aired:']/following-sibling::text()").get()
        item['source'] = response.xpath("//div[@id='content']//div[@class='spaceit_pad']//span[text()='Source:']/following-sibling::text()").get()

        # Logging missing statistics
        if not item['type_of']:
            self.logger.warning(f"No 'Type' found for {item['name']} at {response.url}")

        # Final yield (returning item to Scrapy pipeline)
        yield item