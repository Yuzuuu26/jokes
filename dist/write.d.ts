export type RowData = {
    id: string;
    question: string;
    answer: string;
};
export type inputChecker = {
    exit: boolean;
    input: string | null;
};
export declare function CSVWrite(filePath: string): Promise<string[][]>;
export declare function JSONWrite(filePath: string): string[][];
export declare function handleInput(input: string): {
    exit: boolean;
    input: null;
} | {
    exit: boolean;
    input: string;
};
export declare function addCSV(arrayLengthString: string, jokeHolder: string, punchlineHolder: string): string;
export declare function addJSON(arrayLengthString: string, jokeHolder: string, punchlineHolder: string): RowData;
//# sourceMappingURL=write.d.ts.map