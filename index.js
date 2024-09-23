const axios = require('axios');
const {createClient} = require('@supabase/supabase-js'); 
const cheerio = require('cheerio');

const supabase = createClient('https://eqwifrsvkqnugdaxqtbm.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxd2lmcnN2a3FudWdkYXhxdGJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxMTk0NjUsImV4cCI6MjAzMzY5NTQ2NX0.m_5NIJtqdyxOFhTVhVd5BeVVQRqAuI42lrGWBdUOheA')

async function scrapeTechCrunch() {

  try {
    const response = await axios.get('https://techcrunch.com/');
    const html = response.data;
    const $ = cheerio.load(html);


    const newsArticles = [];
    $('.wp-block-post-title').each((i, element) => {
      const title = $(element).text();
      const link = $(element).find('a').attr('href');

      newsArticles.push({ title, link });
    });

    console.log(newsArticles);
       for (const article of newsArticles) {
        const { data, error } = await supabase
          .from('articles')
          .insert([{ Title: article.title, Link: article.link }]);
    
        if (error) {
          console.error('Error inserting into Supabase:', error);
        } else {
          console.log('Inserted into Supabase:', data);
        }
      }

  } catch (error) {
    console.error('Error fetching TechCrunch:', error);
  }
}

scrapeTechCrunch();
