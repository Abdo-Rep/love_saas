const fs = require('fs');
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    });

    // Automatically copy generated character images on compilation
    try {
      const srcBoss = `C:\\Users\\j\\.gemini\\antigravity\\brain\\16037b62-716a-43bd-a3ec-1ea88260a271\\the_boss_character_1786063427248.jpg`;
      const srcGirl = `C:\\Users\\j\\.gemini\\antigravity\\brain\\16037b62-716a-43bd-a3ec-1ea88260a271\\peasant_girl_character_1786063445353.jpg`;
      const destDir = path.join(__dirname, 'public', 'images');
      
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }

      if (fs.existsSync(srcBoss)) {
        fs.copyFileSync(srcBoss, path.join(destDir, 'the_boss.jpg'));
      }
      if (fs.existsSync(srcGirl)) {
        fs.copyFileSync(srcGirl, path.join(destDir, 'peasant_girl.jpg'));
      }
      console.log('--- Successfully copied character images to public/images/ ---');
    } catch (err) {
      console.warn('--- Failed to copy character images:', err.message);
    }

    // Automatically remove extensionless duplicate LuxuryTheaterStage file
    try {
      const duplicatePath = path.join(__dirname, 'src', 'components', '3d', 'LuxuryTheaterStage');
      if (fs.existsSync(duplicatePath) && fs.statSync(duplicatePath).isFile()) {
        fs.unlinkSync(duplicatePath);
        console.log('--- Successfully deleted duplicate extensionless LuxuryTheaterStage file ---');
      }
    } catch (err) {
      console.warn('--- Failed to delete duplicate file:', err.message);
    }

    return config;
  },
};

module.exports = nextConfig;
