"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface TaxSettingsTabProps {
  businessId?: string;
  isActive: boolean;
  onSettingsSaved?: () => void;
}

interface TaxCategoryRate {
  code: string;
  label: string;
  rate: string;
}

interface TaxSettingsResponse {
  enabled?: boolean;
  registeredState?: string;
  categories?: Array<{
    code?: string;
    label?: string;
    rate?: number | null;
  }>;
  availableCategories?: Array<{
    code?: string;
    label?: string;
  }>;
}

const panelClassName = "rounded-2xl border border-[#ebe2d3] bg-[#fcfaf6]";
const inputClassName =
  "h-11 w-full rounded-xl border border-[#ddd3c4] bg-white px-3 font-montserrat text-[13px] text-[#1c1c1c] placeholder:text-[#9b907e] outline-none transition focus:border-[#c9a44a] focus:ring-2 focus:ring-[#f1e1ae]";
const sectionEyebrowClassName =
  "font-montserrat text-xs font-semibold uppercase tracking-[0.22em] text-[#8e816d]";

function createDefaultState() {
  return {
    enabled: false,
    registeredState: "",
    categories: [] as TaxCategoryRate[],
  };
}

function stringifySettings(state: ReturnType<typeof createDefaultState>) {
  return JSON.stringify(state);
}

function normalizeSettings(settings?: TaxSettingsResponse | null) {
  const fallback = createDefaultState();
  const sourceCategories =
    Array.isArray(settings?.categories) && settings?.categories.length > 0
      ? settings?.categories
      : Array.isArray(settings?.availableCategories)
        ? settings?.availableCategories
        : [];

  return {
    enabled: Boolean(settings?.enabled),
    registeredState: settings?.registeredState ?? "",
    categories: sourceCategories.map((category) => ({
      code: category.code ?? "",
      label: category.label ?? "Untitled Category",
      rate:
        "rate" in category && category.rate !== undefined && category.rate !== null
          ? String(category.rate)
          : "0",
    })),
  };
}

