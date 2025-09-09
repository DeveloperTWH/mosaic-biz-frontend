'use client';

import React, { useEffect, useState } from 'react';

type MinorityTypeItem = {
  _id: string;
  name: string;
};

type Props = {
  value: string;                   // selected minority type id ('' for All)
  onChange: (val: string) => void; // change handler
};

const MinorityType: React.FC<Props> = ({ value, onChange }) => {
  const [minorityTypes, setMinorityTypes] = useState<MinorityTypeItem[]>([]);
  const [loadingMinority, setLoadingMinority] = useState(true);

  useEffect(() => {
    const fetchMinorityTypes = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/minority-types`, {
          credentials: 'include',
        });
        const data = await res.json();
        setMinorityTypes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load minority types', err);
        setMinorityTypes([]);
      } finally {
        setLoadingMinority(false);
      }
    };

    fetchMinorityTypes();
  }, []);

  return (
    <div className="flex flex-col w-full md:w-auto">
      <label htmlFor="minorityType" className="mb-1 text-sm font-medium">
        Filter By Minority Type
      </label>

      <select
        id="minorityType"
        className="px-4 py-3 border rounded min-w-[300px]"
        value={loadingMinority ? '' : value}     // keep controlled; empty while loading
        onChange={(e) => onChange(e.target.value)}
        disabled={loadingMinority}
      >
        {loadingMinority ? (
          <option value="">Loading types...</option>
        ) : (
          <>
            <option value="">All Types</option>
            {minorityTypes.map((type) => (
              <option key={type._id} value={type.name}>
                {type.name}
              </option>
            ))}
          </>
        )}
      </select>
    </div>
  );
};

export default MinorityType;
