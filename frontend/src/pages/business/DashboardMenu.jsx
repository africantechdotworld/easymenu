import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    MoreVertical,
    Edit2,
    Trash2,
    GripVertical,
    ChevronDown,
    Eye,
    Image as ImageIcon,
    Loader2,
    Check
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    getAuthProfile,
    getMenuCategories,
    getMenuItemsByCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem
} from '@/lib/api';
import { useToast } from "@/hooks/use-toast";

const DashboardMenu = () => {
    const { toast } = useToast();
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [itemsLoading, setItemsLoading] = useState(false);
    const [restaurantId, setRestaurantId] = useState(null);

    // Dialog States
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [editingItem, setEditingItem] = useState(null);

    // Form States
    const [categoryName, setCategoryName] = useState('');
    const [itemForm, setItemForm] = useState({
        name: '',
        description: '',
        price: '',
        image: null
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            const profileRes = await getAuthProfile();
            if (profileRes.success) {
                const restId = profileRes.data._id;
                setRestaurantId(restId);
                const catRes = await getMenuCategories(restId);
                if (catRes.success) {
                    setCategories(catRes.data);
                    if (catRes.data.length > 0) {
                        setSelectedCategory(catRes.data[0]);
                    }
                }
            }
            setLoading(false);
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        const fetchItems = async () => {
            if (selectedCategory) {
                setItemsLoading(true);
                const res = await getMenuItemsByCategory(selectedCategory._id);
                if (res.success) {
                    setItems(res.data);
                }
                setItemsLoading(false);
            }
        };
        fetchItems();
    }, [selectedCategory]);

    const handleSaveCategory = async () => {
        if (!categoryName) return;

        const action = editingCategory ? updateCategory(editingCategory._id, { name: categoryName }) : createCategory({ name: categoryName });
        const result = await action;

        if (result.success) {
            toast({ title: editingCategory ? "Category Updated" : "Category Created" });
            const catRes = await getMenuCategories(restaurantId);
            setCategories(catRes.data);
            setIsCategoryDialogOpen(false);
            setCategoryName('');
            setEditingCategory(null);
        }
    };

    const handleDeleteCategory = async (id) => {
        if (window.confirm("Are you sure? This will delete all items in this category.")) {
            const result = await deleteCategory(id);
            if (result.success) {
                toast({ title: "Category deleted" });
                const catRes = await getMenuCategories(restaurantId);
                setCategories(catRes.data);
                if (selectedCategory?._id === id) {
                    setSelectedCategory(catRes.data[0] || null);
                }
            }
        }
    };

    const handleSaveItem = async () => {
        const payload = {
            ...itemForm,
            categoryId: selectedCategory._id
        };

        const action = editingItem ? updateMenuItem(editingItem._id, payload) : createMenuItem(payload);
        const result = await action;

        if (result.success) {
            toast({ title: editingItem ? "Item Updated" : "Item Added" });
            const itemsRes = await getMenuItemsByCategory(selectedCategory._id);
            setItems(itemsRes.data);
            setIsItemDialogOpen(false);
            setItemForm({ name: '', description: '', price: '', image: null });
            setEditingItem(null);
        }
    };

    const handleDeleteItem = async (id) => {
        if (window.confirm("Delete this item?")) {
            const result = await deleteMenuItem(id);
            if (result.success) {
                setItems(items.filter(i => i._id !== id));
                toast({ title: "Item deleted" });
            }
        }
    };

    if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Menu Management</h1>
                    <p className="text-xs text-slate-500">Create and organize your digital menu</p>
                </div>
                <Button size="sm" onClick={() => { setEditingCategory(null); setCategoryName(''); setIsCategoryDialogOpen(true); }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Category
                </Button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Categories List */}
                <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-4">Categories</p>
                    {categories.map((cat) => (
                        <div
                            key={cat._id}
                            className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${selectedCategory?._id === cat._id
                                ? 'bg-primary text-white shadow-md'
                                : 'hover:bg-white hover:shadow-sm text-slate-600'
                                }`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            <span className="font-medium truncate">{cat.name}</span>
                            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingCategory(cat);
                                        setCategoryName(cat.name);
                                        setIsCategoryDialogOpen(true);
                                    }}
                                    className="p-1 hover:bg-white/20 rounded"
                                >
                                    <Edit2 className="w-3 h-3" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat._id); }}
                                    className="p-1 hover:bg-white/20 rounded text-red-200"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Items List */}
                <div className="flex-1">
                    {selectedCategory ? (
                        <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold">{selectedCategory.name}</h2>
                                    <Button size="sm" onClick={() => {
                                        setEditingItem(null);
                                        setItemForm({ name: '', description: '', price: '', image: null });
                                        setIsItemDialogOpen(true);
                                    }}>
                                        <Plus className="w-4 h-4 mr-1" />
                                        Add Dish
                                    </Button>
                                </div>

                                {itemsLoading ? (
                                    <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-slate-300" /></div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {items.map((item) => (
                                            <div
                                                key={item._id}
                                                className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-white hover:border-primary/30 transition-colors group"
                                            >
                                                <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-50 flex-shrink-0">
                                                    {item.image ? (
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-6 h-6 text-slate-200" /></div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between">
                                                        <h4 className="font-bold truncate">{item.name}</h4>
                                                        <span className="font-bold text-primary">${item.price}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{item.description}</p>
                                                    <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 text-[10px]"
                                                            onClick={() => {
                                                                setEditingItem(item);
                                                                setItemForm({ name: item.name, description: item.description, price: item.price, image: null });
                                                                setIsItemDialogOpen(true);
                                                            }}
                                                        >
                                                            <Edit2 className="w-3 h-3 mr-1" /> Edit
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 text-[10px] text-red-500 hover:text-red-600 hover:bg-red-50"
                                                            onClick={() => handleDeleteItem(item._id)}
                                                        >
                                                            <Trash2 className="w-3 h-3 mr-1" /> Delete
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {items.length === 0 && (
                                            <div className="col-span-full py-12 text-center">
                                                <Utensils className="w-12 h-12 text-slate-100 mx-auto mb-3" />
                                                <p className="text-slate-400">No items in this category yet.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                            <Plus className="w-12 h-12 text-slate-200 mb-4" />
                            <h3 className="text-lg font-bold text-slate-800">No Categories Yet</h3>
                            <p className="text-slate-500 max-w-xs mt-2">Start by creating your first menu category to add dishes.</p>
                            <Button className="mt-6" onClick={() => setIsCategoryDialogOpen(true)}>Create Category</Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Category Dialog */}
            <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{editingCategory ? 'Edit Category' : 'New Category'}</DialogTitle></DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <Label>Category Name</Label>
                            <Input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="e.g. Main Course, Drinks" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveCategory}>Save Category</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Item Dialog */}
            <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader><DialogTitle>{editingItem ? 'Edit Dish' : 'Add New Dish'}</DialogTitle></DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <Label>Dish Name</Label>
                            <Input value={itemForm.name} onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })} placeholder="Margherita Pizza" />
                        </div>
                        <div className="space-y-2">
                            <Label>Price ($)</Label>
                            <Input type="number" value={itemForm.price} onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })} placeholder="12.99" />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea value={itemForm.description} onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })} placeholder="Describe your delicious dish..." />
                        </div>
                        <div className="space-y-2">
                            <Label>Image</Label>
                            <Input type="file" onChange={(e) => setItemForm({ ...itemForm, image: e.target.files[0] })} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsItemDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveItem}>Save Dish</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

const Utensils = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
);

export default DashboardMenu;
