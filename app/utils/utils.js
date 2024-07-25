const OpenAi = require('openai');
require('dotenv').config();
const chatGptApiKey = process.env.CHATGPT_API_KEY || "";
const assistant_id = process.env.CHATGPT_ASSISTANT_ID || "";
const openAi = new OpenAi({
  apiKey: chatGptApiKey
})

const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate PDF
const generatePDF = (content, filePath) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const stream = fs.createWriteStream(filePath);

        doc.pipe(stream);
        doc.text(content);
        doc.end();

        stream.on('finish', () => {
            resolve(filePath);
        });

        stream.on('error', (err) => {
            reject(err);
        });
    });
};


exports.generateResumeUsingLLM = async (body) => {

    let prompt = '';
    if (body) {
        prompt += JSON.stringify(body);
    }
    console.log("generate pdf prompt", prompt);

    try {
        const assistantId = assistant_id;
        const thread = await openAi.beta.threads.create();

        let run = await openAi.beta.threads.runs.createAndPoll(
            thread.id,
            { 
              assistant_id: assistantId,
              instructions: prompt,
            }
          );
        let responseOfAI = "";
        if (run.status === 'completed') {
            const messages = await openAi.beta.threads.messages.list(
                run.thread_id
            );
            for (const message of messages.data.reverse()) {
                console.log(`message : ${message.role} > ${message.content[0].text.value}`);
                responseOfAI = message.content[0].text.value
            }
        } else {
            console.log(run.status);
        }
        const randomInt = getRandomInt(1, 1000);
        const resumeContent = responseOfAI.trim();
        console.log("resume content:",resumeContent)
        const pdfFilePath = path.join(__dirname, '../../pdfs', `resume_${randomInt}.pdf`);

        // // Generate and save PDF
        await generatePDF(resumeContent, pdfFilePath);

        console.log('PDF Generated:', pdfFilePath);
        return { filePath: `resume_${randomInt}.pdf` };

    } catch (error) {
        if (error.response) {
            console.error('Error generating resume:', {
                status: error.response.status,
                headers: error.response.headers,
                data: error.response.data
            });
            throw new Error(`Error generating resume: ${error.response.data.error.message}`);
        } else if (error.request) {
            console.error('Error generating resume:', {
                request: error.request
            });
            throw new Error('Error generating resume: No response received from the server.');
        } else {
            console.error('Error generating resume:', {
                message: error.message
            });
            throw new Error(`Error generating resume: ${error.message}`);
        }
    }
};