const fs = require('fs');
const path = require('path');

const HASHNODE_TOKEN = process.env.HASHNODE_TOKEN;
let PUBLICATION_ID = process.env.HASHNODE_PUBLICATION_ID;

if (!HASHNODE_TOKEN) {
  console.error('Error: HASHNODE_TOKEN environment variable is required.');
  process.exit(1);
}

async function getPublicationId() {
  if (PUBLICATION_ID) return PUBLICATION_ID;

  console.log('Fetching Publication ID automatically using HASHNODE_TOKEN...');
  const query = `
    query Me {
      me {
        publications(first: 1) {
          edges {
            node {
              id
              title
            }
          }
        }
      }
    }
  `;

  const response = await fetch('https://gql.hashnode.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': HASHNODE_TOKEN
    },
    body: JSON.stringify({ query })
  });

  const resData = await response.json();
  const pubNode = resData.data?.me?.publications?.edges?.[0]?.node;

  if (pubNode && pubNode.id) {
    console.log(`Found Publication: "${pubNode.title}" (ID: ${pubNode.id})`);
    return pubNode.id;
  }

  throw new Error('Failed to resolve Publication ID automatically. Please set HASHNODE_PUBLICATION_ID manually.');
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
      'Authorization': HASHNODE_TOKEN
    },
    body: JSON.stringify({ query, variables })
  });

  const resData = await response.json();

  if (resData.errors) {
    console.error(`Failed to publish "${title}":`, JSON.stringify(resData.errors, null, 2));
  } else {
    console.log(`Successfully published "${title}"! URL: ${resData.data.publishPost.post.url}`);
  }
}

async function main() {
  const pubId = await getPublicationId();

  if (!fs.existsSync(articlesDir)) {
    console.log('No articles/hashnode directory found.');
    return;
  }

  const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md'));

  for (const file of files) {
    const fullPath = path.join(articlesDir, file);
    await publishArticle(fullPath, pubId);
  }
}

main().catch(err => {
  console.error('Unhandled Error:', err);
  process.exit(1);
});
