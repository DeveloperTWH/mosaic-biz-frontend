import React, { useRef, useEffect, useState } from "react";
import MapComponent from "./MapComponent";

type Service = {
    title: string;
    items: string[];
};

type Vendor = {
    mediaGallery: string[];
    services: Service[];
    mapDots: { city: string; lat: number; lng: number }[];
};

type OverviewProps = {
    vendor: Vendor;
};

const Overview: React.FC<OverviewProps> = ({ vendor }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const [mapSize, setMapSize] = useState({ width: 1, height: 1 });

    useEffect(() => {
        if (mapContainerRef.current) {
            const observer = new ResizeObserver(([entry]) => {
                const { width, height } = entry.contentRect;
                setMapSize({ width, height });
            });

            observer.observe(mapContainerRef.current);

            return () => observer.disconnect();
        }
    }, []);

    const convertLatLngToPosition = (lat: number, lng: number) => {
        const x = ((lng + 180 -7) / 360) * mapSize.width;
        const y = ((90 - lat + 15) / 180) * mapSize.height;
        return { left: x, top: y };
    };

    return (
        <>
            {/* MEDIA GALLERY */}
            <div>
                <h3 className="font-semibold text-2xl mb-5 roboto">Media Gallery</h3>
                {vendor.mediaGallery.length > 0 && (
                    <div className="mb-4">
                        <img
                            src={vendor.mediaGallery[0]}
                            alt="Featured"
                            className="w-full object-contain"
                        />
                    </div>
                )}
                <div className="grid grid-cols-3 gap-5">
                    {vendor.mediaGallery.slice(1).map((src, idx) => (
                        <div key={idx} className="overflow-hidden">
                            <img
                                src={src}
                                alt={`Gallery ${idx + 1}`}
                                className="h-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* SERVICES */}
            <div className="mt-10">
                <h3 className="font-semibold text-lg">Book Your Services</h3>
                <div className="space-y-2 mt-2">
                    {vendor.services.map((service, index) => (
                        <details key={index} className="bg-gray-100 p-3 rounded shadow-lg">
                            <summary className="cursor-pointer heading">{service.title}</summary>
                            <ul className="pl-4 list-disc mt-1">
                                {service.items.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        </details>
                    ))}
                </div>
            </div>

            {/* RESPONSIVE WORLD MAP */}
            <div className="mt-10">
                <MapComponent cities={vendor.mapDots}/>
            </div>
        </>
    );
};

export default Overview;
