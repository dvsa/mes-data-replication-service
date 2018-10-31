/**
 * Handles generating DMS table mappings from a much simpler logical input.
 */
import { getLogger } from './util';
import { DateTime } from 'luxon';

const logger = getLogger('table-mapping', 'debug');

export interface SourceFilter {
    column: string,
    operator: string, 
    value?: string,
    start?: string,
    end?: string
}

export interface Table {
    sourceName: string, 
    sourceFilter?: SourceFilter, 
    removeColumns?: string[]
}

export interface Options {
    sourceSchema: string,
    destSchema: string, 
    tables: Table[]
}

export function generateTableMapping(options: Options): any {
    const config = { rules: [] }

    // first add a transformation rule from source to dest schema name...
    config.rules.push( {
        "rule-type": "transformation",
        "rule-id": "1",
        "rule-name": "1",
        "rule-action": "rename",
        "rule-target": "schema",
        "object-locator": {
            "schema-name": options.sourceSchema
        },
        "value": options.destSchema
    });

    let index = 2; // rule 1 is above
    options.tables.forEach((element: Table) => {
        // then add include selection rules for every table...
        const rule: any = {
            "rule-type": "selection",
            "rule-id": `${index}`,
            "rule-name": `${index}`,
            "object-locator": {
                "schema-name": options.sourceSchema,
                "table-name": element.sourceName
            },
            "rule-action": "include"
        };

        if (element.sourceFilter) {
            if (element.sourceFilter.start) {
                // filter with two values
                rule.filters = [{
                    "filter-type": "source",
                    "column-name": element.sourceFilter.column,
                    "filter-conditions": [{
                        "filter-operator": element.sourceFilter.operator,
                        "start-value": element.sourceFilter.start,
                        "end-value": element.sourceFilter.end
                    }]
                }];
            } else {
                // filter with one value
                rule.filters = [{
                    "filter-type": "source",
                    "column-name": element.sourceFilter.column,
                    "filter-conditions": [{
                        "filter-operator": element.sourceFilter.operator,
                        "value": element.sourceFilter.value
                    }]
                }];
            }
        }

        config.rules.push(rule);
        index += 1;

        if (element.removeColumns) {
            // add rules for each column to remove
            element.removeColumns.forEach((column: string) => {
                const removeRule = {
                    "rule-type": "transformation",
                    "rule-id": `${index}`,
                    "rule-name": `${index}`,
                    "rule-action": "remove-column",
                    "rule-target": "column",
                    "object-locator": {
                        "schema-name": options.sourceSchema,
                        "table-name": element.sourceName,
                        "column-name": column
                    }
                };
                config.rules.push(removeRule);
                index += 1;
            });
        }
    });

    return config;
}

export function addBetweenFilter(options: Options, tableName: string, columnName: string, start: DateTime, end: DateTime) {
    const filter = {
        "column": columnName,
        "operator": "between",
        "start": start.toISODate(),
        "end": end.toISODate()
    };

    options.tables.find((table) => table.sourceName === tableName).sourceFilter = filter;
    logger.debug("Filtering %s on %s from %s to %s", tableName, columnName, start.toISODate(), end.toISODate());
}