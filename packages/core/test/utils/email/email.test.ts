import {normalizeEmail} from "../../../src/utils/email";

describe('normalizeEmail', () => {
    // Gmail specific tests
    it('should normalize Gmail addresses by removing dots', () => {
        expect(normalizeEmail('john.doe@gmail.com')).toBe('johndoe@gmail.com');
    });

    it('should normalize Gmail addresses by ignoring after +', () => {
        expect(normalizeEmail('john.doe+test@gmail.com')).toBe('johndoe@gmail.com');
    });

    it('should treat googlemail.com as gmail.com', () => {
        expect(normalizeEmail('john.doe+test@googlemail.com')).toBe('johndoe@gmail.com');
    });

    // Yahoo specific tests
    it('should normalize Yahoo addresses by ignoring after -', () => {
        expect(normalizeEmail('john.doe-test@yahoo.com')).toBe('john.doe@yahoo.com');
    });

    // General sub-addressing (+ sign) tests
    it('should ignore after + for all providers', () => {
        expect(normalizeEmail('john.doe+test@protonmail.com')).toBe('john.doe@protonmail.com');
        expect(normalizeEmail('john.doe+test@fastmail.com')).toBe('john.doe@fastmail.com');
        expect(normalizeEmail('john.doe+test@icloud.com')).toBe('john.doe@icloud.com');
        expect(normalizeEmail('john.doe+test@example.com')).toBe('john.doe@example.com'); // General case
    });

    // Additional tests
    it('test for invalid email', () => {
        expect(() => normalizeEmail('  John.Doe+test@ExaMple  ')).toThrowError('Email address is invalid');
    });
    // Additional tests
    it('should handle trimming and lowercase', () => {
        expect(normalizeEmail('  John.Doe+test@ExaMple.COM  ')).toBe('john.doe@example.com');
    });

    it('should return unchanged email for domains without known quirks', () => {
        expect(normalizeEmail('john.doe@example.com')).toBe('john.doe@example.com');
    });

    // TLD check tests
    it('should pass for valid TLDs when checkTLD option is true', () => {
        expect(normalizeEmail('john.doe@example.com', {checkTLD: true})).toBe('john.doe@example.com');
    });

    it('should throw an error for invalid TLDs when checkTLD option is true', () => {
        expect(() => normalizeEmail('john.doe@invalidTLD.coom', {checkTLD: true})).toThrowError('Domain is invalid');
    });
});