function parseRate(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

export default function TaxSettingsTab({
  businessId,
  isActive,
  onSettingsSaved,
}: TaxSettingsTabProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [registeredState, setRegisteredState] = useState("");
  const [categories, setCategories] = useState<TaxCategoryRate[]>([]);
  const [initialSnapshot, setInitialSnapshot] = useState(
    stringifySettings(createDefaultState())
  );

  const currentState = useMemo(
    () => ({
      enabled,
      registeredState,
      categories,
    }),
    [categories, enabled, registeredState]
  );

  const isDirty = useMemo(
    () => stringifySettings(currentState) !== initialSnapshot,
    [currentState, initialSnapshot]
  );

  const applyNormalizedSettings = (
    normalized: ReturnType<typeof normalizeSettings>,
    shouldResetSnapshot = true
  ) => {
    setEnabled(normalized.enabled);
    setRegisteredState(normalized.registeredState);
    setCategories(normalized.categories);

    if (shouldResetSnapshot) {
      setInitialSnapshot(stringifySettings(normalized));
    }
  };

  const loadSettings = async () => {
    if (!businessId) {
      applyNormalizedSettings(createDefaultState());
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/business/${businessId}/tax-settings`,
        { withCredentials: true }
      );

      applyNormalizedSettings(normalizeSettings(response.data?.taxSettings));
    } catch (loadError: any) {
      console.error("Error fetching tax settings:", loadError);
      setError(loadError?.response?.data?.message || "Failed to load tax settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isActive) {
      return;
    }

    loadSettings();
  }, [businessId, isActive]);

  const handleRateChange = (code: string, value: string) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.code === code ? { ...category, rate: value } : category
      )
    );
  };

  const discardChanges = () => {
    const snapshot = JSON.parse(initialSnapshot) as ReturnType<typeof createDefaultState>;
    applyNormalizedSettings(snapshot, false);
  };

  const validateForm = () => {
    for (const category of categories) {
      const rate = parseRate(category.rate);

      if (rate === null) {
        return `Please enter a valid rate for ${category.label}.`;
      }
    }

    return null;
  };

  const handleSave = async () => {
    if (!businessId) {
      toast.error("Business not found.");
      return;
    }

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const payload = {
        enabled,
        categories: categories.map((category) => ({
          code: category.code,
          label: category.label,
          rate: Number(category.rate),
        })),
      };

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/business/${businessId}/tax-settings`,
        payload,
        { withCredentials: true }
      );

      applyNormalizedSettings(normalizeSettings(response.data?.taxSettings));
      onSettingsSaved?.();
      toast.success(response.data?.message || "Tax settings saved successfully.");
    } catch (saveError: any) {
      console.error("Error saving tax settings:", saveError);
      const message =
        saveError?.response?.data?.message || "Failed to save tax settings.";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={`${panelClassName} p-8 text-center`}>
        <p className="font-montserrat text-sm font-medium text-gray-600">
          Loading tax settings...
        </p>
      </div>
    );
  }

  return (
    <div className={`${panelClassName} p-5 sm:p-6`}>
      <div className="border-b border-[#e6dccd] pb-4">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-poppins text-[22px] font-semibold text-[#1c1c1c] sm:text-[24px]">
            Tax Settings
          </h2>
          <span className="rounded-full border border-[#f2c184] bg-[#fff3dd] px-3 py-1 font-montserrat text-[11px] font-semibold uppercase tracking-[0.16em] text-[#d06c16]">
            MVP
          </span>
        </div>
        <p className="mt-1 font-montserrat text-sm text-gray-600">
          Set your rates per category for your registered state.
        </p>
      </div>

      {error && (
        <div className="mt-5 rounded-[20px] border border-[#e4b2a8] bg-[#fff3f0] px-4 py-3 font-montserrat text-sm text-[#9f4332]">
          {error}
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-[#bdd7f0] bg-[#f4f9ff] p-4 sm:p-5">
        <p className={sectionEyebrowClassName}>Registered State</p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="text-base text-[#d14a7a]">●</span>
            <div>
              <p className="font-poppins text-base font-medium text-[#1c1c1c]">
                {registeredState || "Not available"}
              </p>
              {/* <p className="font-montserrat text-xs text-gray-500">
                Pulled from account settings
              </p> */}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-dashed border-[#f0bc83] bg-[#fffaf4] px-4 py-3">
        <p className="font-montserrat text-sm leading-6 text-[#8a5a16]">
          You are responsible for selecting the correct tax category per product.
          The platform does not validate tax compliance.
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-[#d8cbb5] bg-white p-4 sm:p-5">
        <label className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-poppins text-lg font-medium text-[#1c1c1c]">
              Enable tax collection
            </p>
            <p className="mt-1 font-montserrat text-sm text-gray-600">
              Turn this on to apply category tax rates for this business.
            </p>
          </div>

          <input
            type="checkbox"
            checked={enabled}
            onChange={(event) => setEnabled(event.target.checked)}
            className="h-5 w-5 rounded border-[#a28e70] text-[#2b241f] focus:ring-[#2b241f]"
          />
        </label>
      </div>

      <div className="mt-6">
        <p className={sectionEyebrowClassName}>Tax Categories & Rates</p>

        <div className="mt-3 overflow-hidden rounded-2xl border border-[#e6dccd] bg-white">
          <div className="grid grid-cols-[1.4fr_180px] border-b border-[#e6dccd] bg-[#f9f6f0] px-4 py-3 sm:px-6">
            <p className="font-montserrat text-xs font-semibold uppercase tracking-[0.18em] text-[#8e816d]">
              Tax Category
            </p>
            <p className="pl-3 font-montserrat text-xs font-semibold uppercase tracking-[0.18em] text-[#8e816d]">
              Rate (%)
            </p>
          </div>

          {categories.length === 0 ? (
            <div className="px-4 py-6 text-center font-montserrat text-sm text-gray-600 sm:px-6">
              No tax categories available.
            </div>
          ) : (
            categories.map((category, index) => {
              const parsedRate = parseRate(category.rate);
              const isZeroRate = parsedRate === 0;

              return (
                <div
                  key={category.code || `${category.label}-${index}`}
                  className={`grid grid-cols-[1.4fr_180px] gap-4 px-4 py-4 sm:px-6 ${
                    index !== categories.length - 1 ? "border-b border-[#f0e7da]" : ""
                  }`}
                >
                  <div>
                    <p className="font-poppins text-base font-medium text-[#1c1c1c]">
                      {category.label}
                    </p>
                    <p className="mt-1 font-montserrat text-xs text-gray-500">
                      {category.code}
                    </p>
                  </div>

                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={category.rate}
                      onChange={(event) =>
                        handleRateChange(category.code, event.target.value)
                      }
                      disabled={!enabled}
                      placeholder="0.00"
                      className={`${inputClassName} pr-8 disabled:cursor-not-allowed disabled:bg-[#f6f2ea] disabled:text-[#9b907e] ${
                        isZeroRate ? "text-[#2f8a63]" : ""
                      }`}
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-poppins text-base text-[#7f7464]">
                      %
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={discardChanges}
          disabled={!isDirty || saving}
          className="rounded-xl border border-[#d6cbbb] bg-white px-5 py-3 font-poppins text-base font-medium text-[#1c1c1c] transition hover:border-[#c9a44a] hover:bg-[#fffaf0] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Discard
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-xl bg-[#2f2923] px-5 py-3 font-poppins text-base font-medium text-white transition hover:bg-[#433b33] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Tax Settings"}
        </button>
      </div>
    </div>
  );
}
