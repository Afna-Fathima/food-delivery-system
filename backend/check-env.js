// Quick environment check
require('dotenv').config();

console.log('\n=== Environment Variables Check ===\n');

const requiredVars = ['MONGODB_URI', 'JWT_SECRET', 'PORT', 'NODE_ENV'];
const warnings = [];

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    const display = varName === 'MONGODB_URI' ? value.substring(0, 50) + '...' : value;
    console.log(`✅ ${varName}: ${display}`);
  } else {
    console.log(`❌ ${varName}: NOT SET`);
    warnings.push(varName);
  }
});

console.log('\n=== Summary ===\n');
if (warnings.length === 0) {
  console.log('✅ All required environment variables are set!');
} else {
  console.log(`❌ Missing variables: ${warnings.join(', ')}`);
  console.log('\nSet these in Render Environment Variables:');
  warnings.forEach(v => console.log(`  - ${v}`));
}

console.log('\n');
