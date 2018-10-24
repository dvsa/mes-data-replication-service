/**
 * Tests for the cli app.
 */
import { generateTaskConfig, Options } from './cli-app'
import { getLogger } from './util';
import * as fs from 'fs'

const logger = getLogger('cli-app.spec', 'debug');

describe('generateTaskConfig', () => {
    
    it('handles a single table', () => {
        const input: Options = loadJSON('input-single-table');
        expect(generateTaskConfig(input)).toEqual(loadJSON('output-single-table'));
    });

    it('handles multiple tables', () => {
        const input: Options = loadJSON('input-multiple-tables');
        expect(generateTaskConfig(input)).toEqual(loadJSON('output-multiple-tables'));
    });

    it('handles a single table with filter', () => {
        const input: Options = loadJSON('input-single-table-with-filter');
        expect(generateTaskConfig(input)).toEqual(loadJSON('output-single-table-with-filter'));
    });

    it('handles a single table removing columns', () => {
        const input: Options = loadJSON('input-single-table-remove-columns');
        expect(generateTaskConfig(input)).toEqual(loadJSON('output-single-table-remove-columns'));
    });
});

function loadJSON(name: string): any {
    try {
        const resultText = fs.readFileSync(`src/test-data/${name}.json`);
        return JSON.parse(resultText.toString('utf8'));
    } catch (e) {
        logger.error("Error loading JSON %s: %s", name, e);
        throw e;
    }
}