const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function convertImages() {
  const client = await pool.connect();
  try {
    // Get all blog posts with base64 images
    const result = await client.query(
      "SELECT id, title, image FROM blog_posts WHERE image LIKE 'data:image%'"
    );
    
    console.log(`Found ${result.rows.length} posts with base64 images`);
    
    const assetsDir = path.join(process.cwd(), 'attached_assets', 'blog_images');
    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir, { recursive: true });
    }
    
    for (const post of result.rows) {
      const base64Data = post.image;
      
      // Extract mime type and data
      const matches = base64Data.match(/^data:image\/(\w+);base64,(.+)$/);
      if (!matches) {
        console.log(`Skipping ${post.id} - invalid format`);
        continue;
      }
      
      const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
      const imageData = Buffer.from(matches[2], 'base64');
      
      // Create filename from post ID
      const filename = `blog_${post.id.substring(0, 8)}.${ext}`;
      const filepath = path.join(assetsDir, filename);
      
      // Save image file
      fs.writeFileSync(filepath, imageData);
      console.log(`Saved: ${filename}`);
      
      // Update database with new path
      const newImagePath = `@assets/blog_images/${filename}`;
      await client.query(
        'UPDATE blog_posts SET image = $1 WHERE id = $2',
        [newImagePath, post.id]
      );
      console.log(`Updated DB: ${post.title.substring(0, 40)}...`);
    }
    
    console.log('Done!');
  } finally {
    client.release();
    await pool.end();
  }
}

convertImages().catch(console.error);
