const fs = require('fs');
const path = require('path');

const HASHNODE_TOKEN = process.env.HASHNODE_TOKEN;
let PUBLICATION_ID = process.env.HASHNODE_PUBLICATION_ID;

if (!HASHNODE_TOKEN) {
  console.error('Error: HASHNODE_TOKEN environment variable is missing.');
  process.exit(1);
}

if (!PUBLICATION_ID) {
  console.error('Error: HASHNODE_PUBLICATION_ID environment variable is missing. Please set it in GitHub Secrets.');
  process.exit(1);
}

async function resolvePublicationId(inputKey) {
  // If it's already a 24-character hexadecimal ID (MongoDB ObjectId), return as-is
  if (/^[0-9a-fA-F]{24}$/.test(inputKey)) {
    return inputKey;
  }

  // Otherwise, treat inputKey as a domain/subdomain (e.g. boycececil666.hashnode.dev)
  const host = inputKey.replace(/^https?:\/\//, '').replace(/\/$/, '');
  console.log(`Resolving Publication ID for host domain: "${host}"...`);

  const hostQuery = `
    query PublicationByHost($host: String!) {
      publication(host: $host) {
        id
        title
      }
    }
  `;

  try {
    const response = await fetch('https://gql.hashnode.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'NodeJS-Hashnode-Publisher/1.0'
      },
      body: JSON.stringify({
        query: hostQuery,
        variables: { host }
      })
    });

    const text = await response.text();
    if (response.ok) {
      const data = JSON.parse(text);
      const pubId = data.data?.publication?.id;
      if (pubId) {
        console.log(`Successfully resolved host "${host}" -> Internal ID: ${pubId}`);
        return pubId;
      }
    }
  } catch (err) {
    console.error(`Failed to resolve host "${host}":`, err.message);
  }

  return inputKey;
}

const articlesDir = path.join(__dirname, '../articles/hashnode');

function parseFrontmatter(fileContent) {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = fileContent.match(frontmatterRegex);

  if (!match) {
    return { metadata: {}, content: fileContent };
  }

  const yamlLines = match[1].split('\n');
  const metadata = {};

  yamlLines.forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      metadata[key] = value;
    }
  });

  return { metadata, content: match[2].trim() };
}

async function publishArticle(filePath, pubId) {
  const rawContent = fs.readFileSync(filePath, 'utf-8');
  const { metadata, content } = parseFrontmatter(rawContent);

  const title = metadata.title || path.basename(filePath, '.md');
  const slug = metadata.slug || path.basename(filePath, '.md');
  const tagsRaw = metadata.tags ? metadata.tags.split(',').map(t => t.trim()) : ['technology'];

  const tags = tagsRaw.map(tag => ({
    slug: tag.toLowerCase().replace(/\s+/g, '-'),
    name: tag
  }));

  const query = `
    mutation PublishPost($input: PublishPostInput!) {
      publishPost(input: $input) {
        post {
          id
          title
          url
        }
      }
    }
  `;

  const variables = {
    input: {
      title: title,
      contentMarkdown: content,
      publicationId: pubId,
      slug: slug,
      tags: tags
    }
  };

  console.log(`Publishing "${title}" to Hashnode...`);

  const response = await fetch('https://gql.hashnode.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': HASHNODE_TOKEN,
      'User-Agent': 'NodeJS-Hashnode-Publisher/1.0'
    },
    body: JSON.stringify({ query, variables })
  });

  const text = await response.text();
  if (!response.ok) {
    console.error(`Hashnode publish HTTP Error ${response.status}:`, text.slice(0, 300));
    return;
  }

  let resData;
  try {
    resData = JSON.parse(text);
  } catch (err) {
    console.error(`Failed to parse response JSON: ${err.message}. Response text:`, text.slice(0, 300));
    return;
  }

  if (resData.errors) {
    console.error(`Failed to publish "${title}":`, JSON.stringify(resData.errors, null, 2));
  } else {
    console.log(`Successfully published "${title}"! URL: ${resData.data?.publishPost?.post?.url}`);
  }
}

async function main() {
  const targetPubId = await resolvePublicationId(PUBLICATION_ID);

  if (!fs.existsSync(articlesDir)) {
    console.log('No articles/hashnode directory found.');
    return;
  }

  const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md'));

  for (const file of files) {
    const fullPath = path.join(articlesDir, file);
    await publishArticle(fullPath, targetPubId);
  }
}

main().catch(err => {
  console.error('Unhandled Error:', err);
  process.exit(1);
});
