"use client"

import type React from "react"
import {useEffect, useState} from "react"
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
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {Check, ChevronsUpDown, Plus, Trash2, User, UserPlus} from "lucide-react"
import {cn} from "@/lib/utils"
import {api} from "@/trpc/react"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {countries} from "@/lib/countries"

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
    material: string
    size: string
}

interface Customer {
    id: number
    name: string
    surname: string
    email: string
    company: string | null
    contact: string
    country: string
    cargoAddress: string
    billingAddress: string
    ico: number | null
    dico: string | null
    deletedAt?: Date | null
}

export function CreateOrderModal({isOpen, onClose, onSubmit}: CreateOrderModalProps) {
    const allCustomerQuery = api.customer.getAllCustomer.useQuery()
    const createCustomerMutation = api.customer.createCustomer.useMutation({
        onSuccess: () => allCustomerQuery.refetch(),
    });
    const {data} = allCustomerQuery
    const customers: Customer[] = data?.data || []
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
    const [customerSearchOpen, setCustomerSearchOpen] = useState(false)
    const [showCreateCustomer, setShowCreateCustomer] = useState(false)
    const [newCustomer, setNewCustomer] = useState<Customer>({
        id: 0,
        name: "",
        surname: "",
        email: "",
        company: "",
        contact: "",
        country: "",
        dico: '',
        ico: 0,
        cargoAddress: "",
        billingAddress: "",
    })
    const [items, setItems] = useState<OrderItem[]>([{
        id: "1",
        name: "",
        price: 0,
        quantity: 1,
        size: "",
        material: ""
    }])
    const [notes, setNotes] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isCreatingCustomer, setIsCreatingCustomer] = useState(false)

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setSelectedCustomer(null)
            setShowCreateCustomer(false)
            setNewCustomer({
                id: 0,
                name: "",
                surname: "",
                email: "",
                company: "",
                contact: "",
                country: "",
                cargoAddress: "",
                ico: null,
                dico: null,
                billingAddress: "",
            })
            setItems([{id: "1", name: "", price: 0, quantity: 1, size: "", material: ""}])
            setNotes("")
        }
    }, [isOpen])

    const addItem = () => {
        const newItem: OrderItem = {
            id: Date.now().toString(),
            name: "",
            price: 0,
            size: "",
            material: "",
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

    const handleCreateCustomer = async () => {
        if (!newCustomer.name || !newCustomer.surname || !newCustomer.email || !newCustomer.company) return
        const {id, ...payload} = newCustomer
        setIsCreatingCustomer(true)

        try {
            await createCustomerMutation.mutateAsync(payload);
            setShowCreateCustomer(false)
            setNewCustomer({
                id: 0,
                name: "",
                surname: "",
                email: "",
                company: "",
                contact: "",
                ico: null,
                dico: null,
                country: "",
                cargoAddress: "",
                billingAddress: "",
            })
        } catch (error) {
            console.error("Failed to create customer:", error)
        } finally {
            setIsCreatingCustomer(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedCustomer) return

        setIsLoading(true)

        const orderData = {
            customerId: selectedCustomer.id,
            products: items.filter((item) => item.name && item.price > 0),
            notes,
            total: calculateTotal(),
        }
        // console.log(orderData)
        //
        try {
            await onSubmit(orderData)
            onClose()
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
                    {/* Customer Selection */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Customer</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {!showCreateCustomer ? (
                                <>
                                    <div className="space-y-2">
                                        <Label>Select customer</Label>
                                        <Popover modal={true} open={customerSearchOpen}
                                                 onOpenChange={setCustomerSearchOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={customerSearchOpen}
                                                    className="w-full justify-between h-10 bg-transparent"
                                                >
                                                    {selectedCustomer ? (
                                                        <div className="flex items-center gap-2">
                                                            <User className="w-4 h-4"/>
                                                            <span className="truncate">
                                                                {selectedCustomer.name} {selectedCustomer.surname}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        "Select customer..."
                                                    )}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full p-0 z-[9999999999]" align="start">
                                                <Command>
                                                    <CommandInput placeholder="Search customers..." className="h-9"/>
                                                    <CommandList>
                                                        <CommandEmpty>
                                                            <div className="text-center py-6">
                                                                <p className="text-sm text-muted-foreground mb-3">No
                                                                    customers found.</p>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        setShowCreateCustomer(true)
                                                                        setCustomerSearchOpen(false)
                                                                    }}
                                                                >
                                                                    <UserPlus className="w-4 h-4 mr-2"/>
                                                                    Create new customer
                                                                </Button>
                                                            </div>
                                                        </CommandEmpty>
                                                        <CommandGroup>
                                                            {customers.map((customer) => (
                                                                <CommandItem
                                                                    key={customer.id}
                                                                    value={`${customer.name} ${customer.surname} ${customer.email} ${customer.company}`}
                                                                    onSelect={() => {
                                                                        setSelectedCustomer(customer)
                                                                        setCustomerSearchOpen(false)
                                                                    }}
                                                                    className="flex items-center gap-3 p-3 cursor-pointer hover:bg-accent hover:text-accent-foreground"
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "h-4 w-4 shrink-0",
                                                                            selectedCustomer?.id === customer.id ? "opacity-100" : "opacity-0",
                                                                        )}
                                                                    />
                                                                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                                                                        <span className="font-medium text-sm truncate">
                                                                          {customer.name} {customer.surname}
                                                                        </span>
                                                                        <span
                                                                            className="text-xs text-muted-foreground truncate">
                                                                            {customer.company} • {customer.email}
                                                                        </span>
                                                                    </div>
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                        <CommandGroup>
                                                            <CommandItem
                                                                onSelect={() => {
                                                                    setShowCreateCustomer(true)
                                                                    setCustomerSearchOpen(false)
                                                                }}
                                                                className="flex items-center gap-3 p-3 cursor-pointer hover:bg-accent hover:text-accent-foreground border-t"
                                                            >
                                                                <UserPlus className="h-4 w-4 shrink-0"/>
                                                                <span className="text-sm font-medium">Create new customer</span>
                                                            </CommandItem>
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    {selectedCustomer && (
                                        <div className="p-4 bg-muted/50 rounded-lg">
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span
                                                        className="font-medium">Company:</span> {selectedCustomer.company}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Email:</span> {selectedCustomer.email}
                                                </div>
                                                {selectedCustomer.contact && (
                                                    <div>
                                                        <span
                                                            className="font-medium">Contact:</span> {selectedCustomer.contact}
                                                    </div>
                                                )}
                                                {selectedCustomer.country && (
                                                    <div>
                                                        <span className="font-medium">Country:</span>{" "}
                                                        {countries.find((c) => c.id.toString() === selectedCustomer.country)?.name ||
                                                            selectedCustomer.country}
                                                    </div>
                                                )}
                                                {selectedCustomer.cargoAddress && (
                                                    <div className="col-span-2">
                                                        <span
                                                            className="font-medium">Cargo Address:</span> {selectedCustomer.cargoAddress}
                                                    </div>
                                                )}
                                                {selectedCustomer.billingAddress && (
                                                    <div className="col-span-2">
                                                        <span
                                                            className="font-medium">Billing Address:</span> {selectedCustomer.billingAddress}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-base font-medium">Create new customer</Label>
                                        <Button type="button" variant="ghost" size="sm"
                                                onClick={() => setShowCreateCustomer(false)}>
                                            Cancel
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="new-customer-name">Name *</Label>
                                            <Input
                                                id="new-customer-name"
                                                value={newCustomer.name}
                                                onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                                                placeholder="Enter customer name"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="new-customer-surname">Surname *</Label>
                                            <Input
                                                id="new-customer-surname"
                                                value={newCustomer.surname}
                                                onChange={(e) =>
                                                    setNewCustomer({
                                                        ...newCustomer,
                                                        surname: e.target.value,
                                                    })
                                                }
                                                placeholder="Enter customer surname"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="new-customer-email">Email *</Label>
                                            <Input
                                                id="new-customer-email"
                                                type="email"
                                                value={newCustomer.email}
                                                onChange={(e) =>
                                                    setNewCustomer({
                                                        ...newCustomer,
                                                        email: e.target.value,
                                                    })
                                                }
                                                placeholder="customer@example.com"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="new-customer-company">Company *</Label>
                                            <Input
                                                id="new-customer-company"
                                                value={newCustomer?.company ?? ''}
                                                onChange={(e) =>
                                                    setNewCustomer({
                                                        ...newCustomer,
                                                        company: e.target.value,
                                                    })
                                                }
                                                placeholder="Company name"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="new-customer-contact">Contact</Label>
                                            <Input
                                                id="new-customer-contact"
                                                value={newCustomer.contact}
                                                onChange={(e) =>
                                                    setNewCustomer({
                                                        ...newCustomer,
                                                        contact: e.target.value,
                                                    })
                                                }
                                                placeholder="+1 (555) 123-4567"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="new-customer-country">Country</Label>
                                            <Select
                                                value={newCustomer.country}
                                                onValueChange={(value) => setNewCustomer({
                                                    ...newCustomer,
                                                    country: value
                                                })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select country"/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {countries.map((country) => (
                                                        <SelectItem key={country.id} value={country.id.toString()}>
                                                            {country.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {newCustomer.country == "44" && (
                                            <>
                                                <div className="space-y-2">
                                                    <Label htmlFor="new-customer-ico">Ico</Label>
                                                    <Input
                                                        id="new-customer-ico"
                                                        value={newCustomer.ico ?? 0}
                                                        onChange={(e) =>
                                                            setNewCustomer({
                                                                ...newCustomer,
                                                                ico: Number(e.target.value),
                                                            })
                                                        }
                                                        placeholder="000000"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="new-customer-dico">Dico</Label>
                                                    <Input
                                                        id="new-customer-dico"
                                                        value={newCustomer.dico ?? ''}
                                                        onChange={(e) =>
                                                            setNewCustomer({
                                                                ...newCustomer,
                                                                dico: e.target.value,
                                                            })
                                                        }
                                                        placeholder="AB000000"
                                                    />
                                                </div>
                                            </>
                                        )}
                                        <div className="space-y-2">
                                            <Label htmlFor="new-customer-cargo-address">Cargo address</Label>
                                            <Input
                                                id="new-customer-cargo-address"
                                                value={newCustomer.cargoAddress}
                                                onChange={(e) =>
                                                    setNewCustomer({
                                                        ...newCustomer,
                                                        cargoAddress: e.target.value,
                                                    })
                                                }
                                                placeholder="123 Main St, City, State"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="new-customer-billing-address">Billing Address</Label>
                                            <Input
                                                id="new-customer-billing-address"
                                                value={newCustomer.billingAddress}
                                                onChange={(e) =>
                                                    setNewCustomer({
                                                        ...newCustomer,
                                                        billingAddress: e.target.value,
                                                    })
                                                }
                                                placeholder="123 Main St, City, State"
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        onClick={handleCreateCustomer}
                                        disabled={
                                            !newCustomer.name ||
                                            !newCustomer.surname ||
                                            !newCustomer.email ||
                                            !newCustomer.company ||
                                            isCreatingCustomer
                                        }
                                        className="w-full"
                                    >
                                        {isCreatingCustomer ? "Creating..." : "Create Customer"}
                                    </Button>
                                </div>
                            )}
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
                                        <div className="col-span-4 space-y-2">
                                            <Label>Quantity</Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => updateItem(item.id, "quantity", Number.parseInt(e.target.value) || 1)}
                                            />
                                        </div>
                                        <div className="col-span-4 space-y-2">
                                            <Label>Product Size</Label>
                                            <Input
                                                value={item.size}
                                                onChange={(e) => updateItem(item.id, "size", e.target.value)}
                                                placeholder="Enter product size"
                                            />
                                        </div>

                                        <div className="col-span-4 space-y-2">
                                            <Label>Product Material</Label>
                                            <Input
                                                value={item.material}
                                                onChange={(e) => updateItem(item.id, "material", e.target.value)}
                                                placeholder="Enter product material"
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
                        <Button type="submit" className="bg-green-600 hover:bg-green-700"
                                disabled={isLoading || !selectedCustomer}>
                            {isLoading ? "Creating..." : "Create order"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
