// Test script to verify newsletter subscribers functionality
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://agwplrggetyxkuygfdxw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnd3BscmdnZXR5eGt1eWdmZHh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5Njg3NTgsImV4cCI6MjA3MzU0NDc1OH0.CsBTJGUgNIV_ZO3izPfQWPar5v_e3-OAPa4v-JD05Hs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testNewsletterSubscribers() {
  console.log('🧪 Testing Newsletter Subscribers Functionality...\n');

  try {
    // Test 1: Fetch all subscribers
    console.log('1. Fetching all newsletter subscribers...');
    const { data: subscribers, error: fetchError } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('is_active', true)
      .order('subscribed_at', { ascending: false });

    if (fetchError) {
      console.error('❌ Error fetching subscribers:', fetchError);
      return;
    }

    console.log(`✅ Found ${subscribers.length} active subscribers:`);
    subscribers.forEach((sub, index) => {
      console.log(`   ${index + 1}. ${sub.email} (${sub.discount_code}) - ${sub.subscribed_at}`);
    });

    // Test 2: Add a new test subscriber
    console.log('\n2. Adding a new test subscriber...');
    const testEmail = `test-${Date.now()}@example.com`;
    const { data: newSubscriber, error: insertError } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email: testEmail,
        is_active: true,
        discount_code: `TEST${Math.random().toString(36).substring(2, 8).toUpperCase()}`
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ Error adding subscriber:', insertError);
    } else {
      console.log(`✅ Successfully added test subscriber: ${newSubscriber.email}`);
    }

    // Test 3: Test unsubscribe functionality
    if (newSubscriber) {
      console.log('\n3. Testing unsubscribe functionality...');
      const { error: unsubscribeError } = await supabase
        .from('newsletter_subscribers')
        .update({ is_active: false })
        .eq('email', testEmail);

      if (unsubscribeError) {
        console.error('❌ Error unsubscribing:', unsubscribeError);
      } else {
        console.log(`✅ Successfully unsubscribed: ${testEmail}`);
      }
    }

    // Test 4: Verify final count
    console.log('\n4. Verifying final subscriber count...');
    const { data: finalSubscribers, error: finalError } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('is_active', true);

    if (finalError) {
      console.error('❌ Error fetching final count:', finalError);
    } else {
      console.log(`✅ Final active subscriber count: ${finalSubscribers.length}`);
    }

    console.log('\n🎉 Newsletter subscribers functionality test completed!');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Run the test
testNewsletterSubscribers();
