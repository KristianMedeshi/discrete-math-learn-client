export const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
export const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/i;
export const lettersRegex = /[а-яА-Яa-zA-Z]/g;
export const numberRegex = /^[0-9]+([.][0-9]+)?$/;
export const cardNumberRegex = /^[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}$/;
export const cardCvvRegex = /^[0-9]{3,4}$/;
export const cardExpiryRegex = /^(0[1-9]|1[0-2]) \/ [0-9]{2}$/;
export const emptyEditorRegex = /^(?![\s\S]*<[^>]+><br><\/[^>]+>$)(?!\s*$).+/;
export const specSymbolRegex = /(ArrowLeft|ArrowRight|Backspace|Delete|Tab|Control|Alt|F[1-9]|F1[0-2]| )/;
