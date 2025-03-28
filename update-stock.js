const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// Path to the constants file
const PRODUCT_LINKS_PATH = path.join(__dirname, 'src', 'constants', 'productLinks.ts');

// Function to read the current productLinks.ts file
function readProductLinks() {
  try {
    return fs.readFileSync(PRODUCT_LINKS_PATH, 'utf8');
  } catch (error) {
    console.error('Error reading productLinks.ts file:', error);
    process.exit(1);
  }
}

// Function to update stock status in the file
function updateStockStatus(content, productKey, newStatus) {
  // Generate regex to find the specific product's status
  const regex = new RegExp(`(${productKey}[\\s\\S]*?status: STOCK_STATUS\\.)([A-Z_]+)`, 'gm');
  
  // Replace the status with the new value
  return content.replace(regex, `$1${newStatus}`);
}

// Function to write updated content back to the file
function writeProductLinks(content) {
  try {
    fs.writeFileSync(PRODUCT_LINKS_PATH, content);
  } catch (error) {
    console.error('Error writing to productLinks.ts file:', error);
    process.exit(1);
  }
}

// Function to commit and push changes to GitHub
function commitAndPush(productKey, status) {
  try {
    execSync('git add src/constants/productLinks.ts');
    execSync(`git commit -m "Update stock status: ${productKey} set to ${status}"`);
    execSync('git push origin main');
    console.log(`Successfully updated ${productKey} to ${status} and pushed to GitHub.`);
  } catch (error) {
    console.error('Error during Git operations:', error.message);
    process.exit(1);
  }
}

// Main function to handle the stock update
function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('Usage: node update-stock.js <PRODUCT_KEY> <STATUS>');
    console.error('  PRODUCT_KEY: PACK_5_LLAVEROS, PACK_5_LLAVEROS_NFC, PACK_25_LLAVEROS, PACK_50_LLAVEROS');
    console.error('  STATUS: IN_STOCK, OUT_OF_STOCK');
    process.exit(1);
  }
  
  const [productKey, status] = args;
  
  // Validate product key
  const validProductKeys = ['PACK_5_LLAVEROS', 'PACK_5_LLAVEROS_NFC', 'PACK_25_LLAVEROS', 'PACK_50_LLAVEROS'];
  if (!validProductKeys.includes(productKey)) {
    console.error(`Error: Invalid product key. Must be one of: ${validProductKeys.join(', ')}`);
    process.exit(1);
  }
  
  // Validate status
  const validStatuses = ['IN_STOCK', 'OUT_OF_STOCK'];
  if (!validStatuses.includes(status)) {
    console.error(`Error: Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    process.exit(1);
  }
  
  // Read the current file content
  const content = readProductLinks();
  
  // Update the stock status
  const updatedContent = updateStockStatus(content, productKey, status);
  
  // Write the updated content back to the file
  writeProductLinks(updatedContent);
  
  console.log(`Stock status for ${productKey} updated to ${status}`);
  
  // Commit and push the changes to GitHub
  commitAndPush(productKey, status);
}

// Run the main function
main(); 