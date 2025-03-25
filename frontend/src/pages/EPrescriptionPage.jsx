import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileX } from "lucide-react";
import LeftNavbar from "../components/LeftNavBar";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

// Cloudinary Config
const CLOUDINARY_CLOUD_NAME = "dh53bxmsk"; // Replace with your Cloudinary cloud name
const UPLOAD_PRESET = "jagvvfvr"; // Replace with your upload preset

const EPrescriptionPage = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [fileUrl, setFileUrl] = useState(null);
    const [fileName, setFileName] = useState("");
    const { user } = useAuthStore();

    const API_URL =
        import.meta.env.MODE === "development"
            ? "http://localhost:3000/api/prescriptions"
            : "/api/prescriptions";

    useEffect(() => {
        const fetchPrescriptions = async () => {
            try {
                const response = await axios.get(API_URL, {
                    withCredentials: true,
                });
                setPrescriptions(response.data.prescriptions || []);
            } catch (error) {
                console.error("Error fetching prescriptions:", error);
            }
        };

        fetchPrescriptions();
    }, []);

    const handleUpload = () => {
        window.cloudinary.openUploadWidget(
            {
                cloud_name: CLOUDINARY_CLOUD_NAME,
                upload_preset: UPLOAD_PRESET,
                sources: ["local", "url", "camera"],
                multiple: false,
                folder: "swiftcareAI",
                resource_type: "auto",
                maxFileSize: 5000000, // 5MB max file size
            },
            async (error, result) => {
                if (!error && result && result.event === "success") {
                    console.log("Uploaded Successfully: ", result.info);
                    setFileUrl(result.info.secure_url);
                } else {
                    console.error("Upload Error:", error);
                }
            }
        );
    };

    const handleSaveToDB = async () => {
        if (!fileUrl || !fileName) return;

        try {
            await axios.post(
                `${API_URL}/upload`,
                { fileUrl, fileName, email: user.email },
                { withCredentials: true }
            );

            setShowUploadModal(false);
            setFileUrl(null);
            setFileName("");

            // Refresh prescriptions list
            const response = await axios.get(API_URL, {
                withCredentials: true,
            });
            setPrescriptions(response.data.prescriptions);
        } catch (error) {
            console.error("Error saving file:", error);
        }
    };

    return (
        <div className="h-screen w-full flex bg-gray-100 z-0">
            {/* Sidebar */}
            <div className="min-w-[300px] bg-white shadow-md">
                <LeftNavbar />
            </div>

            {/* Main Content */}
            <div className="w-full p-8">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text">
                        E-Prescription
                    </h2>
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-all"
                    >
                        Upload Prescription
                    </button>
                </div>

                {/* Horizontal Rule */}
                <hr className="my-6 border-gray-300" />

                {/* Prescription List */}
                <div className="mt-6">
                    {prescriptions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-gray-500">
                            <FileX className="w-16 h-16 mb-3" />
                            <p className="text-lg">
                                No prescriptions uploaded yet.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {prescriptions.map((prescription) => (
                                <div
                                    key={prescription._id}
                                    className="p-4 bg-white rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-all flex flex-col items-center"
                                >
                                    {/* Prescription Image */}
                                    <img
                                        src={prescription.fileUrl}
                                        alt={prescription.fileName}
                                        className="w-full h-48 object-cover rounded-md"
                                    />

                                    {/* Prescription Name */}
                                    <h4 className="font-semibold text-gray-700 mt-3 truncate w-full text-center">
                                        {prescription.fileName}
                                    </h4>

                                    {/* View Prescription Button */}
                                    <a
                                        href={prescription.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 underline mt-2"
                                    >
                                        View Full Prescription
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-2xl w-96">
                        <h3 className="text-xl font-semibold mb-4 text-gray-700">
                            Upload Prescription
                        </h3>

                        <button
                            onClick={handleUpload}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg w-full"
                        >
                            Choose File
                        </button>

                        {fileUrl && (
                            <div className="mt-4 text-center">
                                <p className="text-gray-700">
                                    File Uploaded Successfully!
                                </p>
                                <a
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View File
                                </a>
                            </div>
                        )}

                        <input
                            type="text"
                            placeholder="Enter File Name"
                            value={fileName}
                            onChange={(e) => setFileName(e.target.value)}
                            className="mt-3 w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-green-400"
                        />

                        {/* Modal Buttons */}
                        <div className="flex justify-end gap-3 mt-5">
                            <button
                                onClick={handleSaveToDB}
                                className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg transition-all"
                                disabled={!fileUrl}
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setShowUploadModal(false)}
                                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EPrescriptionPage;
