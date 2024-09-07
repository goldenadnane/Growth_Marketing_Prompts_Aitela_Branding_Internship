import MainHeader from '@/components/MainHeader';
import MainFooter from '@/components/MainFooter';
import React from 'react';

function MainLayout({ children }: any) {
    return (
        <>
            <MainHeader />
            {children}
            <MainFooter />
        </>
    );
}

export default MainLayout;
