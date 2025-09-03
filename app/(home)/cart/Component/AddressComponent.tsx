import { useMemo, useState } from "react";

export type Address = {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  isDefault?: boolean;
};

type AddressComponentProps = {
  addresses: Address[];
  selectedAddressId?: string;
  onSelect: (id: string) => void;
  onAdd: (addr: Address) => void;
};

const emptyNew: Omit<Address, "id"> = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  isDefault: false,
};

const AddressComponent = ({
  addresses,
  selectedAddressId,
  onSelect,
  onAdd,
}: AddressComponentProps) => {
  const [showModal, setShowModal] = useState(false);
  const [newAddress, setNewAddress] = useState<Omit<Address, "id">>(emptyNew);

  const selected = useMemo(
    () => addresses.find(a => a.id === selectedAddressId) || addresses.find(a => a.isDefault) || addresses[0],
    [addresses, selectedAddressId]
  );

  const displayLine = (a?: Address) =>
    a
      ? `${a.fullName}, ${a.addressLine1}${a.addressLine2 ? ", " + a.addressLine2 : ""}${a.city ? ", " + a.city : ""}${a.state ? ", " + a.state : ""}${a.postalCode ? " " + a.postalCode : ""}${a.country ? ", " + a.country : ""} — ${a.phone}`
      : "No address selected";

  const handleAddNewAddress = () => {
    const { fullName, phone, addressLine1, city, postalCode, country } = newAddress;
    if (!fullName || !phone || !addressLine1 || !city || !postalCode || !country) {
      alert("Please fill in all required fields.");
      return;
    }
    const newAddr: Address = {
      id: crypto?.randomUUID?.() ?? String(Date.now()),
      ...newAddress,
    };
    onAdd(newAddr);
    setShowModal(false);
    setNewAddress(emptyNew);
  };

  return (
    <div>
      {/* Delivery Address Card */}
      <div className="flex items-center justify-between p-4 mt-6 bg-white border border-gray-200 rounded-md">
        <div>
          <div className="text-gray-600">Deliver to:</div>
          <div className="mt-2 text-sm text-gray-800">
            {displayLine(selected)}
          </div>
        </div>
        <div>
          <button
            className="px-5 py-2 bg-[#FFC400] font-semibold"
            onClick={() => setShowModal(true)}
          >
            {addresses.length > 0 ? "Change" : "Add Address"}
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-600 bg-opacity-50">
          <div className="bg-white p-6 rounded-md w-full sm:w-96 md:w-1/2 lg:w-1/3 max-h-[90vh] overflow-y-auto">
            <h3 className="mb-4 text-lg font-semibold">Select or Add Address</h3>

            {/* Existing Addresses */}
            {addresses.length > 0 ? (
              <div className="mb-6 space-y-3">
                {addresses.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between p-3 border rounded"
                  >
                    <span className="text-sm text-gray-700">
                      {displayLine(a)}
                      {a.isDefault ? " • Default" : ""}
                    </span>
                    <button
                      className="text-xs text-blue-600"
                      onClick={() => {
                        onSelect(a.id);
                        setShowModal(false);
                      }}
                    >
                      Select
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mb-4 text-sm text-gray-600">
                No saved addresses yet.
              </div>
            )}

            {/* New Address */}
            <div className="mt-2">
              <div className="mb-2 text-sm font-medium text-gray-700">
                Or, add a new address
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <input
                  className="p-2 border"
                  placeholder="Full name *"
                  value={newAddress.fullName}
                  onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                />
                <input
                  className="p-2 border"
                  placeholder="Phone *"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                />
                <input
                  className="p-2 border sm:col-span-2"
                  placeholder="Address line 1 *"
                  value={newAddress.addressLine1}
                  onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                />
                <input
                  className="p-2 border sm:col-span-2"
                  placeholder="Address line 2"
                  value={newAddress.addressLine2 ?? ""}
                  onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                />
                <input
                  className="p-2 border"
                  placeholder="City *"
                  value={newAddress.city ?? ""}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                />
                <input
                  className="p-2 border"
                  placeholder="State/Region"
                  value={newAddress.state ?? ""}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                />
                <input
                  className="p-2 border"
                  placeholder="Postal code *"
                  value={newAddress.postalCode ?? ""}
                  onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                />
                <input
                  className="p-2 border"
                  placeholder="Country *"
                  value={newAddress.country ?? ""}
                  onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                />
                <label className="flex items-center gap-2 mt-1 text-sm sm:col-span-2">
                  <input
                    type="checkbox"
                    checked={!!newAddress.isDefault}
                    onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                  />
                  Set as default
                </label>
              </div>

              <button
                onClick={handleAddNewAddress}
                className="w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded-md"
              >
                Add Address
              </button>
            </div>

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
