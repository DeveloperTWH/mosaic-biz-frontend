import { useState } from 'react';

const AddressComponent = () => {
  const [showModal, setShowModal] = useState(false);
  const [existingAddresses, setExistingAddresses] = useState([
    '123 Street, City, Country',
    '456 Avenue, City, Country',
  ]);
  const [deliveryAddress, setDeliveryAddress] = useState('123 Street, City, Country');
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    postalCode: '',
    country: '',
    phone: '',
  });

  // Handle selecting an existing address
  const handleChangeAddress = (address: string) => {
    setDeliveryAddress(address);
    setShowModal(false);
  };

  // Handle adding a new address
  const handleAddNewAddress = () => {
    const { street, city, postalCode, country, phone } = newAddress;
    if (street && city && postalCode && country && phone) {
      const newFullAddress = `${street}, ${city}, ${postalCode}, ${country} - Phone: ${phone}`;
      setExistingAddresses([...existingAddresses, newFullAddress]);
      setDeliveryAddress(newFullAddress);
      setShowModal(false);
    } else {
      alert("Please fill in all the fields");
    }
  };

  return (
    <div>
      {/* Delivery Address Card */}
      <div className="flex items-center justify-between p-4 mt-6 bg-white border border-gray-200 rounded-md">
        <div>
          <div className="text-gray-600">Deliver to:</div>
          <div className="mt-2 text-sm text-gray-800">{deliveryAddress}</div>
        </div>
        <div>
          <button
            className="px-5 py-2 bg-[#FFC400] font-semibold"
            onClick={() => setShowModal(true)}
          >
            Change
          </button>
        </div>
      </div>

      {/* Modal for Changing Address */}
      {showModal && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-600 bg-opacity-50">
          <div className="bg-white p-6 rounded-md w-full sm:w-96 md:w-1/2 lg:w-1/3 max-h-[90vh] overflow-y-auto">
            <h3 className="mb-4 text-lg font-semibold">Select or Add Address</h3>

            {/* Existing Addresses */}
            {existingAddresses.length > 0 ? (
              <div className="mb-4 space-y-3">
                {existingAddresses.map((address, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{address}</span>
                    <button
                      className="text-xs text-blue-500"
                      onClick={() => handleChangeAddress(address)}
                    >
                      Select
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-600">No existing addresses available.</div>
            )}

            {/* New Address Input Form */}
            <div className="mt-4">
              <div className="text-sm text-gray-600">Or, Add a New Address</div>

              <input
                type="text"
                value={newAddress.street}
                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                placeholder="Street Address"
              />
              <input
                type="text"
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                placeholder="City"
              />
              <input
                type="text"
                value={newAddress.postalCode}
                onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                placeholder="Postal Code"
              />
              <input
                type="text"
                value={newAddress.country}
                onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                placeholder="Country"
              />
              <input
                type="text"
                value={newAddress.phone}
                onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                placeholder="Phone Number"
              />
              <button
                onClick={handleAddNewAddress}
                className="w-full px-4 py-2 mt-4 text-white bg-blue-500 rounded-md"
              >
                Add Address
              </button>
            </div>

            {/* Close Modal Button */}
            <div className="flex justify-center mt-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded-md"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressComponent;
