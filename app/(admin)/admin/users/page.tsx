"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Store, Users as UsersIcon, Shield, Ban } from "lucide-react";

type User = {
  _id: string;
  name: string;
  email: string;
  mobile?: string;
  role: "admin" | "customer" | "business_owner";
  provider?: "local" | "google" | "facebook";
  gender?: "male" | "female" | "other";
  isBlocked?: boolean;
  isDeleted?: boolean;
  isOtpVerified?: boolean;
  createdAt?: string;
};

const UsersPage = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalVendor, setTotalVendor] = useState<number>(0);
  const [totalCustomer, setTotalCustomer] = useState<number>(0);
  const [otpVerified, setOtpVerified] = useState<number>(0);
  const [otpUnverified, setOtpUnverified] = useState<number>(0);

  const router = useRouter();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/users`,
        { withCredentials: true }
      );
      const {
        data,
        totalVendor,
        totalCustomer,
        otpVerified: otpV,
        otpUnverified: otpU,
      } = res.data;
      setUsers(data || []);
      setTotalVendor(totalVendor || 0);
      setTotalCustomer(totalCustomer || 0);
      setOtpVerified(otpV || 0);
      setOtpUnverified(otpU || 0);
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error("Failed to fetch users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleDateString() : "-";

  const RoleBadge = ({ role }: { role: User["role"] }) => {
    const map: Record<User["role"], string> = {
      admin: "bg-purple-100 text-purple-700",
      business_owner: "bg-emerald-100 text-emerald-700",
      customer: "bg-blue-100 text-blue-700",
    };
    const label: Record<User["role"], string> = {
      admin: "Admin",
      business_owner: "Vendor",
      customer: "Customer",
    };
    return (
      <span className={`px-2 py-1 rounded-md text-xs font-medium ${map[role]}`}>
        {label[role]}
      </span>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar setIsSidebarOpen={setSidebarOpen} />

        <main className="flex-1 px-6 py-6 overflow-y-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-3">
            <div className="flex items-center justify-between p-5 bg-white rounded-xl shadow-sm ring-1 ring-gray-100">
              <div>
                <p className="text-sm text-gray-500">Total Vendors</p>
                <p className="mt-1 text-3xl font-semibold">{totalVendor}</p>
              </div>
              <div className="p-3 rounded-full bg-emerald-50">
                <Store className="w-6 h-6 text-emerald-600" />
              </div>
            </div>

            <div className="flex items-center justify-between p-5 bg-white rounded-xl shadow-sm ring-1 ring-gray-100">
              <div>
                <p className="text-sm text-gray-500">Total Customers</p>
                <p className="mt-1 text-3xl font-semibold">{totalCustomer}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-50">
                <UsersIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>

            {/* New Verification card */}
            <div className="flex items-center justify-between p-5 bg-white rounded-xl shadow-sm ring-1 ring-gray-100">
              <div>
                <p className="text-sm text-gray-500">Verification</p>
                <div className="mt-2 space-y-1 text-sm text-gray-700">
                  <div>
                    Verified:{" "}
                    <span className="font-semibold">{otpVerified}</span>
                  </div>
                  <div>
                    Unverified:{" "}
                    <span className="font-semibold">{otpUnverified}</span>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-full bg-violet-50">
                <Shield className="w-6 h-6 text-violet-600" />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden bg-white rounded-xl shadow-sm ring-1 ring-gray-100">
            <div className="px-5 py-4 border-b bg-gray-50">
              <h2 className="text-lg font-semibold">Users</h2>
            </div>

            {loading ? (
              <div className="p-6 text-sm text-gray-500">Loading users…</div>
            ) : users.length === 0 ? (
              <div className="p-6 text-sm text-gray-500">No users found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-gray-600">
                      <th className="px-5 py-3 font-medium">Name</th>
                      <th className="px-5 py-3 font-medium">Email</th>
                      <th className="px-5 py-3 font-medium">Mobile</th>
                      <th className="px-5 py-3 font-medium">Role</th>
                      <th className="px-5 py-3 font-medium">Provider</th>
                      <th className="px-5 py-3 font-medium">OTP</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-gray-50/60">
                        <td className="px-5 py-3">
                          <div className="font-medium text-gray-900">
                            {u.name}
                          </div>
                        </td>
                        <td className="px-5 py-3">{u.email}</td>
                        <td className="px-5 py-3">{u.mobile || "-"}</td>
                        <td className="px-5 py-3">
                          <RoleBadge role={u.role} />
                        </td>
                        <td className="px-5 py-3 capitalize">
                          {u.provider || "local"}
                        </td>
                        <td className="px-5 py-3">
                          {u.isOtpVerified ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700">
                              <Shield className="w-4 h-4" /> Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-gray-500">
                              <Shield className="w-4 h-4" /> Pending
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3">
                          {u.isBlocked || u.isDeleted ? (
                            <span className="inline-flex items-center gap-1 text-red-600">
                              <Ban className="w-4 h-4" /> Inactive
                            </span>
                          ) : (
                            <span className="text-gray-700">Active</span>
                          )}
                        </td>
                        <td className="px-5 py-3">{formatDate(u.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UsersPage;
