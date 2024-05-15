import axios from 'axios';
import pdfParse from 'pdf-parse';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.API_KEY;

async function processFile(filePath: string, instructions: string): Promise<string> {
    console.log("Starting to process the file");

    try {
        const fileContent = fs.readFileSync(filePath);
        const pdfText = await pdfParse(fileContent);
        const contentWithInstructions = `${instructions}\n${pdfText.text}`;

        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4',
            messages: [{role: "user", content: contentWithInstructions}],
            max_tokens: 200,
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        if (response.data.choices[0].message.content) {
            console.log("File successfully processed.")
        }
        console.log("#########################")
        const array = response.data.choices[0].message.content.split(',');
        console.log(array)

        return response.data.choices[0].message.content.split(',');
    } catch (error) {
        console.error('Error processing file:', error);
        throw new Error('Error processing file.');
    }
}
export { processFile };