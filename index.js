const fetch = require('node-fetch');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const marked = require('marked');

const app = express();
const port = 80;

app.set('view engine', 'ejs');

app.use(expressLayouts);

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/blog/:blogId', async (req, res) => {
    const post = await fetch(`http://localhost:1337/posts/${req.params.blogId}`)
        .then(res => res.json())
        .then(post => ({ ...post, content: marked(post.content) }))
        .catch(err => new Error(err));

    if (post instanceof Error) {
        res.redirect('/error');
    } else {
        res.render('blog', { post });
    }
});

app.get('/error', (req, res) => {
    res.render('error');
});

app.listen(port, () => console.log(`listening on port ${port}`));
