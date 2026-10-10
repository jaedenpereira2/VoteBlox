const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting automated contract deployment...\n');

// Step 1: Compile and deploy contracts
console.log('📝 Compiling and deploying contracts...');
exec('cd contracts && npx truffle migrate --reset --network development', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Deployment failed:', error);
    return;
  }
  
  console.log('✅ Contract deployed successfully!\n');
  console.log(stdout);
  
  // Step 2: Copy contract files to all necessary locations
  console.log('📋 Updating contract files in all locations...\n');
  
  const contractSource = path.join(__dirname, 'contracts', 'build', 'contracts', 'VotingSystem.json');
  const destinations = [
    path.join(__dirname, 'server', 'VotingSystem.json'),
    path.join(__dirname, 'client', 'src', 'contracts', 'VotingSystem.json'),
    path.join(__dirname, 'client', 'src', 'contracts', 'build', 'contracts', 'VotingSystem.json')
  ];
  
  destinations.forEach((dest, index) => {
    try {
      // Create directories if they don't exist
      const dir = path.dirname(dest);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      // Copy file
      fs.copyFileSync(contractSource, dest);
      console.log(`✅ Updated: ${dest}`);
    } catch (err) {
      console.error(`❌ Failed to update ${dest}:`, err.message);
    }
  });
  
  // Step 3: Extract and display new contract address
  try {
    const contractData = JSON.parse(fs.readFileSync(contractSource, 'utf8'));
    const networks = contractData.networks;
    const networkIds = Object.keys(networks);
    
    if (networkIds.length > 0) {
      const latestNetwork = networks[networkIds[networkIds.length - 1]];
      console.log(`\n🎯 New Contract Address: ${latestNetwork.address}`);
      console.log(`📍 Network ID: ${networkIds[networkIds.length - 1]}`);

      // Auto-update .env and server/.env
      const envPaths = [path.join(__dirname, '.env'), path.join(__dirname, 'server', '.env')];
      envPaths.forEach(envPath => {
        if (fs.existsSync(envPath)) {
          let envContent = fs.readFileSync(envPath, 'utf8');
          if (envContent.includes('CONTRACT_ADDRESS=')) {
            envContent = envContent.replace(/CONTRACT_ADDRESS=.*(\r?\n|$)/, `CONTRACT_ADDRESS=${latestNetwork.address}$1`);
          } else {
            envContent += `\nCONTRACT_ADDRESS=${latestNetwork.address}\n`;
          }
          fs.writeFileSync(envPath, envContent);
          console.log(`✅ Updated CONTRACT_ADDRESS in ${envPath}`);
        }
      });
    }
  } catch (err) {
    console.error('❌ Could not extract contract address:', err.message);
  }
  
  console.log('\n🎉 Deployment complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Restart your server (npm start in server directory)');
  console.log('2. Refresh your browser (Ctrl+F5)');
  console.log('3. Create a new election in Admin Dashboard');
  console.log('4. Test voting functionality');
}); 