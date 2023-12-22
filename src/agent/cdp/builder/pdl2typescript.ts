/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import * as PDL from './pdl-types';

export interface IDefinitionRequest {
  name: string;
  definition: PDL.Definition;
}

export const pdlToTypeScript = (definitions: IDefinitionRequest[] = []) =>
  definitions.map((_, i) => domainToTypeScript(i, definitions)).join('\n\n');

const primitiveTypes = new Map([
  ['string', 'string'],
  ['number', 'number'],
  ['boolean', 'boolean'],
  ['object', 'Record<string, unknown>'],
  ['integer', 'integer'],
  ['any', 'any'],
]);

const toTitleCase = (s: string) => s[0].toUpperCase() + s.substr(1);

const domainToTypeScript = (index: number, definitions: IDefinitionRequest[] = []) => {
  const result = [];
  const interfaceSeparator = createSeparator();
  const {
    name,
    definition: { domains },
  } = definitions[index];

  result.push(``);
  result.push(`export namespace ${name} {`);
  result.push(`export type integer = number;`);
  interfaceSeparator();

  function appendText(text: string, tags: { [key: string]: string | boolean } = {}) {
    for (const key of Object.keys(tags)) {
      const value = tags[key];
      if (!value) {
        continue;
      }

      text += `\n@${key}`;
      if (typeof value === 'string') {
        text += ` ${value}`;
      }
    }

    if (!text) return;
    result.push('/**');
    for (const line of text.split('\n')) result.push(` * ${line}`);
    result.push(' */');
  }

  function createSeparator() {
    let first = true;
    return function () {
      if (!first) result.push('');
      first = false;
    };
  }

  const makeTypePredicate = (domainName: string, typeName: string) => (domain: PDL.Domain) => {
    return domain.domain === domainName && domain.types?.some(t => t.id === typeName);
  };

  function generateType(domain: PDL.Domain, prop: PDL.DataType<boolean>): string {
    if (prop.type === 'string' && prop.enum) {
      return `${prop.enum.map(value => `'${value}'`).join(' | ')}`;
    }

    if ('$ref' in prop) {
      let [domainName, typeName] = prop.$ref.split('.');
      if (!typeName) {
        [domainName, typeName] = [domain.domain, domainName];
      }

      const hasType = makeTypePredicate(domainName, typeName);
      const containing = definitions.find(d => d.definition.domains.some(hasType));
      if (!containing) {
        throw new Error(`${prop.$ref} is not contained in any domain`);
      }

      return containing === definitions[index]
        ? prop.$ref
        : `${containing.name}.${prop.$ref}`;
    }

    if (prop.type === 'array') {
      const subtype = prop.items ? generateType(domain, prop.items) : 'any';
      return `${subtype}[]`;
    }

    const primitiveType = primitiveTypes.get(prop.type);
    if (primitiveType) {
      return primitiveType;
    }

    throw new Error(`Unknown type: ${JSON.stringify(prop)}`);
  }

  function appendProps(domain: PDL.Domain, props: Iterable<PDL.DataType<false>>) {
    const separator = createSeparator();
    for (const prop of props) {
      separator();
      appendText(prop.description ?? '', { deprecated: !!prop.deprecated });
      result.push(`${prop.name}${prop.optional ? '?' : ''}: ${generateType(domain, prop)};`);
    }
  }

  function appendDomain(domain: PDL.Domain) {
    const apiSeparator = createSeparator();
    const commands = domain.commands || [];
    const events = domain.events || [];
    const types = domain.types || [];
    const name = toTitleCase(domain.domain);
    interfaceSeparator();
    appendText(`Methods and events of the '${name}' domain.`);
    result.push(`export interface ${name}Api {`);
    result.push(`requests: {`);
    for (const command of commands) {
      apiSeparator();
      appendText(command.description, { deprecated: !!command.deprecated });
      result.push(
        `${command.name}: { params: ${name}.${toTitleCase(
          command.name,
        )}Params, result: ${name}.${toTitleCase(command.name)}Result }`,
      );
    }
    result.push(`};`);

    result.push(`events: {`);
    for (const event of events) {
      apiSeparator();
      appendText(event.description, { deprecated: !!event.deprecated });
      result.push(`${event.name}: { params: ${name}.${toTitleCase(event.name)}Event };`);
    }

    result.push(`};`);
    result.push(`}`);

    const typesSeparator = createSeparator();
    interfaceSeparator();
    appendText(`Types of the '${name}' domain.`);
    result.push(`export namespace ${name} {`);
    for (const command of commands) {
      typesSeparator();
      appendText(`Parameters of the '${name}.${command.name}' method.`);
      result.push(`export interface ${toTitleCase(command.name)}Params {`);
      appendProps(domain, command.parameters || []);
      result.push(`}`);
      typesSeparator();
      appendText(`Return value of the '${name}.${command.name}' method.`);
      result.push(`export interface ${toTitleCase(command.name)}Result {`);
      appendProps(domain, command.returns || []);
      result.push(`}`);
    }
    for (const event of events) {
      typesSeparator();
      appendText(`Parameters of the '${name}.${event.name}' event.`);
      result.push(`export interface ${toTitleCase(event.name)}Event {`);
      appendProps(domain, event.parameters || []);
      result.push(`}`);
    }
    for (const type of types) {
      typesSeparator();
      appendText(type.description ?? '', { deprecated: !!type.deprecated });
      if (type.type === 'object') {
        result.push(`export interface ${toTitleCase(type.id)} {`);
        if (type.properties) appendProps(domain, type.properties);
        else result.push(`[key: string]: any;`);
        result.push(`}`);
      } else {
        result.push(`export type ${toTitleCase(type.id)} = ${generateType(domain, type)};`);
      }
    }
    result.push(`}`);
  }

  interfaceSeparator();
  appendText('The list of domains.');
  result.push(`export interface Domains {
`);
  domains.forEach(d => {
    result.push(`${d.domain}: ${d.domain}Api;`);
  });
  result.push(`}`);
  domains.forEach(d => appendDomain(d));
  result.push(`}`);
  return result.join('\n');
};
