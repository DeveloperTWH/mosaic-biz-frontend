'use client';

import React, { useEffect, useState } from 'react';

type MinorityType = {
    _id: string;
    name: string;
};

const MinorityType = () => {

    const [minorityTypes, setMinorityTypes] = useState<MinorityType[]>([]);
    const [loadingMinority, setLoadingMinority] = useState(true);

    useEffect(() => {
        const fetchMinorityTypes = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/minority-types`);
                const data = await res.json();
                setMinorityTypes(data);
            } catch (err) {
                console.error('Failed to load minority types', err);
            } finally {
                setLoadingMinority(false);
            }
        };

        fetchMinorityTypes();
    }, []);

    return (
        <div className="flex flex-col w-full md:w-auto">
            <label htmlFor="minorityType" className="mb-1 text-sm font-medium">Filter By Minority Type</label>
            <select
                id="minorityType"
                className="px-4 py-2 border rounded min-w-[300px]"
                defaultValue=""
                disabled={loadingMinority}
            >
                {loadingMinority ? (
                    <option>Loading types...</option>
                ) : minorityTypes.length > 0 ? (
                    <>
                        <option value="">All Types</option>
                        {minorityTypes.map((type) => (
                            <option key={type._id} value={type._id}>
                                {type.name}
                            </option>
                        ))}
                    </>
                ) : (
                    <option disabled>No types available</option>
                )}
            </select>
        </div>
    )
}

export default MinorityType