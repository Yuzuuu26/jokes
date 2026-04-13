import csvParser from 'csv-parser';
import fs from 'fs';
import * as readLine from 'readline';
import dotenv from 'dotenv';
dotenv.config();
const fileSource = process.env.FILE_SOURCE;
let filePath = '';
let questionsArray = [];
const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
});
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
export function jsonReading(filePath) {
    let jsonObjects = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    questionsArray = jsonObjects.map(person => Object.values(person));
    return questionsArray;
}
// how do we loop it without calling the functions?
function askQuestion(questionsArray) {
    rl.question(`\nChoose a number for a joke (1-${questionsArray.length}).\nEnter 0 to exit:\n`, (userInput) => {
        // assigning userInput to be considered as a number (choice)
        const choice = answerChecker(questionsArray, userInput);
        const input = Number(userInput);
        // checkers if choice is valid
        if (choice.type === 'error') {
            if (isNaN(input)) {
                console.log(choice.message);
                return askQuestion(questionsArray);
            }
            else if (input % 1 !== 0) {
                console.log(choice.message);
                return askQuestion(questionsArray);
            }
            else if (input > questionsArray.length) {
                console.log(choice.message);
                return askQuestion(questionsArray);
            }
        }
        else if (choice.type === 'exit') {
            console.log(choice.message);
            rl.close();
            return;
        }
        const question = getQuestion(questionsArray, input);
        const answer = getAnswer(questionsArray, input);
        console.log('\n' + question);
        console.log(answer);
        askQuestion(questionsArray);
    });
}
askQuestion(questionsArray);
// add a return here
export function getQuestion(questionsArray, questionNumber) {
    const question = questionsArray[questionNumber - 1][1];
    return question;
}
// add a return here
export function getAnswer(questionsArray, answerQuestion) {
    const answer = questionsArray[answerQuestion - 1][2];
    return answer;
}
export function answerChecker(questionsArray, userInput) {
    const choice = Number(userInput);
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
    if (choice > questionsArray.length) {
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
// if y
// if csv
// if json
// if n
//else anything else
// oing back
// 0 exit
//# sourceMappingURL=read.js.map