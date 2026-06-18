import '../globals.css'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className="min-h-screen overflow-x-hidden">
        {children}
        <ToastContainer position="top-right" autoClose={3000} />
      </body>
    </html>
  )
}
