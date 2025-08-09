import React, { useEffect, useState } from 'react'
import Logo from "../../assets/Logo/Logo-Full-Light.png"
import { Link, matchPath } from 'react-router-dom'
import { NavbarLinks } from "../../data/navbar-links"
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CiShoppingCart } from "react-icons/ci";
import ProfileDropdown from '../core/Auth/ProfileDropdown'
import { FaAngleDown } from "react-icons/fa";
import { apiConnector } from '../../services/apiconnector'
import { categories } from '../../services/apis'

export const Navbar = () => {
    const location = useLocation();
    const { token } = useSelector((state) => state.auth);
    const { totalItem } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.profile)
    const [subLinks, setLinks] = useState(["home "]);

    // const fetchSubLinks = async () => {
    //     try {
    //         const result = await apiConnector("GET", categories.CATEGORIES_API)
    //         console.log("Api result is ", result);
    //         console.log(result.data)
    //         setLinks(result.data || []); // Ensure it's an array
    //     } catch (err) {
    //         console.log("Could not fetch the API data");
    //     }
    // }
    // useEffect(() => {
    //     fetchSubLinks();
    // }, [])

    function matchRoute(route) {
        return matchPath({ path: route }, location.pathname)
    }

    return (
        <div className='flex items-center justify-center text-white h-14 border-b-[1px] border-b-richblack-700 '>
            <div className='flex items-start justify-between w-11/12 max-w-maxContent'>
                { //image
                }
                <Link to="/">
                    <img src={Logo} alt='not available'></img>
                </Link>
                {
                    // nav
                }
                <nav>
                    <ul className='flex gap-x-6 text-richblack-25'>
                        {
                            NavbarLinks.map((link, index) => (
                                <li key={index}>
                                    {
                                        link.title === "Catalog" ? (
                                            <div className='relative flex items-center justify-center gap-1 group'>
                                                <p>{link.title}</p>
                                                <FaAngleDown />
                                                <div className='flex flex-col  invisible left-[20%] top-[100%] translate-x-[-20%] 
                                                  rounded-md bg-richblack-5 text-richblack-700 absolute
                                                   opacity-0 transition-all duration-200 text-xl
                                                   group-hover:visible  group-hover:opacity-100 lg:w-[250px] p-2 gap-2 z-10'>

                                                    <div className='absolute  top-0 flex left-[36%] bg-richblack-5  rotate-45 rounded h-6 w-6 translate-y-[-27%]'>
                                                    </div>
                                                    {
                                                        subLinks.length ? (
                                                            subLinks.map((subLink, index) => (
                                                                <Link to={`${subLink.link}`} key={index}>
                                                                    <p> {subLink.title}</p>
                                                                </Link>
                                                            ))
                                                        ) : (<div>
                                                            <div>there is no tags</div>
                                                        </div>)
                                                    }
                                                </div>
                                            </div>) : (
                                            <Link to={link?.path}>
                                                <p className={`${matchRoute(link.path) ? "text-yellow-25" : "text-richblack-25"}`}>{link.title}</p>
                                            </Link>
                                        )
                                    }
                                </li>
                            ))
                        }
                    </ul>
                </nav>
                {
                    // login-- signup -- dashboard
                }
                <div className='flex items-center gap-x-4'>
                    {
                        user && user?.accountType !== "Instructor" && (
                            <Link to="/dashboard/cart" className='relative'>
                                <CiShoppingCart />{
                                    totalItem > 0 && (
                                        <span>{totalItem}</span>
                                    )
                                }
                            </Link>
                        )
                    }
                    {
                        token === null && (
                            <Link to="./login">
                                <button className='px-4 py-1 border rounded-md border-richblack-700 bg-richblack-800 text-richblack-100'>
                                    Login
                                </button>
                            </Link>
                        )
                    }
                    {
                        token === null && (
                            <Link to="./signup">
                                <button className='px-4 py-1 border rounded-md border-richblack-700 bg-richblack-800 text-richblack-100'>
                                    Signup
                                </button>
                            </Link>
                        )
                    }
                    {
                        token !== null && (
                            <ProfileDropdown />
                        )

                    }
                </div>
            </div>
        </div>
    )
}
