"use client";

import React from "react";
import { Plus, X } from "lucide-react";
import type { ServiceChildInput } from "@/lib/api/services";
import { DURATION_OPTIONS_MINUTES } from "@/lib/api/services";

type ChildServiceFieldsProps = {
  children: ServiceChildInput[];
  fieldErrors?: Record<string, string>;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: keyof ServiceChildInput, value: string | number) => void;
};

export default function ChildServiceFields({
  children,
  fieldErrors = {},
  onAdd,
  onRemove,
  onUpdate,
}: ChildServiceFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Service options</h3>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex min-h-11 items-center gap-1 rounded-md border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-700 hover:border-blue-500 hover:text-blue-600"
        >
          <Plus className="h-4 w-4" />
          Add option
        </button>
      </div>

      {fieldErrors.services ? (
        <p className="text-sm text-red-600">{fieldErrors.services}</p>
      ) : null}

      {children.map((service, index) => (
        <div key={index} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Name</label>
              <input
                type="text"
                value={service.name}
                onChange={(e) => onUpdate(index, "name", e.target.value)}
                className="min-h-11 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Haircut"
              />
              {fieldErrors[`services.${index}.name`] ? (
                <p className="mt-1 text-xs text-red-600">{fieldErrors[`services.${index}.name`]}</p>
              ) : null}
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Description</label>
              <input
                type="text"
                value={service.description ?? ""}
                onChange={(e) => onUpdate(index, "description", e.target.value)}
                className="min-h-11 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Brief description"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Duration</label>
              <select
                value={service.durationMinutes || ""}
                onChange={(e) => onUpdate(index, "durationMinutes", parseInt(e.target.value, 10) || 0)}
                className="min-h-11 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">Choose duration</option>
                {DURATION_OPTIONS_MINUTES.map((minutes) => (
                  <option key={minutes} value={minutes}>
                    {minutes >= 60 ? `${minutes / 60} hour${minutes > 60 ? "s" : ""}` : `${minutes} minutes`}
                  </option>
                ))}
              </select>
              {fieldErrors[`services.${index}.durationMinutes`] ? (
                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors[`services.${index}.durationMinutes`]}
                </p>
              ) : null}
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Price ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={service.price || ""}
                onChange={(e) => onUpdate(index, "price", parseFloat(e.target.value) || 0)}
                className="min-h-11 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="25.00"
              />
              {fieldErrors[`services.${index}.price`] ? (
                <p className="mt-1 text-xs text-red-600">{fieldErrors[`services.${index}.price`]}</p>
              ) : null}
            </div>
          </div>

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="inline-flex min-h-11 items-center gap-1 text-sm text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4" />
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
