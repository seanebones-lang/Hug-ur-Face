// Test HuggingFace Space accessibility and queue status
// Run: node test-space-access.js

const HF_SPACE_URL = 'https://bizbots-qwen-image-editor.hf.space';

async function testSpaceAccess() {
  console.log('🔍 Testing HuggingFace Space Access...\n');

  try {
    // Test 1: Check if Space is reachable
    console.log('Test 1: Checking Space availability...');
    const startTime = Date.now();
    const response = await fetch(HF_SPACE_URL);
    const loadTime = Date.now() - startTime;

    console.log(`✅ Space is reachable (${loadTime}ms)`);
    console.log(`   Status: ${response.status} ${response.statusText}`);

    // Test 2: Check API endpoint
    console.log('\nTest 2: Checking API endpoint...');
    try {
      const apiTest = await fetch(`${HF_SPACE_URL}/gradio_api/queue/status`);
      const queueData = await apiTest.json();
      console.log('✅ API endpoint accessible');
      console.log('   Queue data:', JSON.stringify(queueData, null, 2));
    } catch (err) {
      console.log('⚠️  Queue status not available:', err.message);
    }

    // Test 3: Try to get Space info
    console.log('\nTest 3: Getting Space configuration...');
    const configTest = await fetch(`${HF_SPACE_URL}/info`);
    if (configTest.ok) {
      const config = await configTest.json();
      console.log('✅ Space configuration retrieved');
      console.log('   Named endpoints:', config.named_endpoints || 'N/A');
    }

    // Test 4: Simulate simple request
    console.log('\nTest 4: Simulating API call...');
    const testStart = Date.now();
    const apiCall = await fetch(`${HF_SPACE_URL}/gradio_api/call/infer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [
          'test',
          'test prompt',
          'Photo to Anime',
          42,
          true,
          1.0,
          20
        ]
      })
    });

    const callTime = Date.now() - testStart;

    if (apiCall.ok) {
      const result = await apiCall.json();
      console.log(`✅ API call accepted (${callTime}ms)`);
      console.log('   Response:', result);

      if (result.event_id) {
        console.log('   Event ID:', result.event_id);
        console.log('   ⏳ Request is queued for processing');
      }
    } else {
      console.log(`❌ API call failed: ${apiCall.status} ${apiCall.statusText}`);
      const errorText = await apiCall.text();
      console.log('   Error:', errorText);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run tests
testSpaceAccess().then(() => {
  console.log('\n📊 Test Summary:');
  console.log('If your coworker sees different results, the issue is likely:');
  console.log('1. Zero GPU rate limiting (queue full)');
  console.log('2. IP-based restrictions');
  console.log('3. Pro account quota exhausted');
  console.log('\n💡 Solution: Upgrade to dedicated hardware or use HF Inference Endpoints');
});
