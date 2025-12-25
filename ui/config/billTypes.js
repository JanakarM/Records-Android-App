/**
 * Bill Types Configuration
 * 
 * To add a new bill type:
 * 1. Add a new key with its configuration
 * 2. Define the fields specific to that bill type
 * 3. The form and display will auto-generate from this config
 */

export const BILL_TYPES = {
  lic: {
    id: 'lic',
    label: 'LIC Policy',
    icon: 'shield',
    collection: 'Bills',
    
    // Fields for LIC - stored for reference when paying via payment apps
    fields: [
      {
        key: 'holderName',
        label: 'Policy Holder Name',
        type: 'text',
        placeholder: 'Name of the policyholder',
        required: true,
      },
      {
        key: 'policyNumber',
        label: 'Policy Number',
        type: 'text',
        placeholder: 'Enter policy number',
        required: true,
      },
      {
        key: 'frequency',
        label: 'Payment Frequency',
        type: 'dropdown',
        options: [
          { label: 'Monthly', value: 'monthly' },
          { label: 'Quarterly', value: 'quarterly' },
          { label: 'Half-Yearly', value: 'half-yearly' },
          { label: 'Yearly', value: 'yearly' },
        ],
        required: true,
        default: 'yearly',
      },
      {
        key: 'premiumAmount',
        label: 'Premium Amount',
        type: 'number',
        placeholder: 'Enter premium amount',
        required: true,
      },
    ],
    
    // Display format for list items
    getDisplayTitle: (bill) => bill.holderName,
    getDisplaySubtitle: (bill) => `Policy: ${bill.policyNumber}`,
    getDisplayAmount: (bill) => `₹${bill.premiumAmount}`,
  },
  
  // Future bill types can be added here:
  // electricity: { ... },
  // water: { ... },
};

// Get bill type config by id
export const getBillTypeConfig = (typeId) => BILL_TYPES[typeId] || null;

// Get all bill types as array (for dropdown/listing)
export const getAllBillTypes = () => Object.values(BILL_TYPES);

// Get frequency label
export const getFrequencyLabel = (frequency) => {
  const labels = {
    'monthly': 'Monthly',
    'quarterly': 'Quarterly',
    'half-yearly': 'Half-Yearly',
    'yearly': 'Yearly',
  };
  return labels[frequency] || frequency;
};
