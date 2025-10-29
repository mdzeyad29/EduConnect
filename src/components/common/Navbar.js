import React, { useEffect, useState } from 'react'
import Logo from "../../assets/Logo/Logo-Full-Light.png"
import { Link, matchPath } from 'react-router-dom'
import { NavbarLinks } from "../../data/navbar-links"
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CiShoppingCart } from "react-icons/ci";
import { HiMenuAlt3 } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import { RiBookOpenLine, RiGraduationCapLine, RiCodeSSlashLine } from "react-icons/ri";
import { FiCode } from "react-icons/fi";
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
    const [mobileMenu, setMobileMenu] = useState(false);

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
        if (!route) return false; // Handle undefined/null routes
        return matchPath({ path: route }, location.pathname)
    }

    return (
        <div className='flex items-center justify-center text-white h-14 border-b-[1px] border-b-richblack-700 '>
            <div className='flex items-center justify-between w-11/12 max-w-maxContent'>
                { //image
                }
                <Link to="/" className="flex items-center gap-2 group">
                    {/* Interactive Logo with Multiple Icons */}
                    <div className="relative flex items-center justify-center">
                        {/* Icon Background with Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        {/* Main Icon Container */}
                        <div className="relative bg-richblack-800 group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-purple-600 p-2 rounded-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                            {/* Main Icon - Book */}
                            <RiBookOpenLine className="text-yellow-50 text-2xl md:text-3xl transition-transform duration-300 group-hover:scale-110 relative z-10" />
                            
                            {/* Overlay Icons on Hover */}
                            <FiCode className="text-blue-100 text-lg md:text-xl absolute top-1 right-0 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-125 group-hover:-rotate-12 z-20" />
                            <RiGraduationCapLine className="text-purple-100 text-lg md:text-xl absolute bottom-0 left-1 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12 z-20" />
                        </div>
                        {/* Glow effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300"></div>
                    </div>
                    {/* Text Logo */}
                    <div className="flex flex-col">
                        <h1 className='text-xl md:text-2xl font-bold bg-gradient-to-r from-yellow-50 to-yellow-100 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-300'>
                            EduConnect
                        </h1>
                        <span className="text-[10px] md:text-xs text-richblack-300 hidden md:block group-hover:text-richblack-100 transition-colors duration-300">
                            Learn. Code. Grow.
                        </span>
                    </div>
                </Link>
                {
                    // nav
                }
                <nav className="hidden md:block">
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
                    // Mobile Menu Icon
                }
                <button 
                    onClick={() => setMobileMenu(!mobileMenu)}
                    className="md:hidden text-richblack-25"
                    aria-label="Toggle menu"
                >
                    {mobileMenu ? <IoMdClose size={24} /> : <HiMenuAlt3 size={24} />}
                </button>
                {
                    // Mobile Menu
                }
                {mobileMenu && (
                    <div className="absolute top-14 left-0 right-0 bg-richblack-900 border-b border-richblack-700 md:hidden z-50">
                        <nav className="p-4">
                            <ul className="flex flex-col gap-4">
                                {
                                    NavbarLinks.map((link, index) => {
                                        // Skip Catalog link in mobile menu if it doesn't have a path
                                        if (!link.path) return null;
                                        return (
                                            <li key={index}>
                                                <Link 
                                                    to={link.path}
                                                    onClick={() => setMobileMenu(false)}
                                                    className={`${matchRoute(link.path) ? "text-yellow-25" : "text-richblack-25"}`}
                                                >
                                                    {link.title}
                                                </Link>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                            {/* Mobile Auth Buttons */}
                            <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-richblack-700">
                                {token === null ? (
                                    <>
                                        <Link to="./login" onClick={() => setMobileMenu(false)}>
                                            <button className='w-full px-4 py-2 border rounded-md border-richblack-700 bg-richblack-800 text-richblack-100'>
                                                Login
                                            </button>
                                        </Link>
                                        <Link to="./signup" onClick={() => setMobileMenu(false)}>
                                            <button className='w-full px-4 py-2 border rounded-md border-richblack-700 bg-richblack-800 text-richblack-100'>
                                                Signup
                                            </button>
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        {user && user?.accountType !== "Instructor" && (
                                            <Link to="/dashboard/cart" onClick={() => setMobileMenu(false)} className='flex items-center gap-2 text-richblack-25'>
                                                <CiShoppingCart size={24} />
                                                {totalItem > 0 && <span>({totalItem})</span>}
                                            </Link>
                                        )}
                                        <ProfileDropdown />
                                    </>
                                )}
                            </div>
                        </nav>
                    </div>
                )}
                {
                    // login-- signup -- dashboard
                }
                <div className='hidden md:flex items-center gap-x-4'>
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
