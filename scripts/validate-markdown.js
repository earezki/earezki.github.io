#!/usr/bin/env node

/**
 * Markdown Validation and Auto-Fix Script
 * 
 * Detects and resolves common markdown issues:
 * - Invalid frontmatter (missing ---, yaml``` instead of ---, missing required fields)
 * - Unrecognized code block languages (text, plaintext, url, etc.)
 * - Missing required frontmatter fields (title, pubDate, description)
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// Content directories to validate
const CONTENT_DIRS = [
  'src/content/posts',
  'src/content/ainews',
  'src/content/aifinnews',
];

// Required frontmatter fields per collection
const REQUIRED_FIELDS = {
  posts: ['title', 'pubDate'],
  ainews: ['title', 'pubDate'],
  aifinnews: ['title', 'pubDate'],
};

// Language code mappings for Prism
// Maps invalid/unrecognized language codes to valid Prism language codes
const LANGUAGE_MAPPINGS = {
  'url': 'text',
  'plaintext': 'text',
  'code': 'text',
  'snippet': 'text',
  'console': 'bash',
  'terminal': 'bash',
  'cmd': 'bash',
  'powershell': 'bash',
  'properties': 'ini',
  'env': 'bash',
  'dotenv': 'bash',
  'config': 'text',
  'txt': 'text',
  'log': 'text',
};

// Valid Prism language codes (common subset)
const VALID_PRISM_LANGUAGES = new Set([
  'markup', 'html', 'xml', 'svg', 'mathml', 'ssml', 'atom', 'rss',
  'css', 'clike', 'javascript', 'js', 'abap', 'abnf', 'actionscript',
  'ada', 'agda', 'al', 'antlr4', 'g4', 'apacheconf', 'apex', 'apl',
  'applescript', 'aql', 'arduino', 'arff', 'asciidoc', 'adoc', 'aspnet',
  'asm6502', 'autohotkey', 'autoit', 'bash', 'shell', 'basic', 'batch',
  'bbcode', 'birb', 'bison', 'bnf', 'rbnf', 'brainfuck', 'brightscript',
  'bro', 'bsl', 'oscript', 'c', 'csharp', 'cs', 'dotnet', 'cpp', 'cfscript',
  'cfc', 'chaiscript', 'cil', 'clojure', 'cmake', 'cobol', 'coffeescript',
  'coffee', 'concurnas', 'conc', 'csp', 'coq', 'crystal', 'css-extras',
  'csv', 'cypher', 'd', 'dart', 'dataweave', 'dax', 'dhall', 'diff',
  'django', 'jinja2', 'dns-zone-file', 'dns-zone', 'docker', 'dockerfile',
  'dot', 'gv', 'ebnf', 'editorconfig', 'eiffel', 'ejs', 'eta', 'elixir',
  'elm', 'etlua', 'erb', 'erlang', 'excel-formula', 'xlsx', 'xls', 'fsharp',
  'factor', 'false', 'firestore-security-rules', 'flow', 'fortran', 'ftl',
  'gml', 'gamemakerlanguage', 'gcode', 'gdscript', 'gedcom', 'gherkin',
  'git', 'glsl', 'go', 'graphql', 'groovy', 'haml', 'handlebars', 'hbs',
  'haskell', 'hs', 'haxe', 'hcl', 'hlsl', 'http', 'hpkp', 'hsts', 'ichigojam',
  'icon', 'icu-message-format', 'idris', 'idr', 'ignore', 'gitignore',
  'hgignore', 'npmignore', 'inform7', 'ini', 'io', 'j', 'java', 'javadoc',
  'javadoclike', 'javastacktrace', 'jexl', 'jolie', 'jq', 'jsdoc', 'js-extras',
  'json', 'webmanifest', 'json5', 'jsonp', 'jsstacktrace', 'js-templates',
  'julia', 'keyman', 'kotlin', 'kt', 'kts', 'kumir', 'kum', 'latex', 'tex',
  'context', 'latte', 'less', 'lilypond', 'ly', 'liquid', 'lisp', 'emacs',
  'elisp', 'emacs-lisp', 'livescript', 'llvm', 'log', 'lolcode', 'lua',
  'makefile', 'markdown', 'md', 'markup-templating', 'matlab', 'mel',
  'mizar', 'mongodb', 'monkey', 'moonscript', 'moon', 'n1ql', 'n4js', 'n4jsd',
  'nand2tetris-hdl', 'naniscript', 'nani', 'nasm', 'neon', 'nevod', 'nginx',
  'nim', 'nix', 'nsis', 'objectivec', 'objc', 'ocaml', 'opencl', 'openqasm',
  'qasm', 'oz', 'parigp', 'parser', 'pascal', 'objectpascal', 'pascaligo',
  'psl', 'pcaxis', 'px', 'peoplecode', 'pcode', 'perl', 'php', 'phpdoc',
  'php-extras', 'plsql', 'powerquery', 'pq', 'mscript', 'powershell',
  'processing', 'prolog', 'promql', 'properties', 'protobuf', 'pug',
  'puppet', 'pure', 'purebasic', 'pbfasm', 'purescript', 'purs', 'python',
  'py', 'q', 'qml', 'qore', 'r', 'racket', 'rkt', 'jsx', 'tsx', 'reason',
  'regex', 'rego', 'renpy', 'rpy', 'rest', 'rip', 'roboconf', 'robotframework',
  'robot', 'ruby', 'rb', 'rust', 'sas', 'sass', 'scss', 'scala', 'scheme',
  'shell-session', 'sh-session', 'shellsession', 'smali', 'smalltalk',
  'smarty', 'sml', 'smlnj', 'solidity', 'sol', 'solution-file', 'sln',
  'soy', 'sparql', 'rq', 'splunk-spl', 'sqf', 'sql', 'squirrel', 'stan',
  'iecst', 'stylus', 'swift', 'systemd', 't4-templating', 't4-cs', 't4',
  't4-vb', 'tap', 'tcl', 'tt2', 'textile', 'toml', 'tremor', 'trickle',
  'troy', 'turtle', 'trig', 'twig', 'typescript', 'ts', 'typoscript', 'tsconfig',
  'unrealscript', 'uscript', 'uc', 'uri', 'url', 'v', 'vala', 'vbnet',
  'velocity', 'verilog', 'vhdl', 'vim', 'visual-basic', 'vb', 'vba',
  'warpscript', 'wasm', 'web-idl', 'webidl', 'wiki', 'wolfram', 'mathematica',
  'nb', 'wl', 'wren', 'xeora', 'xeoracube', 'xml-doc', 'xojo', 'xquery',
  'yaml', 'yml', 'yang', 'zig'
]);

let stats = {
  filesChecked: 0,
  filesFixed: 0,
  errors: {
    frontmatter: 0,
    languages: 0,
    missingFields: 0,
  },
  fixes: {
    frontmatter: 0,
    languages: 0,
  }
};

/**
 * Parse frontmatter from markdown content
 */
