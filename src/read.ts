import csvParser from 'csv-parser';
import fs from 'fs';
import * as readLine from 'readline';
import dotenv from 'dotenv';
dotenv.config();


const fileSource = process.env.FILE_SOURCE;
let filePath: string = '';
let questionsArray: string[][] = [];

const rl = readLine.createInterface({
    input : process.stdin,
    output : process.stdout
});

type RowData = {
    id: string;
    question: string;
    answer: string;
};

switch (fileSource) {
    case 'csv':
        filePath = process.env.CSV_FILEPATH!;
        csvReading(questionsArray, filePath);
        break;
    case 'json':
        filePath = process.env.JSON_FILEPATH!;
        jsonReading(questionsArray, filePath)
        break;
}

function csvReading(questionsArray: string[][], filePath: string) {
    fs.createReadStream(filePath).pipe(csvParser()).on('data', (row: RowData) => {
        questionsArray.push(Object.values(row));
    }).on('end', () => {
        askQuestion(questionsArray);
    });
}

function jsonReading(questionsArray: string[][], filePath: string) {
    let jsonObjects: RowData[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    questionsArray = jsonObjects.map(person =>  Object.values(person));

    askQuestion(questionsArray);
}

function askQuestion(questionsArray: string[][]) {
    rl.question(`\nChoose a number for a joke (1-${questionsArray.length}).\nEnter 0 to exit:\n`, (userInput) => {

        const choice = Number(userInput);

        if (choice % 1 !== 0) {
            console.log('Whole numbers only.');
            return askQuestion(questionsArray);
        }

        if (isNaN(choice)) {
            console.log("Not a number!");
            return askQuestion(questionsArray);
        }

        if (choice > questionsArray.length) {
            console.log("\nNot within the choices. Choose again!");
            return askQuestion(questionsArray);
        }

        if (choice === 0) {
            console.log("Goodbye!");
            rl.close();
            return;
        }
        
        getQuestion(questionsArray, choice);
        getAnswer(questionsArray, choice);
        askQuestion(questionsArray);
    });
}   

function getQuestion(questionsArray: string[][], questionNumber: number) {
    console.log('\n'+ questionsArray[questionNumber - 1]![1]!)
}

function getAnswer(questionsArray: string[][], answerQuestion: number) {
    console.log(questionsArray[answerQuestion - 1]![2]!)
}