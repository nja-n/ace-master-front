
import React, { useState } from 'react';
import GalleryPage from '../components/bday/GalleryPage';
import Header from '../components/bday/Header';
import WelcomePage from '../components/bday/WelcomePage';
import PhoneLogin from '../components/PhoneLogin';

const BirthDay = () => {
    const [showWelcome, setShowWelcome] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [showPhoneLogin, setShowPhoneLogin] = useState(true);
    const totalPages = 16;

    const handleStart = () => {
        setShowWelcome(false);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePageSelect = (page) => {
        setCurrentPage(page);
    };

    return (
        <>
            {showPhoneLogin ? (
                <PhoneLogin onVerified={() => setShowPhoneLogin(false)} />
            ) : (
                <div className="min-h-screen bg-gray-100">
                    {showWelcome ? (
                        <WelcomePage onStart={handleStart} />
                    ) : (
                        <>
                            <Header
                                currentPage={currentPage + 1}
                                totalPages={totalPages}
                                onPageSelect={handlePageSelect}
                            />
                            <div className="pt-16">
                                <GalleryPage
                                    initialPage={currentPage}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
}

export default BirthDay;