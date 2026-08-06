import fs from 'fs';
import path from 'path';

const filesToDownload = [
  // A close up profile of a young woman's face, showing smooth healthy skin
  { url: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1000&auto=format&fit=crop', name: 'young-woman-skin-care-model-2-scaled.jpg' },
  // Modern aesthetic interior
  { url: 'https://images.unsplash.com/photo-1572014540203-9bb63866847d?q=80&w=1000&auto=format&fit=crop', name: 'Ayla-Website-image-1-scaled.png' },
  // Abstract fluid texture
  { url: 'https://images.unsplash.com/photo-1558244402-286dd748c593?q=80&w=1000&auto=format&fit=crop', name: 'Untitled-design-24-scaled.jpg' },
  // Water drops
  { url: 'https://images.unsplash.com/photo-1585501306429-b69ee1f3a2b7?q=80&w=1000&auto=format&fit=crop', name: 'Screenshot-2026-03-12-163456-1.png' },
  // Skin texture
  { url: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=1000&auto=format&fit=crop', name: 'Screenshot-2026-03-13-100436.webp' },
  // Modern archway / architecture
  { url: 'https://images.unsplash.com/photo-1600607688069-bbf06eb1e967?q=80&w=1000&auto=format&fit=crop', name: 'Screenshot-2026-03-12-163034.png' }
];

async function download() {
  const targetDir = path.join(process.cwd(), 'public', 'images');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  for (const file of filesToDownload) {
    try {
      console.log(`Downloading ${file.name}...`);
      const res = await fetch(file.url);
      
      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`);
      }
      
      const buffer = await res.arrayBuffer();
      fs.writeFileSync(path.join(targetDir, file.name), Buffer.from(buffer));
      console.log(`Saved ${file.name}`);
    } catch (err) {
      console.error(`Error downloading ${file.name}:`, err.message);
    }
  }
}

download();
