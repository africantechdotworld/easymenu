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
    const [categoryForm, setCategoryForm] = useState({
        name: '',
        image: null,
        preview: null
    });
    const [itemForm, setItemForm] = useState({
        name: '',
        description: '',
        price: '',
        image: null,
        preview: null
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

    const handleCategoryFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCategoryForm({
                ...categoryForm,
                image: file,
                preview: URL.createObjectURL(file)
            });
        }
    };

    const handleItemFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setItemForm({
                ...itemForm,
                image: file,
                preview: URL.createObjectURL(file)
            });
        }
    };

    const handleSaveCategory = async () => {
        if (!categoryForm.name) return;

        const payload = {
            name: categoryForm.name,
            image: categoryForm.image
        };

        const action = editingCategory ? updateCategory(editingCategory._id, payload) : createCategory(payload);
        const result = await action;

        if (result.success) {
            toast({ title: editingCategory ? "Category Updated" : "Category Created" });
            const catRes = await getMenuCategories(restaurantId);
            setCategories(catRes.data);
            setIsCategoryDialogOpen(false);
            setCategoryForm({ name: '', image: null, preview: null });
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
            setItemForm({ name: '', description: '', price: '', image: null, preview: null });
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

    const getImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        return `http://localhost:5000${url}`;
    };

    if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Menu Management</h1>
                    <p className="text-xs text-slate-500">Create and organize your digital menu</p>
                </div>
                <Button size="sm" onClick={() => { setEditingCategory(null); setCategoryForm({ name: '', image: null, preview: null }); setIsCategoryDialogOpen(true); }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Category
                </Button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Categories List */}
                <div className="w-full lg:w-72 flex-shrink-0 space-y-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-4">Categories</p>
                    {categories.map((cat) => (
                        <div
                            key={cat._id}
                            className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${selectedCategory?._id === cat._id
                                ? 'bg-primary text-white shadow-md'
                                : 'hover:bg-white hover:shadow-sm text-slate-600'
                                }`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            <div className="w-10 h-10 rounded-lg bg-slate-100/20 overflow-hidden flex-shrink-0 border border-white/10">
                                {cat.imageUrl ? (
                                    <img src={getImageUrl(cat.imageUrl)} alt={cat.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-4 h-4 opacity-40" /></div>
                                )}
                            </div>
                            <span className="font-medium truncate flex-1">{cat.name}</span>
                            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingCategory(cat);
                                        setCategoryForm({ name: cat.name, image: null, preview: getImageUrl(cat.imageUrl) });
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
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shadow-sm">
                                            {selectedCategory.imageUrl ? (
                                                <img src={getImageUrl(selectedCategory.imageUrl)} alt={selectedCategory.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-5 h-5 text-slate-300" /></div>
                                            )}
                                        </div>
                                        <h2 className="text-xl font-bold">{selectedCategory.name}</h2>
                                    </div>
                                    <Button size="sm" onClick={() => {
                                        setEditingItem(null);
                                        setItemForm({ name: '', description: '', price: '', image: null, preview: null });
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
                                                <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-50 shadow-inner">
                                                    {item.imageUrl ? (
                                                        <img src={getImageUrl(item.imageUrl)} alt={item.name} className="w-full h-full object-cover" />
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
                                                                setItemForm({
                                                                    name: item.name,
                                                                    description: item.description,
                                                                    price: item.price,
                                                                    image: null,
                                                                    preview: getImageUrl(item.imageUrl)
                                                                });
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
                                            <div className="col-span-full py-12 text-center opacity-40">
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
                    <div className="py-4 space-y-6">
                        <div className="space-y-3">
                            <Label className="font-semibold">Category Image</Label>
                            <div className="relative group w-full h-32 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
                                {categoryForm.preview ? (
                                    <img src={categoryForm.preview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <ImageIcon className="w-8 h-8 text-slate-200" />
                                )}
                                <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <span className="text-white text-xs font-bold">Select Image</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleCategoryFileChange} />
                                </label>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="font-semibold text-slate-700">Category Name</Label>
                            <Input
                                value={categoryForm.name}
                                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                                placeholder="e.g. Main Course, Drinks"
                                className="h-11 rounded-xl"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)} className="rounded-xl">Cancel</Button>
                        <Button onClick={handleSaveCategory} className="rounded-xl shadow-lg shadow-primary/20">Save Category</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Item Dialog */}
            <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader><DialogTitle>{editingItem ? 'Edit Dish' : 'Add New Dish'}</DialogTitle></DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="space-y-3">
                            <Label className="font-semibold">Dish Image</Label>
                            <div className="relative group w-full h-40 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
                                {itemForm.preview ? (
                                    <img src={itemForm.preview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <ImageIcon className="w-8 h-8 text-slate-200" />
                                )}
                                <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <span className="text-white text-xs font-bold">Select Image</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleItemFileChange} />
                                </label>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 col-span-2">
                                <Label className="font-semibold">Dish Name</Label>
                                <Input value={itemForm.name} onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })} placeholder="Margherita Pizza" className="h-11 rounded-xl" />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label className="font-semibold">Price ($)</Label>
                                <Input type="number" value={itemForm.price} onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })} placeholder="12.99" className="h-11 rounded-xl" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="font-semibold">Description</Label>
                            <Textarea value={itemForm.description} onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })} placeholder="Describe your delicious dish..." className="rounded-xl resize-none" rows={3} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsItemDialogOpen(false)} className="rounded-xl">Cancel</Button>
                        <Button onClick={handleSaveItem} className="rounded-xl shadow-lg shadow-primary/20">Save Dish</Button>
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
