"use client";

type VendorInquiry = {
  _id: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  revealCount?: number;
  lastRevealedAt?: string;
  customerId?: {
    name?: string;
    email?: string;
    mobile?: string;
  };
};

interface InquiriesTableProps {
  inquiries: VendorInquiry[];
}

function formatDateTime(value?: string) {
  if (!value) return "N/A";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "N/A";

  return parsed.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function InquiriesTable({ inquiries }: InquiriesTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e7dece] bg-[#fffdf9]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#efe7d8]">
          <thead className="bg-[#f8f1df]">
            <tr>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-[#8b6a15]">
                Customer Name
              </th>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-[#8b6a15]">
                Email
              </th>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-[#8b6a15]">
                Phone
              </th>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-[#8b6a15]">
                Count
              </th>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-[#8b6a15]">
                Last Reveal
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0e8da] bg-white">
            {inquiries.map((inquiry) => {
              const customerName = inquiry.customerName || inquiry.customerId?.name || "N/A";
              const customerEmail = inquiry.customerEmail || inquiry.customerId?.email || "N/A";
              const customerPhone = inquiry.customerPhone || inquiry.customerId?.mobile || "N/A";

              return (
                <tr key={inquiry._id} className="align-top transition-colors hover:bg-[#fcf8ef]">
                  <td className="px-5 py-4 text-sm font-medium text-gray-900">
                    {customerName}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-700">
                    <span className="break-all">{customerEmail}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-700">{customerPhone}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-[#8b6a15]">
                    {inquiry.revealCount ?? 0}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-700">
                    {formatDateTime(inquiry.lastRevealedAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
