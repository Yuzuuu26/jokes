import csvParser from 'csv-parser';
import fs from 'fs';
import * as readLine from 'readline';
const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
});
const filePath = './data/ts-jokes.csv';
let arrayHolder = [];
let jokeHolder = '';
let punchlineHolder = '';
let questionsArray = [];
let csvArrayLength = 0;
let csvArrayLengthString = '';
let arrayString = '';
fs.createReadStream(filePath).pipe(csvParser()).on('data', (row) => {
    questionsArray.push(Object.values(row));
}).on('end', () => {
    csvArrayLength = questionsArray.length + 1;
    function createJoke() {
        // questionsArray.length = 0;
        // console.log('createJoke', questionsArray);
        // jokeHolder = '';
        rl.question('\nEnter the joke you would like to add\nEnter 0 to exit:\n', (joke) => {
            jokeHolder = joke;
            if (joke === '0') {
                rl.close();
                return;
            }
            return createPunchline();
        });
    }
    function createPunchline() {
        // punchlineHolder = '';
        rl.question('\nEnter joke punchline:\nEnter 0 to exit:\n', (punchline) => {
            punchlineHolder = punchline;
            if (punchline === '0') {
                rl.close();
                return;
            }
            return add();
        });
    }
    function add() {
        rl.question('\nAre you sure you want to add joke (Y/N)? \n', (choice) => {
            choice = choice.toUpperCase();
            if (choice === 'Y') {
                console.log('\nJoke added!');
                csvArrayLengthString = csvArrayLength.toString();
                console.log(`${csvArrayLengthString}. ${jokeHolder} ${punchlineHolder}\n`);
                arrayHolder.push(csvArrayLengthString);
                arrayHolder.push('\"' + jokeHolder + '\"');
                arrayHolder.push('\"' + punchlineHolder + '\"');
                arrayString = arrayHolder.join(',');
                fs.appendFileSync(filePath, '\n' + arrayString);
                return addAnother();
            }
            else {
                console.log('\nGoing back.');
                return createJoke();
            }
        });
    }
    function addAnother() {
        rl.question('\nAdd another joke (Y/N)?\n', (choice) => {
            if (choice.toUpperCase() === 'Y') {
                questionsArray.length = 0;
                csvArrayLength += 1;
                arrayHolder = [];
                createJoke();
            }
            else {
                rl.close();
                return;
            }
        });
    }
    createJoke();
});
//# sourceMappingURL=write.js.map