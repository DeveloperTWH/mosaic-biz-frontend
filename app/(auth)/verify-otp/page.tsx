'use client';
export const dynamic = 'force-dynamic';
import { toast } from 'react-toastify';


import React, { Suspense, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';

function VerifyOtpPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const email = searchParams.get('email');
    const type = searchParams.get('type'); // 'vendor' or 'customer'

    const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
    const [error, setError] = useState('');
    const [resendDisabled, setResendDisabled] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const inputRefs = useRef<HTMLInputElement[]>([]);

    const handleClose = () => {
        router.push('/');
    };

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const val = e.target.value.replace(/\D/g, '');
        if (!val) return;

        const newOtp = [...otp];
        newOtp[index] = val;
        setOtp(newOtp);

        if (val && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace') {
            const newOtp = [...otp];
            if (otp[index]) {
                newOtp[index] = '';
                setOtp(newOtp);
            } else if (index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const joinedOtp = otp.join('');

        if (joinedOtp.length !== 6) {
            setError('Please enter a 6-digit OTP');
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp: joinedOtp }),
            });

            console.log(res);


            const data = await res.json();

            if (data.success) {
                localStorage.setItem('token', data.token);
                router.push(data.user.role === 'vendor' ? '/vendor/dashboard' : '/dashboard');
            } else {
                setError(data.message || 'Invalid OTP');
            }
        } catch (err) {
            console.error('OTP verification error:', err);
            setError('Something went wrong. Please try again.');
        }
    };


    const handleResendOtp = async () => {
        if (!email || !type || resendDisabled) return;

        setResendDisabled(true);
        setCountdown(30); // 30 second countdown

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/resend-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, type }),
            });

            const data = await res.json();

            if (data.success) {
                toast.success('OTP resent successfully!');
            } else {
                toast.error(data.message || 'Failed to resend OTP');
            }
        } catch (err) {
            toast.error('Error while resending OTP');
        }

        // Start countdown timer
        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setResendDisabled(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };


    return (
        <div className="min-h-screen bg-black bg-[url('/login/footer-bg.jpg')] bg-cover bg-center bg-fixed relative py-10 p-1">
            <div
                className="fixed top-4 right-4 z-50 text-white bg-gray-700 rounded-lg p-2 cursor-pointer"
                onClick={handleClose}
            >
                <X size={20} />
            </div>

            <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-auto p-8 z-10">
                <Link href="/">
                    <div className="text-center mb-6">
                        <Image src="/logo.png" alt="Logo" width={350} height={100} className="mx-auto" />
                    </div>
                </Link>

                <div className="text-center font-bold text-lg mb-4">Verify OTP</div>

                {email && (
                    <p className="text-center text-sm text-gray-600 mb-4">
                        Enter the OTP sent to <span className="font-semibold">{email}</span>
                    </p>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between gap-2 mb-4">
                        {[...Array(6)].map((_, idx) => (
                            <input
                                key={idx}
                                type="text"
                                maxLength={1}
                                className="w-12 h-12 text-center text-xl border-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={otp[idx] || ''}
                                onChange={(e) => handleOtpChange(e, idx)}
                                onKeyDown={(e) => handleKeyDown(e, idx)}
                                ref={(el) => {
                                    if (el) inputRefs.current[idx] = el;
                                }}

                            />
                        ))}
                    </div>

                    {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

                    <button type="submit" className="bg-[#10A3C9] text-white w-full py-2 font-semibold">
                        Verify OTP
                    </button>
                </form>

                <p className="text-center text-sm mt-4">
                    Didn’t receive the code?{' '}
                    {resendDisabled ? (
                        <span className="font-semibold text-gray-500">Resend in {countdown}s</span>
                    ) : (
                        <button
                            onClick={handleResendOtp}
                            className="font-bold underline text-blue-600 hover:text-blue-800"
                        >
                            Resend OTP
                        </button>
                    )}
                </p>


            </div>

            <footer className="absolute bottom-2 w-full text-yellow-500 text-sm">
                <div className="pr-5 w-[80%] mx-auto">
                    <p>Copyright 2025. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
}


export default function VerifyPage() {
    return (
        <Suspense fallback={<div className="text-center p-8">Loading login page...</div>}>
            <VerifyOtpPage />
        </Suspense>
    )
}