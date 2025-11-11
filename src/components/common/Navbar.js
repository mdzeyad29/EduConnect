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
import { categories, catalogData } from '../../services/apis'
import { useNavigate } from 'react-router-dom'

export const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);
    const { totalItems } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.profile)
    const [subLinks, setLinks] = useState([]);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState({});
    const [mobileCatalogOpen, setMobileCatalogOpen] = useState(false);
    const [loadingSubLinks, setLoadingSubLinks] = useState(true);

    const fetchSubLinks = async () => {
        setLoadingSubLinks(true);
        try {
            const response = await apiConnector("GET", categories.CATEGORIES_API);
            
            // Validate response structure
            if (!response?.data?.success) {
                throw new Error("Invalid API response structure");
            }
            
            const categoriesData = response.data?.data || [];
            setLinks(categoriesData);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
            // Set empty array on error to prevent showing stale data
            setLinks([]);
        } finally {
            setLoadingSubLinks(false);
        }
    };

    useEffect(() => {
        fetchSubLinks();
    }, []);

    
    const generateCategoryUrl = (categoryName) => {
        return categoryName?.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-') || '';
    };

    // Fetch courses for a specific category and navigate to catalog page
    const fetchCategoryCourses = async (categoryId, categoryName) => {
        if (!categoryId || !categoryName) {
            console.warn("Invalid category data provided:", { categoryId, categoryName });
            return;
        }

        try {
            setLoadingCategories(prev => ({ ...prev, [categoryId]: true }));
            
            const response = await apiConnector("POST", catalogData.CATALOGPAGEDATA_API, {
                categoryId,
            });

            const categoryUrl = generateCategoryUrl(categoryName);

            if (response?.data?.success && response?.data?.data?.selectedCategory) {
                const { selectedCategory, differentCategories } = response.data.data;
                const courses = selectedCategory?.courses || [];
                
                navigate(`/catalog/${categoryUrl}`, {
                    state: {
                        category: selectedCategory,
                        courses,
                        differentCategories,
                        categoryId,
                    }
                });
            } else {
                // Navigate with minimal category info if API response is invalid
                navigate(`/catalog/${categoryUrl}`, {
                    state: {
                        category: { _id: categoryId, name: categoryName },
                        courses: [],
                        categoryId,
                    }
                });
            }
        } catch (error) {
            console.error("Error fetching category courses:", error);
            // Navigate to catalog page even on error
            const categoryUrl = generateCategoryUrl(categoryName);
            navigate(`/catalog/${categoryUrl}`);
        } finally {
            setLoadingCategories(prev => ({ ...prev, [categoryId]: false }));
        }
    };

    // Handle category click - redirects to login if not authenticated
    const handleCategoryClick = (e, category) => {
        e.preventDefault();
        
        // Redirect to login if user is not authenticated
        if (!token) {
            navigate("/login");
            return;
        }
        
        // Validate category has required data before fetching
        if (!category?._id) {
            console.warn("Category missing required ID:", category);
            return;
        }
        
        fetchCategoryCourses(category._id, category.name);
    };

    // Check if current route matches the provided route path
    const matchRoute = (route) => {
        if (!route) return false;
        return matchPath({ path: route }, location.pathname);
    };

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
                                                        loadingSubLinks ? (
                                                            <div className="text-richblack-400 text-sm py-2">
                                                                Loading categories...
                                                            </div>
                                                        ) : subLinks.length > 0 ? (
                                                            subLinks.map((subLink, index) => {
                                                                const isLoading = loadingCategories[subLink._id];
                                                                return (
                                                                    <div 
                                                                        key={subLink._id || index}
                                                                        onClick={(e) => handleCategoryClick(e, subLink)}
                                                                        className="hover:text-richblack-900 transition-colors cursor-pointer flex items-center justify-between"
                                                                    >
                                                                        <p>{subLink.name}</p>
                                                                        {isLoading && (
                                                                            <span className="text-xs text-richblack-400">
                                                                                Loading...
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })
                                                        ) : (
                                                            <div className="text-richblack-400 text-sm">
                                                                No categories available
                                                            </div>
                                                        )
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
                                {NavbarLinks.map((link, index) => (
                                    <li key={index}>
                                        {link.title === "Catalog" ? (
                                            <div>
                                                <button
                                                    className="w-full flex items-center justify-between text-richblack-25"
                                                    onClick={() => setMobileCatalogOpen((prev) => !prev)}
                                                    aria-expanded={mobileCatalogOpen}
                                                    aria-controls="mobile-catalog-submenu"
                                                >
                                                    <span>{link.title}</span>
                                                    <FaAngleDown className={`transition-transform ${mobileCatalogOpen ? 'rotate-180' : ''}`} />
                                                </button>
                                                {mobileCatalogOpen && (
                                                    <div id="mobile-catalog-submenu" className="mt-2 pl-3 flex flex-col gap-2">
                                                        {loadingSubLinks ? (
                                                            <div className="text-richblack-400 text-sm py-2">Loading categories...</div>
                                                        ) : subLinks.length > 0 ? (
                                                            subLinks.map((subLink) => {
                                                                const isLoading = loadingCategories[subLink._id]
                                                                return (
                                                                    <button
                                                                        key={subLink._id}
                                                                        onClick={(e) => {
                                                                            handleCategoryClick(e, subLink)
                                                                            setMobileMenu(false)
                                                                        }}
                                                                        className="text-left text-richblack-300 hover:text-richblack-25"
                                                                    >
                                                                        {subLink.name}
                                                                        {isLoading && (
                                                                            <span className="ml-2 text-xs text-richblack-400">Loading...</span>
                                                                        )}
                                                                    </button>
                                                                )
                                                            })
                                                        ) : (
                                                            <div className="text-richblack-400 text-sm">No categories available</div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            link.path ? (
                                                <Link
                                                    to={link.path}
                                                    onClick={() => setMobileMenu(false)}
                                                    className={`${matchRoute(link.path) ? 'text-yellow-25' : 'text-richblack-25'}`}
                                                >
                                                    {link.title}
                                                </Link>
                                            ) : null
                                        )}
                                    </li>
                                ))}
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
                                            <Link to="/dashboard/cart" onClick={() => setMobileMenu(false)} className='flex items-center gap-2 text-richblack-25 relative'>
                                                <CiShoppingCart size={40} />
                                                {totalItems > 0 && (
                                                    <span className="absolute -top-1 -right-1 bg-yellow-50 text-richblack-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold">
                                                        {totalItems}
                                                    </span>
                                                )}
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
                                <CiShoppingCart   size={32}/>
                                {totalItems > 0 && (
                                    <span className="absolute -top-1 -right-2 bg-yellow-50 text-richblack-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold">
                                        {totalItems}
                                    </span>
                                )}
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
