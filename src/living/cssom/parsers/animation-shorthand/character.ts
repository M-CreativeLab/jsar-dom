import { CodePointTest } from './type';

export const Zero = 0x30;
export const Nine = 0x39;
export const Dot = 0x2E;
export const Space = 0x20;
export const HTab = 0x09;
export const LF = 0x0A;
export const CR = 0x0D;
export const UpperA = 0x41;
export const LowerA = 0x61;
export const UpperF = 0x46;
export const LowerF = 0x66;
export const UpperM = 0x4D;
export const LowerM = 0x6D;
export const UpperS = 0x53;
export const LowerS = 0x73;
export const UpperZ = 0x5A;
export const LowerZ = 0x7A;
export const DoubleQuote = 0x22;
export const SingleQuote = 0x27;
export const OpenParenthesis = 0x28;
export const CloseParenthesis = 0x29;
export const Comma = 0x2C;
export const Backslash = 0x5C;
export const Hyphen = 0x2D;
export const Underscore = 0x5F;

export const isInRange = (
    cp: number | undefined,
    min: number,
    max: number,
): cp is number => typeof cp === 'number' && min <= cp && cp <= max;
export const isOneOf = (...cps: Array<number>): CodePointTest => {
    const set = new Set<number | undefined>(cps);
    return (cp): cp is number => set.has(cp);
};
export const isNot = (...cps: Array<number>): CodePointTest => {
    const set = new Set<number | undefined>(cps);
    return (cp): cp is number => !set.has(cp);
};

export const isWhiteSpace: CodePointTest = isOneOf(Space, HTab, LF, CR);
export const isDigit: CodePointTest = (cp): cp is number => isInRange(cp, Zero, Nine);
export const isUpperAlpha: CodePointTest = (cp): cp is number => isInRange(cp, UpperA, UpperZ);
export const isLowerAlpha: CodePointTest = (cp): cp is number => isInRange(cp, LowerA, LowerZ);
export const isAlpha: CodePointTest = (cp): cp is number => isUpperAlpha(cp) || isLowerAlpha(cp);
export const isNumberStart: CodePointTest = (cp): cp is number => isDigit(cp) || cp === Dot || cp === Hyphen;
export const isHexCharacter: CodePointTest = (cp): cp is number => isDigit(cp) || isInRange(cp, UpperA, UpperF) || isInRange(cp, LowerA, LowerF);
export const isIdentCharacter: CodePointTest = (cp): cp is number => isDigit(cp) || isAlpha(cp) || cp === Hyphen || cp === Underscore;
