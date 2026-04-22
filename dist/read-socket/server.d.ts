export declare function csvReading(filePath: string): Promise<string[][]>;
export declare function jsonReading(filePath: string): string[][];
export declare function getQuestion(questionsArray: string[][], questionNumber: number): string;
export declare function getAnswer(questionsArray: string[][], answerQuestion: number): string;
export type checker = {
    type: string;
    message: string;
};
export declare function answerChecker(questionsArray: string[][], userInput: string): checker;
//# sourceMappingURL=server.d.ts.map