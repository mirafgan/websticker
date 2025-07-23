"use client"

import type React from "react"

import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Textarea} from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Separator} from "@/components/ui/separator"
import {Plus, Trash2} from "lucide-react"

interface CreateOrderModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: any) => void
}

interface OrderItem {
    id: string
    name: string
    price: number
    quantity: number
}

export function CreateOrderModal({isOpen, onClose, onSubmit}: CreateOrderModalProps) {
    const [customer, setCustomer] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [items, setItems] = useState<OrderItem[]>([{id: "1", name: "", price: 0, quantity: 1}])
    const [notes, setNotes] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const addItem = () => {
        const newItem: OrderItem = {
            id: Date.now().toString(),
            name: "",
            price: 0,
            quantity: 1,
        }
        setItems([...items, newItem])
    }

    const removeItem = (id: string) => {
        setItems(items.filter((item) => item.id !== id))
    }

    const updateItem = (id: string, field: keyof OrderItem, value: any) => {
        setItems(items.map((item) => (item.id === id ? {...item, [field]: value} : item)))
    }

    const calculateTotal = () => {
        return items.reduce((total, item) => total + item.price * item.quantity, 0)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        const orderData = {
            name: "LED MENU",
            customerId: 1,
            quantity: 2,
            price: 50,
            size: "50*60",
            material: "Sink",
            notes: "test notes",
            address,
        }

        try {
            await onSubmit(orderData)
            // Reset form
            setCustomer("")
            setEmail("")
            setPhone("")
            setAddress("")
            setItems([{id: "1", name: "", price: 0, quantity: 1}])
            setNotes("")
        } catch (error) {
            console.error("Failed to create order:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create order</DialogTitle>
                    <DialogDescription>Add a new order to your store</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Customer Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Customer</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="customer">Customer name</Label>
                                    <Input
                                        id="customer"
                                        value={customer}
                                        onChange={(e) => setCustomer(e.target.value)}
                                        placeholder="Enter customer name"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="customer@example.com"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="+1 (555) 123-4567"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input
                                        id="address"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="123 Main St, City, State"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Products */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Products</CardTitle>
                                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                                    <Plus className="w-4 h-4 mr-2"/>
                                    Add item
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {items.map((item, index) => (
                                <div key={item.id} className="space-y-4">
                                    <div className="grid grid-cols-12 gap-4 items-end">
                                        <div className="col-span-5 space-y-2">
                                            <Label>Product name</Label>
                                            <Input
                                                value={item.name}
                                                onChange={(e) => updateItem(item.id, "name", e.target.value)}
                                                placeholder="Enter product name"
                                            />
                                        </div>
                                        <div className="col-span-3 space-y-2">
                                            <Label>Price</Label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={item.price}
                                                onChange={(e) => updateItem(item.id, "price", Number.parseFloat(e.target.value) || 0)}
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div className="col-span-2 space-y-2">
                                            <Label>Quantity</Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => updateItem(item.id, "quantity", Number.parseInt(e.target.value) || 1)}
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            {items.length > 1 && (
                                                <Button type="button" variant="outline" size="sm"
                                                        onClick={() => removeItem(item.id)}>
                                                    <Trash2 className="w-4 h-4"/>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    {index < items.length - 1 && <Separator/>}
                                </div>
                            ))}

                            <div className="flex justify-end pt-4">
                                <div className="text-lg font-semibold">Total: ${calculateTotal().toFixed(2)}</div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notes */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add any additional notes for this order..."
                                rows={3}
                            />
                        </CardContent>
                    </Card>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isLoading}>
                            {isLoading ? "Creating..." : "Create order"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