function parseFrontmatter(content) {
  // Check for yaml``` pattern (LLM mistake)
  const yamlCodeBlockMatch = content.match(/^```yaml\n([\s\S]*?)\n```/);
  if (yamlCodeBlockMatch) {
    return {
      valid: false,
      type: 'yaml-codeblock',
      rawFrontmatter: yamlCodeBlockMatch[1],
      endIndex: yamlCodeBlockMatch[0].length,
    };
  }

  // Check for json``` pattern (LLM mistake)
  const jsonCodeBlockMatch = content.match(/^```json\n([\s\S]*?)\n```/);
  if (jsonCodeBlockMatch) {
    return {
      valid: false,
      type: 'json-codeblock',
      rawFrontmatter: jsonCodeBlockMatch[1],
      endIndex: jsonCodeBlockMatch[0].length,
    };
  }

  // Check for proper --- delimiters
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    // Check if frontmatter is missing closing ---
    const unclosedMatch = content.match(/^---\n([\s\S]*?)(?=\n[^-])/);
    if (unclosedMatch) {
      return {
        valid: false,
        type: 'unclosed',
        rawFrontmatter: unclosedMatch[1],
      };
    }
    
    // Check if frontmatter is missing opening ---
    const noOpeningMatch = content.match(/^([\s\S]*?)\n---/);
    if (noOpeningMatch && noOpeningMatch[1].includes(':')) {
      return {
        valid: false,
        type: 'no-opening',
        rawFrontmatter: noOpeningMatch[1],
      };
    }

    return { valid: false, type: 'missing' };
  }

  return {
    valid: true,
    rawFrontmatter: frontmatterMatch[1],
    endIndex: frontmatterMatch[0].length,
  };
}

