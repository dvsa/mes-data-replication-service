/**
 * Node.js Typescript CLI app to generate and run DMS tasks.
 */
import { getLogger } from './util';

const logger = getLogger('cli-app', 'debug');

export interface SourceFilter {
    column: string,
    operator: string, 
    value: string
}

export interface Table {
    sourceName: string, 
    sourceFilter: SourceFilter, 
    removeColumns: string[]
}

export interface Options {
    sourceSchema: string,
    destSchema: string, 
    tables: Table[]
}

export function generateTaskConfig(options: Options): any {
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
            rule.filters = [{
                "filter-type": "source",
                "column-name": element.sourceFilter.column,
                "filter-conditions": [{
                    "filter-operator": element.sourceFilter.operator,
                    "value": element.sourceFilter.value
                }]
            }];
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
