import React from 'react';
import Routes from 'config/Routes';

import Header   from 'components/Header';
import Footer   from 'components/Footer';
import Sidebar   from 'components/Sidebar';

export default class Layout extends React.Component {
    render() {
        return (
            <>
                <Routes />
                <Header />
                <Footer />
                <Sidebar />
            </>
        )
    }
}