var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { describe, it, expect } from 'vitest';
import { CSVWrite, JSONWrite, handleInput, addCSV, addJSON } from '../write.js';
import dotenv from 'dotenv';
dotenv.config();
const JsonfilePath = process.env.JSON_FILEPATH;
const CSVfilePath = process.env.CSV_FILEPATH;
describe('write.JSONWrite', () => {
    it('Gets 1st from the json file', () => {
        const questions = JSONWrite(JsonfilePath);
        expect(questions[0][1]).toBe('Bakit masama ang salt sa tao?');
        expect(questions[0][2]).toBe('Cause its a sin');
    });
    it('Gets 2nd from the json file', () => {
        const questions = JSONWrite(JsonfilePath);
        expect(questions[1][1]).toBe('Anong pinaka malaking nunal sa buong asia?');
        expect(questions[1][2]).toBe('Mole of Asia 🥰');
    });
});
describe('write.CSVWrite', () => {
    it('Gets 3rd from the csv file', () => __awaiter(void 0, void 0, void 0, function* () {
        const questions = yield CSVWrite(CSVfilePath);
        expect(questions[2][1]).toBe('Anong anime ang favorite ng mga Muslim?');
        expect(questions[2][2]).toBe('Eh di Islam Dunk');
    }));
    it('Gets 4th from the csv file', () => __awaiter(void 0, void 0, void 0, function* () {
        const questions = yield CSVWrite(CSVfilePath);
        expect(questions[3][1]).toBe('What kind of cat should you never trust?');
        expect(questions[3][2]).toBe('A cheetah');
    }));
});
describe('read.handleInput', () => {
    it('Exit', () => {
        const result = handleInput('0');
        expect(result).toEqual({
            exit: true,
            input: null
        });
    });
    it('Inputs a joke', () => {
        const result = handleInput('Why did the chicken cross the road?');
        expect(result).toEqual({
            exit: false,
            input: 'Why did the chicken cross the road?'
        });
    });
    it('Inputs a joke punchline', () => {
        const result = handleInput('To get to the other side!');
        expect(result).toEqual({
            exit: false,
            input: 'To get to the other side!'
        });
    });
});
describe('write.addJSON', () => {
    it('Checks if joke is added to JSON file', () => {
        const sentence = addJSON('1', 'Why did the chicken cross the road?', 'To get to the other side!');
        expect(sentence).toEqual({
            id: '1',
            question: 'Why did the chicken cross the road?',
            answer: 'To get to the other side!'
        });
    });
});
describe('write.addCSV', () => {
    it('Checks if joke is added to CSV file', () => {
        const sentence = addCSV('1', 'Why did the chicken cross the road?', 'To get to the other side!');
        expect(sentence).toBe("1,\"Why did the chicken cross the road?\",\"To get to the other side!\"");
    });
});
//# sourceMappingURL=write.test.js.map