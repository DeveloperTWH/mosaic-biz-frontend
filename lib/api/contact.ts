import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface ContactInquiryData {
    firstName: string;
    lastName: string;
    email: string;
    phoneNo: string;
    subject: string;
    howCanWeHelp: string;
}

// Submit contact inquiry
export const submitContactInquiry = async (data: ContactInquiryData) => {
    const response = await axios.post(
        `${API_BASE_URL}/api/contact-inquiry`,
        data,
        {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        }
    );
    return response.data;
};