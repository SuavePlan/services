import {hasValidTld, splitDomain} from "../../../src/utils/domain";

describe('hasValidTld', () => {
    it('should return true for valid TLDs', () => {
        expect(hasValidTld('example.com')).toBeTruthy();
        expect(hasValidTld('example.NET')).toBeTruthy(); // Testing case insensitivity
    });

    it('should return false for invalid TLDs', () => {
        expect(hasValidTld('example.invalidTLD')).toBeFalsy();
    });

    it('should return false for empty strings', () => {
        expect(hasValidTld('')).toBeFalsy();
    });
});

describe('splitDomain', () => {
    it('should split valid domains correctly', () => {
        const result = splitDomain('sub.example.co.uk');
        expect(result).toEqual({
            tld: 'co.uk',
            domain: 'example',
            subdomain: 'sub'
        });
    });

    it('should throw error for invalid domains', () => {
        expect(() => splitDomain('example')).toThrow('Invalid Domain');
        expect(() => splitDomain('example.invalidTLD')).toThrow('Invalid TLD');
    });

    it('should handle domains without subdomains', () => {
        const result = splitDomain('example.co.uk');
        expect(result).toEqual({
            tld: 'co.uk',
            domain: 'example',
            subdomain: null
        });
    });

    it('should handle multiple subdomains', () => {
        const result = splitDomain('a.b.example.com');
        expect(result).toEqual({
            tld: 'com',
            domain: 'example',
            subdomain: 'a.b'
        });
    });

    it('should throw error for empty strings', () => {
        expect(() => splitDomain('')).toThrow('Invalid Domain');
    });
});
