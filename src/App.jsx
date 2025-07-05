import React, { useState, useEffect, createContext, useContext } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth'; // Removed signInWithCustomToken as it's for custom tokens
import { getFirestore, collection, addDoc, onSnapshot, doc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { Mail, Calendar, DollarSign, FileText, CheckCircle, XCircle, Users, ClipboardList, Handshake, ShieldCheck, Home } from 'lucide-react';

// Create a context for Firebase and User
const AppContext = createContext(null);

const App = () => {
    const [page, setPage] = useState('home'); // 'home', 'inquiry', 'dashboard', 'agreement', 'waiver'
    const [firebaseApp, setFirebaseApp] = useState(null);
    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    // Firebase Initialization and Authentication
    useEffect(() => {
        const initFirebase = async () => {
            try {
                // --- START OF MODIFIED SECTION ---
                // Your web app's Firebase configuration, copied directly from Firebase Console
                const firebaseConfig = {
                    apiKey: "AIzaSyDA_4vqx9P2GhGcm-WlkOe0UAZZel0wm6c",
                    authDomain: "immersive-moments-booking.firebaseapp.com",
                    projectId: "immersive-moments-booking",
                    storageBucket: "immersive-moments-booking.firebasestorage.app",
                    messagingSenderId: "43527166384",
                    appId: "1:43527166384:web:d61dd1d97eb2324d451e75"
                };
                // Use the appId from your firebaseConfig for collection paths
                const appId = firebaseConfig.appId;

                if (!Object.keys(firebaseConfig).length || !firebaseConfig.projectId) {
                    throw new Error("Firebase configuration is missing or incomplete. Please ensure firebaseConfig is correctly set.");
                }
                // --- END OF MODIFIED SECTION ---

                const app = initializeApp(firebaseConfig);
                const firestoreDb = getFirestore(app);
                const firebaseAuth = getAuth(app);

                setFirebaseApp(app);
                setDb(firestoreDb);
                setAuth(firebaseAuth);

                // --- START OF MODIFIED AUTHENTICATION ---
                // For local development, we'll sign in anonymously.
                // The __initial_auth_token is specific to the Canvas environment and is removed here.
                await signInAnonymously(firebaseAuth);
                // --- END OF MODIFIED AUTHENTICATION ---

                onAuthStateChanged(firebaseAuth, (user) => {
                    if (user) {
                        setUserId(user.uid);
                    } else {
                        // If user logs out or token expires, sign in anonymously again
                        signInAnonymously(firebaseAuth).then(anonUser => {
                            setUserId(anonUser.user.uid);
                        }).catch(err => {
                            console.error("Error signing in anonymously:", err);
                            setError("Failed to authenticate. Please try again.");
                        });
                    }
                    setIsLoading(false);
                });

            } catch (err) {
                console.error("Firebase initialization error:", err);
                setError(`Failed to initialize application: ${err.message}`);
                setIsLoading(false);
            }
        };

        initFirebase();
    }, []);

    const showMessageModal = (message) => {
        setModalMessage(message);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setModalMessage('');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                <div className="text-center text-gray-700">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p>Loading application...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-100 p-4">
                <div className="text-center text-red-700">
                    <p className="font-bold text-lg mb-2">Error:</p>
                    <p>{error}</p>
                    <p className="mt-4">Please try refreshing the page.</p>
                </div>
            </div>
        );
    }

    return (
        <AppContext.Provider value={{ db, auth, userId, showMessageModal, appId: typeof __app_id !== 'undefined' ? __app_id : 'default-app-id' }}>
            <div className="min-h-screen bg-gray-100 font-inter text-gray-800 flex flex-col">
                {/* Header */}
                <header className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-lg p-4">
                    <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
                        <h1 className="text-3xl font-bold mb-2 sm:mb-0">Immersive Moments</h1>
                        <nav className="flex flex-wrap justify-center gap-4">
                            <button onClick={() => setPage('home')} className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition duration-300">
                                <Home size={18} /> <span>Home</span>
                            </button>
                            <button onClick={() => setPage('inquiry')} className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition duration-300">
                                <Mail size={18} /> <span>New Inquiry</span>
                            </button>
                            <button onClick={() => setPage('dashboard')} className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition duration-300">
                                <ClipboardList size={18} /> <span>Dashboard</span>
                            </button>
                            <button onClick={() => setPage('agreement')} className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition duration-300">
                                <Handshake size={18} /> <span>Agreement</span>
                            </button>
                            <button onClick={() => setPage('waiver')} className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition duration-300">
                                <ShieldCheck size={18} /> <span>Waiver</span>
                            </button>
                        </nav>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
                    {page === 'home' && <HomePage />}
                    {page === 'inquiry' && <InquiryForm />}
                    {page === 'dashboard' && <Dashboard />}
                    {page === 'agreement' && <ServiceAgreement />}
                    {page === 'waiver' && <LiabilityWaiver />}
                </main>

                {/* Footer */}
                <footer className="bg-gray-800 text-white py-4 text-center text-sm">
                    <div className="container mx-auto">
                        <p>&copy; {new Date().getFullYear()} Immersive Moments. All rights reserved.</p>
                        <p>Current User ID: {userId}</p>
                    </div>
                </footer>

                {/* Modal for messages */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full text-center">
                            <p className="text-lg font-semibold mb-4">{modalMessage}</p>
                            <button
                                onClick={closeModal}
                                className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition duration-300"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AppContext.Provider>
    );
};

// Home Page Component
const HomePage = () => {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-10 text-center">
            <h2 className="text-4xl font-extrabold text-purple-700 mb-6">Welcome to Immersive Moments Booking!</h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Manage your 360 Camera & Magazine Gallery Photo Booth Rentals with ease.
                From initial inquiries to signed contracts and scheduled events, our system helps you streamline your operations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-purple-50 p-6 rounded-lg shadow-md flex flex-col items-center">
                    <Mail className="text-purple-600 mb-3" size={48} />
                    <h3 className="text-xl font-semibold text-purple-800 mb-2">Effortless Inquiries</h3>
                    <p className="text-gray-600">Capture all necessary client details through a simple, intuitive form.</p>
                </div>
                <div className="bg-indigo-50 p-6 rounded-lg shadow-md flex flex-col items-center">
                    <FileText className="text-indigo-600 mb-3" size={48} />
                    <h3 className="text-xl font-semibold text-indigo-800 mb-2">Digital Contracts</h3>
                    <p className="text-gray-600">Easily manage service agreements and liability waivers online.</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg shadow-md flex flex-col items-center">
                    <Calendar className="text-green-600 mb-3" size={48} />
                    <h3 className="text-xl font-semibold text-green-800 mb-2">Streamlined Scheduling</h3>
                    <p className="text-gray-600">Keep track of all your bookings and event dates in one place.</p>
                </div>
            </div>
            <p className="mt-10 text-gray-600">
                Navigate using the menu above to get started.
            </p>
        </div>
    );
};