/**
 * Extract fields from frontmatter YAML
 */
function extractFrontmatterFields(yaml) {
  const fields = {};
  const lines = yaml.split('\n');
  
  for (const line of lines) {
    const match = line.match(/^(\w+):\s*(.+)$/);
    if (match) {
      const [, key, value] = match;
      fields[key] = value.trim();
    }
  }
  
  return fields;
}

/**
 * Fix frontmatter issues
 */
function fixFrontmatter(content, frontmatterInfo) {
  let fixed = content;

  switch (frontmatterInfo.type) {
    case 'yaml-codeblock':
    case 'json-codeblock':
      // Replace ```yaml with ---
      fixed = `---\n${frontmatterInfo.rawFrontmatter}\n---${content.substring(frontmatterInfo.endIndex)}`;
      stats.fixes.frontmatter++;
      console.log(`  ✓ Fixed ${frontmatterInfo.type} frontmatter`);
      break;

    case 'unclosed':
      // Add closing ---
      const insertPos = content.indexOf('\n', frontmatterInfo.rawFrontmatter.length + 4);
      fixed = `---\n${frontmatterInfo.rawFrontmatter}\n---${content.substring(insertPos)}`;
      stats.fixes.frontmatter++;
      console.log(`  ✓ Added missing closing --- to frontmatter`);
      break;

    case 'no-opening':
      // Add opening ---
      fixed = `---\n${frontmatterInfo.rawFrontmatter}\n---${content.substring(frontmatterInfo.rawFrontmatter.length)}`;
      stats.fixes.frontmatter++;
      console.log(`  ✓ Added missing opening --- to frontmatter`);
      break;

    case 'missing':
      // Create basic frontmatter
      const filename = path.basename(process.cwd());
      const date = new Date().toISOString().split('T')[0];
      fixed = `---\ntitle: "Untitled"\npubDate: ${date}\ndescription: ""\n---\n\n${content}`;
      stats.fixes.frontmatter++;
      console.log(`  ✓ Created missing frontmatter`);
      break;
  }

  return fixed;
}

/**
 * Check for missing required fields
 */
function checkRequiredFields(fields, collection) {
  const required = REQUIRED_FIELDS[collection] || [];
  const missing = [];

  for (const field of required) {
    if (!fields[field]) {
      missing.push(field);
    }
  }

  return missing;
}

/**
 * Fix invalid language codes in code blocks
 */
function fixLanguageCodes(content) {
  let fixed = content;
  let changesMade = false;

  // Match code blocks with language specifier
  const codeBlockRegex = /```(\w+)/g;
  const matches = [...content.matchAll(codeBlockRegex)];

  for (const match of matches) {
    const lang = match[1];
    
    // Check if language is invalid
    if (!VALID_PRISM_LANGUAGES.has(lang.toLowerCase())) {
      const mappedLang = LANGUAGE_MAPPINGS[lang.toLowerCase()] || 'text';
      
      // Replace the language code
      fixed = fixed.replace(`\`\`\`${lang}`, `\`\`\`${mappedLang}`);
      changesMade = true;
      
      console.log(`  ✓ Fixed language code: ${lang} → ${mappedLang}`);
      stats.fixes.languages++;
    }
  }

  return { content: fixed, changed: changesMade };
}

/**
 * Validate and fix a single markdown file
 */
