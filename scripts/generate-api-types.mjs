import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const check = process.argv.includes('--check');
const source = process.argv.find((arg, index) => index > 1 && !arg.startsWith('--'));
const target = resolve('contracts/openapi.json');
if (source) {
  mkdirSync('contracts', { recursive: true });
  writeFileSync(target, readFileSync(source));
}
const schema = JSON.parse(readFileSync(target, 'utf8'));
function typeOf(value) {
  if (value.$ref) return value.$ref.split('/').at(-1);
  if (Object.hasOwn(value, 'const')) return JSON.stringify(value.const);
  if (value.enum) return value.enum.map((item) => JSON.stringify(item)).join(' | ');
  if (value.anyOf || value.oneOf) return (value.anyOf || value.oneOf).map(typeOf).join(' | ');
  if (value.allOf) return value.allOf.map(typeOf).join(' & ');
  if (value.type === 'array') return `Array<${typeOf(value.items || {})}>`;
  if (value.type === 'object' || value.properties) {
    const fields = Object.entries(value.properties || {}).map(([key, field]) => `${JSON.stringify(key)}${value.required?.includes(key) ? '' : '?'}: ${typeOf(field)};`);
    if (value.additionalProperties) fields.push(`[key: string]: ${typeof value.additionalProperties === 'object' ? typeOf(value.additionalProperties) : 'unknown'};`);
    return `{ ${fields.join(' ')} }`;
  }
  return { string: 'string', integer: 'number', number: 'number', boolean: 'boolean', null: 'null' }[value.type] || 'unknown';
}
const text = '// Generated from contracts/openapi.json. Run pnpm run api:generate; do not edit.\n'
  + Object.entries(schema.components.schemas).sort(([a], [b]) => a.localeCompare(b)).map(([name, value]) => `export type ${name} = ${typeOf(value)};`).join('\n') + '\n';
const output = resolve('src/api/types.generated.ts');
if (check) {
  if (readFileSync(output, 'utf8') !== text) throw new Error('API types have drifted; regenerate and review them.');
} else writeFileSync(output, text);
