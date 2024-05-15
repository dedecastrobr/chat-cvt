import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';
import { processFile } from './cvProcessor';


const app = express();
const port = 3001;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const upload = multer({ dest: 'uploads/' });

app.use(express.static(path.join(__dirname, 'views')));


app.get('/', (req: Request, res: Response) => {
    res.render('index', { responseData: null });
});

app.post('/review', upload.single('file'), async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    const filePath = req.file.path;
    const instructions = "Analise the below CV and provide comma separated list with the areas of strengths. Just a list of area names limited to the top 5 most relevant ones."
    const reviewResult = await processFile(filePath, instructions);
    res.render('index', { responseData: reviewResult });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
