import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';
import { newCareer, processFile } from './cvProcessor';


const app = express();
const port = 3000;

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
    const reviewResult = await processFile(filePath);
    res.render('index', { responseData: reviewResult });
});

app.post('/new-career', async (req: Request, res: Response) => {
    const areasOfStrength = req.body.areasOfStrength;

    if (!areasOfStrength || !Array.isArray(areasOfStrength) || areasOfStrength.length === 0) {
        return res.status(400).send('No areas of strength provided.');
    }

    const instructions = "Analyze the below CV and provide a comma-separated list with the areas of strengths. Just a list of area names limited to the top 5 most relevant ones.";
    
    // Process the list of areas of strength
    const newCareers = await newCareer(areasOfStrength);
    
    // Render the result
    res.render('index', { responseData: newCareers });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
