#!/bin/bash

echo "🧪 Testing Enforcement System"
echo "=============================="
echo ""

# Test 1: Console.log
echo "Test 1: Trying to use console.log..."
echo "const x = 1; console.log(x);" > /tmp/test-console.ts
if npx biome check /tmp/test-console.ts 2>&1 | grep -q "noConsoleLog"; then
  echo "✅ PASS: console.log detected by Biome"
else
  echo "❌ FAIL: console.log not detected"
fi
rm -f /tmp/test-console.ts
echo ""

# Test 2: Package.json in packages
echo "Test 2: Trying to create package.json in packages/..."
mkdir -p /tmp/test-packages/logger
echo '{}' > /tmp/test-packages/logger/package.json
cd /tmp/test-packages
git init -q
git add .
if node /workspace/tools/validators/no-package-json-validator.js 2>&1 | grep -q "PACKAGE.JSON FILES FOUND"; then
  echo "✅ PASS: package.json in packages/ detected"
else
  echo "❌ FAIL: package.json in packages/ not detected"
fi
rm -rf /tmp/test-packages
cd /workspace
echo ""

# Test 3: TypeScript strict mode
echo "Test 3: Checking TypeScript strict mode..."
if grep -q '"strict": true' /workspace/tsconfig.base.json; then
  echo "✅ PASS: TypeScript strict mode enabled"
else
  echo "❌ FAIL: TypeScript strict mode not enabled"
fi
echo ""

# Test 4: Blocked import paths
echo "Test 4: Checking blocked import paths..."
if grep -q '@prisma/client.*BLOCKED' /workspace/tsconfig.base.json; then
  echo "✅ PASS: Prisma imports blocked"
else
  echo "❌ FAIL: Prisma imports not blocked"
fi
echo ""

# Test 5: Core packages exist
echo "Test 5: Checking core packages..."
PACKAGES=("types" "logger" "database" "errors" "validation" "config")
ALL_EXIST=true
for pkg in "${PACKAGES[@]}"; do
  if [ ! -d "/workspace/packages/$pkg/src" ]; then
    echo "❌ Missing: packages/$pkg"
    ALL_EXIST=false
  fi
done
if [ "$ALL_EXIST" = true ]; then
  echo "✅ PASS: All core packages exist"
fi
echo ""

# Test 6: No package.json in packages
echo "Test 6: Verifying no package.json in packages/..."
if find /workspace/packages -name "package.json" -type f 2>/dev/null | grep -q .; then
  echo "❌ FAIL: Found package.json in packages/"
else
  echo "✅ PASS: No package.json in packages/"
fi
echo ""

echo "=============================="
echo "🎯 Enforcement test complete!"
