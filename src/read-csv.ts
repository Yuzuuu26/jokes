// read through the csv file
// for each row, get them
// store into memory using multidimensional array
// get based on array index. by displaying the number. 
// get the number and its joke
// display. 
// error handling

import csvParser from 'csv-parser';
import fs from 'fs';
import * as readLine from 'readline';

const filePath: string = './csv/ts-jokes.csv';

const rl = readLine.createInterface({
    input : process.stdin,
    output : process.stdout
});

type RowData = {
    id: string;
    question: string;
    answer: string;
};

let questionsArray: string[][] = [];

fs.createReadStream(filePath).pipe(csvParser()).on('data', (row: RowData) => {
    questionsArray.push(Object.values(row));
}).on('end', () => {
    function getQuestion(questionNumber: number) {
        console.log('\n'+ questionsArray[questionNumber - 1]![1]!)
        // return questionsArray[questionNumber + 1]![1]!
    }
    function getAnswer(answerQuestion: number) {
        console.log(questionsArray[answerQuestion - 1]![2]!)
        // return questionsArray[answerQuestion + 1]![2]!
    }

    function askQuestion() {
        rl.question(`\nChoose a number for a joke (1-${questionsArray.length}).\nEnter 0 to exit:\n`, (userInput) => {

            const choice = Number(userInput);

            if (choice % 1 !== 0) {
                console.log('Whole numbers only.');
                return askQuestion();
            }

            if (isNaN(choice)) {
                console.log("Not a number!");
                return askQuestion();
            }

            if (choice > questionsArray.length) {
                console.log("\nNot within the choices. Choose again!");
                return askQuestion();
            }

            if (choice === 0) {
                console.log("Goodbye!");
                rl.close();
                return;
            }

            getQuestion(choice);
            getAnswer(choice);

            askQuestion();
        });
    }   
    askQuestion();
});




