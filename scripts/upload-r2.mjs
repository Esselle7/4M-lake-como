// Upload local /public/images to a Cloudflare R2 bucket via the S3-compatible API.
//
// Run once after setup:
//   node --env-file=.env.local scripts/upload-r2.mjs
//
// Required env vars (see .env.local.example):
//   R2_ACCOUNT_ID       Cloudflare account ID
//   R2_ACCESS_KEY_ID    R2 API token access key
//   R2_SECRET_ACCESS_KEY  R2 API token secret
//   R2_BUCKET           bucket name (e.g. "4m-media")
//
// Requires the AWS SDK v3:
//   npm i -D @aws-sdk/client-s3 mime-types

import { readdir, readFile, stat } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import mime from 'mime-types'

const {
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET,
} = process.env

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET) {
  console.error('Missing R2 env vars. Check .env.local')
  process.exit(1)
}

const ROOT = 'public/images'
const KEY_PREFIX = 'images/' // keep the same path structure used in <Image src>

const SKIP = new Set(['.DS_Store', 'README.md'])

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
})

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else if (entry.isFile() && !SKIP.has(entry.name)) yield full
  }
}

let uploaded = 0
let totalBytes = 0
const started = Date.now()

for await (const file of walk(ROOT)) {
  const rel = relative(ROOT, file).replace(/\\/g, '/')
  const key = `${KEY_PREFIX}${rel}`
  const body = await readFile(file)
  const { size } = await stat(file)
  const contentType = mime.lookup(file) || 'application/octet-stream'

  await s3.send(new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  }))

  uploaded++
  totalBytes += size
  console.log(`✓ ${key}  (${(size / 1024).toFixed(1)} KB)`)
}

console.log(`\nDone. ${uploaded} files, ${(totalBytes / 1024 / 1024).toFixed(2)} MB in ${((Date.now() - started) / 1000).toFixed(1)}s`)
