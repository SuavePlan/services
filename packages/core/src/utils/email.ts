import validator from 'validator';
import {hasValidTld} from "./domain";

export interface NormalizeEmailOptions {
    checkTLD: boolean;

}

export function normalizeEmail(email: string, options?: NormalizeEmailOptions): string {

    const opts = Object.assign({}, {
        checkTLD: false
    }, options ?? {});

    // Trim and convert to lowercase
    email = email.trim().toLowerCase();

    // Split into local and domain parts
    let [localPart, domain] = email.split('@');

    // Remove characters after + symbol for all providers
    localPart = localPart.split('+')[0];

    // Normalize based on provider
    switch (domain) {
        case 'gmail.com':
        case 'googlemail.com':
            // Normalize domain for googlemail.com
            domain = 'gmail.com';
            // Remove all dots for Gmail
            localPart = localPart.split('.').join('');
            break;
        case 'yahoo.com':
            // Remove characters after - symbol
            localPart = localPart.split('-')[0];
            break;
        // No need to process + for iCloud, Fastmail, and ProtonMail
        // as it's already handled above.
        default:
            break;
    }

    const normalized = `${localPart}@${domain}`;

    // now validate

    if (!validator.isEmail(normalized)) {
        throw new Error('Email address is invalid');
    }

    if (opts.checkTLD && (!validator.isFQDN(domain) || !hasValidTld(domain))) {
        throw new Error('Domain is invalid');
    }

    return normalized;

}

export default {
    normalizeEmail
}
