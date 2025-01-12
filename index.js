import fs from 'fs';
import express from 'express';
import bodyParser from 'body-parser';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import qr from 'qr-image';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000, () => {
    console.log("Server running on 3000 port");
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
}); 

app.post("/submit", (req, res) => {
    console.log("received");
    var url = req.body.url;
    console.log(url)
    var qr_svg = qr.image(url, { type: 'svg' });
    //qr_svg.pipe(fs.createWriteStream(Math.floor(Math.random()*6969) + '.svg'));
 
    var svg_string = qr.imageSync(url, { type: 'svg' });
    var htmlcontent = getContent(svg_string);
    res.send(htmlcontent);
});

function getContent(el) {
    var content = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QR Code Generator</title>
    <link rel="shortcut icon" href="https://cdn4.iconfinder.com/data/icons/ios7-active-2/512/QR_code.png" type="image/x-icon">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
</head>
<body>
    <div class="container d-flex justify-content-center">
        <h1>✅ Your QR Code:</h1>
    </div>  

    <div class="container d-flex justify-content-center">
        ${el}
    </div>

    <style>
        body {
    background-color: cornflowerblue;
}

h1 {
    color: rgb(239, 236, 236);
    font-weight: 800;
    margin-top: 6rem;
}

svg {
width: 50vh;
height: 50vh;
color: white;
}
    </style>
</body>
</html>
    `;

    return content;
}

app.use((req, res) => { res.redirect('/'); });