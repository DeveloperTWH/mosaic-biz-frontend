import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

interface City {
    city: string;
    lat: number;
    lng: number;
}

interface MapComponentProps {
    cities: City[];
}

const MapComponent: React.FC<MapComponentProps> = ({ cities }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        const width = 600;
        const height = 350;

        const svg = d3.select(svgRef.current)
            .attr('viewBox', `0 0 ${width} ${height}`)
            .attr('preserveAspectRatio', 'xMidYMid meet');

        svg.selectAll('*').remove();

        const projection = d3.geoMercator()
            .scale(85)
            .center([0, 20]) // Slightly shift to remove Antarctica view
            .translate([width / 2, height / 2]);

        const path = d3.geoPath().projection(projection);

        const g = svg.append('g');
        const cityGroup = svg.append('g');

        d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
            .then((worldData: any) => {
                // Cast topojson.feature result to unknown first
                const geoUnknown = topojson.feature(worldData, worldData.objects.countries) as unknown;

                // Type guard: check if geoUnknown is FeatureCollection
                if (
                    typeof geoUnknown === 'object' &&
                    geoUnknown !== null &&
                    'features' in geoUnknown &&
                    Array.isArray((geoUnknown as any).features)
                ) {
                    const countries = geoUnknown as FeatureCollection<Geometry, GeoJsonProperties>;

                    // Filter out Antarctica (id '010')
                    countries.features = countries.features.filter(feature => feature.id !== '010');

                    g.append('path')
                        .datum(countries)
                        .attr('fill', '#cdd4f7')
                        .attr('stroke', 'none')
                        .attr('d', (d: any) => path(d)!);

                    // Add cities dots and labels
                    cities.forEach(city => {
                        const coords = projection([city.lng, city.lat]);
                        if (coords) {
                            cityGroup.append('circle')
                                .attr('cx', coords[0])
                                .attr('cy', coords[1])
                                .attr('r', 4)
                                .attr('fill', '#1fbdca')
                                .style('cursor', 'pointer')
                                .on('mouseover', function () {
                                    const next = this.nextSibling;
                                    if (next && next instanceof Element) {
                                        d3.select(next).classed('hidden', false);
                                    }
                                })
                                .on('mouseout', function () {
                                    const next = this.nextSibling;
                                    if (next && next instanceof Element) {
                                        d3.select(next).classed('hidden', true);
                                    }
                                });


                            cityGroup.append('text')
                                .attr('x', coords[0] + 6)
                                .attr('y', coords[1] + 3)
                                .attr('font-size', '12px')
                                .attr('fill', '#000')
                                .attr('class', 'hidden pointer-events-none')
                                .text(city.city);
                        }
                    });
                } else {
                    console.error('Loaded topojson is not a FeatureCollection');
                }
            })
            .catch(error => {
                console.error('Error loading world map data:', error);
            });
    }, [cities]);

    return (
        <div className="flex justify-center items-center w-full bg-white px-4">
            <svg
                ref={svgRef}
                className="w-full h-auto"
                style={{ display: 'block' }}
            ></svg>
        </div>
    );
};

export default MapComponent;
