import {Outlet} from 'react-router-dom';
import {Navbar} from '../components';

const HomeLayout: React.FunctionComponent = () => {
    return (
        <>
            <Navbar/>
            <section className="main">
                <Outlet/>
            </section>
        </>
    );
}

export default HomeLayout;