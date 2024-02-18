const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const PORT = 3000;
const app = express();

app.use(cors());

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36";

app.get('/:id', async (req, res) => {
    try {
        const malid = encodeURIComponent(req.params.id);
        const mallink = `https://myanimelist.net/search/all?cat=all&q=${malid}`;
        const malreq = await axios.get(mallink, {
            headers: {
                'User-Agent': USER_AGENT,
            }
        });
        const malres = malreq.data;

        console.log(malres);

        const $ = cheerio.load(malres);

        const resmal = []

        $('.list.di-t.w100').each(( index, element )=>{
            const mallistid = $(element).find('.title a') || false;

            if( mallistid.length > 0 && mallistid.attr('href')){
                const num = mallistid.attr('href').match(/\d+/g)[0] || false;

                const name = mallistid.attr('href').split(`anime/${num}/`)[1] || null;

                resmal.push({ num, name});
            }

            
        })

        res.json({ resmal});

    } catch (error) {
        console.log('errrorrrr',error);
    }
})

app.listen(PORT, ()=>{
    console.log('the service is on ',PORT);
})