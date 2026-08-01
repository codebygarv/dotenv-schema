import { describe, it, expect } from 'vitest';
import { generateMarkdownDocs } from '../src/docs/generate-markdown.js';
import { generateEnvExample } from '../src/docs/generate-env-example.js';
import { EnvSchema } from '../src/types/schema.js';

describe('Docs: Generate Markdown', () => {
  it('should generate a markdown table', () => {
    const schema: EnvSchema = {
      PORT: { type: 'number', default: 3000, description: 'The server port' },
      API_KEY: { type: 'string', required: true }
    };
    
    const md = generateMarkdownDocs(schema);
    
    expect(md).toContain('| Variable | Type | Required | Default | Description |');
    expect(md).toContain('| **PORT** | `number` | ✅ | `3000` | The server port |');
    expect(md).toContain('| **API_KEY** | `string` | ✅ | - | - |');
  });
});

describe('Docs: Generate Env Example', () => {
  it('should generate an example env file', () => {
    const schema: EnvSchema = {
      PORT: { type: 'number', default: 3000, description: 'The server port' },
      API_KEY: { type: 'string', required: true }
    };
    
    const example = generateEnvExample(schema);
    
    expect(example).toContain('# The server port');
    expect(example).toContain('PORT=3000');
    expect(example).toContain('API_KEY=your_api_key');
  });
});
