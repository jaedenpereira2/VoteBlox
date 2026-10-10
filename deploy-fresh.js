const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Fresh deployment (new contract + clean database)...\n');

console.log('⚠️  WARNING: This will:');
console.log('   • Deploy new smart contract');
console.log('   • DELETE all database data (users, elections, contestants, votes)');
console.log('   • Reset blockchain to empty state');
console.log('   • Update contract files');
console.log('\n⏳ Starting in 3 seconds... (Ctrl+C to cancel)');

setTimeout(() => {
  // Step 1: Deploy contracts
  console.log('\n📝 Compiling and deploying contracts...');
  exec('cd contracts && npx truffle migrate --reset --network development', (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Contract deployment failed:', error);
      return;
    }
    
    console.log('✅ Contract deployed successfully!\n');
    console.log(stdout);
    
    // Step 2: Delete database file
    console.log('🗑️  Resetting database...');
    const dbPath = path.join(__dirname, 'server', 'database.sqlite');
    
    try {
      if (fs.existsSync(dbPath)) {
        fs.unlinkSync(dbPath);
        console.log('✅ Database file deleted');
      } else {
        console.log('ℹ️  Database file not found (already clean)');
      }
    } catch (err) {
      console.error('❌ Failed to delete database:', err.message);
      console.log('   You may need to manually delete server/database.sqlite');
    }
    
    // Step 3: Update contract files
    console.log('\n📋 Updating contract files...');
    
    const contractSource = path.join(__dirname, 'contracts', 'build', 'contracts', 'VotingSystem.json');
    const importedFiles = [
      {
        dest: path.join(__dirname, 'server', 'VotingSystem.json'),
        usage: 'Server imports this'
      },
      {
        dest: path.join(__dirname, 'client', 'src', 'contracts', 'build', 'contracts', 'VotingSystem.json'),
        usage: 'Client imports this'
      }
    ];
    
    importedFiles.forEach(({ dest, usage }) => {
      try {
        const dir = path.dirname(dest);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.copyFileSync(contractSource, dest);
        console.log(`✅ Updated: ${dest}`);
        console.log(`   └─ ${usage}`);
      } catch (err) {
        console.error(`❌ Failed to update ${dest}:`, err.message);
      }
    });
    
    // Step 4: Show new contract address
    try {
      const contractData = JSON.parse(fs.readFileSync(contractSource, 'utf8'));
      const networks = contractData.networks;
      
      // Show the specific network we deployed to (1337)
      let deployedAddress = null;
      if (networks['1337']) {
        deployedAddress = networks['1337'].address;
        console.log(`\n🎯 New Contract Address: ${deployedAddress}`);
        console.log(`📍 Network ID: 1337 (Ganache Local)`);
      } else if (networks['5777']) {
        deployedAddress = networks['5777'].address;
        console.log(`\n🎯 Contract Address: ${deployedAddress}`);
        console.log(`📍 Network ID: 5777 (Alternative Ganache)`);
      } else {
        console.log('\n⚠️  No recognized network found in contract data');
        console.log('Available networks:', Object.keys(networks));
      }

      if (deployedAddress) {
        const envPaths = [path.join(__dirname, '.env'), path.join(__dirname, 'server', '.env')];
        envPaths.forEach(envPath => {
          if (fs.existsSync(envPath)) {
            let envContent = fs.readFileSync(envPath, 'utf8');
            if (envContent.includes('CONTRACT_ADDRESS=')) {
              envContent = envContent.replace(/CONTRACT_ADDRESS=.*(\r?\n|$)/, `CONTRACT_ADDRESS=${deployedAddress}$1`);
            } else {
              envContent += `\nCONTRACT_ADDRESS=${deployedAddress}\n`;
            }
            fs.writeFileSync(envPath, envContent);
            console.log(`✅ Updated CONTRACT_ADDRESS in ${envPath}`);
          }
        });
      }
    } catch (err) {
      console.error('❌ Could not extract contract address:', err.message);
    }
    
    console.log('\n🎉 Fresh deployment complete!');
    console.log('\n📋 What was reset:');
    console.log('   ✅ Smart contract (new address, empty state)');
    console.log('   ✅ Database (all tables will be recreated on server start)');
    console.log('   ✅ Contract files updated');
    
    console.log('\n📋 Next steps:');
    console.log('1. Start your server (it will recreate database tables)');
    console.log('2. Register new admin account');
    console.log('3. Register new user accounts');
    console.log('4. Create elections and contestants');
    console.log('5. Test the complete flow');
    
    console.log('\n💡 Everything is now completely fresh!');
  });
}, 3000); 