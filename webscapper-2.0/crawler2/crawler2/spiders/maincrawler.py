import scrapy
from crawler2.items import Crawler2Item
import random
import time

class MaincrawlerSpider(scrapy.Spider):
    name = "maincrawler"
    allowed_domains = ["myanimelist.net"]
    start_urls = [f"https://myanimelist.net/topanime.php?limit={50*i}" for i in range(1, 2)]

    def start_requests(self):
        for url in self.start_urls:
            # Introducing random delay between 10 to 30 seconds to avoid rate-limiting
            # i = random.randint(10, 30)
            # self.logger.info(f"Sleeping for {i} seconds to avoid rate-limiting")
            # time.sleep(i)
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        # Extracting anime URLs from the ranking table
        page_anime = response.xpath("//table[@class='top-ranking-table']//tr[@class='ranking-list']//td[2]/a/@href").getall()

        if not page_anime:
            self.logger.warning('No anime links found on the page.')
        
        # Iterating through the extracted anime URLs
        for anime in page_anime:
            stats_url = anime + '/stats'
            char_url = anime + '/characters'
            image_url = anime + '/pics'
            yield scrapy.Request(url=anime, callback=self.parseAnimePage, meta={'stats_url': stats_url, 'char_url': char_url, 'image_url': image_url})

    def parseAnimePage(self, response):
        item = Crawler2Item()

        # Extract anime data
        item['name_english'] = response.xpath("//div[@id='contentWrapper']//div[@class='spaceit_pad']//span[text()='English:']/following-sibling::text()").get()
        item['name'] = response.xpath("//div[@id='contentWrapper']//h1[@class='title-name h1_bold_none']/strong/text()").get()

        # Extract cover image (fallback)
        cover_img = response.xpath('//div[@class="di-b mt4 mb8 ac"]/preceding-sibling::div/a/img/@data-src').get()
        if cover_img:
            item['cover_img'] = cover_img
        else:
            item['cover_img'] = response.xpath('//div[@class="profileRows pb0"]/preceding-sibling::div/a/img/@data-src').get()

        # Additional fields
        item['score'] = response.xpath("//div[@id='contentWrapper']//div[@id='content']//div[@class='stats-block po-r clearfix']/div/div/text()").get()
        item['ranked'] = response.xpath("//div[@id='contentWrapper']//div[@id='content']//div[@class='stats-block po-r clearfix']//div[@class='di-ib ml12 pl20 pt8']/span/strong/text()").get()
        item['popularity'] = response.xpath("//div[@id='contentWrapper']//div[@id='content']//div[@class='stats-block po-r clearfix']//div[@class='di-ib ml12 pl20 pt8']/span[2]/strong/text()").get()
        item['members'] = response.xpath("//div[@id='contentWrapper']//div[@id='content']//div[@class='stats-block po-r clearfix']//div[@class='di-ib ml12 pl20 pt8']/span[3]/strong/text()").get()
        item['synopsis'] = response.xpath("//div[@id='contentWrapper']//div[@id='content']//p[@itemprop='description']/text()[normalize-space()]").getall()
        item['synonyms'] = response.xpath("//div[@id='content']/table//td[@class='borderClass']//div[@class='spaceit_pad']/span/following-sibling::text()").get()

        # Store URLs in meta
        stats_url = response.url + '/stats'
        char_url = response.url + '/characters'
        image_url = response.url + '/pics'

        # Passing URLs in meta dictionary
        print(item)
        yield scrapy.Request(response.url,callback=self.parse_anime_pics, meta={'item': item, 'stats_url': stats_url, 'char_url': char_url, 'image_url': image_url})

    def parse_anime_pics(self, response):
        item = response.meta.get('item', {})
        
        # Check if 'stats_url' is in meta
        stats_url = response.meta.get('stats_url', None)
        if not stats_url:
            self.logger.warning(f"Stats URL missing for {item.get('name', 'Unknown Anime')}")

        item['pics'] = response.xpath("//div[@class='picSurround']/a/img/@src").getall()


        print("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n",item)
        yield item
        # if not item['pics']:
        #     self.logger.warning(f"No pictures found for {item.get('name', 'Unknown Anime')}")

        # if stats_url:
        #     yield response.follow(stats_url, callback=self.parse_anime_stats, meta={'item': item})

    #     def parse_anime_characters(self, response):
    #         item = response.meta['item']
    #         item['characters'] = response.xpath("//div[@class='js-chara-roll-and-name']//text()").getall()

    #         # Logging if no characters are found
    #         if not item['characters']:
    #             self.logger.warning(f"No characters found for {item['name']} at {response.url}")

    #         pics_url = response.meta['pics_url']
    #         yield response.follow(pics_url, callback=self.parse_anime_pics, meta={'item': item})

    # def parse_anime_stats(self, response):
    #     item = response.meta['item']

    #     # Extracting additional stats and handling missing data
    #     item['type_of'] = response.xpath("//div[@id='content']//div[@class='spaceit_pad']//span[text()='Type:']/parent::div//a/text()").get()
    #     item['total_episodes'] = response.xpath("//div[@id='content']//div[@class='spaceit_pad']//span[text()='Episodes:']/following-sibling::text()").get()
    #     item['premiered'] = response.xpath("//div[@id='content']//div[@class='spaceit_pad']//span[text()='Premiered:']/parent::div//a/text()").get()
    #     item['studios'] = response.xpath("//div[@id='content']//div[@class='spaceit_pad']//span[text()='Studios:']/parent::div//a/text()").get()
    #     item['genres'] = response.xpath("//div[@id='content']//div[@class='spaceit_pad']//span[text()='Genres:']/parent::div//a/text()").getall()
    #     item['demographic'] = response.xpath("//div[@id='content']//div[@class='spaceit_pad']//span[text()='Demographic:']/parent::div//a/text()").get()
    #     item['duration_per_ep'] = response.xpath("//div[@id='content']//div[@class='spaceit_pad']//span[text()='Duration:']/following-sibling::text()").get()
    #     item['rating'] = response.xpath("//div[@id='content']//div[@class='spaceit_pad']//span[text()='Rating:']/following-sibling::text()").get()
    #     item['scored_by'] = response.xpath("//div[@id='content']//div//span[text()='Score:']/parent::div//span[@itemprop='ratingCount']/text()").get()
    #     item['favorites'] = response.xpath("//div[@id='content']//div[@class='spaceit_pad']/span[text()='Favorites:']/following-sibling::text()").get()
    #     item['aired'] = response.xpath("//div[@id='content']//div[@class='spaceit_pad']//span[text()='Aired:']/following-sibling::text()").get()
    #     item['source'] = response.xpath("//div[@id='content']//div[@class='spaceit_pad']//span[text()='Source:']/following-sibling::text()").get()

    #     # Logging missing statistics
    #     if not item['type_of']:
    #         self.logger.warning(f"No 'Type' found for {item['name']} at {response.url}")

    #     # Final yield (returning item to Scrapy pipeline)
    #     yield item
