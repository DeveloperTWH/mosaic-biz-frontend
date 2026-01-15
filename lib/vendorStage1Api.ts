export const saveStage1Draft = async (payload: any) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/vendor-onboarding/draft`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to save draft");
  }

  return data;
};

// In vendorOnboarding.ts
export const createStage1Payment = async () => {
  try {
    console.log('Making payment API call...');
    
    const response = await fetch('http://localhost:3001/api/vendor-onboarding/stage1/create-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
      },
      credentials: 'include', // Important for cookies
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    const text = await response.text();
    console.log('Raw response text:', text);
    
    let data;
    try {
      data = JSON.parse(text);
      console.log('Parsed response:', data);
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      throw new Error('Invalid JSON response from server');
    }
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return data;
  } catch (error) {
    console.error('Payment API error:', error);
    throw error;
  }
};

