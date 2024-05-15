import axios from 'axios';
import pdfParse from 'pdf-parse';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.API_KEY;

async function processFile(filePath: string): Promise<string> {
    console.log("Starting to process the file");

    try {
        const fileContent = fs.readFileSync(filePath);
        const pdfText = await pdfParse(fileContent);
        const instructions = "Analise the below CV and provide comma separated list with the areas of strengths. Just a list of area names limited to the top 5 most relevant ones."
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
        return response.data.choices[0].message.content.split(',');
    } catch (error) {
        console.error('Error processing file:', error);
        throw new Error('Error processing file.');
    }
}

async function newCareer(areasList: string[]): Promise<string> {
    console.log("Starting to create your new professioinal career");

    const instructions = "Based on the provided list of areas, suggest new career paths for this person"
    const contentWithInstructions = `${instructions}\n${areasList}`;

    try {

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
            console.log("List of career paths created.")
        }
        return response.data.choices[0].message.content.split(',');
    } catch (error) {
        console.error('Error creating career path:', error);
        throw new Error('Error creating career path.');
    }
}

export { processFile, newCareer };