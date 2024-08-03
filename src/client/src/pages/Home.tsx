import React from 'react';
import styled from 'styled-components';
import banner from '../images/banner.jpg';
import {Reviews, Accordion, Loading} from '../components';
import {Link} from 'react-router-dom';
import {type useDispatchType, type useSelectorType} from '../store';
import {useDispatch, useSelector} from 'react-redux';
import {getFeaturedProducts} from '../features/products/productsThunk';

const Home: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const {featuredProducts, getFeaturedProductsLoading} = useSelector((store: useSelectorType) => store.products);
    React.useEffect(() => {
        dispatch(getFeaturedProducts());
    }, []);
    return (
        <Wrapper>
            <div className="banner" style={{backgroundImage: `url(${banner})`,}}>
                <div className="container">
                    <div className="overlay pTop200 pBottom200 column aCenter jCenter">
                    <h1 className="cWhite f48 tCenter">Fulfill Your Every Desire</h1>
                    <p className="cWhite mBottom50 tCenter">Explore our vast selection of premium products designed to satisfy your every wish. From unique finds to everyday essentials, discover endless possibilities at your fingertips.</p>
                    <Link className="lightButton" to='/product'>Shop Now</Link>
                    </div>
                </div>
            </div>
            {getFeaturedProductsLoading ? (
                <Loading position='normal' title='Loading Featured Products'/>
            ) : (
                <div className="container">
                    <div className="pad20">
                        <h1>Browse products</h1>
                        <p>View some of our catalog. </p>
                    </div>
                    <div className="row">
                        {featuredProducts.map(featuredProduct => {
                            return (
                                <Link className="productItem" to={`/product/${featuredProduct._id}`}>
                                    <div className="productItemInner">
                                        <img className="productImage" src={featuredProduct.image}></img>
                                        <div className="row">
                                            <div className="column flexFull">
                                                <div className="productName">{featuredProduct.name}</div>
                                                <div className="productPrice">${featuredProduct.price / 100}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
            <div className="pad20"></div>
            <div className="container">
                <div className="reviewsBar row">
                    <div className="half">
                        <div className="inner pad20">
                            <h1>
                                <span className="block f48">From our</span>
                                <span className="block f48">Customers.</span>
                            </h1>
                            <p>Here is what some of our customers have had to say about our products.</p>
                        </div>
                    </div>
                    <div className="half">
                        <div className="inner pad20 removePadMobile">
                            <div><Reviews/></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="seperator"></div>
            <h1 className="pad20 tCenter">Need your questions answered? Check our FAQ!</h1>
            <Accordion/>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    .banner {
        background-size:cover;
        background-position:center;
        background-repeat:no-repeat;
        background-image:url('./images/banner.jpg');
    }
    .seperator {
        width:100%;
        height:1px;
        margin-bottom:50px;
        background-color:#eeeeee;
    }
`;

export default Home;