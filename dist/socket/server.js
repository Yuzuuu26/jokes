import csvParser from 'csv-parser';
import fs from 'fs';
import dotenv from 'dotenv';
import * as net from 'net';
dotenv.config();
const fileSource = process.env.FILE_SOURCE;
const PORT = process.env.PORT;
let filePath = '';
let questionsArray = [];
// switch for filepath based on filesource
switch (fileSource) {
    case 'csv':
        filePath = process.env.CSV_FILEPATH;
        csvReading(filePath);
        break;
    case 'json':
        filePath = process.env.JSON_FILEPATH;
        jsonReading(filePath);
        break;
}
// CSV file parsing
export function csvReading(filePath) {
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (row) => {
            questionsArray.push(Object.values(row));
        }).on('end', () => {
            resolve(questionsArray);
        }).on('error', reject);
    });
}
// JSON file parsing
export function jsonReading(filePath) {
    let jsonObjects = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    questionsArray = jsonObjects.map(question => Object.values(question));
    return questionsArray;
}
let requestHolder = [];
// starts the server
function server() {
    const server = net.createServer((conn) => {
        console.log('Server: New client.');
        // asks the question to the client
        function askQuestion(questionsArray) {
            conn.write(`\nChoose a number for a question (1-${questionsArray.length}).\nEnter 0 to exit:\n`);
        }
        // on data (reads the user inputs), does the following
        conn.on('data', (data) => {
            var _a, _b, _c, _d;
            // clears requestHolder array for a new data input
            requestHolder = [];
            // request comes in this format following inputState form
            requestHolder.push({
                type: 'request',
                id: data.toString().trim(),
                question: '',
                answer: '',
                file: fileSource
            });
            // Request is sent and shown to server in JSON format
            console.log('REQUEST:', JSON.stringify(requestHolder[0]));
            const choice = answerChecker(questionsArray, (_a = requestHolder[0]) === null || _a === void 0 ? void 0 : _a.id);
            const input = Number((_b = requestHolder[0]) === null || _b === void 0 ? void 0 : _b.id);
            //checker
            if (choice.type === 'error') {
                conn.write(choice.message);
                return askQuestion(questionsArray);
            }
            // checker
            if (choice.type === 'exit') {
                console.log('Server: Client ended connection.');
                conn.write(choice.message, () => {
                    conn.destroy();
                });
                return;
            }
            const question = getQuestion(questionsArray, input);
            const answer = getAnswer(questionsArray, input);
            requestHolder.push({
                type: 'response',
                id: input.toString(),
                question: question,
                answer: answer,
                file: fileSource
            });
            // shows the joke to the user
            conn.write('\n' + ((_c = requestHolder[1]) === null || _c === void 0 ? void 0 : _c.question) + " ");
            conn.write((_d = requestHolder[1]) === null || _d === void 0 ? void 0 : _d.answer);
            console.log('RESPONSE:', JSON.stringify(requestHolder[1]));
            // clear for the second time
            requestHolder = [];
            // loops
            askQuestion(questionsArray);
        });
        conn.on('error', (err) => {
            console.log('error:', err.message);
        });
        // calls the function
        askQuestion(questionsArray);
    });
    server.listen(PORT, () => {
        console.log(`Server: Listening on port ${PORT}.`);
    });
}
server();
// Question based on the questionNumber
export function getQuestion(questionsArray, questionNumber) {
    const question = questionsArray[questionNumber - 1][1];
    return question;
}
// Answer based on the answerQuestion
export function getAnswer(questionsArray, answerQuestion) {
    const answer = questionsArray[answerQuestion - 1][2];
    return answer;
}
// answer is checked if its type is correct
export function answerChecker(questionsArray, userInput) {
    const choice = Number(userInput);
    console.log('choice', choice);
    if (isNaN(choice)) {
        const checker = {
            type: "error",
            message: "Not a number!"
        };
        return checker;
    }
    if (choice % 1 !== 0) {
        const checker = {
            type: "error",
            message: "Whole numbers only."
        };
        return checker;
    }
    if (choice > questionsArray.length || choice < 0) {
        const checker = {
            type: "error",
            message: "Not within the choices. Choose again!"
        };
        return checker;
    }
    if (choice === 0) {
        const checker = {
            type: "exit",
            message: "Goodbye!"
        };
        return checker;
    }
    const checker = {
        type: "success",
        message: ""
    };
    return checker;
}
//# sourceMappingURL=server.js.map