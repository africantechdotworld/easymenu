import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    X,
    ChevronLeft,
    Tag,
    Grid3X3,
    ChevronRight
} from 'lucide-react';
import { getMenuCategories, getMenuItemsByCategory } from '@/lib/api';

const SearchView = ({
    isOpen,
    onClose,
    restaurantId,
    restaurantName,
    onMenuClick,
    onCategoryClick
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [categories, setCategories] = useState([]);
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(false);
    const searchInputRef = useRef(null);

    // Fetch data when component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const categoriesResult = await getMenuCategories(restaurantId);
                let menusResult = [];

                if (categoriesResult.success) {
                    setCategories(categoriesResult.data);

                    // Fetch all menus across categories
                    menusResult = await Promise.all(
                        categoriesResult.data.map(category => getMenuItemsByCategory(category.id))
                    );
                }

                if (categoriesResult.success) {
                    setCategories(categoriesResult.data);
                }

                // Combine all menus from different categories
                const allMenus = menusResult.flatMap(result =>
                    result.success ? result.data : []
                );
                setMenus(allMenus);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (isOpen) {
            fetchData();
        }
    }, [restaurantId, isOpen]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            //searchInputRef.current.focus();
        }
    }, [isOpen]);

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredMenus = menus.filter(menu =>
        menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        menu.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filters = [
        { id: 'all', label: 'All' },
        { id: 'menus', label: 'Menus' },
        { id: 'categories', label: 'Categories' }
    ];

    const renderResults = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 rounded-full animate-spin border-primary border-t-transparent" />
                </div>
            );
        }

        if (searchQuery.trim() === '') {
            return (
                <div className="py-8 text-center text-muted-foreground">
                    Start typing to search {restaurantName}
                </div>
            );
        }

        if (activeFilter === 'all') {
            return (
                <>
                    {filteredCategories.length > 0 && (
                        <div className="mb-6">
                            <h3 className="px-4 mb-2 text-sm font-semibold text-muted-foreground">Categories</h3>
                            {filteredCategories.map(category => (
                                <div
                                    key={category.id}
                                    className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted/50"
                                    onClick={() => onCategoryClick(category.id)}
                                >
                                    <div className="flex items-center gap-3">
                                        <Grid3X3 className="w-5 h-5 text-muted-foreground" />
                                        <span>{category.name}</span>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                                </div>
                            ))}
                        </div>
                    )}

                    {filteredMenus.length > 0 && (
                        <div>
                            <h3 className="px-4 mb-2 text-sm font-semibold text-muted-foreground">Menu Items</h3>
                            {filteredMenus.map(menu => (
                                <div
                                    key={menu.id}
                                    className="flex gap-4 px-4 py-3 cursor-pointer hover:bg-muted/50"
                                    onClick={() => onMenuClick(menu.categoryId, menu.id)}
                                >
                                    <div className="flex-shrink-0 w-16 h-16 overflow-hidden rounded-lg">
                                        <img
                                            src={menu.image || "/api/placeholder/64/64"}
                                            alt={menu.name}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium">{menu.name}</h4>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {menu.description}
                                        </p>
                                        <p className="mt-1 text-sm font-medium">
                                            ${menu.price}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {filteredCategories.length === 0 && filteredMenus.length === 0 && (
                        <div className="py-8 text-center text-muted-foreground">
                            No results found for "{searchQuery}"
                        </div>
                    )}
                </>
            );
        }

        if (activeFilter === 'categories') {
            return filteredCategories.length > 0 ? (
                filteredCategories.map(category => (
                    <div
                        key={category.id}
                        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted/50"
                        onClick={() => onCategoryClick(category.id)}
                    >
                        <div className="flex items-center gap-3">
                            <Grid3X3 className="w-5 h-5 text-muted-foreground" />
                            <span>{category.name}</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                ))
            ) : (
                <div className="py-8 text-center text-muted-foreground">
                    No categories found
                </div>
            );
        }

        if (activeFilter === 'menus') {
            return filteredMenus.length > 0 ? (
                filteredMenus.map(menu => (
                    <div
                        key={menu.id}
                        className="flex gap-4 px-4 py-3 cursor-pointer hover:bg-muted/50"
                        onClick={() => onMenuClick(menu.categoryId, menu.id)}
                    >
                        <div className="flex-shrink-0 w-16 h-16 overflow-hidden rounded-lg">
                            <img
                                src={menu.image || "/api/placeholder/64/64"}
                                alt={menu.name}
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-medium">{menu.name}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {menu.description}
                            </p>
                            <p className="mt-1 text-sm font-medium">
                                ${menu.price}
                            </p>
                        </div>
                    </div>
                ))
            ) : (
                <div className="py-8 text-center text-muted-foreground">
                    No menu items found
                </div>
            );
        }
    };

    return (
        <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-50 flex flex-col bg-background"
        >
            {/* Header */}
            <div className="border-b">
                <div className="flex items-center gap-2 p-4">
                    <button
                        onClick={onClose}
                        className="p-2 -m-2 rounded-full hover:bg-muted"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div className="relative flex-1">
                        <Search className="absolute w-5 h-5 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder={`Search ${restaurantName}`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full py-2 pl-10 pr-4 rounded-full bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute p-1 -translate-y-1/2 rounded-full right-3 top-1/2 hover:bg-background"
                            >
                                <X className="w-4 h-4 text-muted-foreground" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-2 px-4 pb-4">
                    {filters.map(filter => (
                        <button
                            key={filter.id}
                            onClick={() => setActiveFilter(filter.id)}
                            className={`px-4 py-1 rounded-full text-sm ${activeFilter === filter.id
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-auto">
                {renderResults()}
            </div>
        </motion.div>
    );
};

export default SearchView;