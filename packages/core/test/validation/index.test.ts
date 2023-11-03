import Validation, {isBase64, isHex} from "../../src/validation/index";

describe("Validation Class", () => {
    it("should validate base64 correctly", () => {
        expect(isBase64("SGVsbG8gd29ybGQ=")).toBe(true); // Valid base64
        expect(isBase64("Hello world")).toBe(false);    // Not valid base64
    });

    it("should validate hex correctly", () => {
        expect(isHex("1a2b3c")).toBe(true);  // Valid hex
        expect(isHex("xyz123")).toBe(false); // Not valid hex
    });

    it("should create a Validation instance", () => {
        const validation = new Validation();
        expect(validation).toBeInstanceOf(Validation);
    });

    it("should have isBase64 and isHex methods", () => {
        const validation = new Validation();
        expect(typeof validation.isBase64).toBe("function");
        expect(typeof validation.isHex).toBe("function");
    });
});