async function validateMarkdownFile(filePath, collection) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    let fixed = content;
    let hasChanges = false;

    console.log(`\nChecking: ${path.relative(projectRoot, filePath)}`);
    stats.filesChecked++;

    // 1. Check frontmatter
    const frontmatterInfo = parseFrontmatter(content);
    
    if (!frontmatterInfo.valid) {
      console.log(`  ⚠ Invalid frontmatter (${frontmatterInfo.type})`);
      stats.errors.frontmatter++;
      fixed = fixFrontmatter(fixed, frontmatterInfo);
      hasChanges = true;
      
      // Re-parse after fixing
      const newFrontmatterInfo = parseFrontmatter(fixed);
      if (newFrontmatterInfo.valid) {
        frontmatterInfo.rawFrontmatter = newFrontmatterInfo.rawFrontmatter;
        frontmatterInfo.valid = true;
      }
    }

    // 2. Check required fields
    if (frontmatterInfo.valid && frontmatterInfo.rawFrontmatter) {
      const fields = extractFrontmatterFields(frontmatterInfo.rawFrontmatter);
      const missing = checkRequiredFields(fields, collection);
      
      if (missing.length > 0) {
        console.log(`  ⚠ Missing required fields: ${missing.join(', ')}`);
        stats.errors.missingFields++;
      }
    }

    // 3. Check and fix language codes
    const languageResult = fixLanguageCodes(fixed);
    if (languageResult.changed) {
      fixed = languageResult.content;
      hasChanges = true;
      stats.errors.languages++;
    }

    // 4. Write fixes if any were made
    if (hasChanges) {
      await fs.writeFile(filePath, fixed, 'utf-8');
      stats.filesFixed++;
      console.log(`  ✅ File updated with fixes`);
    } else {
      console.log(`  ✓ No issues found`);
    }

  } catch (error) {
    console.error(`  ❌ Error processing file: ${error.message}`);
  }
}

/**
 * Recursively find all markdown files in a directory
 */
async function findMarkdownFiles(dir) {
  const files = [];
  
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        const subFiles = await findMarkdownFiles(fullPath);
        files.push(...subFiles);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}: ${error.message}`);
  }
  
  return files;
}

/**
 * Main validation function
 */
async function validateAllMarkdown() {
  console.log('🔍 Starting markdown validation...\n');
  console.log(`Checking directories: ${CONTENT_DIRS.join(', ')}\n`);
  console.log('─'.repeat(60));

  for (const dir of CONTENT_DIRS) {
    const fullPath = path.join(projectRoot, dir);
    const collection = path.basename(dir);
    
    try {
      await fs.access(fullPath);
      const files = await findMarkdownFiles(fullPath);
      
      console.log(`\n📁 Processing ${collection} (${files.length} files)`);
      
      for (const file of files) {
        await validateMarkdownFile(file, collection);
      }
    } catch (error) {
      console.log(`\n⚠ Directory not found: ${dir}`);
    }
  }

  // Print summary
  console.log('\n' + '─'.repeat(60));
  console.log('\n📊 Validation Summary:\n');
  console.log(`  Files checked: ${stats.filesChecked}`);
  console.log(`  Files fixed: ${stats.filesFixed}`);
  console.log(`\n  Errors found:`);
  console.log(`    - Frontmatter issues: ${stats.errors.frontmatter}`);
  console.log(`    - Invalid language codes: ${stats.errors.languages}`);
  console.log(`    - Missing required fields: ${stats.errors.missingFields}`);
  console.log(`\n  Fixes applied:`);
  console.log(`    - Frontmatter fixes: ${stats.fixes.frontmatter}`);
  console.log(`    - Language code fixes: ${stats.fixes.languages}`);
  
  if (stats.errors.missingFields > 0) {
    console.log(`\n  ⚠ Note: Missing required fields were detected but not auto-fixed.`);
    console.log(`    Please manually add the required fields to the affected files.`);
  }

  console.log('\n✨ Validation complete!\n');
}

// Run validation
validateAllMarkdown().catch((error) => {
  console.error(`\n❌ Validation failed: ${error.message}\n`);
  process.exit(1);
});