// Inquiry Form Component
const InquiryForm = () => {
    const { db, userId, showMessageModal, appId } = useContext(AppContext);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        eventDate: '',
        serviceType: '360 Camera Booth',
        notes: '',
        status: 'New', // New, Responded, Converted
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: userId,
        convertedToBooking: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!db) {
            showMessageModal("Database not initialized. Please try again later.");
            return;
        }
        setIsSubmitting(true);
        try {
            // Store inquiries in a public collection for easier management
            const inquiriesCollectionRef = collection(db, `artifacts/${appId}/public/data/inquiries`);
            await addDoc(inquiriesCollectionRef, formData);
            showMessageModal("Your inquiry has been submitted successfully!");
            setFormData({
                name: '',
                email: '',
                phone: '',
                eventDate: '',
                serviceType: '360 Camera Booth',
                notes: '',
                status: 'New',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                createdBy: userId,
                convertedToBooking: false,
            });
        } catch (e) {
            console.error("Error adding document: ", e);
            showMessageModal(`Failed to submit inquiry: ${e.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-10 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">Submit a New Inquiry</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    />
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    />
                </div>
                <div>
                    <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-1">Preferred Event Date</label>
                    <input
                        type="date"
                        id="eventDate"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    />
                </div>
                <div>
                    <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                    <select
                        id="serviceType"
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    >
                        <option value="360 Camera Booth">360 Camera Booth</option>
                        <option value="Magazine Gallery Photo Booth">Magazine Gallery Photo Booth</option>
                        <option value="Both">Both (360 Camera & Magazine Gallery)</option>
                        <option value="Other">Other (specify in notes)</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Additional Notes / Details</label>
                    <textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    ></textarea>
                </div>
                <button
                    type="submit"
                    className="w-full bg-purple-600 text-white py-3 rounded-full hover:bg-purple-700 transition duration-300 font-semibold text-lg flex items-center justify-center space-x-2"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Submitting...</span>
                        </>
                    ) : (
                        <>
                            <Mail size={20} />
                            <span>Submit Inquiry</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

// Dashboard Component
const Dashboard = () => {
    const { db, userId, showMessageModal, appId } = useContext(AppContext);
    const [inquiries, setInquiries] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loadingInquiries, setLoadingInquiries] = useState(true);
    const [loadingBookings, setLoadingBookings] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null); // For detailed view
    const [isConverting, setIsConverting] = useState(false);

    // Fetch Inquiries
    useEffect(() => {
        if (!db) return;

        const inquiriesCollectionRef = collection(db, `artifacts/${appId}/public/data/inquiries`);
        // Note: Firestore security rules should allow read access for authenticated users.
        const unsubscribe = onSnapshot(inquiriesCollectionRef, (snapshot) => {
            const fetchedInquiries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Sort by createdAt descending
            fetchedInquiries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setInquiries(fetchedInquiries);
            setLoadingInquiries(false);
        }, (error) => {
            console.error("Error fetching inquiries:", error);
            showMessageModal(`Failed to load inquiries: ${error.message}`);
            setLoadingInquiries(false);
        });

        return () => unsubscribe(); // Cleanup listener on unmount
    }, [db, userId, showMessageModal, appId]);

    // Fetch Bookings
    useEffect(() => {
        if (!db) return;

        const bookingsCollectionRef = collection(db, `artifacts/${appId}/public/data/bookings`);
        // Note: Firestore security rules should allow read access for authenticated users.
        const unsubscribe = onSnapshot(bookingsCollectionRef, (snapshot) => {
            const fetchedBookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Sort by eventDate ascending
            fetchedBookings.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
            setBookings(fetchedBookings);
            setLoadingBookings(false);
        }, (error) => {
            console.error("Error fetching bookings:", error);
            showMessageModal(`Failed to load bookings: ${error.message}`);
            setLoadingBookings(false);
        });

        return () => unsubscribe(); // Cleanup listener on unmount
    }, [db, userId, showMessageModal, appId]);

    const handleMarkResponded = async (inquiryId) => {
        if (!db) return;
        try {
            const inquiryRef = doc(db, `artifacts/${appId}/public/data/inquiries`, inquiryId);
            await updateDoc(inquiryRef, { status: 'Responded', updatedAt: new Date().toISOString() });
            showMessageModal("Inquiry marked as 'Responded'.");
        } catch (error) {
            console.error("Error updating inquiry status:", error);
            showMessageModal(`Failed to update inquiry status: ${error.message}`);
        }
    };

    const handleConvertToBooking = async (inquiry) => {
        if (!db) return;
        setIsConverting(true);
        try {
            // Add to bookings collection
            const bookingsCollectionRef = collection(db, `artifacts/${appId}/public/data/bookings`);
            const newBooking = {
                ...inquiry,
                inquiryId: inquiry.id, // Link to original inquiry
                status: 'Confirmed', // Initial booking status
                paymentStatus: 'Pending Deposit',
                contractSigned: false,
                waiverSigned: false,
                scheduled: true, // Assuming conversion means it's scheduled
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                convertedBy: userId,
            };
            delete newBooking.id; // Remove inquiry's ID before adding as new doc

            await addDoc(bookingsCollectionRef, newBooking);

            // Update original inquiry to mark as converted
            const inquiryRef = doc(db, `artifacts/${appId}/public/data/inquiries`, inquiry.id);
            await updateDoc(inquiryRef, {
                status: 'Converted to Booking',
                convertedToBooking: true,
                updatedAt: new Date().toISOString(),
            });

            showMessageModal(`Inquiry from ${inquiry.name} converted to a booking successfully!`);
        } catch (error) {
            console.error("Error converting inquiry to booking:", error);
            showMessageModal(`Failed to convert inquiry: ${e.message}`);
        } finally {
            setIsConverting(false);
        }
    };

    const handleUpdateBookingStatus = async (bookingId, field, value) => {
        if (!db) return;
        try {
            const bookingRef = doc(db, `artifacts/${appId}/public/data/bookings`, bookingId);
            await updateDoc(bookingRef, { [field]: value, updatedAt: new Date().toISOString() });
            showMessageModal(`Booking ${field} updated.`);
        } catch (error) {
            console.error("Error updating booking status:", error);
            showMessageModal(`Failed to update booking: ${error.message}`);
        }
    };


    return (
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-10">
            <h2 className="text-3xl font-bold text-purple-700 mb-8 text-center">Dashboard</h2>

            {/* Inquiries Section */}
            <section className="mb-10">
                <h3 className="text-2xl font-semibold text-indigo-700 mb-4 flex items-center">
                    <Mail className="mr-2" /> Recent Inquiries
                </h3>
                {loadingInquiries ? (
                    <div className="text-center text-gray-600">Loading inquiries...</div>
                ) : inquiries.length === 0 ? (
                    <div className="text-center text-gray-600">No new inquiries.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
                            <thead className="bg-indigo-100">
                                <tr>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-indigo-800">Name</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-indigo-800">Date</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-indigo-800">Service</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-indigo-800">Status</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-indigo-800">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inquiries.map(inquiry => (
                                    <tr key={inquiry.id} className="border-b border-gray-200 last:border-0 hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm text-gray-800">{inquiry.name}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">{inquiry.eventDate}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">{inquiry.serviceType}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                inquiry.status === 'New' ? 'bg-blue-100 text-blue-800' :
                                                inquiry.status === 'Responded' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-green-100 text-green-800'
                                            }`}>
                                                {inquiry.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm">
                                            <div className="flex flex-wrap gap-2">
                                                {inquiry.status === 'New' && (
                                                    <button
                                                        onClick={() => handleMarkResponded(inquiry.id)}
                                                        className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs hover:bg-blue-600 transition duration-200"
                                                    >
                                                        Mark Responded
                                                    </button>
                                                )}
                                                {!inquiry.convertedToBooking && (
                                                    <button
                                                        onClick={() => handleConvertToBooking(inquiry)}
                                                        className="px-3 py-1 bg-green-500 text-white rounded-full text-xs hover:bg-green-600 transition duration-200"
                                                        disabled={isConverting}
                                                    >
                                                        {isConverting ? 'Converting...' : 'Convert to Booking'}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {/* Bookings Section */}
            <section>
                <h3 className="text-2xl font-semibold text-purple-700 mb-4 flex items-center">
                    <Calendar className="mr-2" /> Upcoming Bookings
                </h3>
                {loadingBookings ? (
                    <div className="text-center text-gray-600">Loading bookings...</div>
                ) : bookings.length === 0 ? (
                    <div className="text-center text-gray-600">No upcoming bookings.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
                            <thead className="bg-purple-100">
                                <tr>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-purple-800">Client</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-purple-800">Event Date</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-purple-800">Service</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-purple-800">Payment</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-purple-800">Contract</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-purple-800">Waiver</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-purple-800">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map(booking => (
                                    <tr key={booking.id} className="border-b border-gray-200 last:border-0 hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm text-gray-800">{booking.name}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">{booking.eventDate}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">{booking.serviceType}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">
                                            <select
                                                value={booking.paymentStatus}
                                                onChange={(e) => handleUpdateBookingStatus(booking.id, 'paymentStatus', e.target.value)}
                                                className="px-2 py-1 rounded-md border border-gray-300 bg-white text-xs"
                                            >
                                                <option value="Pending Deposit">Pending Deposit</option>
                                                <option value="Deposit Paid">Deposit Paid</option>
                                                <option value="Balance Due">Balance Due</option>
                                                <option value="Paid in Full">Paid in Full</option>
                                            </select>
                                        </td>
                                        <td className="py-3 px-4 text-sm">
                                            <button
                                                onClick={() => handleUpdateBookingStatus(booking.id, 'contractSigned', !booking.contractSigned)}
                                                className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${
                                                    booking.contractSigned ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}
                                            >
                                                {booking.contractSigned ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                                <span>{booking.contractSigned ? 'Signed' : 'Not Signed'}</span>
                                            </button>
                                        </td>
                                        <td className="py-3 px-4 text-sm">
                                            <button
                                                onClick={() => handleUpdateBookingStatus(booking.id, 'waiverSigned', !booking.waiverSigned)}
                                                className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${
                                                    booking.waiverSigned ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}
                                            >
                                                {booking.waiverSigned ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                                <span>{booking.waiverSigned ? 'Signed' : 'Not Signed'}</span>
                                            </button>
                                        </td>
                                        <td className="py-3 px-4 text-sm">
                                            <button
                                                onClick={() => setSelectedBooking(booking)}
                                                className="px-3 py-1 bg-purple-500 text-white rounded-full text-xs hover:bg-purple-600 transition duration-200"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {/* Booking Details Modal */}
            {selectedBooking && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full">
                        <h3 className="text-2xl font-bold text-purple-700 mb-4">Booking Details</h3>
                        <div className="space-y-2 text-gray-700">
                            <p><strong>Client Name:</strong> {selectedBooking.name}</p>
                            <p><strong>Email:</strong> {selectedBooking.email}</p>
                            <p><strong>Phone:</strong> {selectedBooking.phone}</p>
                            <p><strong>Event Date:</strong> {selectedBooking.eventDate}</p>
                            <p><strong>Service Type:</strong> {selectedBooking.serviceType}</p>
                            <p><strong>Notes:</strong> {selectedBooking.notes}</p>
                            <p><strong>Status:</strong> {selectedBooking.status}</p>
                            <p><strong>Payment Status:</strong> {selectedBooking.paymentStatus}</p>
                            <p><strong>Contract Signed:</strong> {selectedBooking.contractSigned ? 'Yes' : 'No'}</p>
                            <p><strong>Waiver Signed:</strong> {selectedBooking.waiverSigned ? 'Yes' : 'No'}</p>
                            <p className="text-xs text-gray-500 mt-4">Created: {new Date(selectedBooking.createdAt).toLocaleString()}</p>
                            <p className="text-xs text-gray-500">Last Updated: {new Date(selectedBooking.updatedAt).toLocaleString()}</p>
                        </div>
                        <button
                            onClick={() => setSelectedBooking(null)}
                            className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition duration-300"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Service Agreement Component
const ServiceAgreement = () => {
    const { showMessageModal } = useContext(AppContext);
    const [agreed, setAgreed] = useState(false);

    const handleAgree = () => {
        setAgreed(true);
        showMessageModal("You have agreed to the Service Agreement. This action would typically be recorded in the booking details.");
        // In a real application, this would update the booking document in Firestore
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-10 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">Service Agreement</h2>
            <div className="prose max-w-none text-gray-700 leading-relaxed mb-8 border border-gray-200 p-4 rounded-md h-96 overflow-y-auto">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">1. Services Provided</h3>
                <p>Immersive Moments agrees to provide photo booth rental services as specified in the client's booking confirmation. This includes the chosen photo booth type (360 Camera Booth or Magazine Gallery Photo Booth), duration, props, backdrops, and digital gallery access.</p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">2. Rental Period</h3>
                <p>The rental period shall commence at the agreed-upon start time and conclude at the agreed-upon end time. Any extensions must be approved by Immersive Moments and may incur additional charges.</p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">3. Payment Terms</h3>
                <p>A non-refundable deposit of [X]% of the total booking fee is required to secure the date. The remaining balance is due [Y] days prior to the event date. Payments can be made via [Accepted Payment Methods]. Failure to make timely payments may result in cancellation of the booking.</p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">4. Cancellation Policy</h3>
                <ul className="list-disc list-inside">
                    <li>Cancellations made [Z] days or more prior to the event will result in forfeiture of the deposit.</li>
                    <li>Cancellations made less than [Z] days prior to the event will require payment of the full booking fee.</li>
                    <li>In the unlikely event Immersive Moments must cancel, a full refund will be issued.</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">5. Venue Requirements</h3>
                <p>Client is responsible for ensuring the venue provides adequate space (minimum [dimensions]), access to a standard power outlet, and shelter from elements if outdoors. Immersive Moments is not responsible for service interruptions due to venue limitations.</p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">6. Client Responsibilities</h3>
                <p>Client agrees to provide a safe and appropriate environment for the photo booth and its operators. Client is responsible for any damage to equipment caused by guests or venue staff.</p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">7. Force Majeure</h3>
                <p>Neither party shall be liable for any failure or delay in performance under this agreement due to circumstances beyond their reasonable control, including but not limited to acts of God, war, terrorism, riots, embargoes, acts of civil or military authorities, fire, floods, accidents, strikes, or shortages of transportation, facilities, fuel, energy, labor, or materials.</p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">8. Governing Law</h3>
                <p>This agreement shall be governed by and construed in accordance with the laws of the State of California.</p>
            </div>
            <div className="flex items-center justify-center mt-6">
                <input
                    type="checkbox"
                    id="agreeService"
                    checked={agreed}
                    onChange={() => setAgreed(!agreed)}
                    className="h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
                />
                <label htmlFor="agreeService" className="ml-3 text-lg text-gray-800 font-medium">
                    I have read and agree to the Service Agreement.
                </label>
            </div>
            <div className="text-center mt-6">
                <button
                    onClick={handleAgree}
                    disabled={!agreed}
                    className={`px-8 py-3 rounded-full text-white font-semibold text-lg transition duration-300 ${
                        agreed ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-400 cursor-not-allowed'
                    }`}
                >
                    Accept Agreement
                </button>
            </div>
        </div>
    );
};

// Liability Waiver Component
const LiabilityWaiver = () => {
    const { showMessageModal } = useContext(AppContext);
    const [agreed, setAgreed] = useState(false);

    const handleAgree = () => {
        setAgreed(true);
        showMessageModal("You have agreed to the Liability Waiver. This action would typically be recorded in the booking details.");
        // In a real application, this would update the booking document in Firestore
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-10 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">Liability Waiver</h2>
            <div className="prose max-w-none text-gray-700 leading-relaxed mb-8 border border-gray-200 p-4 rounded-md h-96 overflow-y-auto">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">1. Assumption of Risk</h3>
                <p>Client acknowledges and understands that participation in photo booth activities involves inherent risks, including but not limited to physical injury, property damage, or loss. Client voluntarily assumes all such risks associated with the use of the photo booth equipment and props.</p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">2. Release of Liability</h3>
                <p>Client, on behalf of themselves, their guests, and any minor children attending the event, hereby releases, waives, discharges, and covenants not to sue Immersive Moments, its owners, employees, agents, or affiliates from any and all liability, claims, demands, actions, and causes of action whatsoever arising out of or related to any loss, damage, or injury, including death, that may be sustained by any participant, or to any property belonging to any participant, while participating in the photo booth activities, or while on the premises where the photo booth is located.</p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">3. Indemnification</h3>
                <p>Client agrees to indemnify and hold harmless Immersive Moments from any loss, liability, damage, or costs, including attorney's fees, that Immersive Moments may incur due to the presence of the client or their guests at the event, whether caused by the negligence of Immersive Moments or otherwise.</p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">4. Medical Treatment Consent</h3>
                <p>Client consents to receive medical treatment which may be deemed advisable in the event of injury, accident, or illness during photo booth activities, and agrees to be responsible for any and all costs associated with such medical treatment.</p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">5. Photo and Video Release</h3>
                <p>Client grants Immersive Moments the right to use photos and videos taken at the event for promotional purposes, including but not limited to website, social media, and marketing materials, without further compensation. Clients who do not wish to grant this release must notify Immersive Moments in writing prior to the event.</p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">6. Acknowledgment</h3>
                <p>Client acknowledges that they have read this waiver of liability, fully understand its terms, and understand that they are giving up substantial rights, including their right to sue. Client acknowledges that they are signing this agreement freely and voluntarily, and intend their signature to be a complete and unconditional release of all liability to the greatest extent allowed by law.</p>
            </div>
            <div className="flex items-center justify-center mt-6">
                <input
                    type="checkbox"
                    id="agreeWaiver"
                    checked={agreed}
                    onChange={() => setAgreed(!agreed)}
                    className="h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
                />
                <label htmlFor="agreeWaiver" className="ml-3 text-lg text-gray-800 font-medium">
                    I have read and agree to the Liability Waiver.
                </label>
            </div>
            <div className="text-center mt-6">
                <button
                    onClick={handleAgree}
                    disabled={!agreed}
                    className={`px-8 py-3 rounded-full text-white font-semibold text-lg transition duration-300 ${
                        agreed ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-400 cursor-not-allowed'
                    }`}
                >
                    Accept Waiver
                </button>
            </div>
        </div>
    );
};

export default App;
