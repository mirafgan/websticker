"use client"

import React, {useEffect, useState} from "react"
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {countries} from "@/lib/countries"
import type {Customer} from "@/generated/prisma/client";

interface CreateCustomerModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (customerData: CustomerFormData) => Promise<void>
    editCustomerData: Customer | null
}

interface CustomerFormData {
    name: string
    surname: string
    email: string
    ico: number | null
    dico: string | null
    billingAddress: string
    cargoAddress: string
    company: string
    contact: string
    country: string
}

const initialFormData = {
    name: "",
    surname: "",
    email: "",
    ico: null,
    dico: "",
    billingAddress: "",
    cargoAddress: "",
    company: "",
    contact: "",
    country: "",
}

export function CustomerMutationModal({isOpen, onClose, onSubmit, editCustomerData}: CreateCustomerModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState<CustomerFormData>(initialFormData)

    const handleInputChange = (field: keyof CustomerFormData, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    };

    useEffect(() => {
        if (editCustomerData) {
            setFormData({
                ...editCustomerData,
                ico: editCustomerData.ico,
                company: editCustomerData.company ?? ''
            })
        } else setFormData(initialFormData)
    }, [editCustomerData]);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.name || !formData.surname || !formData.email) {
            alert("Please fill in required fields: Name, Surname, and Email")
            return
        }

        setIsSubmitting(true)
        try {
            await onSubmit(formData)
            // Reset form
            setFormData({
                name: "",
                surname: "",
                email: "",
                ico: 0,
                dico: "",
                billingAddress: "",
                cargoAddress: "",
                company: "",
                contact: "",
                country: "",
            })
            onClose()
        } catch (error) {
            console.error("Failed to create customer:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{editCustomerData ? "Update Customer" : "Create New Customer"} </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                placeholder="Enter customer name"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="surname">Surname *</Label>
                            <Input
                                id="surname"
                                value={formData.surname}
                                onChange={(e) => handleInputChange("surname", e.target.value)}
                                placeholder="Enter customer surname"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            placeholder="Enter customer email"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input
                            id="company"
                            value={formData.company}
                            onChange={(e) => handleInputChange("company", e.target.value)}
                            placeholder="Enter company name"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="contact">Contact</Label>
                        <Input
                            id="contact"
                            value={formData.contact}
                            onChange={(e) => handleInputChange("contact", e.target.value)}
                            placeholder="Enter contact information"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="billingAddress">Billing Address</Label>
                        <Input
                            id="billingAddress"
                            value={formData.billingAddress}
                            onChange={(e) => handleInputChange("billingAddress", e.target.value)}
                            placeholder="Enter billing address"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="cargoAddress">Cargo Address</Label>
                        <Input
                            id="cargoAddress"
                            value={formData.cargoAddress}
                            onChange={(e) => handleInputChange("cargoAddress", e.target.value)}
                            placeholder="Enter cargo address"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
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
                    {formData.country == "44" && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="ico">ICO</Label>
                                    <Input
                                        id="ico"
                                        value={formData?.ico ?? 0}
                                        onChange={(e) => handleInputChange("ico", Number(e.target.value))}
                                        placeholder="Enter ICO number"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="dico">DICO</Label>
                                    <Input
                                        id="dico"
                                        value={formData?.dico ?? ''}
                                        onChange={(e) => handleInputChange("dico", e.target.value)}
                                        placeholder="Enter DICO"
                                    />
                                </div>
                            </div>
                        </>)
                    }
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
                            {isSubmitting ? editCustomerData ? "Updating..." : "Creating..." : editCustomerData ? "Update Customer" : "Create Customer"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
