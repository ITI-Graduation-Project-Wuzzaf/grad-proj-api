"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonParser = void 0;
const jsonParser = (field) => {
    if (field && typeof field === 'string') {
        try {
            return JSON.parse(field);
        }
        catch (err) {
            return '';
        }
    }
    return '';
};
exports.jsonParser = jsonParser;
